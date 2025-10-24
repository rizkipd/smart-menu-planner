import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';
import MobileApiService from '../../services/api';
import {
  FavoritesHeader,
  FavoritesSearchBar,
  FavoritesFilters,
  FavoritesGrid,
  FavoritesLoadingState,
  FavoritePlan,
} from '../../components/favorites';

const { width } = Dimensions.get('window');

// Available plan modes for filtering
const filterChips = [
  { label: 'diet', displayName: 'Dietary', active: true },
  { label: 'budget', displayName: 'Budget', active: false },
  { label: 'time', displayName: 'Quick & Easy', active: false },
  { label: 'health', displayName: 'Health', active: false },
  { label: 'family', displayName: 'Family', active: false },
];

// Fallback favorite plans data (same as original template)
const fallbackFavoritePlans: FavoritePlan[] = [
  {
    id: 1,
    title: 'Weekly Keto Plan',
    description: '7-day low-carb meals',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyvHVS8S9bb1DQohpzVUbz0oTuDxCvVlqoufKxpTMaaAXmaXkI2Ohk1hXDiEuLTY2duXmpLpMclBFOHLrFuqIFb7Sf-WxengQ-hqAPegj_wwTAvykRwKIaHRFVMHSbti4y8Y2Bd6JW2x6m16M17KEPYMofFivKBZcQoRmEOHN1pQvtsdK6s-bfNploJj18zHUuzVAU8kgjgX8rHUP-adKgIhlUxq4Z67iQSrMxH2B2phERNrrxFvY2P1uIxb0oip9F9zePQWcaePLK',
    category: 'Low-Carb',
    mode: 'diet',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Vegan Delight',
    description: 'Plant-based recipes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD3uZdDTIHAG2ssmt2UNzk1FisvouKxQvvZ09qhK4bdlv0D6LuwHGEW70dP-U7oJFJJ-A9Wkf6GsS935SsoOFfrdu6kP6jq1ufgYCIs2QjsHjiU62pQmaqbnaELkVSb2VJuh0KhiET_Lqhz5x-PyeakwVIyN1iz_EtWqaiucZejtr9ZF5gnVEtZJ7SbisNpfLr8ieWU4zp3v2rD5U8hq01P_odvOj5QIj4cG92kP9fKHkt2NS-qfgXctvE9kqWsI1Ana2Eyst_Z5CE',
    category: 'Vegan',
    mode: 'health',
    created_at: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    title: 'Family Favorites',
    description: 'Kid-friendly dinners',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj_gYAdm-o0T40IkiLwJ-rI1nbOfU4s1O8BuE--F1HOyH2nmBNNzxXd1gF6dkPA7wIY7QWaPR7HjbhhaiFVsKopQ4oCe1Hk1c_d-fkj9zItZxCBX61BiTx9G3-lxQ1l5HuY5K3qWn-7pa9-xTfKpkmXgNHtogIzzGvza8hIC53gutghfrNlwOW7zHCbyO11wzYxvOlaeLMxiNhK9m1-M_yo9BB0xzXJeqplD82vLB-qLS_G47DCdhqVl2N4e2tHGWyT6mZqPx6AxA7',
    category: 'Quick & Easy',
    mode: 'family',
    created_at: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    title: 'High-Protein Week',
    description: 'Energizing meal plan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQQs9iMQLADE42d-z8HymtURECGRXj5rds7n-dNwQGqL9z28FZl_jY6O56wKY7outLSbVOKu0SyDVv-pdOyeEx8BQZJfPkL-9XMIa7TIEeJLGrOjMVQQqit5qWgO_vyWQFp-BChYwrv_MASGI2PeVo_xeEwBkljFwB03TiXw1nLX9fXKvxNiiEFLhDeTe8tlu4sqRh34DQFolSPvOo2xp8gT-cgBqZx-2rT4O5V9OxdFpSw3_TlOBA1Srnx7BGYI6hiVh2-TTxOtBE',
    category: 'High-Protein',
    mode: 'health',
    created_at: '2024-01-12T16:45:00Z'
  },
];

