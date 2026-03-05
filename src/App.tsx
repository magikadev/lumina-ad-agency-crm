import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Pipelines } from './pages/Pipelines';
import { Analytics } from './pages/Analytics';
import { useStore } from './store/useStore.ts';
import { supabase, isSupabaseConfigured } from './lib/supabase';

function App() {
  const { currentPage, fetchLeads } = useStore();

  useEffect(() => {
    fetchLeads();

    if (isSupabaseConfigured) {
      // Real-time subscription only if configured
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leads' },
          () => {
            fetchLeads();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'leads': return <Leads />;
      case 'pipelines': return <Pipelines />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {!isSupabaseConfigured && (
        <div className="fixed bottom-4 right-4 z-50 bg-warning/10 border border-warning/20 text-warning px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md">
          Running in Mock Mode (Connect Supabase for persistence)
        </div>
      )}
      {renderPage()}
    </Layout>
  );
}

export default App;
