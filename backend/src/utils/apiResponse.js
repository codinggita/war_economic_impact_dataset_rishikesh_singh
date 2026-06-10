/**
 * Reusable wrapper to standardize API success responses.
 * Enforces a consistent shape for all successful JSON outputs, keeping response structures
 * identical regardless of which resource was requested.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (typically 200, 201)
   * @param {string} message - Descriptive success message
   * @param {any} [data=null] - The payload containing database documents or requested information
   * @param {object} [meta=null] - Optional pagination or metrics metadata
   */
  constructor(statusCode, message, data = null, meta = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
    if (meta !== null) {
      this.meta = meta;
    }
  }

  /**
   * Sends the standardized JSON response via Express.
   * @param {object} res - Express response object
   * @returns {object} Express JSON response
   */
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

export default ApiResponse;
