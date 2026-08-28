import { useState, useEffect } from 'react';
import PageTransition from '../../components/shared/PageTransition';
import CategoryFilter from '../../components/user/CategoryFilter';
import MovieCard from '../../components/user/MovieCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import movieService from '../../services/movieService';
import { LuSearch } from 'react-icons/lu';
import { REAL_MOVIES } from '../../data/mockMovies';

export default function MoviesCatalogPage() {
  const [movies, setMovies] = useState(REAL_MOVIES);
  const [activeGenre, setActiveGenre] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await movieService.getAll();
        if (res.data && res.data.length > 0) {
          setMovies(res.data);
        }
      } catch {
        // Fall back to mock
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((m) => {
    const matchesGenre = activeGenre === 'ALL' || m.genre === activeGenre;
    const matchesSearch = !search.trim() || m.title.toLowerCase().includes(search.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border border-accent-red/40 text-accent-red-neon bg-accent-red/10 mb-3">
            Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[var(--font-display)]">
            All Movies
          </h1>
          <p className="text-text-muted mt-2 text-base sm:text-lg">
            Explore showtimes, reviews, and book seats online
          </p>

          {/* Centered Search Box */}
          <div className="relative max-w-md mx-auto mt-6">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movie title..."
              className="w-full pl-11 pr-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-sm placeholder-text-muted/50 focus:outline-none focus:border-accent-red/50 transition-all shadow-lg shadow-black/20"
            />
          </div>
        </div>

        {/* Category Filters - Centered */}
        <div className="mb-12 flex justify-center">
          <CategoryFilter activeGenre={activeGenre} onSelect={setActiveGenre} />
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-bg-card/50 rounded-3xl border border-border-subtle">
            <p className="text-lg text-text-muted">No movies found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
