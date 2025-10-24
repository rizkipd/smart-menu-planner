import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import FavoritesPlanCard, { FavoritePlan } from './FavoritesPlanCard';

interface FavoritesGridProps {
  plans: FavoritePlan[];
  favoriteIds: Set<number>;
  onPlanPress: (planId: number) => void;
  onToggleFavorite: (planId: number) => void;
  loading: boolean;
}

export default function FavoritesGrid({ 
  plans, 
  favoriteIds, 
  onPlanPress, 
  onToggleFavorite, 
  loading 
}: FavoritesGridProps) {
  if (plans.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorites found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your filters or add some plans to favorites</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {plans.map((plan) => (
        <FavoritesPlanCard
          key={plan.id}
          plan={plan}
          isFavorite={favoriteIds.has(plan.id)}
          onPress={onPlanPress}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },

  emptyText: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
});