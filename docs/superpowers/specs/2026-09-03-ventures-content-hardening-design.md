# Design Spec: Ventures Content Hardening

Status: approved by user, ready for implementation planning.
Extends: `2026-08-15-flight-scene-3d-redesign-design.md` (current shipped system - 3D flight scene, five-beat checkpoint structure, scroll-scrubbed camera). This is not a re-theme. It hardens the existing system: syncs stale content against `resume.tex`, fixes two real code/spec defects found in an audit, and restructures one beat (`Origin`) to carry a third founder venture. Visual language, motion vocabulary, and the 3D scene mechanics are unchanged.

---

## 0. Why

`resume.tex` (updated 2026-08-31, commit `87f4dcd`) is now ahead of the site: it carries a third founder venture (Viyaro), two shipped projects the site has never listed (Masa Hesapları, DurAn), and updated Stratos UAV performance numbers and team size. Per `PRODUCT.md`'s own principle ("single source of truth per fact"), this is drift that needs reconciling. Separately, a code audit while researching this spec found two defects: `DESIGN.md` documents a flagship gradient-border treatment that `Log.tsx` never applies, and `Telemetry.tsx`'s scene-mode panel has no truncation safeguard against its own content overflowing its fixed 85vh viewport, unlike `Log.tsx` which already handles this.

## 1. Content sync (`resume.tex` -> site data)

### `src/data/projects.ts`

- **`otonom-iha`** (flagship, `#001`): description enriched with resume facts - 19.76-minute hover endurance, 12 km autonomous range, precision landing, Pixhawk 6C / Raspberry Pi 5 / ArduPilot / OpenCV stack, TEKNOFEST rotorcraft final and NASA Space Apps Turkey final, press coverage (Anadolu Ajansı, Bursa Hakimiyet). Add one link: `{ label: "stratosiha.com", href: STRATOS_URL, isPrimary: true }` (import `STRATOS_URL` from `@/data/stratos`, same constant `Origin`/`Ventures` already uses - do not hardcode the URL a second time).
- **New: `masa-hesaplari`** - QR-code table ordering and bill-splitting web app. Next.js 16, React 19, Drizzle ORM, Neon Postgres, TypeScript. Description covers the 12-table schema, SSE live order status, iyzico + fast-IBAN + cash payment paths, Turkish/English i18n via locale cookie, daily unpaid-table cron. `links: []` (no public URL per user decision), `status: "SHIPPED"`, no `repo`.
- **New: `duran`** - TEKNOFEST finalist (Bağımlılıklarla Mücadelede Teknolojik Uygulamalar Yarışması), team captain of Stratos Root. ESP32S3 wristband (MAX30102 PPG, GSR, MPU6050, DS18B20) fused on-device with a React Native app to detect gambling-relapse craving spikes inside a 3-minute window. On-device only, no server, no stored raw data. 94% detection accuracy against simulated relapse events, 14 passing unit tests, three-tier intervention flow. `links: []`, `status: "IN_PROGRESS"` (resume says "2026 - Present"), no `repo`.
- **`local-ai-assistant`**: light enrich - "under 800ms average response latency", "used daily for over 6 months".
- **`zero-g-pharma`**: light enrich - "advancing to the global top 50 of 6,000+ teams".
- `order` values on existing entries shift down by however many slots the two new projects occupy; keep `featured: false` for both new entries (they join the secondary/catalogue list, not the featured carousel) unless implementation finds a reason they must be featured - default to non-featured since neither has a link.

### New: `src/data/ventures.ts`

Three founder ventures, replacing the Stratos-only content currently inline in `Origin.tsx`:

