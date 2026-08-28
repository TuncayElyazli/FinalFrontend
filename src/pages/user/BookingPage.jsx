import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import PageTransition from '../../components/shared/PageTransition';
import SeatPicker from '../../components/user/SeatPicker';
import BookingSummary from '../../components/user/BookingSummary';
import CheckoutModal from '../../components/user/CheckoutModal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import bookingService from '../../services/bookingService';

// Mock data
const MOCK_SCREENING = {
  id: 1,
  movieId: 1,
  hallId: 1,
  startTime: '2026-09-01T19:00:00',
  price: 12.50,
  movie: {
    id: 1,
    title: 'Quantum Horizon',
    genre: 'SCI_FI',
    posterUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80',
  },
};

const MOCK_RESERVED = [3, 4, 14, 15, 25, 33, 34, 35, 44, 55, 56, 63, 64, 65, 66];

export default function BookingPage() {
  const { screeningId } = useParams();
  const [screening, setScreening] = useState(null);
  const [reservedSeatIds, setReservedSeatIds] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await bookingService.getSeats(screeningId);
        setScreening(res.data.screening || MOCK_SCREENING);
        setReservedSeatIds(res.data.reservedSeatIds || MOCK_RESERVED);
      } catch {
        setScreening({ ...MOCK_SCREENING, id: parseInt(screeningId) });
        setReservedSeatIds(MOCK_RESERVED);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [screeningId]);

  const handleSelectionChange = (seats, price) => {
    setSelectedSeats(seats);
    setTotalPrice(price);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-16">
        {/* Back */}
        <Link
          to={screening?.movie ? `/movie/${screening.movie.id}` : '/'}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <LuArrowLeft className="w-4 h-4" />
          Back to Movie
        </Link>

        <h1 className="text-3xl font-bold font-[var(--font-display)] mb-2">Select Your Seats</h1>
        <p className="text-text-muted mb-10">
          Pick your perfect spot for{' '}
          <span className="text-accent-red-neon font-medium">
            {screening?.movie?.title || 'the movie'}
          </span>
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Seat Picker */}
          <div className="flex-1">
            <SeatPicker
              reservedSeatIds={reservedSeatIds}
              onSelectionChange={handleSelectionChange}
              price={screening?.price || 12.50}
            />
          </div>

          {/* Booking Summary */}
          <div className="lg:w-80">
            <BookingSummary
              movie={screening?.movie}
              screening={screening}
              selectedSeats={selectedSeats}
              pricePerSeat={screening?.price || 12.50}
              onCheckout={() => setCheckoutOpen(true)}
            />
          </div>
        </div>

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          screeningId={parseInt(screeningId)}
          seatIds={selectedSeats.map((s) => s.id)}
          totalPrice={totalPrice}
        />
      </div>
    </PageTransition>
  );
}
