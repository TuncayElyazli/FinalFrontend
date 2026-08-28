import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCreditCard, LuCalendar, LuLock, LuCheck, LuLoader } from 'react-icons/lu';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import bookingService from '../../services/bookingService';

/**
 * Checkout modal with mock card input fields.
 * Sends the exact JSON payload to POST /api/v1/tickets/book.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {number} props.screeningId
 * @param {number[]} props.seatIds
 * @param {number} props.totalPrice
 */
export default function CheckoutModal({
  isOpen,
  onClose,
  screeningId,
  seatIds,
  totalPrice,
}) {
  const [form, setForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    // Auto-format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }

    // Auto-format expiry with slash
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }

    // CVV limit
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const payload = {
        screeningId,
        seatIds,
        paymentInfo: {
          cardNumber: form.cardNumber.replace(/\s/g, ''),
          expiryDate: form.expiryDate,
          cvv: form.cvv,
        },
      };

      await bookingService.bookTickets(payload);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const handleClose = () => {
    setForm({ cardNumber: '', expiryDate: '', cvv: '' });
    setStatus('idle');
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Complete Booking" size="md">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-4"
            >
              <LuCheck className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-bold font-[var(--font-display)] mb-2">Booking Confirmed!</h3>
            <p className="text-sm text-text-muted mb-6">
              Your tickets have been booked successfully. Enjoy the movie!
            </p>
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Order Summary */}
            <div className="bg-bg-card rounded-xl p-4 border border-border-subtle">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">Seats</span>
                <span>{seatIds?.length || 0} selected</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-accent-red-neon">${totalPrice?.toFixed(2)}</span>
              </div>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Card Number
              </label>
              <div className="flex items-center w-full bg-bg-card border border-border-subtle hover:border-border-light rounded-xl px-3.5 py-3 focus-within:border-accent-red-neon focus-within:ring-1 focus-within:ring-accent-red-neon transition-all gap-3">
                <LuCreditCard className="w-5 h-5 text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  value={form.cardNumber}
                  onChange={handleChange('cardNumber')}
                  placeholder="4169 1234 5678 9012"
                  required
                  id="checkout-card-number"
                  className="w-full bg-transparent border-0 p-0 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Expiry & CVV Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Expiry Date
                </label>
                <div className="flex items-center w-full bg-bg-card border border-border-subtle hover:border-border-light rounded-xl px-3.5 py-3 focus-within:border-accent-red-neon focus-within:ring-1 focus-within:ring-accent-red-neon transition-all gap-3">
                  <LuCalendar className="w-5 h-5 text-text-muted flex-shrink-0" />
                  <input
                    type="text"
                    value={form.expiryDate}
                    onChange={handleChange('expiryDate')}
                    placeholder="12/28"
                    required
                    id="checkout-expiry"
                    className="w-full bg-transparent border-0 p-0 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  CVV
                </label>
                <div className="flex items-center w-full bg-bg-card border border-border-subtle hover:border-border-light rounded-xl px-3.5 py-3 focus-within:border-accent-red-neon focus-within:ring-1 focus-within:ring-accent-red-neon transition-all gap-3">
                  <LuLock className="w-5 h-5 text-text-muted flex-shrink-0" />
                  <input
                    type="text"
                    value={form.cvv}
                    onChange={handleChange('cvv')}
                    placeholder="123"
                    required
                    id="checkout-cvv"
                    className="w-full bg-transparent border-0 p-0 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-900/20 rounded-lg px-4 py-2 border border-red-800/30"
              >
                {errorMsg}
              </motion.p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={status === 'loading'}
              id="checkout-submit-btn"
            >
              {status === 'loading' ? (
                <>
                  <LuLoader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <LuLock className="w-4 h-4" />
                  Pay ${totalPrice?.toFixed(2)}
                </>
              )}
            </Button>

            <p className="text-[10px] text-text-muted text-center">
              🔒 Your payment information is secure and encrypted.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}
