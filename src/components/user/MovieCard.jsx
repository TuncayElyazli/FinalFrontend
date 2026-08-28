import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LuClock, LuStar } from 'react-icons/lu';

/**
 * Movie poster card with hover scale + neon glow effect.
 * @param {Object} props
 * @param {Object} props.movie
 * @param {number} [props.index=0] - For staggered animation
 */
export default function MovieCard({ movie, index = 0 }) {
  return (
    <Link to={`/movie/${movie.id}`} id={`movie-card-${movie.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        whileHover={{ scale: 1.02 }}
        className="group relative bg-bg-card border border-border-subtle rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent-red/30 hover:shadow-[0_0_25px_rgba(255,77,77,0.15)]"
      >
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80'}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-80" />

          {/* Rating Badge */}
          {movie.rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-semibold">
              <LuStar className="w-3 h-3 text-accent-amber" />
              {movie.rating}
            </div>
          )}

          {/* Genre Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-accent-red/80 text-white backdrop-blur-sm whitespace-nowrap">
              {movie.genre?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-base font-semibold font-[var(--font-display)] mb-1 truncate group-hover:text-accent-red-neon transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <LuClock className="w-3 h-3" />
              {movie.duration} min
            </span>
          </div>
        </div>

        {/* Bottom glow line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-red-neon opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    </Link>
  );
}
