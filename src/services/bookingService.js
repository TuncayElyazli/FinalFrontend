import api from './api';

const ENDPOINT = '/api/v1/tickets';

const bookingService = {
  /**
   * Book tickets for a screening.
   * @param {Object} payload
   * @param {number} payload.screeningId
   * @param {number[]} payload.seatIds
   * @param {Object} payload.paymentInfo
   * @param {string} payload.paymentInfo.cardNumber
   * @param {string} payload.paymentInfo.expiryDate
   * @param {string} payload.paymentInfo.cvv
   */
  bookTickets: (payload) => {
    return api.post(`${ENDPOINT}/book`, payload);
  },

  /**
   * Get current user's booking history.
   */
  getMyBookings: () => {
    return api.get(`${ENDPOINT}/my`);
  },

  /**
   * Get available seats for a screening.
   * @param {number|string} screeningId
   */
  getSeats: (screeningId) => {
    return api.get(`${ENDPOINT}/screenings/${screeningId}/seats`);
  },
};

export default bookingService;
