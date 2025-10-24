import React, { useState, useCallback, useMemo } from 'react';
import { 
  FlatList, 
  FlatListProps, 
  ActivityIndicator, 
  View, 
  Text, 
  StyleSheet,
  RefreshControl 
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { logger } from '../../utils/logger';

interface LazyListProps<T> extends Omit<FlatListProps<T>, 'data' | 'renderItem'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  pageSize?: number;
  initialLoadSize?: number;
  loadingComponent?: React.ReactElement;
  emptyComponent?: React.ReactElement;
  errorComponent?: React.ReactElement;
  onRefresh?: () => Promise<void>;
  enableRefresh?: boolean;
  enableInfiniteScroll?: boolean;
  onEndReached?: () => void;
  searchQuery?: string;
  filterFn?: (item: T, query: string) => boolean;
}

/**
 * Optimized lazy loading list component for performance
 * Features: pagination, search filtering, pull-to-refresh, infinite scroll
 */
export default function LazyList<T>({
  data,
  renderItem,
  pageSize = 20,
  initialLoadSize = 10,
  loadingComponent,
  emptyComponent,
  errorComponent,
  onRefresh,
  enableRefresh = false,
  enableInfiniteScroll = true,
  onEndReached,
  searchQuery = '',
  filterFn,
  ...flatListProps
}: LazyListProps<T>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadedItems, setLoadedItems] = useState(initialLoadSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery || !filterFn) return data;
    
    const startTime = Date.now();
    const filtered = data.filter(item => filterFn(item, searchQuery));
    const duration = Date.now() - startTime;
    
    logger.performance('List filtering', duration, {
      originalCount: data.length,
      filteredCount: filtered.length,
      searchQuery
    });
    
    return filtered;
  }, [data, searchQuery, filterFn]);

  // Paginated data for lazy loading
  const paginatedData = useMemo(() => {
    const result = filteredData.slice(0, loadedItems);
    logger.debug('Lazy list pagination', {
      totalItems: filteredData.length,
      loadedItems: result.length,
      pageSize
    });
    return result;
  }, [filteredData, loadedItems, pageSize]);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
      setLoadedItems(initialLoadSize); // Reset pagination on refresh
      logger.user('List refreshed');
    } catch (error) {
      logger.error('Failed to refresh list', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, initialLoadSize]);

  const handleEndReached = useCallback(() => {
    if (isLoadingMore || loadedItems >= filteredData.length) return;
    
    setIsLoadingMore(true);
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      const newLoadedItems = Math.min(loadedItems + pageSize, filteredData.length);
      setLoadedItems(newLoadedItems);
      setIsLoadingMore(false);
      
      logger.debug('Loaded more items', {
        previousCount: loadedItems,
        newCount: newLoadedItems,
        totalAvailable: filteredData.length
      });
    }, 300);

    // Call external onEndReached if provided
    onEndReached?.();
  }, [isLoadingMore, loadedItems, filteredData.length, pageSize, onEndReached]);

  const renderItemWithIndex = useCallback(({ item, index }: { item: T; index: number }) => {
    return renderItem(item, index);
  }, [renderItem]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore || !enableInfiniteScroll) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  }, [isLoadingMore, enableInfiniteScroll]);

  const renderEmpty = useCallback(() => {
    if (emptyComponent) return emptyComponent;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery ? 'No items match your search' : 'No items available'}
        </Text>
        {searchQuery && (
          <Text style={styles.emptySubtext}>
            Try adjusting your search terms
          </Text>
        )}
      </View>
    );
  }, [emptyComponent, searchQuery]);

  const refreshControl = enableRefresh ? (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      colors={[Colors.primary]}
      tintColor={Colors.primary}
    />
  ) : undefined;

  if (loadingComponent && paginatedData.length === 0 && !searchQuery) {
    return loadingComponent;
  }

  return (
    <FlatList
      {...flatListProps}
      data={paginatedData}
      renderItem={renderItemWithIndex}
      keyExtractor={(item, index) => {
        // Try to use item id if available, otherwise use index
        const key = (item as any)?.id || (item as any)?.key || index.toString();
        return key;
      }}
      onEndReached={enableInfiniteScroll ? handleEndReached : undefined}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={refreshControl}
      removeClippedSubviews={true}
      maxToRenderPerBatch={pageSize}
      updateCellsBatchingPeriod={50}
      initialNumToRender={initialLoadSize}
      windowSize={5}
      getItemLayout={flatListProps.getItemLayout}
      showsVerticalScrollIndicator={flatListProps.showsVerticalScrollIndicator ?? false}
    />
  );
}

const styles = StyleSheet.create({
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },

  footerText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.lg,
  },

  emptyText: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});