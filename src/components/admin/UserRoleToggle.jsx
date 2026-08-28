import { motion } from 'framer-motion';

/**
 * Animated toggle switch for user role (USER ↔ ADMIN).
 * @param {Object} props
 * @param {string} props.role - Current role ('USER' or 'ADMIN')
 * @param {function} props.onToggle - Called with new role
 * @param {boolean} [props.disabled=false]
 */
export default function UserRoleToggle({ role, onToggle, disabled = false }) {
  const isAdmin = role === 'ADMIN';

  return (
    <button
      onClick={() => !disabled && onToggle(isAdmin ? 'USER' : 'ADMIN')}
      disabled={disabled}
      className={`
        relative inline-flex items-center h-7 w-[90px] rounded-full flex-shrink-0
        border transition-all duration-300 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${
          isAdmin
            ? 'bg-accent-red/20 border-accent-red/40'
            : 'bg-bg-card border-border-subtle'
        }
      `}
      title={`Switch to ${isAdmin ? 'USER' : 'ADMIN'}`}
      id={`role-toggle-${role}`}
    >
      {/* Slider */}
      <motion.div
        layout
        className={`
          absolute top-0.5 w-[42px] h-6 rounded-full flex items-center justify-center
          text-[10px] font-bold uppercase tracking-wider
          ${
            isAdmin
              ? 'bg-accent-red text-white shadow-[0_0_10px_rgba(255,77,77,0.4)]'
              : 'bg-bg-card-hover text-text-muted'
          }
        `}
        style={{ left: isAdmin ? 'calc(100% - 44px)' : '2px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {isAdmin ? 'Admin' : 'User'}
      </motion.div>
    </button>
  );
}
