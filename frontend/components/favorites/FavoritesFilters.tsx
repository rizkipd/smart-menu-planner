import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

interface FilterChip {
  label: string;
  displayName: string;
  active: boolean;
}

interface FavoritesFiltersProps {
  filterChips: FilterChip[];
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  onRefresh: () => void;
}

export default function FavoritesFilters({ 
  filterChips, 
  activeFilters, 
  onToggleFilter, 
  onRefresh 
}: FavoritesFiltersProps) {
  return (
    <View style={styles.filtersRow}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.chipsContainer}
        contentContainerStyle={styles.chipsContent}
      >
        {filterChips.map((chip, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterChip,
              activeFilters.includes(chip.label) && styles.activeFilterChip
            ]}
            onPress={() => onToggleFilter(chip.label)}
          >
            <Text style={[
              styles.filterChipText,
              activeFilters.includes(chip.label) && styles.activeFilterChipText
            ]}>
              {chip.displayName}
            </Text>
            <Text style={[
              styles.dropdownIcon,
              { color: activeFilters.includes(chip.label) ? Colors.primary : Colors.textDark }
            ]}>
              ▼
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshIcon}>↻</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },

  chipsContainer: {
    flex: 1,
  },

  chipsContent: {
    gap: 8,
    paddingHorizontal: 4,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: Spacing.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },

  activeFilterChip: {
    backgroundColor: Colors.primary,
  },

  filterChipText: {
    color: Colors.textDark,
    fontSize: 12,
    fontWeight: '500',
  },

  activeFilterChipText: {
    color: Colors.textLight,
  },

  dropdownIcon: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  refreshIcon: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});