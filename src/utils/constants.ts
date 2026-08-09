// ============================================
// Barakah Commodities — Constants & Content Data
// ============================================

import type {
  NavLink,
  CommodityItem,
  ProcessStage,
  MudarabahStep,
  LedgerEntry,
  Principle,
  RiskPoint,
  TrustPillar,
} from '../types';

// ---- Colors ----
export const COLORS = {
  emerald: '#063B2A',
  forest: '#031F17',
  gold: '#C9A34E',
  champagne: '#E8D6A4',
  ivory: '#F7F3E8',
  charcoal: '#161814',
} as const;

// ---- Navigation ----
export const NAV_LINKS: NavLink[] = [
  { label: 'Business', href: '#business' },
  { label: 'Mudarabah', href: '#mudarabah' },
  { label: 'Transparency', href: '#transparency' },
  { label: 'Shariah Principles', href: '#principles' },
  { label: 'Contact', href: '#contact' },
];

// ---- Commodities ----
export const COMMODITIES: CommodityItem[] = [
  {
    id: 'spices',
    name: '01',
    label: 'SPICES',
    description: 'Premium spice trading',
    detail:
      'Sourcing and trading quality spices through established supply chains across India.',
  },
  {
    id: 'dry-fruits',
    name: '02',
    label: 'DRY FRUITS',
    description: 'Wholesale commodity trading',
    detail:
      'Trading dry fruits and nuts through direct procurement and wholesale distribution channels.',
  },
  {
    id: 'gold',
    name: '03',
    label: 'PHYSICAL GOLD',
    description: 'Physical gold trading',
    detail:
      'Physical gold trading subject to applicable Shariah requirements and Indian law.',
  },
];

// ---- Process Stages ----
export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'source',
    label: 'SOURCE',
    description: 'Identifying reliable commodity sources and suppliers',
  },
  {
    id: 'purchase',
    label: 'PURCHASE',
    description: 'Procurement at agreed market prices with proper documentation',
  },
  {
    id: 'storage',
    label: 'STORAGE',
    description: 'Secure storage maintaining commodity quality and compliance',
  },
  {
    id: 'trade',
    label: 'TRADE',
    description: 'Selling commodities through established market channels',
  },
  {
    id: 'accounting',
    label: 'ACCOUNTING',
    description: 'Recording every transaction with full transparency',
  },
  {
    id: 'settlement',
    label: 'SETTLEMENT',
    description: 'Distributing results according to the executed agreement',
  },
];

// ---- Mudarabah Flow ----
export const MUDARABAH_STEPS: MudarabahStep[] = [
  {
    id: 'rab-ul-mal',
    titleAr: 'RAB-UL-MAL',
    titleEn: 'Capital Provider',
    description: 'Investor provides capital for commodity trading operations',
  },
  {
    id: 'mudarib',
    titleAr: 'MUDARIB',
    titleEn: 'Business Manager',
    description:
      'Barakah Commodities manages the business with expertise and effort',
  },
  {
    id: 'trading',
    titleAr: 'REAL COMMODITY TRADING',
    titleEn: 'Active Business',
    description: 'Spices / Dry Fruits / Physical Gold — tangible trade activity',
  },
  {
    id: 'result',
    titleAr: 'ACTUAL BUSINESS RESULT',
    titleEn: 'Performance',
    description: 'Profit OR Loss — determined by real business outcomes',
  },
  {
    id: 'sharing',
    titleAr: 'AGREED PROFIT SHARING',
    titleEn: 'Distribution',
    description: 'According to the pre-agreed ratio in the executed agreement',
  },
];

// ---- Profit Model Example ----
export const PROFIT_EXAMPLE = {
  grossSales: 310000,
  costOfGoods: 240000,
  directExpenses: 20000,
  netProfit: 50000,
  // Using a simpler example: ₹30,000 net for the illustration
  illustrativeNet: 30000,
  investorRatio: 70,
  managerRatio: 30,
  investorShare: 21000,
  managerShare: 9000,
};

