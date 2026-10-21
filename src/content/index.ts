// ============================================================
// Content — every string on the page lives here.
//
// The wording around profit, returns, risk and Shariah status is
// deliberate. Nothing here asserts a guaranteed return, a
// certification, or a regulatory approval. The calculator shows a
// target, labelled as one, with the risk stated beside it.
// ============================================================

export interface NavLink {
  label: string;
  href: string;
}

export const CONTACT = {
  name: 'Mohammed Aqib Abdullah',
  role: 'Business Manager',
  phone: '+91 9059804335',
  phoneHref: 'tel:+919059804335',
  /** International format, digits only — what wa.me expects. */
  whatsapp: '919059804335',
} as const;

export const BRAND = {
  name: 'Barakah Commodities',
  logoTop: 'BARAKAH',
  logoBottom: 'COMMODITIES',
  arabic: 'بركة',
  tagline: 'Trust · Transparency · Barakah',
  descriptor: 'Halal Commodity Trading & Ethical Business Partnerships',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'What we trade', href: '#business' },
  { label: 'Partnership', href: '#mudarabah' },
  { label: 'Records', href: '#transparency' },
  { label: 'Contact', href: '#contact' },
];

export const NAV_ACTION: NavLink = { label: 'Calculator', href: '#returns' };

// ---------- Hero ----------
export const HERO = {
  headline: ['Real commodities.', 'Real business.', 'Real barakah.'],
  lede: 'Halal commodity trading built on trust, transparency and responsible profit-sharing partnerships.',
  primaryCta: 'Run the numbers',
  secondaryCta: 'How the partnership works',
  /** The rubber stamp on the still life. Words describing what the process does. */
  stamp: ['WEIGHED', 'RECORDED', 'SETTLED'],
} as const;

// ---------- 01 · Business ----------
export interface Commodity {
  id: 'spices' | 'dry-fruits' | 'gold';
  name: string;
  summary: string;
  detail: string;
  note: string;
}

export const BUSINESS = {
  title: 'We trade what people actually use.',
  lede: 'Barakah Commodities focuses on tangible commodities and real-world trading activity rather than speculative digital assets or artificial financial products.',
} as const;

export const COMMODITIES: Commodity[] = [
  {
    id: 'spices',
    name: 'Spices',
    summary: 'Premium spice trading',
    detail:
      'Turmeric, chilli, pepper and whole spices sourced through established Indian supply chains and moved in wholesale quantities.',
    note: 'Graded and weighed on purchase',
  },
  {
    id: 'dry-fruits',
    name: 'Dry fruits',
    summary: 'Wholesale commodity trading',
    detail:
      'Almonds, dates, pistachios and walnuts procured directly and distributed through wholesale channels.',
    note: 'Stored against seasonal demand',
  },
  {
    id: 'gold',
    name: 'Physical gold',
    summary: 'Physical, allocated metal',
    detail:
      'Physical gold trading subject to applicable Shariah requirements and Indian law. Metal is real, allocated and held, never a paper position.',
    note: 'Spot settlement, physical delivery',
  },
];

// ---------- 02 · The consignment ----------
export interface ProcessStage {
  id: string;
  label: string;
  /** Past tense — what the rubber stamp on this line says. */
  stamp: string;
  description: string;
}

export const PROCESS = {
  title: 'From purchase to settlement.',
  lede: 'Every consignment moves through the same six stages, and each one leaves a record behind it.',
} as const;

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'source',
    label: 'Source',
    stamp: 'Sourced',
    description:
      'Suppliers are identified and quality is assessed before any capital is committed.',
  },
  {
    id: 'purchase',
    label: 'Purchase',
    stamp: 'Weighed',
    description: 'Goods are bought at agreed prices against invoices and weighed on receipt.',
  },
  {
    id: 'storage',
    label: 'Storage',
    stamp: 'Stored',
    description:
      'Stock is held in conditions that preserve grade, with inventory counted and recorded.',
  },
  {
    id: 'trade',
    label: 'Trade',
    stamp: 'Sold',
    description: 'Commodities are sold through established wholesale and retail market channels.',
  },
  {
    id: 'accounting',
    label: 'Accounting',
    stamp: 'Entered',
    description:
      'Purchases, sales and direct expenses are entered as they happen, not reconstructed later.',
  },
  {
    id: 'settlement',
    label: 'Settlement',
    stamp: 'Settled',
    description:
      'The business result is calculated and distributed strictly per the executed agreement.',
  },
];

// ---------- 03 · Mudarabah ----------
export interface MudarabahStep {
  id: string;
  term: string;
  role: string;
  description: string;
}

export const MUDARABAH = {
  title: 'Partnership, not a promise.',
  lede: 'Mudarabah is a profit-sharing partnership in which one party provides capital and the other provides management and expertise.',
  resultNote: 'Profit and loss carry equal weight. A genuine loss is a possible result.',
} as const;

