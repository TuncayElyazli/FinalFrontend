import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

const GENRES = ['ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'SCI_FI', 'ROMANCE', 'THRILLER', 'ANIMATION'];

/**
 * Movie create/edit form modal.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onSubmit - Called with form data
 * @param {Object} [props.movie] - Existing movie for editing (null for create)
 */
export default function MovieForm({ isOpen, onClose, onSubmit, movie = null }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    genre: 'ACTION',
    posterUrl: '',
  });

  const isEditing = !!movie;

  // Populate form when editing
  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title || '',
        description: movie.description || '',
        duration: movie.duration || '',
        genre: movie.genre || 'ACTION',
        posterUrl: movie.posterUrl || '',
      });
    } else {
      setForm({ title: '', description: '', duration: '', genre: 'ACTION', posterUrl: '' });
    }
  }, [movie, isOpen]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      duration: parseInt(form.duration, 10),
    });
    onClose();
  };

  const inputClass =
    'w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-xl text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-red/50 transition-colors';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Movie' : 'Add New Movie'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            placeholder="Enter movie title"
            required
            id="movie-form-title"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Enter movie description"
            rows={3}
            required
            id="movie-form-description"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Duration & Genre Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Duration (min)
            </label>
            <input
              type="number"
              value={form.duration}
              onChange={handleChange('duration')}
              placeholder="120"
              min="1"
              required
              id="movie-form-duration"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Genre
            </label>
            <select
              value={form.genre}
              onChange={handleChange('genre')}
              id="movie-form-genre"
              className={inputClass}
            >
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-bg-surface">
                  {g.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Poster URL */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
            Poster URL
          </label>
          <input
            type="url"
            value={form.posterUrl}
            onChange={handleChange('posterUrl')}
            placeholder="https://example.com/poster.jpg"
            required
            id="movie-form-poster"
            className={inputClass}
          />
        </div>

        {/* Poster Preview */}
        {form.posterUrl && (
          <div className="flex justify-center">
            <img
              src={form.posterUrl}
              alt="Poster preview"
              className="h-32 object-cover rounded-xl border border-border-subtle"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" id="movie-form-submit">
            {isEditing ? 'Update Movie' : 'Create Movie'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
