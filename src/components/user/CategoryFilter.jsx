import { motion } from 'framer-motion';

const GENRES = ['ALL', 'ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'SCI_FI', 'ROMANCE', 'THRILLER'];

const genreLabels = {
  ALL: 'All Movies',
  ACTION: 'Action',
  COMEDY: 'Comedy',
  DRAMA: 'Drama',
  HORROR: 'Horror',
  SCI_FI: 'Sci-Fi',
  ROMANCE: 'Romance',
  THRILLER: 'Thriller',
};

/**
 * Horizontal genre filter pills with animated active indicator and prominent sizing.
 * @param {Object} props
 * @param {string} props.activeGenre
 * @param {function} props.onSelect
 */
export default function CategoryFilter({ activeGenre, onSelect }) {
  return (
    <div
      className="flex items-center justify-center flex-wrap gap-3 sm:gap-3.5 max-w-5xl mx-auto w-full px-2"
      id="category-filter"
    >
      {GENRES.map((genre) => {
        const isActive = activeGenre === genre;
        return (
          <motion.button
            key={genre}
            onClick={() => onSelect(genre)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base font-semibold rounded-full
              whitespace-nowrap transition-all duration-200 cursor-pointer select-none
              ${
                isActive
                  ? 'text-white shadow-[0_0_20px_rgba(229,62,62,0.45)]'
                  : 'text-text-secondary hover:text-white bg-bg-card/90 hover:bg-bg-card-hover border border-border-light/20 hover:border-accent-red/40 shadow-md'
              }
            `}
            id={`filter-${genre.toLowerCase()}`}
          >
            {/* Active animated background */}
            {isActive && (
              <motion.div
                layoutId="active-genre"
                className="absolute inset-0 rounded-full bg-accent-red border border-accent-red-neon"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">{genreLabels[genre] || genre}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

