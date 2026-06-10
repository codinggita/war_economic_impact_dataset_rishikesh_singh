import { CONFLICT_TYPES, CONFLICT_STATUSES, BLACK_MARKET_LEVELS } from '../constants/index.js';

/**
 * Validates Conflict request body payloads.
 * @param {object} data - req.body containing conflict parameters
 * @param {boolean} [isUpdate=false] - Whether validation is for an update operation (skips missing required fields)
 * @returns {string[]} Array of validation error strings, empty if valid
 */
export const validateConflict = (data, isUpdate = false) => {
  const errors = [];

  // Helper to verify that critical fields are present during creation
  const checkRequired = (field, displayName) => {
    if (!isUpdate && (data[field] === undefined || data[field] === null || String(data[field]).trim() === '')) {
      errors.push(`${displayName} is a required field.`);
    }
  };

  checkRequired('conflictName', 'Conflict Name');
  checkRequired('conflictType', 'Conflict Type');
  checkRequired('region', 'Region');
  checkRequired('startYear', 'Start Year');
  checkRequired('endYear', 'End Year');
  checkRequired('status', 'Status');
  checkRequired('primaryCountry', 'Primary Country');
  checkRequired('gdpChange', 'GDP Change %');
  checkRequired('inflationRate', 'Inflation Rate %');
  checkRequired('warCostUsd', 'War Cost USD');
  checkRequired('reconstructionCostUsd', 'Reconstruction Cost USD');

  // Enum boundary checks
  if (data.conflictType && !CONFLICT_TYPES.includes(data.conflictType)) {
    errors.push(`Conflict Type must be one of: ${CONFLICT_TYPES.join(', ')}.`);
  }

  if (data.status && !CONFLICT_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${CONFLICT_STATUSES.join(', ')}.`);
  }

  if (data.blackMarketActivityLevel && !BLACK_MARKET_LEVELS.includes(data.blackMarketActivityLevel)) {
    errors.push(`Black Market Activity Level must be one of: ${BLACK_MARKET_LEVELS.join(', ')}.`);
  }

  // Type checks and logical validation (Start year <= End year)
  const startYrNum = data.startYear !== undefined ? Number(data.startYear) : null;
  const endYrNum = data.endYear !== undefined ? Number(data.endYear) : null;

  if (startYrNum !== null && (isNaN(startYrNum) || startYrNum < 0)) {
    errors.push('Start Year must be a non-negative number.');
  }
  if (endYrNum !== null && (isNaN(endYrNum) || endYrNum < 0)) {
    errors.push('End Year must be a non-negative number.');
  }
  if (startYrNum !== null && endYrNum !== null && !isNaN(startYrNum) && !isNaN(endYrNum) && startYrNum > endYrNum) {
    errors.push('Start Year cannot be greater than the End Year.');
  }

  // Numeric boundary validation helper (Values must not be negative)
  const validateNonNegative = (field, displayName) => {
    if (data[field] !== undefined && data[field] !== null) {
      const val = Number(data[field]);
      if (isNaN(val) || val < 0) {
        errors.push(`${displayName} must be a non-negative number.`);
      }
    }
  };

  validateNonNegative('preWarUnemployment', 'Pre-War Unemployment %');
  validateNonNegative('duringWarUnemployment', 'During-War Unemployment %');
  validateNonNegative('unemploymentSpike', 'Unemployment Spike Points');
  validateNonNegative('youthUnemploymentChange', 'Youth Unemployment Change %');
  validateNonNegative('preWarPovertyRate', 'Pre-War Poverty Rate %');
  validateNonNegative('duringWarPovertyRate', 'During-War Poverty Rate %');
  validateNonNegative('extremePovertyRate', 'Extreme Poverty Rate %');
  validateNonNegative('foodInsecurityRate', 'Food Insecurity Rate %');
  validateNonNegative('householdsFallenIntoPoverty', 'Households Fallen Into Poverty');
  validateNonNegative('inflationRate', 'Inflation Rate %');
  validateNonNegative('currencyDevaluation', 'Currency Devaluation %');
  validateNonNegative('warCostUsd', 'War Cost USD');
  validateNonNegative('reconstructionCostUsd', 'Reconstruction Cost USD');
  validateNonNegative('informalEconomyPreWar', 'Informal Economy Pre-War %');
  validateNonNegative('informalEconomyDuringWar', 'Informal Economy During-War %');
  validateNonNegative('currencyBlackMarketGap', 'Currency Black Market Gap %');

  // GDP Change check (can be negative, but must be numeric)
  if (data.gdpChange !== undefined && data.gdpChange !== null && isNaN(Number(data.gdpChange))) {
    errors.push('GDP Change must be a number.');
  }

  return errors;
};
