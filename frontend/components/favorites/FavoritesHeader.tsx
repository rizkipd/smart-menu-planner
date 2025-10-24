import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/colors';

interface FavoritesHeaderProps {
  onBack: () => void;
  onSort: () => void;
}

export default function FavoritesHeader({ onBack, onSort }: FavoritesHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Favorites</Text>
      <TouchableOpacity style={styles.sortButton} onPress={onSort}>
        <Text style={styles.sortIcon}>⇅</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    paddingTop: Platform.OS === 'ios' ? 65 : 25,
    padding: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  backIcon: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  headerTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  
  sortButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  sortIcon: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});