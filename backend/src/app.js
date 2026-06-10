import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';
import { requestLogger } from './middlewares/logging.middleware.js';
import { generalLimiter } from './middlewares/rateLimit.middleware.js';
import ApiError from './utils/apiError.js';

const app = express();

// ==========================================
// 1. Global Middleware Stack
// ==========================================

// Enable CORS for all cross-origin requests
app.use(cors());

// Configure HTTP request logger (Morgan)
app.use(requestLogger);

// Apply custom memory-based rate limiting to prevent DDoS/abuse on general routes
app.use(generalLimiter);

// Parses incoming JSON request payloads
app.use(express.json());

// Parses URL-encoded request payloads (form data)
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. Global Routes Mounting
// ==========================================

// Mounts modular endpoints (/auth, /conflicts, /health, /version) at root level
app.use('/', routes);

// ==========================================
// 3. Fallback & Error Handling Pipeline
// ==========================================

// Catch-all handler for undefined API routes (generates 404 ApiError)
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Centralized error handling middleware (must be registered last in pipeline)
app.use(errorHandler);

export default app;
