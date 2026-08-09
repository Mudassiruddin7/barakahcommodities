// ============================================
// Barakah Commodities — Shared Types
// ============================================

export interface CommodityItem {
  id: string;
  name: string;
  label: string;
  description: string;
  detail: string;
}

export interface ProcessStage {
  id: string;
  label: string;
  description: string;
}

export interface MudarabahStep {
  id: string;
  titleAr: string;
  titleEn: string;
  description: string;
}

export interface LedgerEntry {
  label: string;
  amount: number;
  type: 'debit' | 'credit' | 'result';
}

export interface Principle {
  id: string;
  titleAr: string;
  titleEn: string;
  description: string;
}

export interface RiskPoint {
  text: string;
}

export interface TrustPillar {
  number: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}
