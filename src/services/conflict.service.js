import Conflict from '../models/conflict.model.js';
import ApiError from '../utils/apiError.js';

/**
 * Service to create a new Conflict.
 * @param {object} conflictData - Attributes of conflict to register
 * @returns {Promise<object>} Created conflict document
 */
export const createConflict = async (conflictData) => {
  return Conflict.create(conflictData);
};

/**
 * Service to query, filter, search, sort, and paginate conflicts.
 * @param {object} filter - Mongoose filter object parsed from req.query
 * @param {object} options - Options containing page, limit, skip, and sort keys
 * @returns {Promise<object>} { conflicts, total, page, limit, totalPages }
 */
export const getConflicts = async (filter, options) => {
  const { page, limit, skip, sort } = options;

  const totalConflicts = await Conflict.countDocuments(filter);
  const conflicts = await Conflict.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalConflicts / limit) || 1;

  return {
    conflicts,
    total: totalConflicts,
    page,
    limit,
    totalPages,
    count: conflicts.length
  };
};

/**
 * Service to fetch a single Conflict document by ID.
 * @param {string} id - MongoDB ObjectId string
 * @returns {Promise<object>} Located conflict document
 */
export const getConflictById = async (id) => {
  const conflict = await Conflict.findById(id);
  if (!conflict) {
    throw new ApiError(404, 'Conflict not found with the provided ID.');
  }
  return conflict;
};

/**
 * Service to update an existing Conflict document.
 * @param {string} id - MongoDB ObjectId string
 * @param {object} updateData - Key-values to update
 * @param {boolean} [overwrite=false] - If true, replaces entire document
 * @returns {Promise<object>} Updated conflict document
 */
export const updateConflict = async (id, updateData, overwrite = false) => {
  const options = {
    new: true, // Return updated document
    runValidators: true, // Run schema rules
  };

  if (overwrite) {
    options.overwrite = true;
  }

  const conflict = await Conflict.findByIdAndUpdate(id, updateData, options);
  if (!conflict) {
    throw new ApiError(404, 'Conflict not found with the provided ID.');
  }
  return conflict;
};

/**
 * Service to delete a Conflict document.
 * @param {string} id - MongoDB ObjectId string
 * @returns {Promise<object>} Deleted conflict document
 */
export const deleteConflict = async (id) => {
  const conflict = await Conflict.findByIdAndDelete(id);
  if (!conflict) {
    throw new ApiError(404, 'Conflict not found with the provided ID.');
  }
  return conflict;
};

/**
 * Service to perform aggregate statistics overview across all conflicts.
 * @returns {Promise<object>} Calculated global metrics (total cost, averages, states)
 */
export const getConflictStatsOverview = async () => {
  const stats = await Conflict.aggregate([
    {
      $group: {
        _id: null,
        totalConflicts: { $sum: 1 },
        ongoingConflicts: {
          $sum: { $cond: [{ $eq: ['$status', 'Ongoing'] }, 1, 0] }
        },
        resolvedConflicts: {
          $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
        },
        totalWarCostUsd: { $sum: '$warCostUsd' },
        totalReconstructionCostUsd: { $sum: '$reconstructionCostUsd' },
        averageInflationRate: { $avg: '$inflationRate' },
        averageGDPChange: { $avg: '$gdpChange' },
        averageUnemploymentSpike: { $avg: '$unemploymentSpike' },
        averagePovertyRate: { $avg: '$duringWarPovertyRate' }
      }
    }
  ]);

  const defaultStats = {
    totalConflicts: 0,
    ongoingConflicts: 0,
    resolvedConflicts: 0,
    totalWarCostUsd: 0,
    totalReconstructionCostUsd: 0,
    averageInflationRate: 0,
    averageGDPChange: 0,
    averageUnemploymentSpike: 0,
    averagePovertyRate: 0
  };

  return stats.length > 0 ? {
    totalConflicts: stats[0].totalConflicts || 0,
    ongoingConflicts: stats[0].ongoingConflicts || 0,
    resolvedConflicts: stats[0].resolvedConflicts || 0,
    totalWarCostUsd: stats[0].totalWarCostUsd || 0,
    totalReconstructionCostUsd: stats[0].totalReconstructionCostUsd || 0,
    averageInflationRate: Number((stats[0].averageInflationRate || 0).toFixed(2)),
    averageGDPChange: Number((stats[0].averageGDPChange || 0).toFixed(2)),
    averageUnemploymentSpike: Number((stats[0].averageUnemploymentSpike || 0).toFixed(2)),
    averagePovertyRate: Number((stats[0].averagePovertyRate || 0).toFixed(2))
  } : defaultStats;
};

