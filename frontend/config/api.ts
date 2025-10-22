/**
 * API Configuration Management
 * Centralizes all API-related configuration with environment variable support
 */

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// API Configuration
export interface ApiConfig {
  baseUrl: string;
  version: string;
  timeout: number;
  healthEndpoint: string;
  retryAttempts: number;
  retryDelay: number;
}

// Default configuration values
const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'http://192.168.0.95:8000',
  version: 'v1',
  timeout: 10000, // 10 seconds
  healthEndpoint: '/health',
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Environment-specific overrides
const DEVELOPMENT_CONFIG: Partial<ApiConfig> = {
  timeout: 15000, // Longer timeout for development
  retryAttempts: 2,
};

const PRODUCTION_CONFIG: Partial<ApiConfig> = {
  timeout: 8000, // Shorter timeout for production
  retryAttempts: 3,
};

/**
 * Get API configuration based on environment variables and defaults
 */
function getApiConfig(): ApiConfig {
  // Start with defaults
  let config = { ...DEFAULT_CONFIG };

  // Apply environment-specific overrides
  if (isDevelopment) {
    config = { ...config, ...DEVELOPMENT_CONFIG };
  } else if (isProduction) {
    config = { ...config, ...PRODUCTION_CONFIG };
  }

  // Override with environment variables if available
  const envBaseUrl = process.env.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_BACKEND_URL;
  if (envBaseUrl) {
    // Extract base URL and version from full API URL
    if (envBaseUrl.includes('/api/')) {
      const parts = envBaseUrl.split('/api/');
      config.baseUrl = parts[0];
      config.version = parts[1] || config.version;
    } else {
      config.baseUrl = envBaseUrl;
    }
  }

  // Environment variable overrides
  if (process.env.API_TIMEOUT) {
    const timeout = parseInt(process.env.API_TIMEOUT, 10);
    if (!isNaN(timeout)) {
      config.timeout = timeout;
    }
  }

  if (process.env.API_VERSION) {
    config.version = process.env.API_VERSION;
  }

  return config;
}

// Export the configuration
export const apiConfig = getApiConfig();

// Helper functions
export const getApiBaseUrl = (): string => apiConfig.baseUrl;
export const getApiVersion = (): string => apiConfig.version;
export const getFullApiUrl = (): string => `${apiConfig.baseUrl}/api/${apiConfig.version}`;
export const getHealthUrl = (): string => `${apiConfig.baseUrl}${apiConfig.healthEndpoint}`;
export const getApiTimeout = (): number => apiConfig.timeout;

// Debug logging in development
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    baseUrl: apiConfig.baseUrl,
    version: apiConfig.version,
    fullUrl: getFullApiUrl(),
    timeout: apiConfig.timeout,
    environment: process.env.NODE_ENV,
  });
}

export default apiConfig;