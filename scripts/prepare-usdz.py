"""Prepare one of Apple's AR models (USDZ) for the site's 3D device viewers.

Picks variants (a colour, a pose), flattens the stage so no references or
variant switches are left for the browser to resolve, and packs it back
into a single USDZ that three's USDLoader reads as it is. Models that load
as Apple ships them (the iMac, the MacBook Air) don't need this.

The models belong to Apple and are shown as reference devices. Flattening
and texture handling follow jadon7/iphone-duo (scripts/prepare-assets.py),
MIT License, Copyright (c) 2026 jadon7.

Run:
  uv run --no-project --python 3.12 --with usd-core==26.8 \\
    python scripts/prepare-usdz.py SOURCE OUT.usdz [VariantSet=Variant ...]

SOURCE is a local .usdz or its apple.com URL. What made public/devices/:
  iphone-18-pro.usdz  https://www.apple.com/105/media/us/iphone-18-pro/2026/591df885-5ee2-4173-86e6-401021249f7c/ar/iphone-18-pro-p-sim.usdz  Color=Silver
  (Color is one of Black, Burgundy, Glacier, Silver.)
"""

import sys
import tempfile
from pathlib import Path
from urllib.request import urlretrieve
from zipfile import ZipFile

from pxr import Sdf, Usd, UsdUtils

if len(sys.argv) < 3:
    sys.exit(__doc__)
source, out, *choices = sys.argv[1:]
out = Path(out).resolve()

with tempfile.TemporaryDirectory() as tmp:
    work = Path(tmp)
    src = Path(source)
    if source.startswith("https://"):
        src = work / "source.usdz"
        print(f"Downloading {source} ...", flush=True)
        urlretrieve(source, src)

    # The textures, out of the package, beside the flattened layer.
    textures = work / "textures"
    textures.mkdir()
    with ZipFile(src) as archive:
        for name in archive.namelist():
            if Path(name).suffix.lower() in {".png", ".jpg", ".jpeg", ".avif"}:
                (textures / Path(name).name).write_bytes(archive.read(name))

    stage = Usd.Stage.Open(str(src))
    root = stage.GetDefaultPrim()
    for choice in choices:
        set_name, variant = choice.split("=", 1)
        variant_set = root.GetVariantSet(set_name)
        if variant not in variant_set.GetVariantNames():
            sys.exit(f"{set_name} has no {variant}: {variant_set.GetVariantNames()}")
        variant_set.SetVariantSelection(variant)

    flat = stage.Flatten()

    # Flattening leaves package paths (file.usdz[dir/tex.png]); point them at
    # the copies. Walk the layer itself, so shared (instanced) parts that a
    # stage traversal skips are rewritten too.
    def rewrite(path):
        if not path.IsPropertyPath():
            return
        spec = flat.GetAttributeAtPath(path)
        value = spec.default if spec else None
        if isinstance(value, Sdf.AssetPath) and value.path:
            filename = Path(value.path.split("[")[-1].rstrip("]")).name
            spec.default = Sdf.AssetPath(f"textures/{filename}")

    flat.Traverse(Sdf.Path.absoluteRootPath, rewrite)
    layer = work / "model.usdc"
    flat.Export(str(layer))

    out.parent.mkdir(parents=True, exist_ok=True)
    if not UsdUtils.CreateNewUsdzPackage(Sdf.AssetPath(str(layer)), str(out)):
        sys.exit("Could not pack the USDZ")
    print(f"Wrote {out} ({out.stat().st_size / 1048576:.1f} MB)", flush=True)
