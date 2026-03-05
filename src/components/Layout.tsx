import { LayoutDashboard, Users, Briefcase, BarChart3, Settings, Bell, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useStore } from '../store/useStore.ts';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { currentPage, setCurrentPage, setSearchQuery } = useStore();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-surface/20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tight">Lumina</span>
          </div>
          
          <nav className="space-y-1">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={currentPage === 'dashboard'}
              onClick={() => setCurrentPage('dashboard')}
            />
            <NavItem
              icon={<Users size={20} />}
              label="Leads"
              active={currentPage === 'leads'}
              onClick={() => setCurrentPage('leads')}
            />
            <NavItem
              icon={<Briefcase size={20} />}
              label="Pipelines"
              active={currentPage === 'pipelines'}
              onClick={() => setCurrentPage('pipelines')}
            />
            <NavItem
              icon={<BarChart3 size={20} />}
              label="Analytics"
              active={currentPage === 'analytics'}
              onClick={() => setCurrentPage('analytics')}
            />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-border">
          <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-surface/10">
          <div className="flex items-center gap-4 bg-surface/50 px-4 py-2 rounded-full border border-border w-96">
            <Search size={18} className="text-textSecondary" />
            <input 
              type="text" 
              placeholder="Search campaigns, clients..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active = false, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`
    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
    ${active ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surface hover:text-text'}
  `}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);
