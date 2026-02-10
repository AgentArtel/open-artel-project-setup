#!/usr/bin/env node
/**
 * Environment Configuration Checker
 * Validates that all required environment variables are set
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '..', '.env');
const REQUIRED_VARS = {
  KIMI_API_KEY: {
    required: true,
    description: 'Kimi/Moonshot API key (required for /api/kimi/chat)',
    getUrl: 'https://platform.moonshot.cn/',
    pattern: /^sk-/,
  },
  GITHUB_TOKEN: {
    required: true,
    description: 'GitHub Personal Access Token (required for GitHub API)',
    getUrl: 'https://github.com/settings/tokens',
    pattern: /^ghp_/,
  },
};

const OPTIONAL_VARS = {
  PORT: {
    default: '3001',
    description: 'Server port',
  },
  CORS_ORIGIN: {
    default: 'http://localhost:5173',
    description: 'Frontend CORS origin',
  },
  KIMI_BASE_URL: {
    default: 'https://api.moonshot.cn/v1',
    description: 'Kimi API base URL',
  },
  LOG_LEVEL: {
    default: 'info',
    description: 'Logging level',
  },
  NODE_ENV: {
    default: 'development',
    description: 'Node environment',
  },
};

console.log('==========================================');
console.log('Environment Configuration Check');
console.log('==========================================');
console.log('');

// Check if .env exists
if (!fs.existsSync(ENV_FILE)) {
  console.log('❌ .env file not found!');
  console.log('');
  console.log('Run: cp .env.example .env');
  console.log('Or: npm run setup');
  process.exit(1);
}

console.log('✅ .env file exists');
console.log('');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('Required Variables:');
console.log('-------------------');
for (const [key, config] of Object.entries(REQUIRED_VARS)) {
  const value = process.env[key];
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`❌ ${key}: NOT SET`);
    console.log(`   ${config.description}`);
    console.log(`   Get it from: ${config.getUrl}`);
    hasErrors = true;
  } else if (config.pattern && !config.pattern.test(value)) {
    console.log(`⚠️  ${key}: Invalid format`);
    console.log(`   Expected pattern: ${config.pattern}`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${key}: Set (${value.substring(0, 10)}...)`);
  }
  console.log('');
}

// Check optional variables
console.log('Optional Variables:');
console.log('-------------------');
for (const [key, config] of Object.entries(OPTIONAL_VARS)) {
  const value = process.env[key] || config.default;
  if (process.env[key]) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`⚪ ${key}: ${value} (using default)`);
  }
}

console.log('');
console.log('==========================================');

if (hasErrors) {
  console.log('❌ Configuration incomplete');
  console.log('');
  console.log('To fix:');
  console.log('  1. Edit .env file and add missing values');
  console.log('  2. Or run: npm run setup');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuration has warnings (see above)');
  process.exit(0);
} else {
  console.log('✅ Configuration complete!');
  console.log('');
  console.log('You can now start the backend:');
  console.log('  npm run dev');
  process.exit(0);
}

