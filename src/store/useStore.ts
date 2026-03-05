import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lead, LeadStatus, AnalyticsStats } from '../types';

// Mock data for preview
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    company: 'Stellar Tech',
    email: 'alex@stellar.io',
    phone: '+1 555-0123',
    value: 12500,
    status: 'proposal',
    score: 85,
    contactDate: new Date().toISOString(),
    industry: 'SaaS',
    notes: 'High intent lead from Q4 webinar.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sarah Chen',
    company: 'Nexus Design',
    email: 'sarah@nexus.com',
    phone: '+1 555-0456',
    value: 8000,
    status: 'new',
    score: 45,
    contactDate: new Date().toISOString(),
    industry: 'Creative Agency',
    notes: 'Interested in brand identity package.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface AppState {
  currentPage: 'dashboard' | 'leads' | 'pipelines' | 'analytics';
  leads: Lead[];
  isLoading: boolean;
  searchQuery: string;
  filterStatus: LeadStatus | 'all';
  
  setCurrentPage: (page: 'dashboard' | 'leads' | 'pipelines' | 'analytics') => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: LeadStatus | 'all') => void;
  
  fetchLeads: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'dashboard',
      leads: [],
      isLoading: false,
      searchQuery: '',
      filterStatus: 'all',

      setCurrentPage: (page) => set({ currentPage: page }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),

      fetchLeads: async () => {
        if (!isSupabaseConfigured) {
          if (get().leads.length === 0) {
            set({ leads: MOCK_LEADS, isLoading: false });
          }
          return;
        }

        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!error && data) {
            const formattedLeads: Lead[] = data.map(l => ({
              ...l,
              contactDate: l.contact_date,
              createdAt: l.created_at,
              updatedAt: l.updated_at
            }));
            set({ leads: formattedLeads });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addLead: async (leadData) => {
        if (!isSupabaseConfigured) {
          const newLead: Lead = {
            ...leadData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          set((state) => ({ leads: [newLead, ...state.leads] }));
          return;
        }

        const { data, error } = await supabase
          .from('leads')
          .insert([{ ...leadData, contact_date: leadData.contactDate }])
          .select()
          .single();

        if (!error && data) {
          set((state) => ({ leads: [data, ...state.leads] }));
        }
      },

      updateLead: async (id, updates) => {
        if (!isSupabaseConfigured) {
          set((state) => ({
            leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
          }));
          return;
        }

        const { error } = await supabase
          .from('leads')
          .update({
            ...updates,
            contact_date: updates.contactDate,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (!error) {
          set((state) => ({
            leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l))
          }));
        }
      },

      deleteLead: async (id) => {
        if (!isSupabaseConfigured) {
          set((state) => ({ leads: state.leads.filter((l) => l.id !== id) }));
          return;
        }

        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (!error) {
          set((state) => ({ leads: state.leads.filter((l) => l.id !== id) }));
        }
      },
    }),
    { name: 'lumina-crm-storage' }
  )
);

// Selectors
export const selectFilteredLeads = (state: AppState) => {
  const { leads, searchQuery, filterStatus } = state;
  return leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
};

export const selectAnalytics = (state: AppState): AnalyticsStats => {
  const { leads } = state;
  const won = leads.filter(l => l.status === 'won');
  const lost = leads.filter(l => l.status === 'lost');
  const pipeline = leads.filter(l => !['won', 'lost'].includes(l.status));

  const totalValue = pipeline.reduce((sum, l) => sum + l.value, 0);
  const winRate = (won.length / (won.length + lost.length || 1)) * 100;

  const industryData = Array.from(new Set(leads.map(l => l.industry || 'Other'))).map(ind => ({
    name: ind,
    value: leads.filter(l => l.industry === ind).reduce((s, l) => s + l.value, 0)
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  return {
    totalValue,
    winRate,
    activeDeals: pipeline.length,
    avgScore: leads.length ? leads.reduce((s, l) => s + l.score, 0) / leads.length : 0,
    industryData,
    statusDistribution: [
      { name: 'New', value: leads.filter(l => l.status === 'new').length },
      { name: 'Contacted', value: leads.filter(l => l.status === 'contacted').length },
      { name: 'Qualified', value: leads.filter(l => l.status === 'qualified').length },
      { name: 'Proposal', value: leads.filter(l => l.status === 'proposal').length },
      { name: 'Negotiation', value: leads.filter(l => l.status === 'negotiation').length },
    ]
  };
};