export const MUDARABAH_STEPS: MudarabahStep[] = [
  {
    id: 'rab-ul-mal',
    term: 'Rab-ul-Mal',
    role: 'The capital provider',
    description: 'The investor commits capital to the trading business.',
  },
  {
    id: 'mudarib',
    term: 'Mudarib',
    role: 'The manager',
    description:
      'Barakah Commodities contributes management, expertise and the working effort of the business.',
  },
  {
    id: 'trading',
    term: 'Real commodity trading',
    role: 'The activity',
    description:
      'Capital is deployed into spices, dry fruits and physical gold: goods that are bought, held and sold.',
  },
  {
    id: 'result',
    term: 'Actual business result',
    role: 'Profit or loss',
    description:
      'The outcome is whatever the trading actually produced. A genuine loss is a possible result.',
  },
  {
    id: 'sharing',
    term: 'Agreed profit sharing',
    role: 'The distribution',
    description: 'Any profit is divided according to the ratio set out in the executed agreement.',
  },
];

// ---------- 04 · The calculator ----------
export const RETURNS = {
  title: 'Run the numbers.',
  lede: 'Choose an amount up to ₹5,00,000. This is what a four-month cycle is targeted to return, month by month.',
  min: 25_000,
  max: 500_000,
  step: 5_000,
  initial: 100_000,
  presets: [100_000, 200_000, 300_000, 500_000],
  tenureMonths: 4,
  /** Target monthly return on capital, as a range. */
  monthlyLow: 0.07,
  monthlyHigh: 0.08,
  labels: {
    amount: 'Amount you put in',
    cycle: 'Four-month cycle',
    monthly: 'Each month, targeted',
    total: 'Over four months',
    closing: 'At the end of month four',
    closingNote: 'Capital plus returns, if the target is met every month.',
  },
  disclaimerLabel: 'A target, not a promise',
  disclaimerBody:
    'In a Mudarabah partnership, profit is shared from what the trading actually earns. A cycle can return less than the target, or lose money, and your capital is at risk. These figures assume the target is met in every month.',
  ctaLabel: 'Talk to us about',
} as const;

// ---------- 05 · Profit model ----------
export const PROFIT = {
  title: 'How profit is calculated.',
  lede: 'Profit is what remains after the cost of goods and the direct expenses of running the trade. It is arithmetic, not a projection.',
  disclaimerLabel: 'Illustration only, not a guaranteed return',
  disclaimerBody:
    'The figures above are a worked example chosen to show the method, using the same lot as the records further down. Actual profit depends on actual business performance, and a genuine business loss is possible.',
} as const;

export interface ProfitLine {
  id: string;
  label: string;
  amount: number;
  operator?: string;
  kind: 'credit' | 'debit' | 'result';
  hint: string;
}

export const PROFIT_LINES: ProfitLine[] = [
  {
    id: 'gross',
    label: 'Gross sales',
    amount: 310000,
    kind: 'credit',
    hint: 'Everything received from selling the goods',
  },
  {
    id: 'cogs',
    label: 'Cost of goods',
    amount: 240000,
    operator: 'less',
    kind: 'debit',
    hint: 'What the commodities cost to buy',
  },
  {
    id: 'expenses',
    label: 'Direct business expenses',
    amount: 20000,
    operator: 'less',
    kind: 'debit',
    hint: 'Transport, storage and other costs of the trade',
  },
  {
    id: 'net',
    label: 'Net business profit',
    amount: 50000,
    operator: 'equals',
    kind: 'result',
    hint: 'What the business actually earned',
  },
];

export const PROFIT_SPLIT = {
  net: 50000,
  investorRatio: 70,
  managerRatio: 30,
  investorShare: 35000,
  managerShare: 15000,
  investorLabel: 'Investor · Rab-ul-Mal',
  managerLabel: 'Manager · Mudarib',
} as const;

// ---------- 06 · Transparency ----------
export interface LedgerRow {
  id: string;
  date: string;
  particulars: string;
  reference: string;
  amount: number;
  kind: 'debit' | 'credit' | 'result';
}

export const TRANSPARENCY = {
  title: 'Every rupee should have a record.',
  lede: 'A commodity business is only as trustworthy as its books. Purchases, sales and expenses are entered as they occur.',
  dataLabel: 'Demonstration data',
  dataNote:
    'The entries below illustrate the format of the records. They are not actual Barakah Commodities transactions.',
  closing: 'Transparency is not a feature. It is the foundation.',
} as const;

export const LEDGER_ROWS: LedgerRow[] = [
  {
    id: 'r1',
    date: '04 Apr',
    particulars: 'Purchase: turmeric, 12 qtl',
    reference: 'INV-0418',
    amount: 240000,
    kind: 'debit',
  },
  {
    id: 'r2',
    date: '09 Apr',
    particulars: 'Transport: mandi to godown',
    reference: 'EXP-0092',
    amount: 8000,
    kind: 'debit',
  },
  {
    id: 'r3',
    date: '11 Apr',
    particulars: 'Storage: godown, one month',
    reference: 'EXP-0097',
    amount: 5000,
    kind: 'debit',
  },
  {
    id: 'r4',
    date: '22 Apr',
    particulars: 'Other direct expenses',
    reference: 'EXP-0104',
    amount: 7000,
    kind: 'debit',
  },
  {
    id: 'r5',
    date: '28 Apr',
    particulars: 'Sales: wholesale lot',
    reference: 'SAL-0231',
    amount: 310000,
    kind: 'credit',
  },
  {
    id: 'r6',
    date: '30 Apr',
    particulars: 'Net business result',
    reference: 'P&L',
    amount: 50000,
    kind: 'result',
  },
];

