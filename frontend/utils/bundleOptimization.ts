/**
 * Bundle optimization utilities for Smart Menu Planner
 * Provides lazy loading, code splitting, and performance monitoring
 */

import { logger } from './logger';

/**
 * Lazy import with error handling and retry logic
 */
export function lazyImport<T>(
  importFn: () => Promise<T>,
  componentName: string,
  retries: number = 3
): Promise<T> {
  return new Promise((resolve, reject) => {
    const attemptImport = (attempt: number) => {
      const startTime = Date.now();
      
      importFn()
        .then((module) => {
          const duration = Date.now() - startTime;
          logger.performance(`Lazy import: ${componentName}`, duration, {
            attempt,
            success: true
          });
          resolve(module);
        })
        .catch((error) => {
          const duration = Date.now() - startTime;
          logger.error(`Failed to import ${componentName}`, {
            attempt,
            duration,
            error: error.message
          });

          if (attempt < retries) {
            logger.debug(`Retrying import for ${componentName}`, {
              attempt: attempt + 1,
              retries
            });
            setTimeout(() => attemptImport(attempt + 1), 1000 * attempt);
          } else {
            reject(new Error(`Failed to load ${componentName} after ${retries} attempts`));
          }
        });
    };

    attemptImport(1);
  });
}

/**
 * Preload critical components during app initialization
 */
export async function preloadCriticalComponents() {
  const criticalComponents = [
    // Core navigation components
    () => import('../app/(tabs)/index'),
    () => import('../app/(tabs)/plans'),
    () => import('../app/(tabs)/shopping'),
    () => import('../app/(tabs)/favorites'),
  ];

  const startTime = Date.now();
  
  try {
    const results = await Promise.allSettled(
      criticalComponents.map((importFn, index) => 
        lazyImport(importFn, `critical-component-${index}`)
      )
    );

    const duration = Date.now() - startTime;
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    logger.performance('Critical components preload', duration, {
      total: criticalComponents.length,
      successful,
      failed
    });

    if (failed > 0) {
      logger.warn(`${failed} critical components failed to preload`);
    }
  } catch (error) {
    logger.error('Critical components preload failed', error);
  }
}

/**
 * Lazy load non-critical features
 */
export const LazyComponents = {
  // Profile components (loaded when user navigates to profile)
  ProfileSettings: () => lazyImport(
    () => import('../app/(tabs)/profile'),
    'ProfileSettings'
  ),
  
  // Weekly plan (loaded when user navigates to weekly plan)
  WeeklyPlan: () => lazyImport(
    () => import('../app/weekly-plan'),
    'WeeklyPlan'
  ),
  
  // Plan mode selection (loaded after login)
  PlanModeSelection: () => lazyImport(
    () => import('../app/plan-mode-selection'),
    'PlanModeSelection'
  ),

  // Advanced components that can be lazy loaded
  CachedImage: () => lazyImport(
    () => import('../components/common/CachedImage'),
    'CachedImage'
  ),

  LazyList: () => lazyImport(
    () => import('../components/common/LazyList'),
    'LazyList'
  ),
};

/**
 * Memory usage monitoring and cleanup
 */
export class MemoryManager {
  private static imageCache = new Map<string, any>();
  private static maxCacheSize = 50; // Maximum number of cached images

  static cacheImage(uri: string, imageData: any) {
    if (this.imageCache.size >= this.maxCacheSize) {
      // Remove oldest entries (simple LRU)
      const firstKey = this.imageCache.keys().next().value;
      this.imageCache.delete(firstKey);
      logger.debug('Image cache cleanup', { removedKey: firstKey });
    }

    this.imageCache.set(uri, imageData);
    logger.debug('Image cached', { 
      uri, 
      cacheSize: this.imageCache.size 
    });
  }

  static getCachedImage(uri: string) {
    return this.imageCache.get(uri);
  }

  static clearImageCache() {
    const size = this.imageCache.size;
    this.imageCache.clear();
    logger.info('Image cache cleared', { previousSize: size });
  }

  static getMemoryUsage() {
    if (__DEV__) {
      // In development, provide mock memory stats
      return {
        imageCache: this.imageCache.size,
        maxCacheSize: this.maxCacheSize,
        estimatedMemoryMB: (this.imageCache.size * 0.5).toFixed(1) // Rough estimate
      };
    }
    return null;
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics = new Map<string, number>();

  static startTiming(label: string) {
    this.metrics.set(label, Date.now());
  }

  static endTiming(label: string) {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.metrics.delete(label);
      logger.performance(label, duration);
      return duration;
    }
    return 0;
  }

  static measure<T>(label: string, fn: () => T): T {
    this.startTiming(label);
    try {
      const result = fn();
      this.endTiming(label);
      return result;
    } catch (error) {
      this.endTiming(label);
      throw error;
    }
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    try {
      const result = await fn();
      this.endTiming(label);
      return result;
    } catch (error) {
      this.endTiming(label);
      throw error;
    }
  }
}

/**
 * Bundle size analyzer (development only)
 */
export function analyzeBundleSize() {
  if (!__DEV__) return;

  logger.debug('Bundle analysis', {
    memoryUsage: MemoryManager.getMemoryUsage(),
    cachedImages: MemoryManager.getMemoryUsage()?.imageCache || 0,
    timestamp: new Date().toISOString()
  });
}

/**
 * Resource cleanup for memory management
 */
export function cleanupResources() {
  MemoryManager.clearImageCache();
  logger.info('Resources cleaned up');
}