# Flight Scene 3D Redesign — Design Spec

## 1. Motivation

Full site pivot: portfolio becomes a single continuous 3D WebGL scene. The
visitor's scroll drives a camera flying along a fixed flight route (spline)
through the site's content, reframed as a drone flight from liftoff to
landing. The existing GSAP scrollytelling redesign ("Flight Log", merged to
main) provided the content pool and section order; this spec replaces its
scroll mechanics with a persistent 3D scene while keeping the underlying
content and information architecture intact.

## 2. Out of scope

- No new content, copy, or data sources. Every content domain (identity,
  project log, founder story, GitHub telemetry, contact) already exists —
  this spec only changes how it's presented.
- No GLTF/external 3D asset downloads. The drone model is a procedural
  three.js geometry derived from the existing `drone-schematic.tsx` SVG
  path logic, not a downloaded asset.
- No automated test suite (project has none; `npm run build` plus manual
  verification remains the bar, consistent with prior work on this repo).
- No changes to nav/anchor IDs' meaning — `#hero`, `#log`, `#origin`,
  `#telemetry`, `#contact` keep mapping to the same content, mechanics
  change underneath.

## 3. Global constraints (inherited, unchanged)

- No gradients, no glassmorphism, no purple. Flat fills, one accent color
  (terminal green, unchanged from current site).
- Background: off-black/zinc-950 (never pure `#000000`), consistent with
  existing design system.
- No pill/`rounded-full` status chips — bordered rectangles or dot +
  underline instead, including inside 3D-scene HUD overlays.
- Plain, human copy. No hype words, no decorative emoji.
- Font stack unchanged: Cabinet Grotesk (display) + JetBrains Mono (mono/UI).
- `transform`/`opacity` only for CSS-driven motion; WebGL rendering owns
  its own GPU path separately.
- GSAP and Three.js must never animate the same property on the same
  element. GSAP's role is strictly: read scroll position, produce a single
  `progress` number (0–1). Three.js's `useFrame` render loop is the only
  thing that moves the camera. Framer Motion owns HTML overlay fades,
  driven by derived checkpoint state, never by direct scroll binding.

## 4. Architecture

### 4.1 Data flow

```
scroll position
  → GSAP ScrollTrigger (scrub, one instance, whole-page height)
  → useFlightProgress() hook → progress: number (0–1), stored in a ref
     (not React state — avoids re-rendering the whole tree every scroll tick)
  → consumed by two independent readers, once per frame each:
      1. CameraRig (R3F useFrame): reads progress ref, computes point +
         tangent on the CatmullRom spline, positions/aims the camera
      2. Checkpoint overlay layer: progress is also mirrored into a
         throttled React state (updated only when the active checkpoint
         index changes, not every frame) that drives which HTML panel is
         visible via Framer Motion fade
```

Progress is the single source of truth. Neither consumer feeds back into
scroll or into each other.

### 4.2 Persistent canvas

- One `<Canvas>` (react-three-fiber), `position: fixed; inset: 0; z-index:
  0`, mounted once at the page root, never unmounted during scroll.
- HTML content renders in normal document flow on top (`z-index: 10+`),
  with `pointer-events: none` on non-interactive scene-adjacent wrappers so
  clicks reach real content, not the canvas.
- Page height is driven by a tall spacer element (`height: 500vh` or
  similar, tuned during implementation) since the canvas itself doesn't
  scroll — scroll only produces the `progress` number.

### 4.3 Camera rig

- Flight route defined once as a `CatmullRomCurve3` with fixed control
  points (`src/lib/flight-scene/route.ts`), authored by hand to produce 5
  legs with distinct altitude/angle per checkpoint (liftoff climbs, log/
  origin/telemetry legs bank and vary height, landing descends and levels
  out).
- `CameraRig` (`useFrame`) reads `progress`, gets `curve.getPointAt(progress)`
  and a look-ahead point slightly further along the curve for `lookAt`,
  applies banking (roll) proportional to the curve's local curvature.
- Reduced-motion mode: `CameraRig` freezes at a single fixed point/orientation
  (e.g., progress pinned at the checkpoint currently active) — it does not
  traverse the spline. Checkpoint content still switches via the overlay
  layer, which continues to read the mirrored progress state normally.

### 4.4 Checkpoint overlays

