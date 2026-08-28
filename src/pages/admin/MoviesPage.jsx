import { useState, useEffect } from 'react';
import { LuPlus, LuFilm } from 'react-icons/lu';
import PageTransition from '../../components/shared/PageTransition';
import Button from '../../components/shared/Button';
import DataTable from '../../components/admin/DataTable';
import MovieForm from '../../components/admin/MovieForm';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import adminService from '../../services/adminService';

const MOCK_ADMIN_MOVIES = [
  { id: 1, title: 'Quantum Horizon', description: 'Quantum multiverse adventure.', duration: 148, genre: 'SCI_FI', posterUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=200&q=80' },
  { id: 2, title: 'Shadow Protocol', description: 'Covert ops espionage mission.', duration: 132, genre: 'ACTION', posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80' },
  { id: 3, title: 'Midnight Echoes', description: 'Musical drama and love.', duration: 124, genre: 'DRAMA', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&q=80' },
  { id: 4, title: 'Crimson Veil', description: 'Supernatural mystery thriller.', duration: 118, genre: 'HORROR', posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&q=80' },
];

export default function MoviesPage() {
  const [movies, setMovies] = useState(MOCK_ADMIN_MOVIES);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deletingMovie, setDeletingMovie] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await adminService.movies.getAll();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setMovies(res.data);
      }
    } catch {
      // Keep mock movies on network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingMovie) {
        await adminService.movies.update(editingMovie.id, formData);
        setMovies((prev) =>
          prev.map((m) => (m.id === editingMovie.id ? { ...m, ...formData } : m))
        );
      } else {
        const res = await adminService.movies.create(formData);
        const created = res.data || { ...formData, id: Date.now() };
        setMovies((prev) => [created, ...prev]);
      }
    } catch {
      // Local optimistic update if backend is mock
      if (editingMovie) {
        setMovies((prev) =>
          prev.map((m) => (m.id === editingMovie.id ? { ...m, ...formData } : m))
        );
      } else {
        setMovies((prev) => [{ ...formData, id: Date.now() }, ...prev]);
      }
    } finally {
      setIsFormOpen(false);
      setEditingMovie(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMovie) return;
    try {
      await adminService.movies.delete(deletingMovie.id);
    } catch {
      // Optimistic delete for offline dev
    } finally {
      setMovies((prev) => prev.filter((m) => m.id !== deletingMovie.id));
      setDeletingMovie(null);
    }
  };

  const columns = [
    {
      key: 'posterUrl',
      label: 'Poster',
      render: (val, row) => (
        <img
          src={val || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&q=80'}
          alt={row.title}
          className="w-10 h-14 object-cover rounded-lg border border-border-subtle flex-shrink-0"
        />
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (val, row) => (
        <div className="min-w-0 max-w-xs md:max-w-sm">
          <p className="font-semibold text-text-primary truncate">{val}</p>
          <p className="text-xs text-text-muted truncate">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'genre',
      label: 'Genre',
      render: (val) => (
        <span className="px-2.5 py-1 text-[11px] font-semibold uppercase rounded-full bg-accent-red/10 text-accent-red-neon border border-accent-red/20 whitespace-nowrap">
          {val?.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (val) => <span className="whitespace-nowrap font-medium text-text-secondary">{val} min</span>,
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-[var(--font-display)]">Movie Management</h1>
            <p className="text-sm text-text-muted mt-1">
              Add, edit, and organize movie catalogs and media posters
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingMovie(null);
              setIsFormOpen(true);
            }}
            id="add-movie-btn"
          >
            <LuPlus className="w-4 h-4" />
            Add Movie
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <DataTable
            columns={columns}
            data={movies}
            onEdit={(movie) => {
              setEditingMovie(movie);
              setIsFormOpen(true);
            }}
            onDelete={(movie) => setDeletingMovie(movie)}
            searchPlaceholder="Search movies by title, genre, or description..."
          />
        )}

        {/* Movie Form Modal */}
        <MovieForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMovie(null);
          }}
          onSubmit={handleCreateOrUpdate}
          movie={editingMovie}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={!!deletingMovie}
          onClose={() => setDeletingMovie(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Movie"
          message={`Are you sure you want to remove "${deletingMovie?.title}"? All associated screenings and tickets may be affected.`}
        />
      </div>
    </PageTransition>
  );
}
