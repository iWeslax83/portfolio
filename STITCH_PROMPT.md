# Google Stitch - Paste-Ready Prompts

Use at [labs.google.com/stitch](https://labs.google.com/stitch). Set mode to
**Web / Desktop**, theme **Dark**. Generate the full page with PROMPT 1, then
refine individual sections with the follow-up prompts if Stitch truncates.

> **Note on motion:** Stitch outputs static HTML/CSS with limited animation. The
> prompt below *describes* the heavy, cinematic motion as intent (Stitch will add
> hover states, some transitions, and respect the layout for it) - but the real
> heavy animation (scroll choreography, parallax, pinned UAV sequence, count-ups,
> 3D card tilt, contribution-graph build-in) gets wired in afterward in Framer
> Motion when the code comes back here. Keep the motion language in so Stitch
> leaves room for it and doesn't fight the design.

---

## PROMPT 1 - Full landing page (master prompt, founder-first + heavily animated)

> Design a single-page **dark, engineering-precise, heavily-animated personal
> portfolio** for a **founder** who started a TEKNOFEST UAV team and personally
> engineers the autonomous systems it flies plus production software. Mood:
> "mission control meets design studio" - calm, instrument-grade, confident,
> cinematic, alive. Founder identity leads; engineering range is the proof. NOT a
> generic SaaS template.
>
> **Visual language:** Background deep charcoal `#0B0B0D` (never pure black).
> Cards/panels `#131418`, raised with a 1px hairline border `rgba(255,255,255,0.07)`
> + soft charcoal shadow, 16px rounded. Single accent: warm **Ember Amber `#E8A05C`**,
> used scarcely (primary CTA, active nav, key numbers, role tags, link hovers, a `$`
> glyph). NO blue, NO purple, NO neon glow, NO gradient headlines. Text: primary
> `#ECECEE`, body `#8B8C94`, labels `#55565E`. Fonts: headlines **Space Grotesk**
> (tight tracking), body **Manrope** (~65 chars/line), **JetBrains Mono** for section
> markers, stat numbers, tech tags, nav, role tags. NO Inter, NO serif. Max-width
> ~1200px, lots of negative space, strict grid, ASYMMETRIC. No centered hero, no
> 3-equal-column rows, no overlapping elements.
>
> **Motion intent (heavy / cinematic - a DIFFERENT animation per section):** the
> scroll reveal must NOT repeat; each section enters with its own distinct named
> motion, all sharing the same spring physics. (1) HERO = boot sequence: telemetry
> grid parallax-fades up, role tag types in, headline reveals word-by-word, inline
> images scale + un-blur, stats count up. (2) STRATOS = cinematic side-sweep: text
> slides from left, heading does a clip-path mask-wipe, right cards stagger from
> right. (3) SELECTED WORK = depth stack: spotlight scales up from 0.92 with shadow
> bloom, grid cards 3D flip-up (rotateX) cascading. (4) STACK = pop & drift: pills
> spring-pop with scale overshoot, groups enter from opposite sides, then slow
> perpetual drift. (5) GITHUB = data build: numbers count up, contribution grid
> builds column-by-column with an amber sweep, language bar fills left→right. (6)
> CONTACT = lift in: heading reveals character-by-character, cards rise + tilt
> upright one by one. Plus globally: a slim amber scroll-progress bar fixed at top,
> 3D tilt-toward-cursor on cards with amber border bloom on hover, magnetic primary
> buttons, and an ambient low-opacity amber light following the cursor in the hero
> (NOT a neon glow, NOT a replaced cursor). Everything spring-smooth, GPU-friendly,
> respects reduced-motion.
>
> **Fixed top nav:** left = mono wordmark `emir.sakarya` (dot in amber). Right = mono
> links with index numbers: `00.home  01.stratos  02.work  03.stack  04.github
> 05.contact`. Active link in Ember Amber. Transparent over hero, subtle charcoal
> blur on scroll.
>
> **HERO (left-aligned, asymmetric, FOUNDER-FIRST):**
> - Mono eyebrow in Ember Amber: `$ whoami`
> - A prominent amber mono role tag ABOVE the headline, uppercase + tracked-out:
>   **"FOUNDER & HEAD OF ELECTRONICS & SOFTWARE · STRATOS İHA"** - this is the first
>   thing the eye lands on.
> - Large Space Grotesk headline embedding three small rounded type-height images
>   *between the words* as punctuation: "I founded a [small drone photo] UAV team and
>   engineer the autonomous [small PCB macro] systems that fly it - and the [small
>   dashboard screenshot] software behind them." Images inline, never overlapping text.
> - Subhead in Muted Steel: "Embedded-systems & full-stack engineer · Tofaş Fen
>   Lisesi, Bursa, Türkiye · TEKNOFEST competitor."
> - A row of three stat blocks (mono, amber numbers): "10+ projects", "20+
>   technologies", "5 competition programs".
> - One primary Ember-Amber CTA "View work" + one ghost outline button "Get in touch".
> - Animated telemetry-grid backdrop behind it all. NO "scroll to explore" text, NO chevron.
>
> **01 STRATOS İHA** (section marker `$ cat stratos.md`) - placed FIRST after the
> hero because the founder story leads. A bold full-width feature band that reads
> like a flagship credential. Left column: large heading "STRATOS İHA" + amber role
> badge "Founder & Head of Electronics & Software" + body: "I founded STRATOS İHA, a
> student TEKNOFEST UAV community at Tofaş Fen Lisesi that designs, builds and
> programs its own aircraft. I lead Electronics & Software - autonomous quadrotors
> with real-time target detection and precision landing, FPV racing drones, and VEX
> robots - and grew the team to four departments and seven core members." A small row
> of mono mini-stats: "4 departments", "7 core members", "Founded 2026". Right column:
> three mini project cards (Autonomous Quadrotor · computer-vision targeting; FPV
> Racing Drone · low-latency streaming; VEX Robot · V5 Pushback). One amber link
> "stratosiha.vercel.app →". This section should feel the most cinematic - large type,
> parallax, a standout amber-bordered panel.
>
> **02 SELECTED WORK** (section marker `$ ls projects/ --featured`): asymmetric
> 2-column zig-zag, NOT equal cards. One wide spotlight panel on top, then a staggered
> grid:
> - SPOTLIGHT - "Autonomous Rotary-Wing Multicopter UAV" · tag "TEKNOFEST 2026 ·
>   Rotary-Wing". "Custom quadcopter with autonomous flight, precision navigation,
>   computer-vision target detection and mission execution. Role: Electronics &
>   Software Captain - flight-controller integration, sensor systems, autonomous
>   mission planning." Tags: autonomous flight, flight controller, computer vision,
>   PCB, machine learning.
> - "Tofaş Fen Webapp" · full-stack, open source. "Production school-management system:
>   22 MongoDB models, 6 user roles, JWT + 2FA auth, GraphQL, WebSocket, Kubernetes
>   deployment." Tags: React 19, Express, MongoDB, K8s. Link: source code.
> - "Local AI Assistant" · AI, open source. "WhatsApp-based 'Jarvis' running Llama
>   3.1 8B locally on an RTX 3060 Ti - tasks, calendar, habits, expenses, mood journal."
>   Tags: Python, FastAPI, Ollama. Link: source code.
> - "STRATOS İHA - Club Website" · web, live. "Official site for the STRATOS UAV
>   community I founded." Tags: Next.js, TypeScript, Tailwind. Link: live.
> - "İzin Sistemi" · full-stack, live. "Permission/leave-management system for the
>   Tofaş Fen Innovation Workshop." Tags: JavaScript, Node. Link: live.
> - "Genesis" · hackathon, TUA Astro 2026. "Closed-loop space-agriculture life-support
>   simulator." Tags: JavaScript, AI prediction. Links: live demo, source.
> - Smaller tiles row: "Zero-G Pharma" (Python microgravity drug-crystal sim, Top 5
>   Turkey · NASA Space Apps 2025), "FPV Drone" (MEB Robot · FPV racing), "VEX Robotics"
>   (V5 Pushback), "TMT Website".
> Each card: tag pill + mono detail, Space Grotesk title, Manrope description, mono
> tech tags, amber "source code →" / "live →" links. 3D tilt + amber border bloom on hover.
>
> **03 STACK** (section marker `$ cat skills.json`): a clean 2x2 of grouped tech, mono
> tags, NO progress bars, slow drift/marquee motion. frontend: React, Next.js,
> TypeScript, Tailwind, Framer Motion · backend: Node.js, Express, FastAPI, GraphQL,
> MongoDB, Redis · ai_&_embedded: Python, Ollama, Flight Controllers, PCB Design ·
> devops: Docker, Kubernetes, GitHub Actions, Linux, Vercel.
>
> **04 GITHUB** (section marker `$ gh api user`): three stat cards (mono, amber count-up
> numbers) for public repos / contributions / languages, a GitHub-style contribution
> heat-grid in amber tints on charcoal that builds in column-by-column, and a thin
> language-breakdown bar. Profile: github.com/iWeslax83.
>
> **05 CONTACT** (section marker `$ cat contact.md`): heading "Get in touch", subhead
> "Open to internships, collaborations, and interesting problems." Three equal contact
> cards in a row (this is the ONE place a 3-up row is fine): Email
> (emirsakarya00@gmail.com), GitHub (github.com/iWeslax83), LinkedIn
> (linkedin.com/in/emirsakarya). Each: amber mono icon tile + label + value, border
> brightens to amber on hover.
>
> **Footer:** mono `emir.sakarya` left, mono `$ exit 0` right, thin hairline top border.
>
> Use real screenshots or neutral `picsum.photos` placeholders for images - no broken
> links, no emojis, no fake names, no "Elevate/Seamless/Next-Gen" copy.

---

## FOLLOW-UP PROMPTS (use if Stitch truncates or you want to redo one section)

**Hero only (founder-first):**
> Redesign just the hero of a dark, heavily-animated engineering portfolio.
> Background `#0B0B0D`, accent Ember Amber `#E8A05C`, fonts Space Grotesk + Manrope +
> JetBrains Mono. Left-aligned/asymmetric. Mono eyebrow `$ whoami`. A prominent amber
> uppercase mono role tag above the headline: "FOUNDER & HEAD OF ELECTRONICS &
> SOFTWARE · STRATOS İHA". Space Grotesk headline embedding three small rounded
> type-height images between words: "I founded a [drone] UAV team and engineer the
> autonomous [PCB] systems that fly it - and the [browser] software behind them."
> Subhead: "Embedded-systems & full-stack engineer · Tofaş Fen Lisesi, Bursa ·
> TEKNOFEST competitor." Three amber count-up stat blocks (10+ projects, 20+
> technologies, 5 competition programs). One amber CTA "View work" + ghost "Get in
> touch". Ambient animated telemetry-grid backdrop, word-by-word headline reveal. No
> centered layout, no scroll cue.

**STRATOS band only:** paste the "01 STRATOS İHA" block with the Visual-language + Motion-intent paragraphs on top.

**Projects only:** paste the "02 SELECTED WORK" block with the Visual-language + Motion-intent paragraphs on top.

---

### Tips
- Stitch works screen-by-screen - if PROMPT 1 is too long, generate the hero first,
  then "add a section below:" + each block in order (STRATOS, work, stack, github, contact).
- After generating, tell Stitch "tighten spacing, make it more asymmetric, lead
  harder on the founder role, reduce accent usage to one amber element per section"
  to push it away from generic output.
- Export the code from Stitch, then bring it back here - I'll wire in the real heavy
  Framer Motion (scroll choreography, parallax, pinned UAV sequence, count-ups, 3D
  card tilt, contribution-graph build-in) and integrate it into your Next.js app.
