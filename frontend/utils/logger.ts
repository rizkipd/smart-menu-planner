/**
 * Debug logging utility for Smart Menu Planner
 * Provides controlled logging that can be disabled in production
 */

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  private isDevelopment: boolean;
  private enabledLevels: Set<string>;

  constructor() {
    this.isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';
    // In development, enable all logs. In production, only enable errors and warnings
    this.enabledLevels = new Set(
      this.isDevelopment 
        ? [LOG_LEVELS.ERROR, LOG_LEVELS.WARN, LOG_LEVELS.INFO, LOG_LEVELS.DEBUG]
        : [LOG_LEVELS.ERROR, LOG_LEVELS.WARN]
    );
  }

  private log(level: string, message: string, ...args: any[]) {
    if (!this.enabledLevels.has(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(prefix, message, ...args);
        break;
      case LOG_LEVELS.WARN:
        console.warn(prefix, message, ...args);
        break;
      case LOG_LEVELS.INFO:
        console.info(prefix, message, ...args);
        break;
      case LOG_LEVELS.DEBUG:
        console.log(prefix, message, ...args);
        break;
      default:
        console.log(prefix, message, ...args);
    }
  }

  /**
   * Log error messages (always enabled)
   */
  error(message: string, ...args: any[]) {
    this.log(LOG_LEVELS.ERROR, message, ...args);
  }

  /**
   * Log warning messages (always enabled)
   */
  warn(message: string, ...args: any[]) {
    this.log(LOG_LEVELS.WARN, message, ...args);
  }

  /**
   * Log info messages (development only)
   */
  info(message: string, ...args: any[]) {
    this.log(LOG_LEVELS.INFO, message, ...args);
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, ...args: any[]) {
    this.log(LOG_LEVELS.DEBUG, message, ...args);
  }

  /**
   * Log API requests and responses (development only)
   */
  api(method: string, url: string, data?: any, response?: any) {
    if (!this.isDevelopment) return;

    this.debug(`API ${method.toUpperCase()} ${url}`, {
      requestData: data,
      response: response
    });
  }

  /**
   * Log navigation events (development only)
   */
  navigation(action: string, route?: string, params?: any) {
    if (!this.isDevelopment) return;

    this.debug(`Navigation: ${action}`, {
      route,
      params
    });
  }

  /**
   * Log user interactions (development only)
   */
  user(action: string, context?: any) {
    if (!this.isDevelopment) return;

    this.debug(`User Action: ${action}`, context);
  }

  /**
   * Log performance metrics (development only)
   */
  performance(label: string, duration?: number, metadata?: any) {
    if (!this.isDevelopment) return;

    this.debug(`Performance: ${label}`, {
      duration: duration ? `${duration}ms` : undefined,
      ...metadata
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing or custom instances
export { Logger, LOG_LEVELS };
export type { LogLevel };