export default function Favorites() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(['diet']);
  const [loading, setLoading] = useState(false);
  const [favoritePlans, setFavoritePlans] = useState<FavoritePlan[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // Filter and search plans
  const filteredFavoritePlans = favoritePlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(plan.mode);
    
    return matchesSearch && matchesFilter;
  });

  // Load favorite plans on component mount
  useEffect(() => {
    loadFavoritePlans();
  }, []);

  const loadFavoritePlans = async () => {
    try {
      setLoading(true);
      console.log('❤️ Loading favorite plans from API...');
      
      // Load popular plans from multiple modes to simulate favorites
      const modes = ['diet', 'budget', 'time', 'health', 'family'];
      const allPlans: FavoritePlan[] = [];
      
      for (const mode of modes) {
        try {
          const response = await MobileApiService.getPopularPlans(mode, 5);
          console.log(`❤️ API Response for ${mode}:`, response);
          if (response.success && response.data) {
            const transformedPlans = response.data.popular_plans.map(plan => ({
              id: plan.id,
              title: generatePlanTitle(mode, plan.id),
              description: plan.preview || generatePlanDescription(mode),
              image: getImageForMode(mode),
              category: getCategoryForMode(mode),
              mode: mode,
              created_at: plan.created_at,
              preview: plan.preview
            }));
            allPlans.push(...transformedPlans);
          }
        } catch (error) {
          console.warn(`❤️ Failed to load plans for mode ${mode}:`, error);
        }
      }
      
      if (allPlans.length > 0) {
        // Select first 6 plans as "favorites" and shuffle them
        const shuffledPlans = allPlans.sort(() => Math.random() - 0.5).slice(0, 6);
        setFavoritePlans(shuffledPlans);
        setFavoriteIds(new Set(shuffledPlans.map(plan => plan.id)));
      } else {
        // Use fallback data if API fails
        setFavoritePlans(fallbackFavoritePlans);
        setFavoriteIds(new Set(fallbackFavoritePlans.map(plan => plan.id)));
      }
    } catch (error) {
      console.error('Failed to load favorite plans:', error);
      // Use fallback data
      setFavoritePlans(fallbackFavoritePlans);
      setFavoriteIds(new Set(fallbackFavoritePlans.map(plan => plan.id)));
    } finally {
      setLoading(false);
    }
  };

  const generatePlanTitle = (mode: string, id: number): string => {
    const titles = {
      diet: [`Keto Weekly Plan #${id}`, `Mediterranean Diet ${id}`, `Low-Carb Delights ${id}`],
      budget: [`Budget Meals #${id}`, `Affordable Week ${id}`, `Economic Eats ${id}`],
      time: [`Quick & Easy #${id}`, `15-Min Meals ${id}`, `Fast Family Food ${id}`],
      health: [`Healthy Living #${id}`, `Nutritious Week ${id}`, `Wellness Plan ${id}`],
      family: [`Family Favorites #${id}`, `Kid-Friendly ${id}`, `Parent Approved ${id}`]
    };
    const modeTitle = titles[mode as keyof typeof titles] || [`Plan #${id}`];
    return modeTitle[id % modeTitle.length];
  };

  const generatePlanDescription = (mode: string): string => {
    const descriptions = {
      diet: '7-day specialized diet meal plan',
      budget: 'Affordable meals for the whole week',
      time: 'Quick meals for busy schedules',
      health: 'Nutritious and balanced meal plan',
      family: 'Kid-friendly family dinners'
    };
    return descriptions[mode as keyof typeof descriptions] || 'Custom meal plan';
  };

  const getImageForMode = (mode: string): string => {
    const images = {
      diet: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyvHVS8S9bb1DQohpzVUbz0oTuDxCvVlqoufKxpTMaaAXmaXkI2Ohk1hXDiEuLTY2duXmpLpMclBFOHLrFuqIFb7Sf-WxengQ-hqAPegj_wwTAvykRwKIaHRFVMHSbti4y8Y2Bd6JW2x6m16M17KEPYMofFivKBZcQoRmEOHN1pQvtsdK6s-bfNploJj18zHUuzVAU8kgjgX8rHUP-adKgIhlUxq4Z67iQSrMxH2B2phERNrrxFvY2P1uIxb0oip9F9zePQWcaePLK',
      budget: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD3uZdDTIHAG2ssmt2UNzk1FisvouKxQvvZ09qhK4bdlv0D6LuwHGEW70dP-U7oJFJJ-A9Wkf6GsS935SsoOFfrdu6kP6jq1ufgYCIs2QjsHjiU62pQmaqbnaELkVSb2VJuh0KhiET_Lqhz5x-PyeakwVIyN1iz_EtWqaiucZejtr9ZF5gnVEtZJ7SbisNpfLr8ieWU4zp3v2rD5U8hq01P_odvOj5QIj4cG92kP9fKHkt2NS-qfgXctvE9kqWsI1Ana2Eyst_Z5CE',
      time: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj_gYAdm-o0T40IkiLwJ-rI1nbOfU4s1O8BuE--F1HOyH2nmBNNzxXd1gF6dkPA7wIY7QWaPR7HjbhhaiFVsKopQ4oCe1Hk1c_d-fkj9zItZxCBX61BiTx9G3-lxQ1l5HuY5K3qWn-7pa9-xTfKpkmXgNHtogIzzGvza8hIC53gutghfrNlwOW7zHCbyO11wzYxvOlaeLMxiNhK9m1-M_yo9BB0xzXJeqplD82vLB-qLS_G47DCdhqVl2N4e2tHGWyT6mZqPx6AxA7',
      health: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQQs9iMQLADE42d-z8HymtURECGRXj5rds7n-dNwQGqL9z28FZl_jY6O56wKY7outLSbVOKu0SyDVv-pdOyeEx8BQZJfPkL-9XMIa7TIEeJLGrOjMVQQqit5qWgO_vyWQFp-BChYwrv_MASGI2PeVo_xeEwBkljFwB03TiXw1nLX9fXKvxNiiEFLhDeTe8tlu4sqRh34DQFolSPvOo2xp8gT-cgBqZx-2rT4O5V9OxdFpSw3_TlOBA1Srnx7BGYI6hiVh2-TTxOtBE',
      family: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj_gYAdm-o0T40IkiLwJ-rI1nbOfU4s1O8BuE--F1HOyH2nmBNNzxXd1gF6dkPA7wIY7QWaPR7HjbhhaiFVsKopQ4oCe1Hk1c_d-fkj9zItZxCBX61BiTx9G3-lxQ1l5HuY5K3qWn-7pa9-xTfKpkmXgNHtogIzzGvza8hIC53gutghfrNlwOW7zHCbyO11wzYxvOlaeLMxiNhK9m1-M_yo9BB0xzXJeqplD82vLB-qLS_G47DCdhqVl2N4e2tHGWyT6mZqPx6AxA7'
    };
    return images[mode as keyof typeof images] || images.diet;
  };

  const getCategoryForMode = (mode: string): string => {
    const categories = {
      diet: 'Diet Plan',
      budget: 'Budget-Friendly',
      time: 'Quick & Easy',
      health: 'Health Focus',
      family: 'Family Style'
    };
    return categories[mode as keyof typeof categories] || 'Custom';
  };

  const handleBack = () => {
    router.back();
  };

  const handleSort = () => {
    Alert.alert(
      'Sort Options',
      'Choose how to sort your favorites:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'By Date', onPress: () => sortFavorites('date') },
        { text: 'By Name', onPress: () => sortFavorites('name') },
        { text: 'By Category', onPress: () => sortFavorites('category') }
      ]
    );
  };

  const sortFavorites = (sortBy: 'date' | 'name' | 'category') => {
    setFavoritePlans(prev => {
      const sorted = [...prev].sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'name':
            return a.title.localeCompare(b.title);
          case 'category':
            return a.category.localeCompare(b.category);
          default:
            return 0;
        }
      });
      return sorted;
    });
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleFavorite = async (planId: number) => {
    const newFavoriteIds = new Set(favoriteIds);
    if (newFavoriteIds.has(planId)) {
      newFavoriteIds.delete(planId);
      setFavoritePlans(prev => prev.filter(plan => plan.id !== planId));
    } else {
      newFavoriteIds.add(planId);
      // In a real app, you'd fetch the plan details and add it to favorites
    }
    setFavoriteIds(newFavoriteIds);
  };

  const handlePlanPress = async (planId: number) => {
    try {
      const response = await MobileApiService.getPlanDetails(planId);
      if (response.success && response.data) {
        Alert.alert(
          'Plan Details',
          `Plan ID: ${planId}\nMode: ${response.data.mode}\nCreated: ${new Date(response.data.created_at).toLocaleDateString()}`,
          [
            { text: 'OK' },
            { text: 'View Details', onPress: () => console.log('Navigate to plan details', planId) }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load plan details');
    }
  };

  const refreshFavorites = async () => {
    Alert.alert(
      'Refresh Favorites',
      'This will reload your favorite meal plans from the server.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Refresh', onPress: loadFavoritePlans }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.designRoot}>
        <FavoritesHeader 
          onBack={handleBack} 
          onSort={handleSort} 
        />
        
        <FavoritesSearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        
        <FavoritesFilters 
          filterChips={filterChips}
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
          onRefresh={refreshFavorites}
        />
        
        <ScrollView style={styles.gridContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
            <FavoritesLoadingState />
          ) : (
            <FavoritesGrid 
              plans={filteredFavoritePlans}
              favoriteIds={favoriteIds}
              onPlanPress={handlePlanPress}
              onToggleFavorite={toggleFavorite}
              loading={loading}
            />
          )}
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
    color: Colors.textMuted,
    fontSize: 16,
  },

  heartIconActive: {
    color: Colors.primary,
  },

  refreshIcon: {
    color: Colors.textDark,
    fontSize: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    color: Colors.textMuted,
    fontSize: 16,
    marginTop: 12,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    width: '100%',
  },

  emptyText: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },

  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },

  chipsContainer: {
    flex: 1,
  },

  refreshButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
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
    marginBottom: 4,
  },

  planCategory: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
});