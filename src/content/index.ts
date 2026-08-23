// ============================================================
// Content — every string on the page lives here.
//
// The wording around profit, risk and Shariah status is
// deliberate. Nothing here asserts a guaranteed return, a
// certification, or a regulatory approval.
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
} as const;

export const BRAND = {
  name: 'Barakah Commodities',
  logoTop: 'BARAKAH',
  logoBottom: 'COMMODITIES',
  tagline: 'Trust · Transparency · Barakah',
  descriptor: 'Halal Commodity Trading & Ethical Business Partnerships',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'Business', href: '#business' },
  { label: 'Mudarabah', href: '#mudarabah' },
  { label: 'Transparency', href: '#transparency' },
  { label: 'Principles', href: '#principles' },
  { label: 'Contact', href: '#contact' },
];

// ---------- Hero ----------
export const HERO = {
  eyebrow: 'Barakah Commodities',
  headline: ['Real commodities.', 'Real business.', 'Real barakah.'],
  lede: 'Halal commodity trading built on trust, transparency and responsible profit-sharing partnerships.',
  primaryCta: 'Explore our business',
  secondaryCta: 'Understand Mudarabah',
} as const;

export const COMMODITY_STRIP = [
  'Spices',
  'Dry Fruits',
  'Physical Gold',
  'Commodity Trading',
] as const;

// ---------- 01 · Business ----------
export interface Commodity {
  id: string;
  index: string;
  name: string;
  summary: string;
  detail: string;
  note: string;
}

export const BUSINESS = {
  eyebrow: 'What we trade',
  title: 'We trade what people actually use.',
  lede: 'Barakah Commodities focuses on tangible commodities and real-world trading activity rather than speculative digital assets or artificial financial products.',
} as const;

export const COMMODITIES: Commodity[] = [
  {
    id: 'spices',
    index: '01',
    name: 'Spices',
    summary: 'Premium spice trading',
    detail:
      'Turmeric, chilli, pepper and whole spices sourced through established Indian supply chains and moved in wholesale quantities.',
    note: 'Graded and weighed on purchase',
  },
  {
    id: 'dry-fruits',
    index: '02',
    name: 'Dry Fruits',
    summary: 'Wholesale commodity trading',
    detail:
      'Almonds, dates, pistachios and walnuts procured directly and distributed through wholesale channels.',
    note: 'Stored against seasonal demand',
  },
  {
    id: 'gold',
    index: '03',
    name: 'Physical Gold',
    summary: 'Physical, allocated metal',
    detail:
      'Physical gold trading subject to applicable Shariah requirements and Indian law. Metal is real, allocated and held — never a paper position.',
    note: 'Spot settlement, physical delivery',
  },
];

// ---------- 02 · The commodity table ----------
export interface ProcessStage {
  id: string;
  index: string;
  label: string;
  description: string;
}

export const PROCESS = {
  eyebrow: 'The commodity table',
  title: 'From purchase to settlement.',
  lede: 'Every consignment moves through the same six stages, and each one leaves a record behind it.',
} as const;

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'source',
    index: '01',
    label: 'Source',
    description:
      'Suppliers are identified and quality is assessed before any capital is committed.',
  },
  {
    id: 'purchase',
    index: '02',
    label: 'Purchase',
    description:
      'Goods are bought at agreed prices against invoices and weighed on receipt.',
  },
  {
    id: 'storage',
    index: '03',
    label: 'Storage',
    description:
      'Stock is held in conditions that preserve grade, with inventory counted and recorded.',
  },
  {
    id: 'trade',
    index: '04',
    label: 'Trade',
    description:
      'Commodities are sold through established wholesale and retail market channels.',
  },
  {
    id: 'accounting',
    index: '05',
    label: 'Accounting',
    description:
      'Purchases, sales and direct expenses are entered as they happen, not reconstructed later.',
  },
  {
    id: 'settlement',
    index: '06',
    label: 'Settlement',
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
  eyebrow: 'The partnership',
  title: 'Partnership, not a promise.',
  lede: 'Mudarabah is a profit-sharing partnership in which one party provides capital and the other provides management and expertise.',
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
      'Capital is deployed into spices, dry fruits and physical gold — goods that are bought, held and sold.',
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
    description:
      'Any profit is divided according to the ratio set out in the executed agreement.',
  },
];

