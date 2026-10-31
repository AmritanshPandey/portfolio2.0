"""Prepare Apple's iPhone Duo reference model for the Agent Pay fold viewer.

Downloads Apple's USDZ, selects its unfolded (Landscape) pose, flattens the
references and points textures at local files, writing public/iphone-duo/
(git-ignored). Apple's assets belong to Apple and are never committed; this
runs at build time on Vercel (see vercel.json) and once locally.

Adapted from jadon7/iphone-duo (scripts/prepare-assets.py), MIT License,
Copyright (c) 2026 jadon7. Apple's UI images are not fetched: the viewer
shows Agent Pay's own screens.

Run: uv run --no-project --python 3.12 --with usd-core==26.8 python scripts/prepare-iphone-duo.py
"""

from pathlib import Path
from urllib.request import urlretrieve
from zipfile import ZipFile

from pxr import Sdf, Usd

root = Path(__file__).resolve().parents[1]
out = root / "public" / "iphone-duo"
textures = out / "textures"
cache = root / ".cache" / "iphone-duo"
textures.mkdir(parents=True, exist_ok=True)
cache.mkdir(parents=True, exist_ok=True)

render = out / "iPhone_Duo_Render.usdc"
if render.exists():
    print("iPhone Duo model already prepared.", flush=True)
    raise SystemExit(0)

model = cache / "iPhone_Duo_Star_White.usdz"
model_url = "https://www.apple.com/105/media/us/iphone-duo/2026/9305e4b9-72d9-4c05-9381-b572adadd5e5/ar/iPhone_Duo_e-sim_Star-White_Variant.usdz"
if not model.exists():
    print("Downloading Apple's iPhone Duo reference model...", flush=True)
    urlretrieve(model_url, model)

with ZipFile(model) as archive:
    for name in archive.namelist():
        if Path(name).suffix.lower() in {".png", ".jpg", ".jpeg", ".avif"}:
            (textures / Path(name).name).write_bytes(archive.read(name))

print("Preparing the unfolded pose...", flush=True)
stage = Usd.Stage.Open(str(model))
stage.GetDefaultPrim().GetVariantSet("Pose").SetVariantSelection("Landscape")
flattened = Usd.Stage.Open(stage.Flatten())
for prim in flattened.Traverse():
    for attribute in prim.GetAttributes():
        value = attribute.Get()
        if isinstance(value, Sdf.AssetPath) and value.path:
            # Flattening resolves USDZ references to package paths; use local texture paths for the browser.
            filename = Path(value.path.split("[")[-1].rstrip("]")).name
            attribute.Set(Sdf.AssetPath(f"textures/{filename}"))
flattened.GetRootLayer().Export(str(render))
print(f"iPhone Duo model ready in {out.relative_to(root)}", flush=True)
