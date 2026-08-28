import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './SeatPicker.module.scss';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const SEATS_PER_ROW = 10;

// Seat states
const SEAT_STATE = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  RESERVED: 'reserved',
};

/**
 * Interactive cinema seat map with rows A-G, seats 1-10.
 * @param {Object} props
 * @param {number[]} [props.reservedSeatIds=[]] - IDs of already reserved seats
 * @param {function} props.onSelectionChange - Callback with array of selected seat objects
 * @param {number} [props.price=10] - Price per seat
 */
export default function SeatPicker({ reservedSeatIds = [], onSelectionChange, price = 10 }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Generate seat ID from row and number
  const getSeatId = (row, num) => {
    const rowIndex = ROWS.indexOf(row);
    return rowIndex * SEATS_PER_ROW + num;
  };

  const getSeatState = useCallback(
    (seatId) => {
      if (reservedSeatIds.includes(seatId)) return SEAT_STATE.RESERVED;
      if (selectedSeats.includes(seatId)) return SEAT_STATE.SELECTED;
      return SEAT_STATE.AVAILABLE;
    },
    [reservedSeatIds, selectedSeats]
  );

  const toggleSeat = (seatId, row, num) => {
    if (reservedSeatIds.includes(seatId)) return;

    setSelectedSeats((prev) => {
      const next = prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId];

      // Notify parent with seat details
      const seatDetails = next.map((id) => {
        const r = ROWS[Math.floor((id - 1) / SEATS_PER_ROW)];
        const n = ((id - 1) % SEATS_PER_ROW) + 1;
        return { id, label: `${r}${n}` };
      });
      onSelectionChange?.(seatDetails, next.length * price);

      return next;
    });
  };

  return (
    <div className={styles.seatPicker} id="seat-picker">
      {/* Screen */}
      <div className={styles.screen}>
        <div className={styles.screenBar} />
        <span className={styles.screenLabel}>SCREEN</span>
      </div>

      {/* Seat Grid with responsive horizontal scroll wrapper */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div className={styles.grid}>
          {ROWS.map((row) => (
            <div key={row} className={styles.row}>
              <span className={styles.rowLabel}>{row}</span>
              <div className={styles.seats}>
                {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                  const num = i + 1;
                  const seatId = getSeatId(row, num);
                  const state = getSeatState(seatId);

                  return (
                    <motion.button
                      key={seatId}
                      whileHover={state !== SEAT_STATE.RESERVED ? { scale: 1.15 } : {}}
                      whileTap={state !== SEAT_STATE.RESERVED ? { scale: 0.9 } : {}}
                      animate={{
                        backgroundColor:
                          state === SEAT_STATE.SELECTED
                            ? '#ff4d4d'
                            : state === SEAT_STATE.RESERVED
                            ? '#1f2937'
                            : '#374151',
                        boxShadow:
                          state === SEAT_STATE.SELECTED
                            ? '0 0 12px rgba(255,77,77,0.5)'
                            : '0 0 0px transparent',
                      }}
                      transition={{ duration: 0.25 }}
                      onClick={() => toggleSeat(seatId, row, num)}
                      disabled={state === SEAT_STATE.RESERVED}
                      className={`${styles.seat} ${styles[state]}`}
                      title={`Seat ${row}${num}`}
                      id={`seat-${row}${num}`}
                    >
                      <span className={styles.seatNum}>{num}</span>
                    </motion.button>
                  );
                })}
              </div>
              <span className={styles.rowLabel}>{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.available}`} />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.selected}`} />
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.reserved}`} />
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
}
