import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { ReactNode } from 'react';
import { useStore, selectAnalytics } from '../store/useStore';

export const Dashboard = () => {
  const { leads, setCurrentPage } = useStore();
  const analytics = useStore(selectAnalytics);

  const highValueLeads = leads
    .filter((l) => !['won', 'lost'].includes(l.status))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const needsAttention = leads
    .filter((lead) => {
      if (lead.status === 'won' || lead.status === 'lost') return false;
      const daysSinceContact = Math.floor(
        (new Date().getTime() - new Date(lead.contactDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return daysSinceContact > 3;
    })
    .slice(0, 2);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return formatCurrency(value);
  };

  const recentActivity = leads
    .filter((l) => l.status === 'won')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agency Overview</h1>
          <p className="text-textSecondary">Real-time performance and high-priority opportunities.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-border transition-colors">
            Export Report
          </button>
          <button
            onClick={() => setCurrentPage('leads')}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Zap size={16} />
            View All Leads
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pipeline"
          value={formatLargeNumber(analytics.totalValue)}
          change="+12.5%"
          trend="up"
          icon={<DollarSign className="text-primary" />}
        />
        <StatCard
          title="Active Leads"
          value={analytics.activeDeals.toString()}
          change={`+${analytics.activeDeals}`}
          trend="up"
          icon={<Users className="text-secondary" />}
        />
        <StatCard
          title="Win Rate"
          value={`${analytics.winRate.toFixed(1)}%`}
          change="+2.1%"
          trend={analytics.winRate > 20 ? 'up' : 'down'}
          icon={<Target className="text-accent" />}
        />
        <StatCard
          title="Avg. Lead Score"
          value={`${analytics.avgScore.toFixed(0)}%`}
          change="+1.2%"
          trend="up"
          icon={<TrendingUp className="text-success" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-semibold">Pipeline Distribution</h3>
              <p className="text-sm text-textSecondary">Lead volume across deal stages</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" vertical={false} />
                <XAxis dataKey="name" stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#262626',
                    border: '1px solid #2F2F2F',
                    borderRadius: '12px',
                  }}
                  itemStyle={{ color: '#FFFFFF' }}
                  cursor={{ fill: 'rgba(158, 127, 255, 0.1)' }}
                />
                <Bar dataKey="value" fill="#9E7FFF" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">High-Value Leads</h3>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Priority</span>
          </div>
          <div className="space-y-4 flex-1">
            {highValueLeads.length > 0 ? (
              highValueLeads.map((lead) => (
                <motion.div
                  key={lead.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setCurrentPage('leads')}
                  className="p-4 rounded-xl bg-surface/40 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-surface to-border flex items-center justify-center font-bold text-primary">
                      {lead.company.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">{lead.company}</h4>
                        <span className="text-xs font-bold text-success">{formatCurrency(lead.value)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className="text-[10px] text-textSecondary font-medium">{lead.score}% fit</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">No active high-value leads</div>
            )}
          </div>
          <button
            onClick={() => setCurrentPage('leads')}
            className="w-full mt-6 py-3 text-sm font-medium text-textSecondary hover:text-text flex items-center justify-center gap-2 transition-colors"
          >
            View all opportunities <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-warning" />
            Attention Required
          </h3>
          <div className="space-y-3">
            {needsAttention.length > 0 ? (
              needsAttention.map((lead) => {
                const daysSinceContact = Math.floor(
                  (new Date().getTime() - new Date(lead.contactDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <ActionItem
                    key={lead.id}
                    icon={<Clock className="text-warning" />}
                    title={`Follow up with ${lead.company}`}
                    desc={`Last contacted ${daysSinceContact} days ago. ${lead.notes.slice(0, 50)}...`}
                    time="Overdue"
                  />
                );
              })
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">All leads are up to date!</div>
            )}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((lead, i) => {
                const timeAgo = Math.floor(
                  (new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60)
                );
                return (
                  <div key={lead.id} className="flex gap-4 relative">
                    {i !== recentActivity.length - 1 && (
                      <div className="absolute left-[7px] top-6 bottom-[-24px] w-[2px] bg-border" />
                    )}
                    <div className="w-4 h-4 mt-1 rounded-full bg-primary/20 border-2 border-primary shrink-0 z-10" />
                    <div>
                      <p className="text-sm font-medium">
                        Deal won with <span className="text-primary">{lead.company}</span>
                      </p>
                      <p className="text-xs text-textSecondary">
                        {timeAgo < 24 ? `${timeAgo} hours ago` : `${Math.floor(timeAgo / 24)} days ago`} - {formatCurrency(lead.value)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-textSecondary text-sm">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: ReactNode;
}

const StatCard = ({ title, value, change, trend, icon }: StatCardProps) => (
  <motion.div whileHover={{ y: -4 }} className="glass-panel p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
      <div className="text-[80px]">{icon}</div>
    </div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-surface rounded-lg border border-border">{icon}</div>
      <div
        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        }`}
      >
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <p className="text-textSecondary text-sm font-medium">{title}</p>
    <h4 className="text-3xl font-bold mt-1 tracking-tight">{value}</h4>
  </motion.div>
);

interface ActionItemProps {
  icon: ReactNode;
  title: string;
  desc: string;
  time: string;
}

const ActionItem = ({ icon, title, desc, time }: ActionItemProps) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-surface/20 border border-border/30 hover:bg-surface/40 transition-colors cursor-pointer">
    <div className="mt-1">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">{time}</span>
      </div>
      <p className="text-xs text-textSecondary mt-1">{desc}</p>
    </div>
  </div>
);
