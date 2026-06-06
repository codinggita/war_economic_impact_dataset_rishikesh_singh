import express from 'express';
import healthRoutes from './health.routes.js';
import versionRoutes from './version.routes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/version', versionRoutes);

export default router;
