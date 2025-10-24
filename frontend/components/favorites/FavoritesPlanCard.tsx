import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');

export interface FavoritePlan {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  mode: string;
  created_at: string;
  preview?: string;
}

interface FavoritesPlanCardProps {
  plan: FavoritePlan;
  isFavorite: boolean;
  onPress: (planId: number) => void;
  onToggleFavorite: (planId: number) => void;
}

export default function FavoritesPlanCard({ 
  plan, 
  isFavorite, 
  onPress, 
  onToggleFavorite 
}: FavoritesPlanCardProps) {
  return (
    <TouchableOpacity
      style={styles.planCard}
      onPress={() => onPress(plan.id)}
    >
      <View style={styles.planImageContainer}>
        <Image source={{ uri: plan.image }} style={styles.planImage} />
        <TouchableOpacity 
          style={styles.favoriteIcon}
          onPress={() => onToggleFavorite(plan.id)}
        >
          <Text style={[styles.heartIcon, isFavorite && styles.heartIconActive]}>♥</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.planInfo}>
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>
        <Text style={styles.planCategory}>{plan.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    width: (width - (Spacing.lg * 2) - Spacing.md) / 2,
  },

  planImageContainer: {
    position: 'relative',
    height: 120,
  },

  planImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heartIcon: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: 'bold',
  },

  heartIconActive: {
    color: Colors.primary,
  },

  planInfo: {
    padding: Spacing.sm,
  },

  planTitle: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  planDescription: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
    lineHeight: 16,
  },

  planCategory: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});