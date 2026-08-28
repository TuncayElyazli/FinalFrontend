import { useState, useEffect } from 'react';
import PageTransition from '../../components/shared/PageTransition';
import HeroCarousel from '../../components/user/HeroCarousel';
import CategoryFilter from '../../components/user/CategoryFilter';
import MovieCard from '../../components/user/MovieCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import movieService from '../../services/movieService';
import { REAL_MOVIES } from '../../data/mockMovies';

export default function HomePage() {
  const [movies, setMovies] = useState(REAL_MOVIES);
  const [activeGenre, setActiveGenre] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Try to fetch from API; fall back to mock data
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await movieService.getAll();
        if (res.data && res.data.length > 0) {
          setMovies(res.data);
        }
      } catch {
        // API unavailable — use mock data
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies =
    activeGenre === 'ALL'
      ? movies
      : movies.filter((m) => m.genre === activeGenre);

  return (
    <PageTransition>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Movies Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 sm:py-20" id="movies-section">
        {/* Section Header - Centered & Symmetric */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-red/10 border border-accent-red/30 text-accent-red-neon text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
            <span>Now in Theaters</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[var(--font-display)] tracking-tight text-white">
            Explore Movies
          </h2>
          <p className="text-text-muted mt-3 text-base sm:text-lg max-w-xl mx-auto">
            Browse our curated collection of blockbusters and reserve your favorite seats online
          </p>
        </div>

        {/* Category Filter - Prominent & Centered */}
        <div className="mb-12 sm:mb-16 flex justify-center">
          <CategoryFilter activeGenre={activeGenre} onSelect={setActiveGenre} />
        </div>

        {/* Movie Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-bg-surface/60 rounded-3xl border border-border-subtle max-w-2xl mx-auto">
            <p className="text-lg text-text-muted">No movies found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}
