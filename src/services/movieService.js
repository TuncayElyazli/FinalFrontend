import api from './api';

const ENDPOINT = '/api/v1/movies';

const movieService = {
  /**
   * Get all movies, optionally filtered by genre.
   * @param {string} [genre] - Genre filter (e.g., "ACTION", "COMEDY")
   */
  getAll: (genre) => {
    const params = genre && genre !== 'ALL' ? { genre } : {};
    return api.get(ENDPOINT, { params });
  },

  /**
   * Get a single movie by ID.
   * @param {number|string} id
   */
  getById: (id) => {
    return api.get(`${ENDPOINT}/${id}`);
  },

  /**
   * Get screenings for a specific movie.
   * @param {number|string} movieId
   */
  getScreenings: (movieId) => {
    return api.get(`${ENDPOINT}/${movieId}/screenings`);
  },

  /**
   * Search movies by title.
   * @param {string} query
   */
  search: (query) => {
    return api.get(`${ENDPOINT}/search`, { params: { q: query } });
  },
};

export default movieService;
