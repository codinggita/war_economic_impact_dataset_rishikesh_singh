import Conflict from '../models/conflict.model.js';

/**
 * Create a new conflict in the database.
 * @param {Object} data - Conflict data
 * @returns {Promise<Object>} Created conflict document
 */
export const createConflict = async (data) => {
  return Conflict.create(data);
};

/**
 * Fetch conflicts based on filters and pagination/sorting options.
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Pagination/sorting options (page, limit, skip, sort)
 * @returns {Promise<Object>} Object containing paginated conflicts list and counts metadata
 */
export const getConflicts = async (filter = {}, options = {}) => {
  const { skip, limit, sort } = options;

  // Query conflicts with sorting, limit and skip constraints
  const conflicts = await Conflict.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Total matching documents count
  const total = await Conflict.countDocuments(filter);

  return {
    conflicts,
    total,
    page: options.page,
    limit: options.limit,
    totalPages: Math.ceil(total / limit),
    count: conflicts.length
  };
};

/**
 * Fetch a single conflict by its database ID.
 * @param {string} id - Conflict ObjectID
 * @returns {Promise<Object>} Found conflict document
 */
export const getConflictById = async (id) => {
  return Conflict.findById(id);
};

/**
 * Update a conflict by ID.
 * Supports partial updates (PATCH) and full overwrites (PUT).
 * @param {string} id - Conflict ObjectID
 * @param {Object} data - Field update payload
 * @param {boolean} [overwrite=false] - If true, replaces the entire document
 * @returns {Promise<Object>} Updated conflict document
 */
export const updateConflict = async (id, data, overwrite = false) => {
  if (overwrite) {
    return Conflict.findByIdAndUpdate(id, data, {
      new: true,
      overwrite: true,
      runValidators: true
    });
  }
  return Conflict.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

/**
 * Delete a conflict by ID.
 * @param {string} id - Conflict ObjectID
 * @returns {Promise<Object>} Deleted conflict document
 */
export const deleteConflict = async (id) => {
  return Conflict.findByIdAndDelete(id);
};
