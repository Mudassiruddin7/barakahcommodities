# Barakah Commodities

A single-page site for a halal commodity trading business dealing in spices, dry
fruits and physical gold, with partnership arrangements structured around
Mudarabah principles.

React + TypeScript + Vite. GSAP for the headline reveals and the stamp. Native
scrolling and no 3D at runtime: the goods are pre-rendered images in
`public/images`.

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
| What we trade | Spices, dry fruits, gold: one band and one picture each |
| From purchase to settlement | How a consignment moves, six stamps |
| Partnership | How Mudarabah is structured |
| **Run the numbers** | What a four-month cycle is *targeted* to return |
| How profit is calculated | A worked example, labelled as one |
| Records | How it is recorded (a ledger page) |
| Risk | What can go wrong |
| Principles | What the business holds to |
| Contact | Who is accountable, and the next step |

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
- **Motion.** Strong exponential ease-out everywhere (`--ease-out` in CSS), UI
  feedback under 300 ms, `scale(0.97)` on press, hover only behind
  `(hover: hover)`. GSAP does the headline line reveals and the hero stamp; the
  process stamps, ledger lines and tape are CSS. `prefers-reduced-motion` removes
  the travel and leaves everything visible.

## Structure

```
public/images/      Pre-rendered pictures of the goods (transparent WebP)
src/
  content/          All copy and data. One file.
  utils/            motion.ts (GSAP setup), scroll.ts (anchor jumps), returns.ts
  hooks/            Viewport state and one-shot visibility.
  components/       One directory per section, each with its own CSS.
```

## Why the goods are images

The first version rendered the goods live with Three.js. That cost a ~940 kB
script and kept the GPU busy while scrolling, so scrolling felt heavy. The
scenes were rendered once, trimmed to their contents and saved as transparent
WebP (about 580 kB for all six). Page JavaScript is about 125 kB gzipped.

The scene source (procedural PBR gold, sack, brass and instanced spices) is in
git history at commit `d650010` if the pictures ever need re-rendering.

## Accessibility

Semantic sectioning, a skip link, visible focus states, a keyboard-operable
calculator and strips, a real `<table>` for the ledger, the profit tape and the
calculator's figures, a live region for the calculator, and descriptive `alt`
text on every picture.
