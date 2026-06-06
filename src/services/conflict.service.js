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
 * Fetch conflicts based on filters and options.
 * (Paging/sorting will be integrated in future PRs).
 * @returns {Promise<Array>} List of conflict documents
 */
export const getConflicts = async () => {
  return Conflict.find();
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
