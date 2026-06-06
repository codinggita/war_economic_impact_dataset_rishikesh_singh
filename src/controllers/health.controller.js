import mongoose from 'mongoose';

export const getHealth = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    res.status(200).json({
      success: true,
      status: 'UP',
      message: 'API server is running and healthy.',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: {
        status: dbStateMap[dbState] || 'unknown',
        code: dbState,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to check server health',
      error: err.message,
    });
  }
};