```ts
export interface Venture {
  name: string;
  role: string;
  proof: string; // one-line stat/traction, real numbers only
  href?: string; // omit if no public URL
}

export const ventures: Venture[] = [
  {
    name: "STRATOS İHA",
    role: "Founder & Chief Engineer",
    proof: "25-person engineering org · TEKNOFEST rotorcraft finalist · NASA Space Apps Turkey finalist",
    href: STRATOS_URL,
  },
  {
    name: "Teluvane",
    role: "Founder",
    proof: "Multi-tenant AI-agent compliance platform · hash-chained audit trail · EU AI Act / ISO 42001 / NIST AI RMF / SOC 2",
    href: "https://teluvane.com",
  },
  {
    name: "Viyaro",
    role: "Founder & CEO",
    proof: "Autonomous mobility · BOSİAD-funded · 50,000+ rides across 10+ companies in production",
  },
];
```

Exact copy wording is implementation's call within these facts; do not invent numbers not present in `resume.tex` or already on the site. `stratosUnits` (quadrotor/FPV/VEX programs) in `src/data/stratos.ts` stays as-is and nests under the Stratos venture row (see section 2).

### `PRODUCT.md`

- Fix an existing internal contradiction: "Product Purpose" currently lists Teluvane under "hardware ventures", while "Evidence on Hand" explicitly states Teluvane has no hardware component. Reword "Product Purpose" to name Stratos UAV and Viyaro as the hardware/ops ventures and Teluvane as the software venture, or drop the hardware/software split entirely and just name all three ventures plus "a working full-stack/AI engineer."
- Add Viyaro to "Evidence on Hand" with its funding/traction facts.
- Update Stratos team size reference (25, not 7) wherever `PRODUCT.md` states a headcount.

### `src/messages/en.json`

