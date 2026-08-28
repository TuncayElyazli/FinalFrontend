import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuClock, LuStar, LuCalendar, LuMapPin, LuArrowLeft, LuPlay, LuFilm } from 'react-icons/lu';
import PageTransition from '../../components/shared/PageTransition';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Modal from '../../components/shared/Modal';
import movieService from '../../services/movieService';
import { REAL_MOVIES, MOCK_SCREENINGS } from '../../data/mockMovies';

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieRes, screeningsRes] = await Promise.all([
          movieService.getById(id),
          movieService.getScreenings(id),
        ]);
        setMovie(movieRes.data);
        setScreenings(screeningsRes.data || []);
      } catch {
        // Fallback to real movies catalog
        const found = REAL_MOVIES.find((m) => String(m.id) === String(id)) || REAL_MOVIES[0];
        setMovie(found);
        setScreenings(MOCK_SCREENINGS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!movie) return <div className="text-center py-20 text-text-muted">Movie not found.</div>;

  return (
    <PageTransition>
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/70 to-bg-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 -mt-48 relative z-10 pb-16">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6">
          <LuArrowLeft className="w-4 h-4" />
          Back to Movies
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0"
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-2xl shadow-2xl shadow-black/50 border border-border-subtle"
            />
          </motion.div>

          {/* Details */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border border-accent-red/40 text-accent-red-neon bg-accent-red/10 mb-3">
                {movie.genre?.replace('_', ' ')}
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold font-[var(--font-display)] mb-4">
                {movie.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-5 text-sm text-text-muted mb-6">
                {movie.rating && (
                  <span className="flex items-center gap-1.5">
                    <LuStar className="w-4 h-4 text-accent-amber" />
                    {movie.rating} / 10
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <LuClock className="w-4 h-4" />
                  {movie.duration} min
                </span>
              </div>

              {/* Description */}
              <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl text-base sm:text-lg">
                {movie.description}
              </p>

              {/* Action: Watch Trailer */}
              {movie.trailerUrl && (
                <div className="mb-8">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowTrailer(true)}
                    id="watch-trailer-btn"
                    className="border-accent-red/40 hover:border-accent-red text-white shadow-lg shadow-black/40"
                  >
                    <LuPlay className="w-5 h-5 text-accent-red-neon" />
                    Watch Official Trailer
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Screenings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold font-[var(--font-display)] mb-4 flex items-center gap-2">
                <LuCalendar className="w-5 h-5 text-accent-red-neon" />
                Available Screenings
              </h2>

              {screenings.length === 0 ? (
                <p className="text-sm text-text-muted">No screenings available at this time.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {screenings.map((s, i) => {
                    const dateObj = new Date(s.startTime);
                    const dateStr = dateObj.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });
                    const timeStr = dateObj.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                        className="h-full"
                      >
                        <Link to={`/booking/${s.id}`} className="block h-full">
                          <div className="group h-full bg-bg-card hover:bg-bg-card-hover border border-border-subtle hover:border-accent-red/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,77,77,0.15)] hover:-translate-y-1">
                            {/* Card Header: Showtime & Price */}
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-xl sm:text-2xl font-bold font-[var(--font-display)] text-white group-hover:text-accent-red-neon transition-colors block">
                                  {timeStr}
                                </span>
                                <span className="text-xs text-text-muted font-medium mt-0.5 block">
                                  {dateStr}
                                </span>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="inline-block px-3 py-1 rounded-xl bg-accent-amber/10 border border-accent-amber/25 text-accent-amber font-bold text-base sm:text-lg">
                                  ${s.price?.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Card Footer: Hall Badge & CTA */}
                            <div className="pt-3 border-t border-border-subtle/60 flex items-center justify-between gap-2 text-xs">
                              <span className="flex items-center gap-1.5 text-text-secondary bg-bg-surface px-2.5 py-1 rounded-lg border border-border-subtle font-medium">
                                <LuMapPin className="w-3.5 h-3.5 text-accent-red-neon flex-shrink-0" />
                                Hall {s.hallId}
                              </span>
                              <span className="text-accent-red-neon font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Book Seats →
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Embedded Trailer Section */}
        {movie.trailerUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-14 pt-10 border-t border-border-subtle"
          >
            <h2 className="text-xl sm:text-2xl font-semibold font-[var(--font-display)] mb-6 flex items-center gap-2.5 text-white">
              <LuFilm className="w-6 h-6 text-accent-red-neon" />
              Official Movie Trailer
            </h2>
            <div className="relative aspect-video w-full max-w-4xl rounded-3xl overflow-hidden border border-border-subtle shadow-2xl bg-black">
              <iframe
                src={movie.trailerUrl}
                title={`${movie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Watch Trailer Modal */}
      {movie.trailerUrl && (
        <Modal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          title={`${movie.title} - Official Trailer`}
          size="xl"
        >
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black">
            <iframe
              src={`${movie.trailerUrl}?autoplay=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </Modal>
      )}
    </PageTransition>
  );
}
