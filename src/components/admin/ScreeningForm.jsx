import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

/**
 * Screening create/edit form modal.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onSubmit
 * @param {Object} [props.screening] - Existing screening for editing
 * @param {Array} [props.movies=[]] - Available movies for dropdown
 */
export default function ScreeningForm({ isOpen, onClose, onSubmit, screening = null, movies = [] }) {
  const [form, setForm] = useState({
    movieId: '',
    hallId: '',
    startTime: '',
    price: '',
  });

  const isEditing = !!screening;

  useEffect(() => {
    if (screening) {
      setForm({
        movieId: screening.movieId || '',
        hallId: screening.hallId || '',
        startTime: screening.startTime ? screening.startTime.slice(0, 16) : '',
        price: screening.price || '',
      });
    } else {
      setForm({ movieId: '', hallId: '', startTime: '', price: '' });
    }
  }, [screening, isOpen]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      movieId: parseInt(form.movieId, 10),
      hallId: parseInt(form.hallId, 10),
      startTime: form.startTime + ':00', // Append seconds
      price: parseFloat(form.price),
    });
    onClose();
  };

  const inputClass =
    'w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-xl text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-red/50 transition-colors';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Screening' : 'Add New Screening'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Movie Selection */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
            Movie
          </label>
          <select
            value={form.movieId}
            onChange={handleChange('movieId')}
            required
            id="screening-form-movie"
            className={inputClass}
          >
            <option value="" disabled className="bg-bg-surface">
              Select a movie
            </option>
            {movies.map((m) => (
              <option key={m.id} value={m.id} className="bg-bg-surface">
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Hall & Price Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Hall ID
            </label>
            <input
              type="number"
              value={form.hallId}
              onChange={handleChange('hallId')}
              placeholder="1"
              min="1"
              required
              id="screening-form-hall"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Price ($)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={handleChange('price')}
              placeholder="12.50"
              step="0.01"
              min="0"
              required
              id="screening-form-price"
              className={inputClass}
            />
          </div>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange('startTime')}
            required
            id="screening-form-time"
            className={inputClass}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" id="screening-form-submit">
            {isEditing ? 'Update Screening' : 'Create Screening'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
