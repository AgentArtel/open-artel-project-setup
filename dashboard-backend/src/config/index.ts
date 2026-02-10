import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  github: {
    token: process.env.GITHUB_TOKEN || '',
  },
  kimi: {
    apiKey: process.env.KIMI_API_KEY || '',
    baseUrl: process.env.KIMI_BASE_URL || 'https://api.moonshot.cn/v1',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate required environment variables
if (!config.github.token) {
  console.warn('⚠️  GITHUB_TOKEN not set. GitHub API features will be unavailable.');
}

if (!config.kimi.apiKey) {
  console.warn('⚠️  KIMI_API_KEY not set. Kimi API features will be unavailable.');
}

