import { motion, AnimatePresence } from 'framer-motion';
import { LuTicket, LuClock, LuMapPin } from 'react-icons/lu';
import Button from '../shared/Button';

/**
 * Booking summary side panel showing selected seats, pricing, and checkout CTA.
 * @param {Object} props
 * @param {Object} [props.movie] - Movie details
 * @param {Object} [props.screening] - Screening details (time, hall)
 * @param {Array} [props.selectedSeats=[]] - Array of { id, label } objects
 * @param {number} [props.pricePerSeat=10]
 * @param {function} props.onCheckout
 */
export default function BookingSummary({
  movie,
  screening,
  selectedSeats = [],
  pricePerSeat = 10,
  onCheckout,
}) {
  const totalPrice = selectedSeats.length * pricePerSeat;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-bg-card border border-border-subtle rounded-2xl p-6 sticky top-24"
      id="booking-summary"
    >
      {/* Movie Info */}
      {movie && (
        <div className="flex gap-4 mb-6 pb-6 border-b border-border-subtle">
          <img
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80'}
            alt={movie.title}
            className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold font-[var(--font-display)] truncate">{movie.title}</h3>
            <span className="text-xs text-accent-red-neon font-medium">{movie.genre?.replace('_', ' ')}</span>
            {screening && (
              <div className="mt-2 space-y-1 text-xs text-text-muted">
                <p className="flex items-center gap-1.5">
                  <LuClock className="w-3 h-3" />
                  {screening.startTime ? new Date(screening.startTime).toLocaleString() : 'TBD'}
                </p>
                <p className="flex items-center gap-1.5">
                  <LuMapPin className="w-3 h-3" />
                  Hall {screening.hallId || '—'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Seats */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
          <LuTicket className="w-4 h-4 text-accent-red-neon" />
          Selected Seats ({selectedSeats.length})
        </h4>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          <AnimatePresence mode="popLayout">
            {selectedSeats.length === 0 ? (
              <p className="text-xs text-text-muted italic">No seats selected</p>
            ) : (
              selectedSeats.map((seat) => (
                <motion.span
                  key={seat.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  layout
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-accent-red/15 text-accent-red-neon border border-accent-red/25"
                >
                  {seat.label}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b border-border-subtle">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Price per seat</span>
          <span>${pricePerSeat.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Seats</span>
          <span>× {selectedSeats.length}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-base font-semibold">Total</span>
        <motion.span
          key={totalPrice}
          initial={{ scale: 1.3, color: '#ff4d4d' }}
          animate={{ scale: 1, color: '#f0f0f5' }}
          className="text-2xl font-bold font-[var(--font-display)]"
        >
          ${totalPrice.toFixed(2)}
        </motion.span>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={selectedSeats.length === 0}
        onClick={onCheckout}
        id="proceed-checkout-btn"
      >
        Proceed to Checkout
      </Button>
    </motion.div>
  );
}
