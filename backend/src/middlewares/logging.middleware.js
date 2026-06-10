import morgan from 'morgan';

/**
 * Configure request logging based on application environments.
 * - 'dev' logs method, status, response time, and length with colorized outputs.
 * - 'combined' logs standard Apache format logs, ideal for production stream captures.
 */
const selectLoggingFormat = () => {
  return process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
};

export const requestLogger = morgan(selectLoggingFormat());
