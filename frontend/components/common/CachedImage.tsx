import React, { useState } from 'react';
import { Image, ImageProps, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { logger } from '../../utils/logger';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  fallbackUri?: string;
  showLoadingIndicator?: boolean;
  loadingSize?: 'small' | 'large';
  cachePolicy?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';
}

/**
 * Enhanced Image component with caching, fallback, and loading states
 * Optimized for meal plan images with proper error handling
 */
export default function CachedImage({
  uri,
  fallbackUri,
  showLoadingIndicator = true,
  loadingSize = 'small',
  cachePolicy = 'default',
  style,
  onLoad,
  onError,
  ...props
}: CachedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentUri, setCurrentUri] = useState(uri);

  const handleLoad = (event: any) => {
    setIsLoading(false);
    setHasError(false);
    logger.debug('Image loaded successfully', { uri: currentUri });
    onLoad?.(event);
  };

  const handleError = (event: any) => {
    setIsLoading(false);
    setHasError(true);
    
    logger.warn('Image failed to load', { 
      uri: currentUri, 
      error: event.nativeEvent?.error 
    });

    // Try fallback URI if available and we haven't already tried it
    if (fallbackUri && currentUri !== fallbackUri) {
      logger.debug('Attempting fallback image', { fallbackUri });
      setCurrentUri(fallbackUri);
      setIsLoading(true);
      setHasError(false);
      return;
    }

    onError?.(event);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  // Prepare image source with caching headers
  const imageSource = {
    uri: currentUri,
    cache: cachePolicy,
    // Add cache control headers for better caching
    headers: {
      'Cache-Control': cachePolicy === 'force-cache' ? 'max-age=86400' : 'no-cache',
    },
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        {...props}
        source={imageSource}
        style={[StyleSheet.absoluteFill, style]}
        onLoad={handleLoad}
        onError={handleError}
        onLoadStart={handleLoadStart}
        resizeMode={props.resizeMode || 'cover'}
      />
      
      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size={loadingSize} 
            color={Colors.primary}
          />
        </View>
      )}

      {/* Error placeholder */}
      {hasError && !isLoading && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <ActivityIndicator size="small" color={Colors.textMuted} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },

  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardSecondary,
  },

  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardSecondary,
  },

  errorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundDarkAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
});