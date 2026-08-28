import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LuDollarSign,
  LuTicket,
  LuFilm,
  LuUsers,
  LuTrendingUp,
  LuCalendar,
  LuActivity,
} from 'react-icons/lu';
import StatsCard from '../../components/shared/StatsCard';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import adminService from '../../services/adminService';

const MOCK_STATS = {
  totalRevenue: 48920.5,
  ticketsSold: 3412,
  activeMovies: 18,
  totalUsers: 1240,
  recentBookings: [
    { id: 101, movie: 'Dune: Part Two', user: 'alex.doe@example.com', seats: 'F4, F5', amount: 25.0, time: '10 mins ago' },
    { id: 102, movie: 'Oppenheimer', user: 'sarah.k@example.com', seats: 'D7', amount: 14.0, time: '25 mins ago' },
    { id: 103, movie: 'The Batman', user: 'michael.b@example.com', seats: 'E5, E6, E7', amount: 42.0, time: '1 hour ago' },
    { id: 104, movie: 'Interstellar', user: 'elena.r@example.com', seats: 'C2', amount: 12.5, time: '2 hours ago' },
  ],
};

export default function DashboardPage() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await adminService.getDashboardStats();
        if (res.data) {
          setStats((prev) => ({ ...prev, ...res.data }));
        }
      } catch {
        // Fall back to mock stats
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-[var(--font-display)]">Admin Dashboard</h1>
            <p className="text-sm text-text-muted mt-1">
              Overview of revenue, active screenings, bookings, and customer growth
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live System Active
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            icon={LuDollarSign}
            label="Total Revenue"
            value={`$${stats.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            trend="+18.4%"
            accentColor="#ff4d4d"
          />
          <StatsCard
            icon={LuTicket}
            label="Tickets Sold"
            value={stats.ticketsSold?.toLocaleString()}
            trend="+12.2%"
            accentColor="#ffb347"
          />
          <StatsCard
            icon={LuFilm}
            label="Active Movies"
            value={stats.activeMovies}
            trend="+4"
            accentColor="#60a5fa"
          />
          <StatsCard
            icon={LuUsers}
            label="Total Users"
            value={stats.totalUsers?.toLocaleString()}
            trend="+8.7%"
            accentColor="#a78bfa"
          />
        </div>

        {/* Analytics & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart Visual Area */}
          <div className="lg:col-span-2 bg-bg-card border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold font-[var(--font-display)]">Revenue Analytics</h3>
                <p className="text-xs text-text-muted">Monthly income breakdown</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <LuTrendingUp className="w-3.5 h-3.5" /> +24% YoY
              </span>
            </div>

            {/* Visual Bar Chart Mock */}
            <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border-subtle">
              {[
                { month: 'Jan', val: 45 },
                { month: 'Feb', val: 58 },
                { month: 'Mar', val: 72 },
                { month: 'Apr', val: 64 },
                { month: 'May', val: 88 },
                { month: 'Jun', val: 95 },
                { month: 'Jul', val: 110 },
              ].map((item, i) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.val}k
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.val}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-accent-red to-accent-amber opacity-75 group-hover:opacity-100 group-hover:shadow-[var(--glow-red)] transition-all"
                  />
                  <span className="text-[11px] font-medium text-text-muted">{item.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted mt-4">
              <span>Q1 - Q2 Performance</span>
              <span>Updated automatically</span>
            </div>
          </div>

          {/* Recent Bookings Feed */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold font-[var(--font-display)]">Recent Bookings</h3>
              <LuActivity className="w-4 h-4 text-accent-red-neon" />
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
              {stats.recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-bg-surface border border-border-subtle/60 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text-primary truncate">{b.movie}</p>
                    <p className="text-[11px] text-text-muted truncate">{b.user}</p>
                    <p className="text-[10px] text-accent-red-neon truncate">Seats: {b.seats}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-accent-amber">${b.amount.toFixed(2)}</p>
                    <p className="text-[10px] text-text-muted whitespace-nowrap">{b.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
