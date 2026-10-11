# Latest work showcase: iPhone Duo fold into Agent Pay

Status: design approved in chat on 2026-10-11; this spec awaits review.
Companion spec: site password gate (separate document, separate PR). The gate
ships first or together with this feature, because this feature puts a
previously hidden case study on the home page.

## 1. Intent

The home page is credible but has no signature moment, and the work itself has
no picture within the first scroll. This feature adds one showstopper: a
3D folding phone that shows the latest project and, on click, unfolds and
carries the visitor into that project's case study.

Success means:

- A hiring manager sees real product UI within one scroll of the hero.
- The moment reads as confident and professional, not a gimmick: one motion
  moment, no looping attention-seekers, the work stays the subject.
- The hero loads exactly as fast as it does today.

## 2. Decisions already made

| Question | Decision |
|---|---|
| Vehicle | Port the Three.js fold from github.com/chuspeeism/iphone-duo (MIT code) with its Apple iPhone Duo model |
| Click behaviour | One click: unfold, camera moves into the inner screen, case study opens |
| Featured project | Agent Pay (`/work/agent-commerce`) |
| Agent Pay visibility | Listed and linked like every other case study (the whole site sits behind the password gate) |
| Interaction removed | Orbit/drag, slider, image upload, auto-play loop |

Raised and accepted by the owner: the Apple model and textures are Apple's
assets, outside the repo's MIT licence and subject to Apple's terms; the full
demo weighs about 10 MB. Section 6 contains both.

## 3. Out of scope

- More than one featured project (a switcher can follow later).
- Pointer-driven tilt or any idle animation.
- Replacing the stock gradient covers elsewhere on the site.
- A licensed replacement model (the architecture keeps the door open; see 6.3).

## 4. Experience

### 4.1 Placement

A new section, `#latest`, directly below the hero and above the work list.

