import { PAGINATION } from '../constants/index.js';

/**
 * Maps legacy schema or human-readable query sort fields to active database schema camelCase keys.
 */
const SORT_FIELD_MAP = {
  'Inflation_Rate_%': 'inflationRate',
  'GDP_Change_%': 'gdpChange',
  'Pre_War_Unemployment_%': 'preWarUnemployment',
  'During_War_Unemployment_%': 'duringWarUnemployment',
  'Food_Insecurity_Rate_%': 'foodInsecurityRate',
  'Extreme_Poverty_Rate_%': 'extremePovertyRate',
  'Currency_Devaluation_%': 'currencyDevaluation',
  'Currency_Black_Market_Rate_Gap_%': 'currencyBlackMarketGap',
  'Estimated_Reconstruction_Cost_USD': 'reconstructionCostUsd',
  'Cost_of_War_USD': 'warCostUsd',
  'Start_Year': 'startYear',
  'End_Year': 'endYear',
  'Conflict_Name': 'conflictName',
  'conflictName': 'conflictName',
  'conflictType': 'conflictType',
  'region': 'region',
  'primaryCountry': 'primaryCountry',
  'status': 'status',
  'startYear': 'startYear',
  'endYear': 'endYear',
  'inflationRate': 'inflationRate',
  'gdpChange': 'gdpChange',
  'warCostUsd': 'warCostUsd',
  'reconstructionCostUsd': 'reconstructionCostUsd',
  'duringWarPovertyRate': 'duringWarPovertyRate',
  'extremePovertyRate': 'extremePovertyRate',
  'preWarUnemployment': 'preWarUnemployment',
  'duringWarUnemployment': 'duringWarUnemployment',
  'foodInsecurityRate': 'foodInsecurityRate',
  'currencyDevaluation': 'currencyDevaluation',
  'currencyBlackMarketGap': 'currencyBlackMarketGap'
};

/**
 * Parses URL query parameters into a Mongoose-friendly filter and options structure.
 * Standardizes categorical queries, fields aliases, boolean flags, and sorting.
 * 
 * @param {object} query - Express req.query object
 * @returns {object} { filter, options: { page, limit, skip, sort } }
 */
export const parseQuery = (query) => {
  const filter = {};

  // Simple Categorical Filters
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

  // Pagination baseline
  let page = Number(query.page) || PAGINATION.DEFAULT_PAGE;
  if (page < 1) page = PAGINATION.DEFAULT_PAGE;

  let limit = Number(query.limit) || PAGINATION.DEFAULT_LIMIT;
  if (limit < 1) limit = PAGINATION.DEFAULT_LIMIT;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  const skip = (page - 1) * limit;

  // Dynamic Sorting with whitelist validation
  let sort = '-createdAt'; // Default sort order
  if (query.sort) {
    const isDesc = query.sort.startsWith('-');
    const rawField = isDesc ? query.sort.substring(1) : query.sort;
    const schemaField = SORT_FIELD_MAP[rawField] || rawField;
    
    // Only allow sorting on recognized database fields
    if (SORT_FIELD_MAP[schemaField]) {
      sort = isDesc ? `-${schemaField}` : schemaField;
    }
  }

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