export const RECORD_TYPES = [
  { id: 'purchase', label: 'Purchase records', detail: 'Invoices, weights and grades' },
  { id: 'sales', label: 'Sales records', detail: 'Buyer, quantity and realised price' },
  { id: 'expense', label: 'Expense records', detail: 'Transport, storage, handling' },
  { id: 'inventory', label: 'Inventory', detail: 'Stock held, counted and valued' },
  { id: 'pl', label: 'Profit & loss', detail: 'Period result, computed from entries' },
  { id: 'reporting', label: 'Investor reporting', detail: 'Statements per the agreement' },
];

// ---------- 07 · Risk ----------
export const RISK = {
  title: 'Real business means real risk.',
  lede: 'Commodity trading carries genuine commercial risk. Stating it plainly is part of doing it honestly.',
  pans: { gold: 'Profit', iron: 'Loss' },
} as const;

export const RISK_POINTS = [
  {
    id: 'prices',
    label: 'Prices move',
    detail: 'Commodity prices can move up or down between purchase and sale.',
  },
  {
    id: 'sales',
    label: 'Demand varies',
    detail: 'Sales may be higher or lower than expected in any given period.',
  },
  {
    id: 'expenses',
    label: 'Costs bite',
    detail: 'Transport, storage and handling expenses can affect profitability.',
  },
  {
    id: 'loss',
    label: 'Loss is possible',
    detail: 'Genuine business losses are possible, and are borne as the agreement sets out.',
  },
];

export const RISK_STATEMENTS = [
  'Past performance does not guarantee future results.',
  'Profit is not fixed or guaranteed.',
  'Capital is subject to genuine business risk.',
];

// ---------- 08 · Principles ----------
export interface Principle {
  id: string;
  term: string;
  english: string;
  description: string;
}

export const PRINCIPLES_SECTION = {
  title: 'Built around amanah.',
  lede: 'Five commitments that shape how the business is run, priced and reported.',
  disclaimerLabel: 'Status of the structure',
  disclaimer:
    'Our proposed partnership structure is intended to follow the principles of Mudarabah. Final agreements and operations should be reviewed by qualified legal and Shariah professionals.',
} as const;

export const PRINCIPLES: Principle[] = [
  {
    id: 'amanah',
    term: 'Amanah',
    english: 'Trust',
    description:
      'Capital placed with the business is held as a trust and managed with care, not treated as the manager’s own.',
  },
  {
    id: 'sidq',
    term: 'Sidq',
    english: 'Truthfulness',
    description:
      'Records reflect what actually happened. Results are reported as they are, including when they disappoint.',
  },
  {
    id: 'adl',
    term: 'Adl',
    english: 'Fairness',
    description:
      'Fair pricing on both sides of a trade, and a profit split agreed in advance rather than adjusted after the fact.',
  },
  {
    id: 'no-riba',
    term: 'No riba',
    english: 'No interest-based returns',
    description:
      'Returns arise from trading real goods at a profit, never from lending money at a fixed rate of interest.',
  },
  {
    id: 'halal-trade',
    term: 'Halal trade',
    english: 'Permissible business activity',
    description:
      'Only permissible commodities, bought and sold through legitimate commercial channels.',
  },
];

// ---------- 09 · Trust ----------
export const TRUST = {
  title: 'Built on three things.',
  speakTo: 'Speak to',
  pillars: [
    {
      title: 'Transparent records',
      detail:
        'Every purchase, sale and expense is documented and available for review by the partner whose capital is at work.',
    },
    {
      title: 'Responsible management',
      detail:
        'Positions are sized to what the business can carry. Preserving capital comes before chasing a larger result.',
    },
    {
      title: 'Long-term relationships',
      detail:
        'The intent is repeat partnership over years, which only holds if each cycle is reported honestly.',
    },
  ],
} as const;

// ---------- 10 · Closing ----------
export const CLOSING = {
  headline: ['Trade with trust.', 'Grow with barakah.'],
  lede: 'Explore a more transparent approach to halal commodity trading and ethical business partnerships.',
  primaryCta: 'Talk to Barakah Commodities',
  secondaryCta: 'Run the numbers',
} as const;

// ---------- Footer / legal ----------
export const FOOTER_LINKS = {
  navigate: [...NAV_LINKS, NAV_ACTION] as NavLink[],
  legal: [{ label: 'Risk disclosure', href: '#risk' }] as NavLink[],
};

export const LEGAL_NOTE =
  'Barakah Commodities is a commodity trading business. Any partnership arrangement is subject to applicable laws, regulations and the executed agreement.';

export const formatINR = (value: number): string => `₹${value.toLocaleString('en-IN')}`;
