import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FavoritePlan {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  isFavorite: boolean;
}

interface FavoriteMenuPageProps {
  onBack: () => void;
  onSort?: () => void;
  onPlanSelect?: (plan: FavoritePlan) => void;
}

const categories = ['Vegan', 'Low-Carb', 'High-Protein', 'Vegetarian', 'Quick & Easy'];

const favoritePlans: FavoritePlan[] = [
  {
    id: '1',
    title: 'Weekly Keto Plan',
    description: '7-day low-carb meals',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyvHVS8S9bb1DQohpzVUbz0oTuDxCvVlqoufKxpTMaaAXmaXkI2Ohk1hXDiEuLTY2duXmpLpMclBFOHLrFuqIFb7Sf-WxengQ-hqAPegj_wwTAvykRwKIaHRFVMHSbti4y8Y2Bd6JW2x6m16M17KEPYMofFivKBZcQoRmEOHN1pQvtsdK6s-bfNploJj18zHUuzVAU8kgjgX8rHUP-adKgIhlUxq4Z67iQSrMxH2B2phERNrrxFvY2P1uIxb0oip9F9zePQWcaePLK',
    category: 'Low-Carb',
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Vegan Delight',
    description: 'Plant-based recipes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD3uZdDTIHAG2ssmt2UNzk1FisvouKxQvvZ09qhK4bdlv0D6LuwHGEW70dP-U7oJFJJ-A9Wkf6GsS935SsoOFfrdu6kP6jq1ufgYCIs2QjsHjiU62pQmaqbnaELkVSb2VJuh0KhiET_Lqhz5x-PyeakwVIyN1iz_EtWqaiucZejtr9ZF5gnVEtZJ7SbisNpfLr8ieWU4zp3v2rD5U8hq01P_odvOj5QIj4cG92kP9fKHkt2NS-qfgXctvE9kqWsI1Ana2Eyst_Z5CE',
    category: 'Vegan',
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Family Favorites',
    description: 'Kid-friendly dinners',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj_gYAdm-o0T40IkiLwJ-rI1nbOfU4s1O8BuE--F1HOyH2nmBNNzxXd1gF6dkPA7wIY7QWaPR7HjbhhaiFVsKopQ4oCe1Hk1c_d-fkj9zItZxCBX61BiTx9G3-lxQ1l5HuY5K3qWn-7pa9-xTfKpkmXgNHtogIzzGvza8hIC53gutghfrNlwOW7zHCbyO11wzYxvOlaeLMxiNhK9m1-M_yo9BB0xzXJeqplD82vLB-qLS_G47DCdhqVl2N4e2tHGWyT6mZqPx6AxA7',
    category: 'Quick & Easy',
    isFavorite: true,
  },
  {
    id: '4',
    title: 'High-Protein Week',
    description: 'Energizing meal plan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQQs9iMQLADE42d-z8HymtURECGRXj5rds7n-dNwQGqL9z28FZl_jY6O56wKY7outLSbVOKu0SyDVv-pdOyeEx8BQZJfPkL-9XMIa7TIEeJLGrOjMVQQqit5qWgO_vyWQFp-BChYwrv_MASGI2PeVo_xeEwBkljFwB03TiXw1nLX9fXKvxNiiEFLhDeTe8tlu4sqRh34DQFolSPvOo2xp8gT-cgBqZx-2rT4O5V9OxdFpSw3_TlOBA1Srnx7BGYI6hiVh2-TTxOtBE',
    category: 'High-Protein',
    isFavorite: true,
  },
];

export default function FavoriteMenuPage({ onBack, onSort = () => {}, onPlanSelect = () => {} }: FavoriteMenuPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Vegan');
  const [filteredPlans, setFilteredPlans] = useState(favoritePlans);
  
  // Safe area insets fallback for web and mobile
  const getSafeAreaInsets = () => {
    if (Platform.OS === 'web') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
    return { top: 44, bottom: 34, left: 0, right: 0 }; // iOS default safe area
  };
  
  const insets = getSafeAreaInsets();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPlans(query, selectedCategory);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    filterPlans(searchQuery, category);
  };

  const filterPlans = (query: string, category: string) => {
    let filtered = favoritePlans;
    
    if (query) {
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(query.toLowerCase()) ||
        plan.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(plan => plan.category === category);
    }
    
    setFilteredPlans(filtered);
  };

  const renderCategoryChip = (category: string) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryChip,
          isSelected ? styles.categoryChipSelected : styles.categoryChipDefault
        ]}
        onPress={() => handleCategorySelect(category)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.categoryChipText,
          isSelected ? styles.categoryChipTextSelected : styles.categoryChipTextDefault
        ]}>
          {category}
        </Text>
        <MaterialIcons 
          name="keyboard-arrow-down" 
          size={16} 
          color={isSelected ? '#38e07b' : 'black'} 
        />
      </TouchableOpacity>
    );
  };

  const renderPlanCard = (plan: FavoritePlan) => (
    <TouchableOpacity
      key={plan.id}
      style={styles.planCard}
      onPress={() => onPlanSelect(plan)}
      activeOpacity={0.9}
    >
      <View style={styles.planImageContainer}>
        <Image
          source={{ uri: plan.image }}
          style={styles.planImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => {
            // Toggle favorite logic here
          }}
        >
          <MaterialIcons
            name="favorite"
            size={16}
            color="#38e07b"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.planInfo}>
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f8f7" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <TouchableOpacity style={styles.sortButton} onPress={onSort}>
          <MaterialIcons name="sort" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <View style={styles.searchIconContainer}>
            <MaterialIcons name="search" size={24} color="#9eb7a8" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search my favorites..."
            placeholderTextColor="#9eb7a8"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(renderCategoryChip)}
      </ScrollView>

      {/* Image Grid */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlans.length > 0 ? (
          <View style={styles.plansGrid}>
            {filteredPlans.map(renderPlanCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="heart-broken" size={64} color="#6b7280" />
            <Text style={styles.emptyStateTitle}>No favorites yet.</Text>
            <Text style={styles.emptyStateDescription}>
              Explore meal plans and tap the heart icon to save them here!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color="#9eb7a8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="calendar-today" size={24} color="#9eb7a8" />
          <Text style={styles.navText}>Meal Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <MaterialIcons name="favorite" size={24} color="#38e07b" />
          <Text style={[styles.navText, styles.navTextActive]}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#9eb7a8" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7',
    minHeight: 884,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f6f8f7',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.015,
  },
  sortButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 12,
    height: 48,
    width: '100%',
  },
  searchIconContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderRightWidth: 0,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: 'black',
    backgroundColor: '#e5e5e5',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingLeft: 8,
    paddingRight: 16,
    borderWidth: 0,
  },
  categoryContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexShrink: 0,
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(56, 224, 123, 0.2)',
  },
  categoryChipDefault: {
    backgroundColor: '#e5e5e5',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#38e07b',
  },
  categoryChipTextDefault: {
    color: 'black',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  planCard: {
    width: '48%',
    marginBottom: 16,
  },
  planImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  planImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: {
    paddingHorizontal: 4,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6b7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: 'rgba(246, 248, 247, 0.8)',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingBottom: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9eb7a8',
    letterSpacing: 0.015,
  },
  navItemActive: {},
  navTextActive: {
    color: '#38e07b',
  },
});