import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');

export interface ShoppingItemData {
  name?: string;
  ingredient?: string;
  quantity: string;
  category: string;
  checked?: boolean;
  image?: string;
}

interface ShoppingItemProps {
  item: ShoppingItemData;
  onPress: () => void;
}

export default function ShoppingItem({ item, onPress }: ShoppingItemProps) {
  const displayName = item.name || item.ingredient || 'Unknown Item';
  
  return (
    <TouchableOpacity 
      style={[styles.itemCard, item.checked && styles.itemCardChecked]}
      onPress={onPress}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
          {displayName}
        </Text>
        <Text style={styles.itemQuantity}>{item.quantity}</Text>
      </View>
      <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
        {item.checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    width: (width - Spacing.lg * 3) / 2, // Two columns with spacing
    borderWidth: 1,
    borderColor: 'transparent',
  },

  itemCardChecked: {
    backgroundColor: Colors.cardSecondary,
    borderColor: Colors.primary,
  },

  itemImage: {
    width: 40,
    height: 40,
    borderRadius: Spacing.borderRadius.md,
    marginRight: Spacing.sm,
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },

  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },

  itemQuantity: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '400',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },

  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  checkmark: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
});