Five checkpoints, each a `'use client'` leaf component, given a `visible:
boolean` prop derived from progress ranges:

| Checkpoint | Progress range | Content (unchanged from current site) |
|---|---|---|
| Liftoff | 0.00 – 0.12 | Identity/hero copy, CTA |
| Waypoint: Log | 0.12 – 0.36 | Project log entries (current Flight Log cards content) |
| Waypoint: Origin | 0.36 – 0.58 | Founder story copy + drone schematic build-up |
| Waypoint: Telemetry | 0.58 – 0.82 | GitHub stats, contribution graph, language bars |
| Landing | 0.82 – 1.00 | Contact form |

Ranges are tuned during implementation to match spline leg lengths; the
table above is the intended split, not a hard pixel contract.

### 4.5 Drone model

`DroneModel.tsx` builds a low-poly three.js line/extrude geometry directly
from the same coordinate data `drone-schematic.tsx` already uses for its
SVG paths, so both 2D and 3D views stay derived from one data source
instead of two hand-maintained shapes.

## 5. Performance

- `CameraRig`, any perpetual shader/particle effect, and `DroneModel` are
  each `React.memo`-wrapped, isolated leaf components — they read refs
  inside `useFrame`, never trigger parent re-renders.
- All geometries/materials created with `useMemo` and disposed in a
  `useEffect` cleanup (`geometry.dispose()`, `material.dispose()`) to avoid
  GPU memory leaks across hot reloads.
- Mobile/low-performance mode (`useIsMobile()`, existing hook): same route
  and camera logic, but lower segment count on the spline-derived geometry,
  no particle/fog shader, simplified single-light setup.
- Reduced-motion mode: camera frozen (§4.3); mobile/perf and reduced-motion
  are independent, orthogonal switches — a mobile user without
  reduced-motion still gets a flying (lightweight) camera; a desktop user
  with reduced-motion gets a full-quality but static scene.

## 6. Error handling

- On mount, `Canvas.tsx` checks WebGL2 availability
  (`canvas.getContext('webgl2')`). If unavailable, the 3D canvas is never
  rendered — the page falls back to a plain vertical HTML flow presenting
  the same five content blocks in order, no 3D dependency loaded on that
  path.
- No other runtime error states are expected (no user input, no network
  calls inside the scene layer).

## 7. Visual language inside the scene

- Palette unchanged: terminal green single accent, off-black background.
- Depth cue: fog (`THREE.Fog`, solid off-black color matching the page
  background) darkens distant geometry — no gradient textures, this is a
  standard three.js depth technique, not a banned CSS gradient.
- HUD-style panels (Telemetry checkpoint) stay bordered rectangles, no
  `rounded-full` chips, consistent with the global constraint.

## 8. Dependencies

Not currently in `package.json` — must be installed before implementation:

```
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

## 9. File structure

- `src/lib/flight-scene/route.ts` — spline control points + checkpoint
  progress ranges (data only)
- `src/lib/flight-scene/useFlightProgress.ts` — scroll-to-progress hook
- `src/components/flight-scene/Canvas.tsx` — R3F canvas mount + WebGL
  capability fallback
- `src/components/flight-scene/CameraRig.tsx` — camera-on-spline leaf
  component
- `src/components/flight-scene/DroneModel.tsx` — procedural 3D drone
  geometry
- `src/components/checkpoints/Liftoff.tsx`,`Log.tsx`, `Origin.tsx`,
  `Telemetry.tsx`, `Landing.tsx` — HTML overlay panels, one per checkpoint

Existing components this replaces (`hero.tsx`, `flight-log.tsx`,
`founder-story.tsx`, `telemetry.tsx`, `contact.tsx` mechanics) are not
deleted outright at spec time — the implementation plan decides per-file
whether to gut and reuse (for their content/data-fetching logic) or
replace, since their current content (copy, stats props, data imports)
still applies verbatim to the new checkpoint components.

## 10. Testing / verification

- `npm run build` must stay green at every implementation checkpoint (no
  test framework in this repo).
- Manual checklist for pre-deploy (to be carried into the plan's final
  task): desktop flight traversal full route, mobile lightweight mode,
  `prefers-reduced-motion` emulation (frozen camera, working checkpoint
  fades), WebGL-disabled fallback (flat HTML), keyboard/screen-reader pass
  over checkpoint content order.
