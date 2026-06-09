import { PAGINATION } from '../constants/index.js';

/**
 * Parses URL query parameters into a Mongoose-friendly filter and options structure.
 * Baseline skeleton implementation for parsing page, limit, skip, and sort.
 * 
 * @param {object} query - Express req.query object
 * @returns {object} { filter, options: { page, limit, skip, sort } }
 */
export const parseQuery = (query) => {
  const filter = {};

  // Default pagination options
  let page = Number(query.page) || PAGINATION.DEFAULT_PAGE;
  if (page < 1) page = PAGINATION.DEFAULT_PAGE;

  let limit = Number(query.limit) || PAGINATION.DEFAULT_LIMIT;
  if (limit < 1) limit = PAGINATION.DEFAULT_LIMIT;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  const skip = (page - 1) * limit;
  let sort = '-createdAt'; // Default sort order

  return {
    filter,
    options: {
      page,
      limit,
      skip,
      sort
    }
  };
};
