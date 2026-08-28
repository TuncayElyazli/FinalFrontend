import { motion } from 'framer-motion';

/**
 * Animated loading spinner with neon ring effect.
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
export default function LoadingSpinner({ size = 'md' }) {
  const dims = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  const borderWidth = { sm: '2px', md: '3px', lg: '4px' };

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className={`${dims[size]} rounded-full`}
        style={{
          border: `${borderWidth[size]} solid var(--bg-card)`,
          borderTopColor: 'var(--accent-red-neon)',
          boxShadow: '0 0 15px rgba(255,77,77,0.3)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
