import { PAGINATION } from '../constants/index.js';

/**
 * Parses URL query parameters into a Mongoose-friendly filter and options structure.
 * Standardizes categorical queries, fields aliases, and boolean flags.
 * 
 * @param {object} query - Express req.query object
 * @returns {object} { filter, options: { page, limit, skip, sort } }
 */
export const parseQuery = (query) => {
  const filter = {};

  // ==========================================
  // Simple Categorical Filters
  // ==========================================
  const simpleFields = [
    'region',
    'status',
    'conflictType',
    'primaryCountry',
    'mostAffectedSector',
    'blackMarketActivityLevel'
  ];

  simpleFields.forEach((field) => {
    if (query[field] !== undefined && query[field] !== '') {
      filter[field] = query[field];
    }
  });

  // Handle aliases (country, type, sector, blackMarket)
  if (query.country !== undefined && query.country !== '') filter.primaryCountry = query.country;
  if (query.type !== undefined && query.type !== '') filter.conflictType = query.type;
  if (query.sector !== undefined && query.sector !== '') filter.mostAffectedSector = query.sector;
  if (query.blackMarket !== undefined && query.blackMarket !== '') filter.blackMarketActivityLevel = query.blackMarket;

  // Boolean flags (War Profiteering)
  const parseBooleanQuery = (val) => {
    if (val === undefined || val === '') return undefined;
    const str = String(val).toLowerCase().trim();
    return str === 'true' || str === 'yes';
  };

  const profiteeringVal = parseBooleanQuery(query.warProfiteeringDocumented ?? query.profiteering);
  if (profiteeringVal !== undefined) {
    filter.warProfiteeringDocumented = profiteeringVal;
  }

  // Pagination & Options baseline
  let page = Number(query.page) || PAGINATION.DEFAULT_PAGE;
  if (page < 1) page = PAGINATION.DEFAULT_PAGE;

  let limit = Number(query.limit) || PAGINATION.DEFAULT_LIMIT;
  if (limit < 1) limit = PAGINATION.DEFAULT_LIMIT;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  const skip = (page - 1) * limit;
  let sort = '-createdAt';

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
