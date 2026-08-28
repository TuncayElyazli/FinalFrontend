import { motion } from 'framer-motion';

/**
 * Glassmorphism statistics card for the admin dashboard.
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Lucide icon component
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.trend] - e.g., "+12%" or "-3%"
 * @param {string} [props.accentColor='var(--accent-red-neon)']
 */
export default function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  accentColor = 'var(--accent-red-neon)',
}) {
  const isPositiveTrend = trend && !trend.startsWith('-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden bg-bg-card border border-border-subtle rounded-2xl p-6 group hover:border-border-light transition-all duration-300"
    >
      {/* Glow accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1 truncate">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-[var(--font-display)] tracking-tight truncate text-white">
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs font-medium mt-2 flex items-center gap-1 truncate ${
                isPositiveTrend ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              <span>{trend}</span>
              <span className="text-text-muted text-[11px]">vs last month</span>
            </p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>
      </div>
    </motion.div>
  );
}
