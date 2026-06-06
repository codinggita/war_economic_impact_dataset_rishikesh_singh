import ApiError from '../utils/apiError.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  if (process.env.NODE_ENV === 'development' || !error.isOperational) {
    console.error(`[Error Middleware] Status: ${error.statusCode} - Message: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  }

  res.status(error.statusCode).json(response);
};

export default errorHandler;