// ---- Ledger Entries (Demonstration Data) ----
export const LEDGER_ENTRIES: LedgerEntry[] = [
  { label: 'PURCHASE', amount: 240000, type: 'debit' },
  { label: 'SALES', amount: 310000, type: 'credit' },
  { label: 'TRANSPORT', amount: 8000, type: 'debit' },
  { label: 'STORAGE', amount: 5000, type: 'debit' },
  { label: 'OTHER DIRECT EXPENSES', amount: 7000, type: 'debit' },
  { label: 'NET BUSINESS RESULT', amount: 50000, type: 'result' },
];

export const TRANSPARENCY_PILLARS = [
  'Purchase Records',
  'Sales Records',
  'Expense Records',
  'Inventory',
  'Profit & Loss',
  'Investor Reporting',
];

// ---- Islamic Principles ----
export const PRINCIPLES: Principle[] = [
  {
    id: 'amanah',
    titleAr: 'AMANAH',
    titleEn: 'Trust',
    description:
      'Holding and managing entrusted capital with integrity and responsibility.',
  },
  {
    id: 'sidq',
    titleAr: 'SIDQ',
    titleEn: 'Truthfulness',
    description:
      'Honest reporting, genuine records, and transparent communication.',
  },
  {
    id: 'adl',
    titleAr: 'ADL',
    titleEn: 'Fairness',
    description:
      'Fair pricing, fair profit-sharing, and equitable business dealings.',
  },
  {
    id: 'no-riba',
    titleAr: 'NO RIBA',
    titleEn: 'No Interest',
    description:
      'Returns based on actual business performance, not fixed interest rates.',
  },
  {
    id: 'halal-trade',
    titleAr: 'HALAL TRADE',
    titleEn: 'Permissible Business',
    description:
      'Trading only in permissible commodities through ethical business practices.',
  },
];

// ---- Risk Points ----
export const RISK_POINTS: RiskPoint[] = [
  { text: 'Commodity prices can move up or down.' },
  { text: 'Sales may be higher or lower than expected.' },
  { text: 'Business expenses can affect profitability.' },
  { text: 'Genuine business losses are possible.' },
];

export const RISK_DISCLAIMERS = [
  'Past performance does not guarantee future results.',
  'Profit is not fixed or guaranteed.',
  'Capital is subject to genuine business risk.',
];

// ---- Trust Pillars ----
export const TRUST_PILLARS: TrustPillar[] = [
  {
    number: '01',
    title: 'Transparent records',
    description:
      'Every purchase, sale, and expense documented and available for review.',
  },
  {
    number: '02',
    title: 'Responsible management',
    description:
      'Prudent business decisions focused on preserving capital and generating genuine returns.',
  },
  {
    number: '03',
    title: 'Long-term relationships',
    description:
      'Building partnerships based on trust and mutual benefit, not short-term speculation.',
  },
];

// ---- Contact ----
export const CONTACT = {
  name: 'Mohammed Aqib Abdullah',
  title: 'Business Manager',
  phone: '+91 9059804335',
  phoneHref: 'tel:+919059804335',
};

// ---- Legal ----
export const LEGAL_DISCLAIMER =
  'Barakah Commodities is a commodity trading business. Any partnership arrangement is subject to applicable laws, regulations and the executed agreement.';

export const SHARIAH_DISCLAIMER =
  'Our proposed partnership structure is intended to follow the principles of Mudarabah. Final agreements and operations should be reviewed by qualified legal and Shariah professionals.';

// ---- Footer Links ----
export const FOOTER_LINKS = {
  main: [
    { label: 'Business', href: '#business' },
    { label: 'Mudarabah', href: '#mudarabah' },
    { label: 'Transparency', href: '#transparency' },
    { label: 'Shariah Principles', href: '#principles' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms', href: '#terms' },
    { label: 'Risk Disclosure', href: '#risk' },
  ],
};

// ---- Breakpoints ----
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

// ---- Animation Config ----
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.7,
    cinematic: 1.2,
  },
  ease: {
    out: [0.16, 1, 0.3, 1] as [number, number, number, number],
    inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
};
