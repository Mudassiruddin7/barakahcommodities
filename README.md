# Barakah Commodities

A single-page site for a halal commodity trading business dealing in spices, dry
fruits and physical gold, with partnership arrangements structured around
Mudarabah principles.

React + TypeScript + Vite. Three.js (React Three Fiber) for the 3D, GSAP for
scroll-linked motion, Lenis for smooth scrolling.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## What the page argues

Section order is deliberate and shouldn't be shuffled without a reason — each
section answers the question the previous one raises.

| Section | Says |
|---------|------|
| Hero | What the business is, in one screen |
| What we trade | Spices, dry fruits, gold — one lot at a time |
| From purchase to settlement | How a consignment moves, six stamps |
| Partnership | How Mudarabah is structured |
| **Run the numbers** | What a four-month cycle is *targeted* to return |
| How profit is calculated | A worked example, labelled as one |
| Records | How it is recorded |
| Risk | What can go wrong |
| Principles | What the business holds to |
| Trust / Contact | Who is accountable, and the next step |

## The returns calculator

`src/components/returns/ReturnsCalculator.tsx`, maths in `src/utils/returns.ts`,
every number and word in `src/content/index.ts` (`RETURNS`).

- Amount: ₹25,000 to ₹5,00,000, in steps of ₹5,000 (typed amounts are rounded
  to the nearest ₹1,000 and clamped).
- Cycle: four months. Target: **7% to 8% of the amount, each month**, so
  ₹1,00,000 shows ₹7,000–₹8,000 a month and ₹28,000–₹32,000 (28%–32%) over the
  cycle. Capital plus returns at the close is shown separately.
- It is a **range, labelled as a target**, with the risk statement beside it
  rather than under it. Change the rates, limits or presets in `RETURNS`; the
  rest follows.
- Accessible: native range input, typed input, a text equivalent of the chart
  as a table, and a live region that announces the result once the amount
  stops changing.
- The "Talk to us about ₹…" button opens WhatsApp with the chosen amount filled
  in. Nothing is sent until the visitor sends it.

## Language around profit, returns, risk and Shariah status

All copy lives in `src/content/index.ts`. The wording there is constrained on
purpose, and edits should keep it that way:

- No guaranteed profit, guaranteed return, fixed return, or risk-free framing.
  Returns on this page are a **target**, said to be one, with the possibility of
  less than the target or a loss stated next to them.
- No claim of formal Shariah certification, and no regulatory approval implied.
  The principles section says the structure is *intended* to follow Mudarabah
  and should be reviewed by qualified legal and Shariah professionals.
- Worked figures are labelled as illustrations; ledger entries are labelled as
  demonstration data and explicitly not real transactions. The worked profit
  example and the ledger describe the same lot, so their numbers agree.
- The possibility of a genuine business loss is stated, not buried: the
  Mudarabah diagram shows "profit" and "loss" as equal blocks.
- The primary call to action is a conversation, not an investment.

`index.html` carries Organization schema limited to facts that are verifiable:
name, what the business does, and how to reach it. No ratings, awards,
certifications, founding dates or addresses are asserted.

## Design

The look is taken from the trade itself rather than from a template: the
stencilled marks on jute sacks, the plain gothic of invoices and ledgers, the
flat colours of the goods being sold.

- **Type.** Big Shoulders Stencil for everything that is displayed, Libre
  Franklin for text. Both carry the ₹ glyph. The Arabic wordmark is a four-letter
  subset of Reem Kufi.
- **Colour.** Bone paper, ink, turmeric, chilli and cardamom. Each section is
  one flat *field* (`.field--bone`, `--ink`, `--turmeric`, `--chilli`,
  `--cardamom`) that sets `--bg`, `--fg`, `--muted`, `--accent` and `--surface`;
  components only ever read those tokens. No gradients, no glows, no resting
  shadows, square corners throughout.
- **Devices.** A rubber stamp (hero, process, the "sample entries" mark on the
  ledger), an adding-machine tape for the profit example, a ruled ledger page,
  rolling-digit counters in the calculator, and five colour strips for the
  principles.
- **Motion.** Strong exponential ease-out everywhere (`--ease-out` in CSS,
  `EASE_OUT` in `utils/motion.ts`), UI feedback under 300 ms, `scale(0.97)` on
  press, hover only behind `(hover: hover)`, exits faster than entrances. GSAP
  owns scroll-linked motion; CSS owns hover, press and state changes.
  `prefers-reduced-motion` turns off smooth scrolling, the line reveals, the
  stamp slam and the pour, and leaves everything visible.

## Structure

```
src/
  content/          All copy and data. One file.
  utils/            motion.ts (GSAP setup), scroll.ts (Lenis), returns.ts (maths)
  hooks/            Viewport state, pointer and scroll refs.
  components/       One directory per section, each with its own CSS.
  three/
    gl.ts           One-time WebGL capability probe, shared by every scene.
    Stage.tsx       Lazy boundary and lifetime: creates a canvas near the
                    viewport, destroys it when far away, shows a fallback.
    StageCanvas.tsx The Canvas: frame gating, DPR cap, context-loss recovery.
    Lighting.tsx    A product-photography softbox rig baked into a cube map.
    textures.ts     Procedural textures (weave, wrinkle, grain, hallmark).
    geometry.ts     Shapes of the goods, and the heap-settling routine.
    materials.ts    What each good is made of, shared by every scene.
    objects/        Gold bar, sack, brass dish, instanced piles, goods.
    scenes/         Hero stall, the three lots, the balance.
```

UI components never import three.js. Scenes never contain DOM.

## How the 3D is kept cheap and robust

- **At most two live WebGL contexts.** A canvas is created when its slot gets
  within about a screen of the viewport and destroyed again when it is far
  away. Browsers cap live contexts (Chrome: 16) and kill the oldest past that,
  which is the likely reason earlier scenes used to go blank after some scrolling. WebGL capability is
  probed once, not once per canvas.
- **No hole is ever left.** No WebGL, a lost context, a failed chunk or a
  throwing scene all resolve to a designed flat fallback. A restored context
  rebuilds the scene.
- Nothing 3D loads until it is needed: three, R3F and drei sit behind `Stage`.
- Frames stop entirely for off-screen scenes and hidden tabs. DPR is capped by
  measured device tier and lowered if frames drop.
- No model, image or HDR files ship. Textures are generated procedurally and
  cached at module scope; goods are instanced (one draw call per kind of good).
- Shadows are real shadow maps falling on a transparent `ShadowMaterial` floor,
  so the objects sit on the page's own paper. drei's `ContactShadows` was
  tried first: it rendered nothing under software WebGL on three 0.185 (even for
  a plain box), and it bakes once, which misses goods that are still pouring in.

### Two things worth knowing before editing scenes

**Metal needs something dark to reflect between the bright things.** The room in
`Lighting.tsx` is deliberately near-black with a few very bright panels: an
overhead softbox, a key, two narrow strips, a rim, and a fill with a vertical
falloff. A fully lit environment makes gold read as flat yellow.

**Canvas sizing.** R3F skips creating the renderer while its container measures
zero. `StageCanvas` starts with frames on and dispatches one `resize` after
layout settles. Don't remove either.

## Accessibility

Semantic sectioning, a skip link, visible focus states, a keyboard-operable
calculator and strips, a real `<table>` for the ledger, the profit tape and the
calculator's figures, a live region for the calculator, and `aria-label`
describing each 3D scene. The site is usable without WebGL and without
JavaScript animation.
