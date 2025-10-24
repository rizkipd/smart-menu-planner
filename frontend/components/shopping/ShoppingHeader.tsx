import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/colors';

interface ShoppingHeaderProps {
  onRefresh: () => void;
  onBack?: () => void;
}

export default function ShoppingHeader({ onRefresh, onBack }: ShoppingHeaderProps) {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>Shopping List</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshIcon}>↻</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    paddingTop: Platform.OS === 'ios' ? 65 : 25, // Platform-specific status bar spacing
    paddingHorizontal: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  
  headerTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
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

  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  refreshIcon: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});