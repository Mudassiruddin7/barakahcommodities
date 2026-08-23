# Barakah Commodities

A single-page site for a halal commodity trading business dealing in spices, dry
fruits and physical gold, with partnership arrangements structured around
Mudarabah principles.

React + TypeScript + Vite. Three.js via React Three Fiber for the 3D, GSAP
ScrollTrigger for scroll-linked storytelling, Framer Motion for UI transitions.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## What the page argues

Section order is deliberate and shouldn't be shuffled without a reason — each
section answers the question the previous one raises.

| # | Section | Says |
|---|---------|------|
| — | Hero | What the business is, in one screen |
| 01 | Business | What is actually traded |
| 02 | Process | How a consignment moves, purchase to settlement |
| 03 | Mudarabah | How the partnership is structured |
| 04 | Profit | How profit is calculated — a worked example, labelled as one |
| 05 | Transparency | How it is recorded |
| 06 | Risk | What can go wrong |
| 07 | Principles | What the business holds to |
| 08 | Trust | Why work with us, and who is accountable |
| 09 | Closing | The next step |

## Language around profit, risk and Shariah status

All copy lives in `src/content/index.ts`. The wording there is constrained on
purpose, and edits should keep it that way:

- No guaranteed profit, guaranteed return, fixed return, or risk-free framing.
- No claim of formal Shariah certification, and no regulatory approval implied.
  The principles section says the structure is *intended* to follow Mudarabah
  and should be reviewed by qualified legal and Shariah professionals.
- Worked figures are labelled as illustrations; ledger entries are labelled as
  demonstration data and explicitly not real transactions.
- The possibility of a genuine business loss is stated, not buried — the
  Mudarabah flow shows "profit or loss" with equal weight.
- The primary call to action is a conversation, not an investment.

`index.html` carries Organization schema limited to facts that are verifiable:
name, what the business does, and how to reach it. No ratings, awards,
certifications, founding dates or addresses are asserted.

## Structure

```
src/
  content/          All copy and data. One file.
  hooks/            Capability detection, viewport state, pointer/scroll refs.
  utils/motion.ts   One easing curve, shared Framer variants, GSAP helpers.
  components/       One directory per section, each with its own CSS.
  three/
    Stage.tsx       Lazy boundary — nothing 3D loads until it is needed.
    StageCanvas.tsx The Canvas itself: DPR ceiling, frameloop gating.
    Lighting.tsx    Lightformer rig baked into a small cube map.
    textures.ts     Procedural canvas textures. No image assets ship.
    objects/        Reusable props: ingot, bowl, crate, ledger, balance…
    scenes/         One composition per section that needs 3D.
```

UI components never import three.js. Scenes never contain DOM.

## How the 3D is kept cheap

Three.js, R3F and drei together are by far the largest dependency, and none of
it is on the critical path:

- `Stage` is a `lazy` boundary. The 3D bundle is only requested when a section
  is within 400px of the viewport, so a visitor who reads the hero and leaves
  downloads it once, and one who never scrolls past it downloads nothing more.
- `StageCanvas` sets `frameloop="never"` for any scene that is off-screen or in
  a hidden tab. Several canvases exist; at most one or two ever render.
- DPR is capped by measured device tier, then reduced further by
  `PerformanceMonitor` if frames drop.
- Every texture is generated procedurally into a canvas and cached at module
  scope. There are no image, HDR or model files to download.
- The environment map is built from `Lightformer` panels with `frames={1}`, so
  it is rendered once and never again.
- Geometry counts and grain counts drop on low-tier devices; shadows are
  skipped entirely there.
- Without WebGL, every `Stage` renders a designed fallback instead.

### Two things worth knowing before editing scenes

**Canvas sizing.** R3F measures its own container and skips creating the
renderer while that measurement reads zero. Arriving through a Suspense reveal
can miss the first measurement, leaving a 300×150 canvas with nothing behind
it. `StageCanvas` dispatches one `resize` after layout settles to force a
re-measure. Don't remove it.

**Metal needs something to reflect.** Fully metallic materials have no diffuse
term, so any face pointing at an empty part of the environment renders black.
The lighting rig deliberately includes a zenith panel and a dim floor bounce
for exactly this reason — the tops and sides of the bullion depend on them.

## Motion

- **GSAP ScrollTrigger** owns scroll-linked storytelling: the desk camera, the
  ledger reveal, the Mudarabah spine, the profit counters.
- **Framer Motion** owns discrete UI transitions: reveals, hovers, the mobile
  menu.
- **R3F** owns the scenes only.

Nothing is animated by two systems at once. `MotionConfig reducedMotion="user"`
covers every Framer component; GSAP and R3F paths check `useReducedMotion`
individually. Pointer and scroll values reach render loops through refs, so
neither ever triggers a React re-render.

## Accessibility

Semantic sectioning, a skip link, visible focus states, keyboard-reachable
commodity panels, live region on the process station, real `<table>` markup for
the ledger and the profit calculation, and `aria-label` describing each 3D
scene. The site is usable without WebGL and without JavaScript animation.
