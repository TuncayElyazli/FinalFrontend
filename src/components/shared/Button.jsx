import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-accent-red text-white hover:bg-accent-red-neon shadow-[var(--glow-red)] hover:shadow-[var(--glow-red-intense)]',
  secondary:
    'bg-bg-card text-text-primary border border-border-light hover:bg-bg-card-hover hover:border-accent-red/30',
  danger:
    'bg-red-900/40 text-red-300 border border-red-800/50 hover:bg-red-900/60',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
  amber:
    'bg-accent-amber text-bg-primary font-semibold hover:bg-accent-amber-neon shadow-[var(--glow-amber)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

/**
 * Animated button with glow variants.
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'|'amber'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.disabled]
 * @param {React.ReactNode} props.children
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none
        transition-all duration-200 cursor-pointer flex-shrink-0
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
