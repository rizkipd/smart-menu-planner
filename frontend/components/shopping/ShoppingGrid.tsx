import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '../../constants/spacing';
import ShoppingItem, { ShoppingItemData } from './ShoppingItem';

interface ShoppingGridProps {
  items: ShoppingItemData[];
  onItemPress: (index: number) => void;
}

export default function ShoppingGrid({ items, onItemPress }: ShoppingGridProps) {
  return (
    <View style={styles.itemsGrid}>
      {items.map((item, index) => (
        <ShoppingItem
          key={index}
          item={item}
          onPress={() => onItemPress(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});