- `stratos.body` (or its replacement key once the section is renamed conceptually - see section 2) drops "seven core members" in favor of the 25-person figure, and stops describing only the three programs since the beat now covers three ventures, not one.
- Section `kicker`/`title` copy updated to reflect a ventures-plural framing rather than "STRATOS İHA" as the section title (the section still leads with Stratos first, it just isn't Stratos-exclusive anymore).
- Nav label copy for this section (currently under the `founderStory` key) gets wording that reads correctly for a three-venture section, e.g. "Founder" rather than "Stratos" if the visible nav text names the section specifically. Check `nav.tsx` for how the key's value is actually displayed before changing it.
- Hero (`Liftoff.tsx`) copy is not required to change - `cred4` etc. can stay - but if implementation finds an easy, factual improvement (e.g. referencing the venture count) that fits the existing tone, it's in scope. Do not force a hero rewrite if nothing concrete needs to change there.

## 2. Ventures beat (`Origin.tsx` restructure)

Today `Origin.tsx` is a Stratos-only deep dive: role badge, body paragraph, a 3-stat `dl` (departments/members/founded), and the full `stratosUnits` list as a wide right-column list. This becomes a three-row Ventures list, matching the existing bordered-row, numbered-index visual language `Origin.tsx` already uses for `stratosUnits` (`grid-cols-[auto_1fr]`, `border-b border-rule`, mono index) - **not cards**, so this does not read as the generic three-card pattern the global design rules ban.

- Each of the three `ventures` entries renders as one bordered row: mono index (`01`/`02`/`03`), venture name (`font-display`), role, proof line (mono, same treatment as a catalogue row's tech-pills line), and an external link icon if `href` is present (Viyaro has none - render without the link affordance, not a disabled/greyed one).
- The Stratos row additionally nests its existing `stratosUnits` sub-list (quadrotor/FPV/VEX) compactly beneath its proof line - smaller type, same bordered-row idiom one level down. This is the only venture with a sub-list; Teluvane and Viyaro rows are single-row.
- The stat `dl` (departments/members/founded) currently sitting above the unit list is replaced - team size (25) becomes part of the Stratos row's proof line instead of a standalone number tile, consistent with how the other two ventures present their proof (a sentence, not a stat grid). This removes the one `dl` element and its three tiles.
- `DroneSchematic` (the flat-mode figure) stays, unchanged, still Stratos-flavored - it's a real hand-built asset tied to the flagship hardware identity, not something this pass touches.
- Internal checkpoint id (`"origin"` in `CheckpointId`), the flight-scene camera route mapping, and the section anchor `#founder-story` are **not renamed** - only the component's rendered content and copy change. This keeps the change mechanical and low-risk against the 3D camera route/type system, which is out of scope for this pass. (Renaming the component file `Origin.tsx` -> `Ventures.tsx` is fine and recommended since the export no longer represents "origin story" specifically; update its one import site in `FlightSceneRoot.tsx` accordingly.)

## 3. Code defects fixed

### `Log.tsx` - flagship gradient border

`DESIGN.md` documents (and `globals.css:189` defines) a `.gradient-border` treatment for the flagship catalogue row. `Log.tsx`'s article `className` never applies it. Fix: apply `flagship ? "gradient-border" : ""` (or equivalent conditional) to the flagship row's wrapper, matching the documented behavior. Ship this in the same change as the flagship project's new `stratosiha.com` link and enriched description (section 1), since both touch the same row.

### `Telemetry.tsx` - scene-mode overflow safeguard

Scene-mode `CheckpointShell` panels are `fixed inset-0`, capped at `max-h-[85vh]`, `overflow-hidden`, with no internal scroll by design (this was a deliberate choice in the flight-scene redesign so page scroll drives the camera instead of being trapped - see `DESIGN.md` section 5). `Log.tsx` already handles this by capping its rendered list to 4 rows in scene mode. `Telemetry.tsx` has no equivalent safeguard despite rendering more content (3 stat tiles + 2 charts + a full skills matrix + a link row) - it risks silent clipping on shorter viewports.

Fix, mirroring `Log.tsx`'s existing pattern rather than introducing internal scroll (which the 3D redesign explicitly ruled out for scene mode): in scene mode, cap the skills matrix to a fixed number of items per category (or top N categories) with a mono "+N more" annotation, same idiom as a truncated list elsewhere in the system. Flat mode keeps the full, untruncated skills matrix, same as `Log.tsx`'s flat-mode behavior for its project list. The three stat tiles and two chart panels above the skills matrix are not truncated - they're already fixed-size.

## 4. Polish pass

After the content and structural changes above land, re-audit the touched surfaces (new Ventures rows, updated flagship Log row, Telemetry's truncated skills tile) against:
- The six global design rules (no gradient/glass/purple outside the two named scoped exceptions, no pill badges outside `StatusTag`/`CatalogFilter`, plain copy, no three-card-row pattern, typography rhythm, cut decorative cruft).
- Existing motion vocabulary only (`plateIn`, `staggerContainer`, row-hover-sweep, `readoutSettle`) - no new animation mechanics introduced for this pass.

## 5. Explicitly out of scope

- 3D flight-scene mechanics, camera route, `CheckpointId` type, checkpoint anchor ids.
- i18n structure (site stays English-only).
- Any new accent color, gradient call site, or pill shape beyond what `DESIGN.md` already documents as scoped exceptions.
- Section reordering (five-beat structure: Home -> Flight Log -> Ventures -> Telemetry -> Contact stays as-is).
- Adding a live URL for Viyaro or the two new projects - none exist per user confirmation; do not invent placeholders.

## 6. Testing

- `npm install` must leave `node_modules` in sync with `package.json` (this was found broken at the start of this pass - `three`/`@react-three/*` were declared but not installed, 500-ing the dev server; already fixed, but re-verify `npm run dev` boots clean before considering this spec's work done).
- Run the dev server, verify the golden path (hero -> full scroll to contact) in both scene mode (WebGL) and flat mode (forced fallback) at mobile and desktop widths.
- Verify the flagship catalogue row shows the gradient border and the new `stratosiha.com` link.
- Verify the Ventures beat renders three rows, Stratos's sub-list nests correctly, Viyaro renders without a broken/empty link affordance.
- Verify Telemetry's skills matrix truncates in scene mode and shows in full in flat mode, and that scene-mode Telemetry no longer risks clipping at a typical laptop viewport height.
- Verify `PRODUCT.md`'s hardware/software venture description no longer contradicts itself.
- No gradient, pill, or accent-2 usage introduced outside the call sites already named in `DESIGN.md`.
