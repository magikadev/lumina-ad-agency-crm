import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Target, 
  Users, 
  Briefcase,
  ArrowUpRight,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useStore, selectAnalytics } from '../store/useStore';

const COLORS = ['#9E7FFF', '#38bdf8', '#f472b6', '#10b981', '#f59e0b'];

export const Analytics = () => {
  const stats = useStore(selectAnalytics);

  // Memoize chart data to prevent unnecessary re-renders
  const industryChart = useMemo(() => stats.industryData, [stats.industryData]);
  const statusChart = useMemo(() => stats.statusDistribution, [stats.statusDistribution]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
          <p className="text-textSecondary">Deep insights into your agency's performance.</p>
        </div>
        <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-border transition-colors flex items-center gap-2">
          <Download size={16} />
          Export Data
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} icon={<Target className="text-primary" />} trend="+2.4%" />
        <MetricCard title="Pipeline Value" value={`$${(stats.totalValue / 1000).toFixed(0)}k`} icon={<TrendingUp className="text-secondary" />} trend="+12%" />
        <MetricCard title="Active Deals" value={stats.activeDeals.toString()} icon={<Briefcase className="text-accent" />} trend="+5" />
        <MetricCard title="Avg. Lead Score" value={`${stats.avgScore.toFixed(0)}%`} icon={<Users className="text-success" />} trend="+1.2%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-primary" />
            Revenue by Industry
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryChart}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {industryChart.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#262626', border: '1px solid #2F2F2F', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {industryChart.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-textSecondary truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChartIcon size={20} className="text-secondary" />
            Pipeline Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" vertical={false} />
                <XAxis dataKey="name" stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#262626', border: '1px solid #2F2F2F', borderRadius: '12px' }}
                  cursor={{ fill: 'rgba(158, 127, 255, 0.05)' }}
                />
                <Bar dataKey="value" fill="#9E7FFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, trend }: any) => (
  <motion.div whileHover={{ y: -4 }} className="glass-panel p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-surface rounded-lg border border-border">{icon}</div>
      <span className="text-xs font-bold text-success flex items-center gap-1">
        <ArrowUpRight size={14} />
        {trend}
      </span>
    </div>
    <p className="text-textSecondary text-sm font-medium">{title}</p>
    <h4 className="text-3xl font-bold mt-1">{value}</h4>
  </motion.div>
);