- Left column: label "Latest work · Mastercard", title "Agent Pay", one line
  taken from the case study ("The CPO and several SVPs now demo Agent Pay from
  their phones at Money20/20, Mastercard Connections, and Innovate at McLaren
  HQ, with no designer in the room."), and a quiet prompt "Open the case study".
- Right column: the phone, folded, cover screen playing the Agent Pay demo.
- Below `md`, the stage stacks under the caption.

### 4.2 Motion

1. Arrival: when the section enters the viewport, the phone rises about 24px
   and settles from a slight tilt to its resting angle over about 0.9s, using
   the site easing `cubic-bezier(0.22, 1, 0.36, 1)`. It then stays still.
2. Click, Enter or Space on the stage:
   - Unfold from closed (0°) to open (180°) over 1.4s with smoothstep easing,
     the engine's existing curve. The inner screen reveals the wide Agent Pay
     view; the cover screen's blur and darkening run as in the original.
   - Camera dolly into the inner screen over 0.6s while the section fades.
   - `router.push("/work/agent-commerce")`. The case study's first visual uses
     the same inner-screen image, so the landing reads as continuous.
3. Reduced motion (`prefers-reduced-motion: reduce`): no arrival motion, no
   unfold; activation navigates immediately.

### 4.3 Accessibility

- The stage is one focusable control: a `<button>` overlaying the canvas with
  an accessible name "Open the Agent Pay case study".
- The canvas and all screen media are `aria-hidden`.
- The caption text carries the meaning; the 3D is decoration.
- No drag gestures, so touch scrolling never fights the stage.

## 5. Screen media

| Screen | Shape | Content | Format |
|---|---|---|---|
| Cover (folded) | portrait, about 0.69:1 | 8–12s loop of the demo's "Buy a bicycle" flow, recorded from agent-pay-demo.vercel.app at 390px wide | MP4 (H.264) plus WebM, muted, plus a poster frame |
| Inner (open) | landscape, about 1.42:1 (1600 × 1125 canvas) | Still composition: Assisted and Autonomous flows side by side, built from demo screenshots | WebP |

- The cover video plays only while the section is on screen.
- The screen shader samples with `textureLod`, so the video texture needs
  mipmaps; the engine regenerates them per decoded frame (or copies frames into
  a mipmapped canvas texture if that proves cheaper).
- The owner approves the recording and the still before they ship.

## 6. Architecture

### 6.1 Units

| Unit | Kind | Responsibility | Depends on |
|---|---|---|---|
| `components/sections/latest/latest-work.tsx` | Server component | Section shell, caption, placeholder, mounts the stage | `duo-stage` |
| `components/sections/latest/duo-stage.tsx` | Client component | Viewport gate, capability checks, dynamic import of the engine, click and keyboard handling, prefetch, navigation, fallbacks | `duo-engine`, `next/navigation` |
| `lib/duo/duo-engine.ts` | Plain TypeScript | Three.js scene: model load, fold and screen shaders, lighting, render-on-demand | `three` |
| `lib/duo/apple-model.ts` | Plain TypeScript | The only Apple-specific code: USD load, mesh-name mapping, screen UV setup | `three` USD loader |
| `scripts/prepare-duo-assets.py` | Build script | Downloads and prepares the model into `public/duo/` (gitignored) | Python 3.12, `usd-core` |

Engine interface:

```ts
type DuoEngine = {
  ready: Promise<void>                 // resolves when the model and textures are live
  setCoverMedia(video: HTMLVideoElement): void
  setInnerMedia(image: HTMLImageElement): void
  unfold(durationMs?: number): Promise<void>
  dollyIn(durationMs?: number): Promise<void>
  setActive(onScreen: boolean): void   // pauses rendering and video off screen
  dispose(): void
}
function createDuoEngine(canvas: HTMLCanvasElement, opts: { modelUrl: string }): DuoEngine
```

### 6.2 What is ported and what is dropped

Kept from `main.js`: renderer setup and tone mapping, `RoomEnvironment`
lighting, the hinge vertex shader (`rotateHinge`, `bendStrip`), the projected
screen fragment shader with blur and darkening, the 1.4s smoothstep transition.

Dropped: `OrbitControls`, slider, play/pause loop, upload input, `alert()`
error handling, the default wallpaper and launcher screens.

Changed: render only while animating or while the cover video advances; cap
device pixel ratio at 2 (1.5 on touch devices); transparent clear colour so
the stage sits on the section background in both themes.

### 6.3 Assets and licensing containment

- `scripts/prepare-duo-assets.py` is adapted from the repo's script: download
  the Star White USDZ from Apple, select the Landscape pose, flatten, rewrite
  texture paths, write to `public/duo/`. That folder is in `.gitignore`, so
  Apple's files never enter this public repository.
- The Vercel build runs the script before `next build`. If the download fails,
  the build still succeeds and the stage stays on its placeholder.
- The placeholder is the cover video's poster frame inside a plain CSS phone
  outline, so no render of Apple's device is committed either.
- Attribution: the ported engine files carry the original MIT notice;
  `THIRD_PARTY_NOTICES.md` lists the engine and Three.js.
- Swap path: only `apple-model.ts` and the prepare script are Apple-specific.
  A licensed model replaces those two without touching the stage or engine API.

### 6.4 Dependency

`three`, pinned to 0.186.0 to match the shaders as written. It is imported only
from `lib/duo/*`, which loads through `import()` inside `duo-stage`, so it
never enters the home page's initial bundle.

## 7. Agent Pay visibility

- Remove `robots: { index: false, follow: false }` from
  `app/work/agent-commerce/layout.tsx`. With the whole site gated, indexing is
  governed by the gate spec, not per page.
- Add Agent Pay to `lib/data/work.ts` so it appears in the work list and the
  sitemap.
- Remove the hero's Add-later note about missing AI work; the rotating "AI
  agents" line is now backed.
- Coordinate with PR #8 (work index rewrite), which edits `lib/data/work.ts`.

## 8. Performance budget

| Moment | Budget |
|---|---|
| Home first load, before scrolling | Unchanged from today (measured before and after) |
| Stage start | Begins one viewport before `#latest`, after the page is idle |
| Engine chunk | About 150 KB gzipped (Three.js core plus USD loader) |
| Model | About 3.6 MB, fetched only by the engine |
| Low-end or Save-Data | `navigator.connection.saveData` or `deviceMemory < 4` keeps the placeholder |

## 9. Failure handling

| Failure | Behaviour |
|---|---|
| No WebGL or WebGL context lost | Placeholder stays; activation navigates directly |
| Model or texture fails to load | Same as above; logged once, no `alert()` |
| Video fails or autoplay is blocked | Poster frame on the cover screen |
| Animation stalls | Navigation fires anyway 2.5s after activation |
| Slow route | Case study is prefetched when the section enters the viewport |

## 10. Verification

- Playwright test: activating the stage lands on `/work/agent-commerce`, with
  and without reduced motion, and with WebGL unavailable.
- Screenshots: placeholder, folded 3D, mid-unfold, 390px, light mode.
- Network comparison: home bytes before first scroll, before and after.
- `npm run lint`, `npx tsc --noEmit`, `npm run check:type`, `npm run build`.

## 11. Dependencies on the owner

- Approve the cover recording and the inner still.
- Confirm the gate spec, which ships first or together.
