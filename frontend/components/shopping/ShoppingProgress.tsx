import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

interface ShoppingProgressProps {
  checkedItems: number;
  totalItems: number;
  progressPercentage: number;
}

export default function ShoppingProgress({ checkedItems, totalItems, progressPercentage }: ShoppingProgressProps) {
  return (
    <View style={styles.progressSection}>
      <Text style={styles.progressText}>
        {checkedItems} of {totalItems} items completed ({progressPercentage}%)
      </Text>
      <View style={styles.progressBar}>
        <View 
          style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  progressText: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },

  progressBar: {
    height: 6,
    backgroundColor: Colors.cardDark,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
});