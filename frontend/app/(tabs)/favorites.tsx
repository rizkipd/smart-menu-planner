import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Sample favorite meal plans data from template
const favoritePlans = [
  {
    id: 1,
    title: 'Weekly Keto Plan',
    description: '7-day low-carb meals',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyvHVS8S9bb1DQohpzVUbz0oTuDxCvVlqoufKxpTMaaAXmaXkI2Ohk1hXDiEuLTY2duXmpLpMclBFOHLrFuqIFb7Sf-WxengQ-hqAPegj_wwTAvykRwKIaHRFVMHSbti4y8Y2Bd6JW2x6m16M17KEPYMofFivKBZcQoRmEOHN1pQvtsdK6s-bfNploJj18zHUuzVAU8kgjgX8rHUP-adKgIhlUxq4Z67iQSrMxH2B2phERNrrxFvY2P1uIxb0oip9F9zePQWcaePLK',
    category: 'Low-Carb'
  },
  {
    id: 2,
    title: 'Vegan Delight',
    description: 'Plant-based recipes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD3uZdDTIHAG2ssmt2UNzk1FisvouKxQvvZ09qhK4bdlv0D6LuwHGEW70dP-U7oJFJJ-A9Wkf6GsS935SsoOFfrdu6kP6jq1ufgYCIs2QjsHjiU62pQmaqbnaELkVSb2VJuh0KhiET_Lqhz5x-PyeakwVIyN1iz_EtWqaiucZejtr9ZF5gnVEtZJ7SbisNpfLr8ieWU4zp3v2rD5U8hq01P_odvOj5QIj4cG92kP9fKHkt2NS-qfgXctvE9kqWsI1Ana2Eyst_Z5CE',
    category: 'Vegan'
  },
  {
    id: 3,
    title: 'Family Favorites',
    description: 'Kid-friendly dinners',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj_gYAdm-o0T40IkiLwJ-rI1nbOfU4s1O8BuE--F1HOyH2nmBNNzxXd1gF6dkPA7wIY7QWaPR7HjbhhaiFVsKopQ4oCe1Hk1c_d-fkj9zItZxCBX61BiTx9G3-lxQ1l5HuY5K3qWn-7pa9-xTfKpkmXgNHtogIzzGvza8hIC53gutghfrNlwOW7zHCbyO11wzYxvOlaeLMxiNhK9m1-M_yo9BB0xzXJeqplD82vLB-qLS_G47DCdhqVl2N4e2tHGWyT6mZqPx6AxA7',
    category: 'Quick & Easy'
  },
  {
    id: 4,
    title: 'High-Protein Week',
    description: 'Energizing meal plan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQQs9iMQLADE42d-z8HymtURECGRXj5rds7n-dNwQGqL9z28FZl_jY6O56wKY7outLSbVOKu0SyDVv-pdOyeEx8BQZJfPkL-9XMIa7TIEeJLGrOjMVQQqit5qWgO_vyWQFp-BChYwrv_MASGI2PeVo_xeEwBkljFwB03TiXw1nLX9fXKvxNiiEFLhDeTe8tlu4sqRh34DQFolSPvOo2xp8gT-cgBqZx-2rT4O5V9OxdFpSw3_TlOBA1Srnx7BGYI6hiVh2-TTxOtBE',
    category: 'High-Protein'
  },
];

const filterChips = [
  { label: 'Vegan', active: true },
  { label: 'Low-Carb', active: false },
  { label: 'High-Protein', active: false },
  { label: 'Vegetarian', active: false },
  { label: 'Quick & Easy', active: false },
];

export default function Favorites() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(['Vegan']);

  const handleBack = () => {
    router.back();
  };

  const handleSort = () => {
    console.log('Sort favorites');
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handlePlanPress = (planId: number) => {
    console.log('Selected plan:', planId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.designRoot}>
        {/* Top App Bar - template: flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
            <Text style={styles.sortIcon}>⇅</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar - template: px-4 py-3 */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <Text style={styles.searchIconText}>🔍</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search my favorites..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter Chips - template: flex gap-3 p-3 overflow-x-auto */}
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
              onPress={() => toggleFilter(chip.label)}
            >
              <Text style={[
                styles.filterChipText,
                activeFilters.includes(chip.label) && styles.activeFilterChipText
              ]}>
                {chip.label}
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

        {/* Image Grid - template: grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4 flex-1 */}
        <ScrollView style={styles.gridContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {favoritePlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
                onPress={() => handlePlanPress(plan.id)}
              >
                <View style={styles.planImageContainer}>
                  <Image source={{ uri: plan.image }} style={styles.planImage} />
                  <View style={styles.favoriteIcon}>
                    <Text style={styles.heartIcon}>♥</Text>
                  </View>
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  
  designRoot: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  
  // Header - template: flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    paddingTop: 50, // Mobile status bar spacing
    padding: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    color: Colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
  },

  sortIcon: {
    color: Colors.textDark,
    fontSize: 24,
  },

  searchIconText: {
    fontSize: 20,
    color: Colors.textMuted,
  },

  dropdownIcon: {
    fontSize: 12,
  },

  heartIcon: {
    color: Colors.primary,
    fontSize: 16,
  },
  
  headerTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  
  sortButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  
  // Search Section - template: px-4 py-3
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  
  searchContainer: {
    flexDirection: 'row',
    height: 48,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
  },
  
  searchIcon: {
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: Spacing.lg,
    borderTopLeftRadius: Spacing.borderRadius.lg,
    borderBottomLeftRadius: Spacing.borderRadius.lg,
  },
  
  searchInput: {
    flex: 1,
    backgroundColor: Colors.cardSecondary,
    color: Colors.textDark,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingLeft: 8,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 0,
  },
  
  // Filter Chips - template: flex gap-3 p-3 overflow-x-auto
  chipsContainer: {
    flexGrow: 0,
  },
  
  chipsContent: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  
  filterChip: {
    flexDirection: 'row',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.cardSecondary,
    borderRadius: Spacing.borderRadius.lg,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.sm,
  },
  
  activeFilterChip: {
    backgroundColor: Colors.primary + '33', // primary/20
  },
  
  filterChipText: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '500',
  },
  
  activeFilterChipText: {
    color: Colors.primary,
  },
  
  // Grid Container - template: grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4 flex-1
  gridContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.lg,
    paddingBottom: Spacing.lg,
  },

  scrollContent: {
    paddingBottom: 100, // Footer height + extra spacing
  },
  
  // Plan Card - template: flex flex-col gap-3 pb-3
  planCard: {
    flexDirection: 'column',
    paddingBottom: 12,
    width: (width - (Spacing.lg * 2) - Spacing.lg) / 2, // 2 columns with gap
    marginBottom: 12,
  },
  
  planImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
  },
  
  planImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.cardSecondary,
  },
  
  favoriteIcon: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  planInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  
  planTitle: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  
  planDescription: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '400',
  },
});