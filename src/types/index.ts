export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: LeadStatus;
  score: number;
  contactDate: string;
  industry: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsStats {
  totalValue: number;
  winRate: number;
  activeDeals: number;
  avgScore: number;
  industryData: Array<{ name: string; value: number }>;
  statusDistribution: Array<{ name: string; value: number }>;
}