// ---------- 04 · Profit model ----------
export const PROFIT = {
  eyebrow: 'Profit model',
  title: 'How profit is calculated.',
  lede: 'Profit is what remains after the cost of goods and the direct expenses of running the trade. It is arithmetic, not a projection.',
  disclaimerLabel: 'Illustration only — not a guaranteed return',
  disclaimerBody:
    'The figures below are a worked example chosen to show the method. Actual profit depends on actual business performance, and a genuine business loss is possible.',
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
    amount: 40000,
    operator: 'less',
    kind: 'debit',
    hint: 'Transport, storage and other costs of the trade',
  },
  {
    id: 'net',
    label: 'Net business profit',
    amount: 30000,
    operator: 'equals',
    kind: 'result',
    hint: 'What the business actually earned',
  },
];

export const PROFIT_SPLIT = {
  net: 30000,
  investorRatio: 70,
  managerRatio: 30,
  investorShare: 21000,
  managerShare: 9000,
  investorLabel: 'Investor · Rab-ul-Mal',
  managerLabel: 'Manager · Mudarib',
} as const;

// ---------- 05 · Transparency ----------
export interface LedgerRow {
  id: string;
  date: string;
  particulars: string;
  reference: string;
  amount: number;
  kind: 'debit' | 'credit' | 'result';
}

export const TRANSPARENCY = {
  eyebrow: 'Transparency',
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
    particulars: 'Purchase — turmeric, 12 qtl',
    reference: 'INV-0418',
    amount: 240000,
    kind: 'debit',
  },
  {
    id: 'r2',
    date: '09 Apr',
    particulars: 'Transport — mandi to godown',
    reference: 'EXP-0092',
    amount: 8000,
    kind: 'debit',
  },
  {
    id: 'r3',
    date: '11 Apr',
    particulars: 'Storage — godown, one month',
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
    particulars: 'Sales — wholesale lot',
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

// ---------- 06 · Risk ----------
export const RISK = {
  eyebrow: 'Risk',
  title: 'Real business means real risk.',
  lede: 'Commodity trading carries genuine commercial risk. Stating it plainly is part of doing it honestly.',
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

// ---------- 07 · Principles ----------
export interface Principle {
  id: string;
  term: string;
  english: string;
  description: string;
}

export const PRINCIPLES_SECTION = {
  eyebrow: 'Islamic business principles',
  title: 'Built around amanah.',
  lede: 'Five commitments that shape how the business is run, priced and reported.',
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
    term: 'No Riba',
    english: 'No interest-based returns',
    description:
      'Returns arise from trading real goods at a profit — never from lending money at a fixed rate of interest.',
  },
  {
    id: 'halal-trade',
    term: 'Halal Trade',
    english: 'Permissible business activity',
    description:
      'Only permissible commodities, bought and sold through legitimate commercial channels.',
  },
];

// ---------- 08 · Trust ----------
export const TRUST = {
  eyebrow: 'Why work with us',
  title: 'Built on three things.',
  pillars: [
    {
      index: '01',
      title: 'Transparent records',
      detail:
        'Every purchase, sale and expense is documented and available for review by the partner whose capital is at work.',
    },
    {
      index: '02',
      title: 'Responsible management',
      detail:
        'Positions are sized to what the business can carry. Preserving capital comes before chasing a larger result.',
    },
    {
      index: '03',
      title: 'Long-term relationships',
      detail:
        'The intent is repeat partnership over years, which only holds if each cycle is reported honestly.',
    },
  ],
} as const;

// ---------- 09 · Closing ----------
export const CLOSING = {
  eyebrow: 'Next step',
  headline: ['Trade with trust.', 'Grow with barakah.'],
  lede: 'Explore a more transparent approach to halal commodity trading and ethical business partnerships.',
  primaryCta: 'Talk to Barakah Commodities',
  secondaryCta: 'View partnership model',
} as const;

// ---------- Footer / legal ----------
export const FOOTER_LINKS = {
  navigate: NAV_LINKS,
  legal: [
    { label: 'Privacy Policy', href: '#legal-privacy' },
    { label: 'Terms', href: '#legal-terms' },
    { label: 'Risk Disclosure', href: '#risk' },
  ] as NavLink[],
};

export const LEGAL_NOTE =
  'Barakah Commodities is a commodity trading business. Any partnership arrangement is subject to applicable laws, regulations and the executed agreement.';

export const formatINR = (value: number): string =>
  `₹${value.toLocaleString('en-IN')}`;