/**
 * Service to locate single extreme records by key metrics.
 * @param {string} fieldName - Field to sort by
 * @param {number} sortOrder - -1 for descending (highest), 1 for ascending (lowest)
 * @returns {Promise<object>} Single extreme conflict document
 */
const getExtremeConflictBy = async (fieldName, sortOrder) => {
  const conflict = await Conflict.findOne().sort({ [fieldName]: sortOrder });
  if (!conflict) {
    throw new ApiError(404, `No conflict record matches the metric sorting request.`);
  }
  return conflict;
};

export const getHighestInflation = () => getExtremeConflictBy('inflationRate', -1);
export const getLowestGDP = () => getExtremeConflictBy('gdpChange', 1); // GDP change (lowest value is greatest contraction)
export const getHighestWarCost = () => getExtremeConflictBy('warCostUsd', -1);
export const getHighestReconstructionCost = () => getExtremeConflictBy('reconstructionCostUsd', -1);

/**
 * Service to aggregate distributions of conflicts across categorical divisions (region, conflictType).
 * @param {string} groupFieldName - Field to group by (e.g. '$region', '$conflictType')
 * @param {string} outputFieldName - Descriptive key name for the grouping in result array
 * @returns {Promise<object[]>} Group counts sorted descending
 */
const getCategoricalDistribution = async (groupFieldName, outputFieldName) => {
  const distribution = await Conflict.aggregate([
    {
      $group: {
        _id: groupFieldName,
        totalConflicts: { $sum: 1 }
      }
    },
    {
      $sort: { totalConflicts: -1 }
    },
    {
      $project: {
        _id: 0,
        [outputFieldName]: '$_id',
        totalConflicts: 1
      }
    }
  ]);
  return distribution;
};

export const getRegionDistribution = () => getCategoricalDistribution('$region', 'region');
export const getConflictTypeDistribution = () => getCategoricalDistribution('$conflictType', 'conflictType');

/**
 * Service to aggregate financial and economic costs grouped by geographical regions.
 * @returns {Promise<object[]>} Regional cost statistics sorted descending by total cost
 */
export const getWarCostByRegion = async () => {
  return Conflict.aggregate([
    {
      $group: {
        _id: '$region',
        totalWarCostUsd: { $sum: '$warCostUsd' },
        averageWarCostUsd: { $avg: '$warCostUsd' },
        totalConflicts: { $sum: 1 }
      }
    },
    {
      $sort: { totalWarCostUsd: -1 }
    },
    {
      $project: {
        _id: 0,
        region: '$_id',
        totalConflicts: 1,
        totalWarCostUsd: 1,
        averageWarCostUsd: { $round: ['$averageWarCostUsd', 2] }
      }
    }
  ]);
};

/**
 * Service to aggregate inflation rates grouped by geographical regions.
 * @returns {Promise<object[]>} Regional inflation rates (avg, max, min) sorted descending by average inflation
 */
export const getInflationByRegion = async () => {
  return Conflict.aggregate([
    {
      $group: {
        _id: '$region',
        averageInflationRate: { $avg: '$inflationRate' },
        highestInflationRate: { $max: '$inflationRate' },
        lowestInflationRate: { $min: '$inflationRate' },
        totalConflicts: { $sum: 1 }
      }
    },
    {
      $sort: { averageInflationRate: -1 }
    },
    {
      $project: {
        _id: 0,
        region: '$_id',
        totalConflicts: 1,
        averageInflationRate: { $round: ['$averageInflationRate', 2] },
        highestInflationRate: { $round: ['$highestInflationRate', 2] },
        lowestInflationRate: { $round: ['$lowestInflationRate', 2] }
      }
    }
  ]);
};
