import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LuLayoutDashboard,
  LuFilm,
  LuCalendar,
  LuUsers,
  LuChevronLeft,
  LuClapperboard,
} from 'react-icons/lu';

const navItems = [
  { to: '/admin/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
  { to: '/admin/movies', icon: LuFilm, label: 'Movies' },
  { to: '/admin/screenings', icon: LuCalendar, label: 'Screenings' },
  { to: '/admin/users', icon: LuUsers, label: 'Users' },
];

/**
 * Admin sidebar with icon + label nav links and active neon-red accent.
 * @param {Object} props
 * @param {boolean} [props.collapsed=false]
 * @param {function} [props.onToggle]
 */
export default function Sidebar({ collapsed = false, onToggle }) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`
        fixed top-0 left-0 h-screen z-40
        bg-bg-surface border-r border-border-subtle
        flex flex-col
        transition-all duration-300
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
      id="admin-sidebar"
    >
      {/* Header */}
      <div className="h-[var(--navbar-height)] flex items-center justify-between px-4 border-b border-border-subtle flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <LuClapperboard className="w-6 h-6 text-accent-red-neon flex-shrink-0" />
            <span className="text-lg font-bold font-[var(--font-display)] text-gradient truncate">
              Admin Panel
            </span>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className={`w-8 h-8 rounded-lg bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer flex-shrink-0 ${
            collapsed ? 'mx-auto rotate-180' : ''
          }`}
          id="sidebar-toggle"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <LuChevronLeft className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            id={`sidebar-${item.label.toLowerCase()}`}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) => `
              group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'text-accent-red-neon bg-accent-red/10'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active accent bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent-red-neon"
                    style={{ boxShadow: '0 0 10px rgba(255,77,77,0.5)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate whitespace-nowrap">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border-subtle flex-shrink-0">
        <NavLink
          to="/"
          title={collapsed ? 'Back to Site' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LuChevronLeft className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="truncate whitespace-nowrap">Back to Site</span>}
        </NavLink>
      </div>
    </motion.aside>
  );
}
