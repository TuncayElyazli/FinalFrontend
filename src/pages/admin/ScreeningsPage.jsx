import { useState, useEffect } from 'react';
import { LuPlus, LuCalendar } from 'react-icons/lu';
import PageTransition from '../../components/shared/PageTransition';
import Button from '../../components/shared/Button';
import DataTable from '../../components/admin/DataTable';
import ScreeningForm from '../../components/admin/ScreeningForm';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import adminService from '../../services/adminService';
import movieService from '../../services/movieService';

import { REAL_MOVIES } from '../../data/mockMovies';

const MOCK_MOVIES = REAL_MOVIES.map((m) => ({ id: m.id, title: m.title }));

const MOCK_SCREENINGS = [
  { id: 1, movieId: 1, movieTitle: 'Dune: Part Two', hallId: 1, startTime: '2026-09-01T14:00:00', price: 12.50 },
  { id: 2, movieId: 2, movieTitle: 'Oppenheimer', hallId: 2, startTime: '2026-09-01T17:30:00', price: 14.00 },
  { id: 3, movieId: 3, movieTitle: 'The Batman', hallId: 1, startTime: '2026-09-01T20:00:00', price: 15.00 },
  { id: 4, movieId: 4, movieTitle: 'Spider-Man: Across the Spider-Verse', hallId: 3, startTime: '2026-09-02T11:00:00', price: 10.00 },
  { id: 5, movieId: 5, movieTitle: 'Interstellar', hallId: 2, startTime: '2026-09-02T19:00:00', price: 14.00 },
];

export default function ScreeningsPage() {
  const [screenings, setScreenings] = useState(MOCK_SCREENINGS);
  const [movies, setMovies] = useState(MOCK_MOVIES);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScreening, setEditingScreening] = useState(null);
  const [deletingScreening, setDeletingScreening] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [screeningsRes, moviesRes] = await Promise.all([
        adminService.screenings.getAll(),
        movieService.getAll(),
      ]);

      if (moviesRes.data && Array.isArray(moviesRes.data)) {
        setMovies(moviesRes.data);
      }

      if (screeningsRes.data && Array.isArray(screeningsRes.data)) {
        setScreenings(screeningsRes.data);
      }
    } catch {
      // Retain mock records when backend is inactive
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    const movieObj = movies.find((m) => m.id === formData.movieId);
    const enrichedData = {
      ...formData,
      movieTitle: movieObj ? movieObj.title : `Movie #${formData.movieId}`,
    };

    try {
      if (editingScreening) {
        await adminService.screenings.update(editingScreening.id, formData);
        setScreenings((prev) =>
          prev.map((s) => (s.id === editingScreening.id ? { ...s, ...enrichedData } : s))
        );
      } else {
        const res = await adminService.screenings.create(formData);
        const created = res.data || { ...enrichedData, id: Date.now() };
        setScreenings((prev) => [created, ...prev]);
      }
    } catch {
      // Local optimistic update
      if (editingScreening) {
        setScreenings((prev) =>
          prev.map((s) => (s.id === editingScreening.id ? { ...s, ...enrichedData } : s))
        );
      } else {
        setScreenings((prev) => [{ ...enrichedData, id: Date.now() }, ...prev]);
      }
    } finally {
      setIsFormOpen(false);
      setEditingScreening(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingScreening) return;
    try {
      await adminService.screenings.delete(deletingScreening.id);
    } catch {
      // Optimistic delete
    } finally {
      setScreenings((prev) => prev.filter((s) => s.id !== deletingScreening.id));
      setDeletingScreening(null);
    }
  };

  const columns = [
    {
      key: 'movieTitle',
      label: 'Movie',
      render: (val, row) => (
        <div className="min-w-0 max-w-xs md:max-w-sm">
          <p className="font-semibold text-text-primary truncate">{val || `Movie #${row.movieId}`}</p>
          <span className="text-[11px] text-text-muted">ID: {row.movieId}</span>
        </div>
      ),
    },
    {
      key: 'hallId',
      label: 'Hall',
      render: (val) => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-bg-surface border border-border-subtle whitespace-nowrap">
          Hall {val}
        </span>
      ),
    },
    {
      key: 'startTime',
      label: 'Start Time',
      render: (val) => (
        <div className="text-xs whitespace-nowrap">
          <p className="font-medium text-text-primary">
            {new Date(val).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-text-muted">
            {new Date(val).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (val) => (
        <span className="font-bold text-accent-amber whitespace-nowrap">${Number(val)?.toFixed(2)}</span>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-[var(--font-display)]">Screenings & Schedules</h1>
            <p className="text-sm text-text-muted mt-1">
              Manage cinema halls, showtimes, and ticket tier pricing
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingScreening(null);
              setIsFormOpen(true);
            }}
            id="add-screening-btn"
          >
            <LuPlus className="w-4 h-4" />
            Add Screening
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <DataTable
            columns={columns}
            data={screenings}
            onEdit={(screening) => {
              setEditingScreening(screening);
              setIsFormOpen(true);
            }}
            onDelete={(screening) => setDeletingScreening(screening)}
            searchPlaceholder="Search screenings by movie, hall, or date..."
          />
        )}

        {/* Screening Form Modal */}
        <ScreeningForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingScreening(null);
          }}
          onSubmit={handleCreateOrUpdate}
          screening={editingScreening}
          movies={movies}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={!!deletingScreening}
          onClose={() => setDeletingScreening(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Screening"
          message={`Are you sure you want to cancel the screening for "${deletingScreening?.movieTitle}" in Hall ${deletingScreening?.hallId}?`}
        />
      </div>
    </PageTransition>
  );
}
