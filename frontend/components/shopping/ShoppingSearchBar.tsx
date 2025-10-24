import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

interface ShoppingSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ShoppingSearchBar({ searchQuery, onSearchChange }: ShoppingSearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchIcon}>
          <Text style={styles.searchIconText}>🔍</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },

  searchIcon: {
    marginRight: Spacing.sm,
  },

  searchIconText: {
    fontSize: 16,
  },

  searchInput: {
    flex: 1,
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '400',
  },
});