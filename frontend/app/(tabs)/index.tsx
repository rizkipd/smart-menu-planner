import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashScreen from '../../components/SplashScreen';
import PlanModeSelection from '../../components/PlanModeSelection';
import ProfilePage from '../../components/ProfilePage';
import LoginScreen from '../../components/LoginScreen';
import SelectedMenuPage from '../../components/SelectedMenuPage';
import ShoppingListView from '../../components/ShoppingListView';
import WeeklyMenuView from '../../components/WeeklyMenuView';
import FavoriteMenuPage from '../../components/FavoriteMenuPage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Platform-specific scaling for iOS layout issues
const { OS } = Platform;
const scale = OS === 'ios' ? 0.8 : 1; // Reduce size on iOS by 20%
const fontScale = OS === 'ios' ? 0.9 : 1; // Reduce font size on iOS by 10%

const API_BASE_URL = 'http://192.168.0.95:8000/api/v1/mobile';

interface PlanModeData {
  id: string;
  title: string;
  description: string;
  image: string;
  gradient: [string, string];
  selected?: boolean;
}

interface WeeklyPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface ShoppingListItem {
  ingredient: string;
  quantity: string;
  category?: string;
  checked?: boolean;
  emoji?: string;
}

export default function HomeScreen() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<WeeklyPlan[] | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState('Beautiful');
  const [showSplash, setShowSplash] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('home');
  
  // New state for component navigation
  const [showLogin, setShowLogin] = useState(false);
  const [showPlanMode, setShowPlanMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSelectedMenu, setShowSelectedMenu] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const [showFavoriteMenu, setShowFavoriteMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start with login required
  
  
  const planModes: PlanModeData[] = [
    {
      id: 'diet_health',
      title: 'Diet & Health',
      description: 'Prioritizes nutritional goals and healthy eating.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaOg5RziT9w_V4wlcMr4oPfvPHMuL8cU56wKFRgxcf1yJ-Esrl-uPyYS5-xNGjRVRFu_7jX7-4XKW-nCq1w1RXHP_rHvGpLLkwDQjvlEs9pMoExv7lnZsIqzzcfQi2Vf1tbqiI8IEjWDquDDj-tfL-1DobzabQZxN9rd2d-LeIeoxD4oBBmo4mcIw2XITqmcZVZmbrKkrI1sB0X5S8eXnX2QxrSLCUMw1lBD97un-TNbjb2INh2KvKdnBjSllyfgug8m-n3vnuL-ez',
      gradient: ['#38e07b', '#22c55e']
    },
    {
      id: 'taste_satisfaction',
      title: 'Taste & Satisfaction',
      description: 'Focuses on flavorful and enjoyable meal experiences.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAx5xPNlkSbWWu9d3v5wFEMqISovKmaqqqkpko4IDVzuS2egkbOBFbeGRGNEpyZ6aEa3NlKbjdWA7m_vuNTSc4w9VudTjGn8zpPMmouqhj4Bfe5DoeefW9hx5Ru44fXIBxgWx_v3qRdY2fi16b4JUeq4U5ddUT9osmx5h6oU0Zn5BShq_9tHX12aoLOSlcaokCnlKu_2ZhYx7jKYN7PYTTTXKBZvapGuVpP7bjwhGtDdmuKUPvF10QM-72X5-MenmIUtxx1JOKjdlK',
      gradient: ['#f59e0b', '#f97316']
    },
    {
      id: 'budget_friendly',
      title: 'Budget Friendly',
      description: 'Generates cost-effective meal plans to help you save.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaukLgPSWZq6ULELdDIPVI6EDxJzcIM758cRS6E-ao5pKPsDhnHja2O3rlf5g4FUbmZJolB8_vSNjxh2aS_S0d_r7hrdbC1Rv5lIl39S4EOAleXA38QAjXuZgv42TAJkbgJB46N-S2g28gJLpR9MNZosGB52cUkj0ZjKcKz6aUic0RDiN6Z2WeR_R44F5iAocaSnbIxP7dddEvVQQAUgWBv9xYbBDXBzNBhFjxAxyWIcrIdIRzvSE8PeCTVsTrGSq1cnQTCz6fgVN7',
      gradient: ['#3b82f6', '#2563eb']
    }
  ];

  const toggleItemCheck = (index: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedItems(newCheckedItems);
  };

  const categorizeShoppingList = (items: ShoppingListItem[]) => {
    const categories = {
      '🥕 Fresh Produce': [] as ShoppingListItem[],
      '🥛 Proteins': [] as ShoppingListItem[],
      '🥛 Dairy & Eggs': [] as ShoppingListItem[],
      '🌾 Pantry Staples': [] as ShoppingListItem[],
      '🧋 Frozen': [] as ShoppingListItem[],
      '🥫 Other': [] as ShoppingListItem[]
    };

    items?.forEach(item => {
      const ingredient = item.ingredient.toLowerCase();
      if (ingredient.includes('lettuce') || ingredient.includes('tomato') || ingredient.includes('onion') || 
          ingredient.includes('carrot') || ingredient.includes('bell pepper') || ingredient.includes('cucumber') ||
          ingredient.includes('spinach') || ingredient.includes('herbs') || ingredient.includes('fruit')) {
        categories['🥕 Fresh Produce'].push({...item, emoji: '🥕'});
      } else if (ingredient.includes('chicken') || ingredient.includes('beef') || ingredient.includes('fish') || 
                 ingredient.includes('salmon') || ingredient.includes('turkey') || ingredient.includes('pork')) {
        categories['🥛 Proteins'].push({...item, emoji: '🍖'});
      } else if (ingredient.includes('milk') || ingredient.includes('cheese') || ingredient.includes('yogurt') || 
                 ingredient.includes('butter') || ingredient.includes('eggs')) {
        categories['🥛 Dairy & Eggs'].push({...item, emoji: '🥛'});
      } else if (ingredient.includes('rice') || ingredient.includes('pasta') || ingredient.includes('bread') || 
                 ingredient.includes('flour') || ingredient.includes('oil') || ingredient.includes('spices')) {
        categories['🌾 Pantry Staples'].push({...item, emoji: '🌾'});
      } else if (ingredient.includes('frozen')) {
        categories['🧋 Frozen'].push({...item, emoji: '🧋'});
      } else {
        categories['🥫 Other'].push({...item, emoji: '🛍️'});
      }
    });

    return categories;
  };

  const generateMealPlan = async (mode: string) => {
    setLoading(true);
    setError(null);
    
    // Map frontend mode IDs to backend expected modes
    const modeMap: Record<string, string> = {
      'diet_health': 'Diet',
      'taste_satisfaction': 'Satisfaction', 
      'budget_friendly': 'Economic'
    };
    
    const backendMode = modeMap[mode] || mode;
    
    try {
      // Try API call first
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: backendMode,
          preferences: {
            people_count: 2,
            dietary_restrictions: 'none'
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedPlan(data.data.weekly_plan);
        setShoppingList(data.data.shopping_list);
        // Show the selected menu page after successful generation
        setShowSelectedMenu(true);
      } else {
        setError(data.message || 'Failed to generate meal plan');
      }
    } catch (err) {
      // Use mock data if API fails
      console.log('API unavailable, using mock data');
      const mockWeeklyPlan: WeeklyPlan[] = [
        {
          day: 'Monday',
          breakfast: 'Avocado Toast with Egg',
          lunch: 'Grilled Chicken Salad',
          dinner: 'Salmon with Roasted Vegetables'
        },
        {
          day: 'Tuesday',
          breakfast: 'Greek Yogurt Parfait',
          lunch: 'Turkey Wrap',
          dinner: 'Pasta with Meatballs'
        },
        {
          day: 'Wednesday',
          breakfast: 'Oatmeal with Berries',
          lunch: 'Quinoa Buddha Bowl',
          dinner: 'Grilled Steak with Sweet Potato'
        },
        {
          day: 'Thursday',
          breakfast: 'Smoothie Bowl',
          lunch: 'Chicken Caesar Salad',
          dinner: 'Vegetable Stir Fry'
        },
        {
          day: 'Friday',
          breakfast: 'Whole Wheat Pancakes',
          lunch: 'Tuna Sandwich',
          dinner: 'Homemade Pizza'
        },
        {
          day: 'Saturday',
          breakfast: 'Eggs Benedict',
          lunch: 'Club Sandwich',
          dinner: 'BBQ Chicken Ribs'
        },
        {
          day: 'Sunday',
          breakfast: 'French Toast',
          lunch: 'French Onion Soup',
          dinner: 'Roast Chicken Dinner'
        }
      ];

      const mockShoppingList: ShoppingListItem[] = [
        { ingredient: 'Avocados', quantity: '2', category: 'Produce' },
        { ingredient: 'Eggs', quantity: '1 dozen', category: 'Dairy' },
        { ingredient: 'Whole Wheat Bread', quantity: '1 loaf', category: 'Bakery' },
        { ingredient: 'Chicken Breast', quantity: '2 lbs', category: 'Protein' },
        { ingredient: 'Mixed Greens', quantity: '1 bag', category: 'Produce' },
        { ingredient: 'Cherry Tomatoes', quantity: '1 pint', category: 'Produce' },
        { ingredient: 'Cucumber', quantity: '2', category: 'Produce' },
        { ingredient: 'Salmon Fillet', quantity: '1 lb', category: 'Protein' },
        { ingredient: 'Broccoli', quantity: '1 head', category: 'Produce' },
        { ingredient: 'Bell Peppers', quantity: '3', category: 'Produce' },
        { ingredient: 'Olive Oil', quantity: '1 bottle', category: 'Pantry' },
        { ingredient: 'Greek Yogurt', quantity: '1 tub', category: 'Dairy' },
        { ingredient: 'Granola', quantity: '1 bag', category: 'Pantry' },
        { ingredient: 'Honey', quantity: '1 jar', category: 'Pantry' }
      ];

      setGeneratedPlan(mockWeeklyPlan);
      setShoppingList(mockShoppingList);
      setShowSelectedMenu(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    generateMealPlan(modeId);
  };

  const resetToModeSelection = () => {
    setSelectedMode(null);
    setGeneratedPlan(null);
    setShoppingList(null);
    setError(null);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setSelectedMode(null);
    setGeneratedPlan(null);
    setShoppingList(null);
    setError(null);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Navigation handlers for the separate components
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    // Show plan selection immediately after login
    setShowPlanMode(true);
    // Reset state
    setSelectedMode(null);
    setGeneratedPlan(null);
    setShoppingList(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    setActiveTab('home');
  };

  const handleBackFromPlanMode = () => {
    setShowPlanMode(false);
  };

  const handleBackFromProfile = () => {
    setShowProfile(false);
  };

  const handlePlanModeSelect = (selectedMode: any) => {
    setSelectedMode(selectedMode.id);
    setShowPlanMode(false);
    generateMealPlan(selectedMode.id);
  };

  // Navigation handlers for other components
  const handleBackFromSelectedMenu = () => {
    setShowSelectedMenu(false);
  };

  const handleBackFromShoppingList = () => {
    setShowShoppingList(false);
  };

  const handleBackFromWeeklyMenu = () => {
    setShowWeeklyMenu(false);
  };

  const handleBackFromFavoriteMenu = () => {
    setShowFavoriteMenu(false);
  };

  // Show menu handlers
  const handleShowSelectedMenu = () => {
    setShowSelectedMenu(true);
  };

  const handleShowShoppingList = () => {
    setShowShoppingList(true);
  };

  const handleShowWeeklyMenu = () => {
    setShowWeeklyMenu(true);
  };

  const handleShowFavoriteMenu = () => {
    setShowFavoriteMenu(true);
  };

  const PlanModeCard = ({ mode, index }: { mode: PlanModeData; index: number }) => (
    <TouchableOpacity
      key={mode.id}
      onPress={() => handleModeSelect(mode.id)}
      disabled={loading}
      style={[
        styles.templateCard,
        selectedMode === mode.id && styles.templateCardSelected,
        {
          opacity: loading ? 0.7 : 1,
          transform: [{ scale: loading ? 0.96 : 1 }],
        }
      ]}
    >
      {mode.image && (
        <Image
          source={{ uri: mode.image }}
          style={styles.templateCardImage}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={mode.gradient}
        style={styles.templateCardOverlay}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <View style={styles.templateCardContent}>
          <Text style={styles.templateCardTitle}>{mode.title}</Text>
          <Text style={styles.templateCardDescription}>{mode.description}</Text>
          <View style={styles.templateButtonContainer}>
            <TouchableOpacity 
              style={[
                styles.templateSelectButton,
                selectedMode === mode.id && styles.templateSelectButtonSelected
              ]}
              onPress={() => handleModeSelect(mode.id)}
            >
              <Text style={[
                styles.templateSelectButtonText,
                selectedMode === mode.id && styles.templateSelectButtonTextSelected
              ]}>
                {selectedMode === mode.id ? 'Selected' : 'Select'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const LoadingScreen = () => (
    <View style={styles.centeredContainer}>
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['rgba(0, 162, 237, 0.1)', 'rgba(0, 136, 204, 0.15)']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#00a2ed" />
        </LinearGradient>
      </View>
      <Text style={styles.loadingTitle}>Generating Meal Plan</Text>
      <Text style={styles.loadingSubtitle}>Please wait while we create your personalized plan</Text>
      
      <View style={styles.loadingDots}>
        <View style={[styles.dot, { backgroundColor: '#00a2ed' }]} />
        <View style={[styles.dot, { backgroundColor: '#0088cc', animationDelay: '0.2s' }]} />
        <View style={[styles.dot, { backgroundColor: '#006bb3', animationDelay: '0.4s' }]} />
      </View>
    </View>
  );

  const ErrorScreen = () => (
    <View style={styles.centeredContainer}>
      <View style={styles.errorContainer}>
        <View style={styles.errorIcon}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
        </View>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={resetToModeSelection}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CelebrationEmojis = () => (
    <View style={styles.celebrationContainer}>
      <Ionicons name="checkmark-circle" size={24} color="#00a2ed" />
    </View>
  );

  // Removed - replaced with mobile banner

  const MobileDayCard = ({ day, dayIndex }: { day: WeeklyPlan; dayIndex: number }) => {
    const meals = [
      { type: 'breakfast', meal: day.breakfast, icon: 'sunny-outline', emoji: '🌅', time: '7:00 AM' },
      { type: 'lunch', meal: day.lunch, icon: 'restaurant-outline', emoji: '🍽️', time: '12:30 PM' },
      { type: 'dinner', meal: day.dinner, icon: 'moon-outline', emoji: '🌙', time: '7:00 PM' }
    ];

    return (
      <View style={styles.mobileDayCard}>
        <View style={styles.dayCardHeader}>
          <View style={styles.dayInfo}>
            <Text style={styles.mobileDayTitle}>{day.day}</Text>
            <Text style={styles.mobileDaySubtitle}>Today's Menu</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.mealsList}>
          {meals.map((mealData, index) => (
            <TouchableOpacity key={mealData.type} style={styles.dayMealRow}>
              <View style={styles.mealTimeContainer}>
                <Text style={styles.mealTime}>{mealData.time}</Text>
                <View style={styles.timeLine} />
              </View>
              
              <View style={styles.mealCard}>
                <View style={styles.mealCardHeader}>
                  <View style={styles.mealIconRow}>
                    <Text style={styles.mealEmoji}>{mealData.emoji}</Text>
                    <Text style={styles.mealType}>{mealData.type.charAt(0).toUpperCase() + mealData.type.slice(1)}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.heartButton}
                    onPress={() => {
                      const key = `${day.day}-${mealData.type}`;
                      const newFavorites = new Set(favoriteItems);
                      if (newFavorites.has(key)) {
                        newFavorites.delete(key);
                      } else {
                        newFavorites.add(key);
                      }
                      setFavoriteItems(newFavorites);
                    }}
                  >
                    <Ionicons 
                      name={favoriteItems.has(`${day.day}-${mealData.type}`) ? "heart" : "heart-outline"} 
                      size={20} 
                      color={favoriteItems.has(`${day.day}-${mealData.type}`) ? "#ef4444" : "#9ca3af"} 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.mealDescription}>{mealData.meal}</Text>
                <View style={styles.mealActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="add-outline" size={16} color="#667eea" />
                    <Text style={styles.actionButtonText}>Add to Plan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const TemplateDaySection = ({ day, dayIndex }: { day: WeeklyPlan; dayIndex: number }) => {
    const meals = [
      { 
        type: 'breakfast', 
        meal: day.breakfast, 
        emoji: '🥑', 
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIyN4C4neKWgZwHxY0C9G63qCsKhPzaSDSIZqn1CCeOXYAZawiwyWu3GzWn6AxZ5yogHB5XxWj6QnxMResKqmdm0YKgzQRmhdPG4FSCxYWe3kP36qh4KHNLssccEF-O-hGB_9QwYdehXD-j3C-zrxZkBUeg-qkgxF5DE5IpyoF4rfvYrhz3ZI7C_LgR2N9AdaPKFuhufNzTN8r8A8WNgbJer9kORgz46d9IzjkD-duj3LjIkNR05xiM4tmoB8M6va79Gt1yLxIKuWx',
        description: 'A healthy and quick breakfast option.',
        ingredients: 'Avocado, egg, whole-wheat bread, salt, pepper.'
      },
      { 
        type: 'lunch', 
        meal: day.lunch, 
        emoji: '🥗', 
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmuvZco8ev-noSac-L6ZkDfTNgCpAn1qNSOJfb-wDPPkRpOjbj4BKqn9sbakCYo8ajG7ifNGvmWVlCo4ZvYPgldBkc3LVDID1A5IV7qSxSgdCLQTgm9coODWR2TeO_dcMlldHy73I9tgGuf2qmbeoz0deuzl1U0LAMz6mzk9rJaMC-CIrbMwQfNSv-49UJEpfPQnDju_1IUr2Z2pqF9F4oHtC4ubx1nmzuEqowC4eXVwD5_Xg6V58pXgM4u2vJiLm8H60uaqukLjG',
        description: 'A light and protein-rich salad.',
        ingredients: 'Quinoa, grilled chicken, cucumber, tomatoes, lemon vinaigrette.'
      },
      { 
        type: 'dinner', 
        meal: day.dinner, 
        emoji: '🐟', 
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2eVGaWbte2gFS_pBWSR6fz5avyekicVb6K5brRzW4L0-uiK-3E5p3fQX2eHPfXTH55ZHquAuxjxa4jovhcXYVQuvmHth5Vt2XSSDWQatGJ0E_oTjyIrGtf7PhSntCrxR3j6U9ZprQNMj8iO4X8si1RVQCD2eDi0tCHQjLO26BnNy2BvhASZgGwHL5AIqYkRiO75o07b4UF8_vN27bKVDO6Zm3Chryo3i92g5ftIM4x9bZs34fZzIFkur75VHpvJz8ckkkWojeY_l3',
        description: 'A flavorful and balanced meal.',
        ingredients: 'Salmon fillet, broccoli, bell peppers, olive oil, herbs.'
      }
    ];

    return (
      <View style={styles.templateDaySection}>
        <Text style={styles.templateDayTitle}>{day.day}</Text>
        <View style={styles.templateMealsContainer}>
          {meals.map((mealData, index) => (
            <View key={index} style={styles.templateMealCard}>
              <View style={styles.templateMealImageContainer}>
                <Image
                  source={{ uri: mealData.image }}
                  style={styles.templateMealImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.templateMealContent}>
                <Text style={styles.templateMealTitle}>{mealData.meal}</Text>
                <Text style={styles.templateMealDescription}>
                  {mealData.type.charAt(0).toUpperCase() + mealData.type.slice(1)} - {mealData.description}
                </Text>
                <Text style={styles.templateMealIngredients}>
                  Key Ingredients: {mealData.ingredients}
                </Text>
              </View>
              <TouchableOpacity style={styles.templateViewRecipeButton}>
                <Text style={styles.templateViewRecipeButtonText}>Quick View Recipe</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const ModernShoppingListCard = () => {
    const categorizedItems = categorizeShoppingList(shoppingList || []);
    const totalItems = shoppingList?.length || 0;
    const checkedCount = checkedItems.size;
    const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

    return (
      <View style={styles.modernShoppingContainer}>
        {/* Quick Actions Bar */}
        <View style={styles.quickActionsBar}>
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.quickActionGradient}>
              <Ionicons name="checkmark-done" size={18} color="white" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Mark All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.quickActionGradient}>
              <Ionicons name="share" size={18} color="white" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Share List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.quickActionGradient}>
              <Ionicons name="map" size={18} color="white" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Store Map</Text>
          </TouchableOpacity>
        </View>

        {/* Modern Category Cards */}
        <View style={styles.modernCategoriesContainer}>
          {Object.entries(categorizedItems).map(([category, items], categoryIndex) => {
            if (items.length === 0) return null;
            
            const categoryData = {
              '🥕 Fresh Produce': { gradient: ['#22c55e', '#16a34a'], bgColor: 'rgba(34, 197, 94, 0.1)' },
              '🥛 Proteins': { gradient: ['#ef4444', '#dc2626'], bgColor: 'rgba(239, 68, 68, 0.1)' },
              '🥛 Dairy & Eggs': { gradient: ['#3b82f6', '#2563eb'], bgColor: 'rgba(59, 130, 246, 0.1)' },
              '🌾 Pantry Staples': { gradient: ['#f59e0b', '#d97706'], bgColor: 'rgba(245, 158, 11, 0.1)' },
              '🧋 Frozen': { gradient: ['#06b6d4', '#0891b2'], bgColor: 'rgba(6, 182, 212, 0.1)' },
              '🥫 Other': { gradient: ['#8b5cf6', '#7c3aed'], bgColor: 'rgba(139, 92, 246, 0.1)' }
            };
            
            const catData = categoryData[category as keyof typeof categoryData] || categoryData['🥫 Other'];
            const completedInCategory = items.filter(item => {
              const globalIndex = (shoppingList || []).findIndex(i => i.ingredient === item.ingredient);
              return checkedItems.has(globalIndex);
            }).length;
            
            return (
              <View key={category} style={styles.modernCategoryCard}>
                <View style={styles.modernCategoryHeader}>
                  <LinearGradient colors={catData.gradient as unknown as readonly [string, string]} style={styles.modernCategoryIcon}>
                    <Text style={styles.modernCategoryEmoji}>{category.charAt(0)}</Text>
                  </LinearGradient>
                  <View style={styles.modernCategoryInfo}>
                    <Text style={styles.modernCategoryTitle}>{category.replace(/^[^\s]+\s/, '')}</Text>
                    <View style={styles.modernCategoryMeta}>
                      <Text style={styles.modernCategoryCount}>{items.length} items</Text>
                      <View style={styles.categoryProgressDot} />
                      <Text style={styles.modernCategoryProgress}>{completedInCategory}/{items.length} done</Text>
                    </View>
                  </View>
                  <View style={[{ backgroundColor: catData.bgColor, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }]}>
                    <Text style={styles.categoryProgressText}>{Math.round((completedInCategory / items.length) * 100)}%</Text>
                  </View>
                </View>
                
                <View style={styles.modernItemsList}>
                  {items.map((item, index) => {
                    const globalIndex = (shoppingList || []).findIndex(i => i.ingredient === item.ingredient);
                    const isChecked = checkedItems.has(globalIndex);
                    return (
                      <TouchableOpacity 
                        key={index} 
                        style={[styles.modernShoppingItem, isChecked && styles.modernCheckedItem]}
                        onPress={() => toggleItemCheck(globalIndex)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.modernCheckboxContainer}>
                          <View style={[styles.modernCheckbox, isChecked && styles.modernCheckedBox]}>
                            {isChecked && (
                              <LinearGradient colors={['#10b981', '#059669']} style={styles.checkmarkGradient}>
                                <Ionicons name="checkmark" size={14} color="white" />
                              </LinearGradient>
                            )}
                          </View>
                        </View>
                        
                        <View style={styles.modernItemContent}>
                          <View style={styles.modernItemHeader}>
                            <Text style={[styles.modernItemName, isChecked && styles.modernCheckedText]}>
                              {item.ingredient}
                            </Text>
                            <TouchableOpacity style={styles.modernItemAction}>
                              <Ionicons name="ellipsis-horizontal" size={16} color="#9ca3af" />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.modernItemFooter}>
                            <Text style={[styles.modernItemQuantity, isChecked && styles.modernCheckedText]}>
                              {item.quantity}
                            </Text>
                            {isChecked && (
                              <View style={styles.completedBadge}>
                                <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                                <Text style={styles.completedText}>Done</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Modern Shopping Summary */}
        <View style={styles.modernShoppingSummary}>
          <LinearGradient colors={['#f8fafc', '#f1f5f9']} style={styles.summaryGradient}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>{totalItems}</Text>
                  <Text style={styles.summaryStatLabel}>Total Items</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>{checkedCount}</Text>
                  <Text style={styles.summaryStatLabel}>Completed</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>{totalItems - checkedCount}</Text>
                  <Text style={styles.summaryStatLabel}>Remaining</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.summaryActionButton}>
                <LinearGradient colors={['#38e07b', '#22c55e']} style={styles.summaryActionGradient}>
                  <Ionicons name="car" size={18} color="white" />
                  <Text style={styles.summaryActionText}>Navigate to Store</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => {
      setShowSplash(false);
      // Show login screen after splash
      setShowLogin(true);
    }} />;
  }

  // Show Login Screen if not authenticated
  if (!isAuthenticated || showLogin) {
    return (
      <LoginScreen
        onLogin={handleLoginSuccess}
        onSignUp={() => {}}
      />
    );
  }

  // Show Plan Mode Selection
  if (showPlanMode) {
    return (
      <PlanModeSelection
        onBack={handleBackFromPlanMode}
        onPlanSelect={handlePlanModeSelect}
      />
    );
  }

  // Show Profile Page
  if (showProfile) {
    return (
      <ProfilePage
        onBack={handleBackFromProfile}
        onEditProfile={() => {}}
        onDietaryRestrictions={() => {}}
        onUnitsOfMeasurement={() => {}}
        onChangePassword={() => {}}
        onLogOut={handleLogout}
        onDeleteAccount={() => {}}
      />
    );
  }

  // Show Selected Menu Page
  if (showSelectedMenu) {
    return (
      <SelectedMenuPage
        onBack={handleBackFromSelectedMenu}
        planData={generatedPlan || undefined}
        onShare={() => {}}
        onRegenerate={() => {
          if (selectedMode) {
            generateMealPlan(selectedMode);
          }
        }}
        onSavePlan={() => {
          // Handle save plan
          Alert.alert('Success', 'Plan saved successfully!');
        }}
      />
    );
  }

  // Show Shopping List
  if (showShoppingList) {
    return (
      <ShoppingListView
        onBack={handleBackFromShoppingList}
        onShare={() => {}}
        onAddItem={() => {}}
      />
    );
  }

  // Show Weekly Menu
  if (showWeeklyMenu) {
    return (
      <WeeklyMenuView
        onBack={handleBackFromWeeklyMenu}
        onBrowseRecipes={() => {}}
        onGenerateNew={() => {}}
        onViewRecipe={() => {}}
        weeklyPlan={generatedPlan || undefined}
      />
    );
  }

  // Show Favorite Menu
  if (showFavoriteMenu) {
    return (
      <FavoriteMenuPage
        onBack={handleBackFromFavoriteMenu}
        onSort={() => {}}
        onPlanSelect={() => {}}
      />
    );
  }

  const BottomTabNavigation = () => {
    const tabs = [
      { id: 'home', icon: 'home', activeIcon: 'home', label: 'Home' },
      { id: 'plans', icon: 'calendar-outline', activeIcon: 'calendar', label: 'My Plans' },
      { id: 'favorites', icon: 'heart-outline', activeIcon: 'heart', label: 'Favorites' },
      { id: 'shopping', icon: 'bag-outline', activeIcon: 'bag', label: 'Shopping' },
      { id: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' }
    ];

    return (
      <View style={styles.bottomTabContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.98)']}
          style={styles.bottomTabGradient}
        >
          <View style={styles.bottomTabContent}>
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.tabButton}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.tabIconContainer, isActive && styles.activeTabIconContainer]}>
                    {isActive && (
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.activeTabBackground}
                      />
                    )}
                    <Ionicons
                      name={isActive ? tab.activeIcon as any : tab.icon as any}
                      size={22}
                      color={isActive ? 'white' : '#9ca3af'}
                    />
                  </View>
                  <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                    {tab.label}
                  </Text>
                  {tab.id === 'shopping' && shoppingList && shoppingList.length > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{shoppingList.length}</Text>
                    </View>
                  )}
                  {tab.id === 'favorites' && favoriteItems.size > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{favoriteItems.size}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'plans':
        return <WeeklyMenuView 
          onBack={() => setActiveTab('home')} 
          onBrowseRecipes={() => {}} 
          onGenerateNew={() => {}} 
          onViewRecipe={() => {}}
          weeklyPlan={generatedPlan || undefined}
        />;
      
      case 'favorites':
        return <FavoriteMenuPage 
          onBack={() => setActiveTab('home')}
          onSort={() => {}}
          onPlanSelect={() => {}}
        />;
      
      case 'shopping':
        return <ShoppingListView 
          onBack={() => setActiveTab('home')}
          onShare={() => {}}
          onAddItem={() => {}}
        />;
      
      case 'profile':
        return <ProfilePage 
          onBack={() => setActiveTab('home')}
          onEditProfile={() => {}}
          onDietaryRestrictions={() => {}}
          onUnitsOfMeasurement={() => {}}
          onChangePassword={() => {}}
          onLogOut={() => {}}
          onDeleteAccount={() => {}}
        />;
      
      default:
        // Home content (existing)
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      

      {/* MOBILE NATIVE TAB SYSTEM - FULL SCREEN EXPERIENCE */}
      {activeTab === 'home' && (
        <ScrollView
          style={styles.fullScreenScroll}
          contentContainerStyle={styles.homeContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38e07b" />
          }
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
        >
        {!selectedMode && (
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Welcome to Your Meal Plan</Text>
            <Text style={styles.heroSubtitle}>
              Select a plan mode to get started
            </Text>
            
            <TouchableOpacity 
              style={styles.showPlanModeButton}
              onPress={() => setShowPlanMode(true)}
            >
              <LinearGradient 
                colors={['#38e07b', '#22c55e']} 
                style={styles.showPlanModeGradient}
              >
                <Ionicons name="grid" size={20} color="white" />
                <Text style={styles.showPlanModeText}>Select Plan Mode</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Template-Based Mode Selection */}
        {!selectedMode && (
          <View style={styles.templateModesContainer}>
            <View style={styles.templateHeader}>
              <TouchableOpacity style={styles.templateBackButton}>
                <Ionicons name="arrow-back" size={24} color="#1f2937" />
              </TouchableOpacity>
              <Text style={styles.templateHeaderTitle}>Curated Gallery</Text>
              <View style={styles.templateHeaderSpacer} />
            </View>
            <View style={styles.templateCardsContainer}>
              {planModes.map((mode, index) => (
                <PlanModeCard key={mode.id} mode={mode} index={index} />
              ))}
            </View>
            {selectedMode && (
              <View style={styles.templateContinueContainer}>
                <TouchableOpacity 
                  style={styles.templateContinueButton}
                  onPress={() => generateMealPlan(selectedMode!)}
                >
                  <Text style={styles.templateContinueButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Loading State */}
        {loading && <LoadingScreen />}

        {/* Error State */}
        {error && <ErrorScreen />}

        {/* Generated Plan - Mobile Native Design */}
        {generatedPlan && !loading && (
          <View style={styles.mobileContainer}>
            {/* Mobile Header */}
            <View style={styles.mobileHeader}>
              <TouchableOpacity style={styles.backButton} onPress={resetToModeSelection}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.mobileHeaderTitle}>Your Plan</Text>
                <Text style={styles.mobileHeaderSubtitle}>7 days • 21 meals</Text>
              </View>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Success Banner - Mobile Style */}
            <View style={styles.mobileBanner}>
              <LinearGradient 
                colors={['#667eea', '#764ba2']} 
                style={styles.bannerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.bannerContent}>
                  <Ionicons name="checkmark-circle" size={28} color="white" />
                  <View style={styles.bannerText}>
                    <Text style={styles.bannerTitle}>Perfect! ✨</Text>
                    <Text style={styles.bannerSubtitle}>Your personalized meal plan is ready</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Days Stories - Instagram Style */}
            <View style={styles.storiesContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesScroll}
              >
                {generatedPlan.map((day, index) => (
                  <TouchableOpacity key={day.day} style={styles.storyItem}>
                    <LinearGradient
                      colors={index === 0 ? ['#667eea', '#764ba2'] : ['#e5e7eb', '#f3f4f6']}
                      style={styles.storyCircle}
                    >
                      <Text style={[styles.storyDay, { color: index === 0 ? 'white' : '#374151' }]}>
                        {day.day.slice(0, 3)}
                      </Text>
                    </LinearGradient>
                    <Text style={styles.storyLabel}>{day.day}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Current Day Detail - Mobile Card */}
            <View style={styles.currentDayContainer}>
              <MobileDayCard day={generatedPlan[0]} dayIndex={0} />
            </View>

            {/* Quick Actions */}
            {/* Mobile Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => generateMealPlan(selectedMode!)}
                disabled={loading}
              >
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.actionGradient}>
                  <Ionicons name="refresh" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.actionText}>Generate New Plan</Text>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={handleShowShoppingList}
              >
                <LinearGradient colors={['#10b981', '#059669']} style={styles.actionGradient}>
                  <Ionicons name="basket" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.actionText}>Shopping List</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{shoppingList?.length || 0}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={handleShowWeeklyMenu}
              >
                <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.actionGradient}>
                  <Ionicons name="calendar" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.actionText}>Weekly Menu</Text>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Clean Mobile Footer - No ugly bottom sheet */}
          </View>
        )}
        </ScrollView>
      )}
      
      {/* FULL SCREEN TAB PAGES - MOBILE NATIVE LAYOUT */}
      {activeTab !== 'home' && (
        <View style={styles.fullScreenTab}>
          {renderTabContent()}
        </View>
      )}
      
      {/* Bottom Tab Navigation */}
      <BottomTabNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7',
  },
  
  // TEMPLATE-BASED PLAN MODE SELECTION STYLES
  templateModesContainer: {
    flex: 1,
    backgroundColor: '#f6f8f7',
  },
  
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 8,
    paddingBottom: 8,
    backgroundColor: '#f6f8f7',
  },
  
  templateBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  templateHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.015,
  },
  
  templateHeaderSpacer: {
    width: 40,
  },
  
  templateCardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  
  templateCard: {
    position: 'relative',
    width: '100%',
    height: 192 * scale,
    borderRadius: 24 * scale,
    overflow: 'hidden',
    borderWidth: 4 * scale,
    borderColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 * scale },
    shadowOpacity: 0.1,
    shadowRadius: 8 * scale,
    elevation: 4,
  },
  
  templateCardSelected: {
    borderColor: '#38e07b',
  },
  
  templateCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  
  templateCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'flex-end',
  },
  
  templateCardContent: {
    gap: 8,
  },
  
  templateCardTitle: {
    fontSize: 20 * fontScale,
    fontWeight: '700',
    color: 'white',
    lineHeight: 24 * fontScale,
    letterSpacing: -0.3 * fontScale,
  },
  
  templateCardDescription: {
    fontSize: 14 * fontScale,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20 * fontScale,
    marginBottom: 4 * scale,
  },
  
  templateButtonContainer: {
    marginTop: 12,
  },
  
  templateSelectButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  
  templateSelectButtonSelected: {
    backgroundColor: '#38e07b',
  },
  
  templateSelectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  templateSelectButtonTextSelected: {
    color: '#122017',
  },
  
  templateContinueContainer: {
    padding: 16,
    marginTop: 'auto',
  },
  
  templateContinueButton: {
    backgroundColor: '#38e07b',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(56, 224, 123, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  templateContinueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#122017',
    letterSpacing: 0.015,
  },
  
  // TEMPLATE RECIPE BOOK STYLES
  templateRecipeContainer: {
    flex: 1,
    backgroundColor: '#f6f8f7',
  },
  
  templateRecipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 8,
    paddingBottom: 8,
    backgroundColor: '#f6f8f7',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  
  templateRecipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.015,
  },
  
  templateActionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  
  templateBrowseButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  templateBrowseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.015,
  },
  
  templateGenerateButton: {
    flex: 1,
    backgroundColor: '#38e07b',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  templateGenerateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#122017',
    letterSpacing: 0.015,
  },
  
  templateRecipeScroll: {
    flex: 1,
  },
  
  templateRecipeScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  
  templateDaySection: {
    marginBottom: 32,
  },
  
  templateDayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    paddingVertical: 16,
    letterSpacing: -0.015,
  },
  
  templateMealsContainer: {
    gap: 16,
  },
  
  templateMealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    gap: 16,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  
  templateMealImageContainer: {
    width: '100%',
    height: 192,
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  templateMealImage: {
    width: '100%',
    height: '100%',
  },
  
  templateMealContent: {
    gap: 4,
  },
  
  templateMealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 20,
  },
  
  templateMealDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6b7280',
    lineHeight: 20,
  },
  
  templateMealIngredients: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6b7280',
    lineHeight: 20,
  },
  
  templateViewRecipeButton: {
    backgroundColor: '#38e07b',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  templateViewRecipeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#122017',
    letterSpacing: 0.015,
  },
  
  // Mobile Native Styles
  mobileContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  mobileHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
  },
  
  mobileHeaderSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  mobileBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  
  bannerGradient: {
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  bannerText: {
    marginLeft: 16,
    flex: 1,
  },
  
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  
  storiesContainer: {
    marginBottom: 24,
  },
  
  storiesScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  
  storyItem: {
    alignItems: 'center',
  },
  
  storyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  storyDay: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  storyLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  currentDayContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  
  mobileDayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  dayInfo: {
    flex: 1,
  },
  
  mobileDayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  
  mobileDaySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  mealsList: {
    gap: 16,
  },
  
  dayMealRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  mealTimeContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  
  mealTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  
  timeLine: {
    width: 2,
    height: 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 1,
  },
  
  mealCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  
  mealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  mealIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  mealEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  heartButton: {
    padding: 4,
  },
  
  mealDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  
  mealActions: {
    flexDirection: 'row',
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 4,
  },
  
  quickActions: {
    paddingHorizontal: 20,
    gap: 12,
  },
  
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  
  actionGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
  
  // Bottom Tab Navigation Styles - ALWAYS ON TOP
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  
  bottomTabGradient: {
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.8)',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  
  bottomTabContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
    position: 'relative',
  },
  
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  
  activeTabIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  
  activeTabBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  
  activeTabLabel: {
    color: '#667eea',
    fontWeight: '600',
  },
  
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'white',
  },
  
  // Tab Content Styles - MOBILE NATIVE FULL SCREEN
  tabContentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  tabHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  
  tabHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  
  tabHeaderSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  tabScrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    flex: 1,
  },
  
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  
  createButton: {
    alignSelf: 'center',
  },
  
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  
  // Favorites Tab Styles
  favoritesList: {
    paddingTop: 20,
  },
  
  favoriteItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  favoriteDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  favoriteMealType: {
    fontSize: 14,
    color: '#9ca3af',
    textTransform: 'capitalize',
    flex: 1,
    marginLeft: 12,
  },
  
  // Profile Tab Styles
  profileSection: {
    paddingTop: 20,
  },
  
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  profileInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  
  profileInfo: {
    flex: 1,
  },
  
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  
  settingsSection: {
    gap: 4,
  },
  
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  settingContent: {
    flex: 1,
  },
  
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  
  settingSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  
  // MOBILE SCROLL CONTENT - PROPER BOTTOM PADDING FOR TABS
  tabScrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 140 : 120,
    flexGrow: 1,
  },
  header: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 20,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 139, 247, 0.12)',
    borderWidth: 0,
    shadowColor: 'rgba(0, 139, 247, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.8,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 139, 247, 0.1)',
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    shadowColor: 'rgba(0, 139, 247, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
  
  // MOBILE NATIVE LAYOUT SYSTEM - FULL SCREEN TABS
  fullScreenScroll: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  homeContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 140 : 120,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  
  fullScreenTab: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 139, 247, 0.08)',
    borderWidth: 0,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: 'rgba(0, 139, 247, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  aiText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#008BF7',
    marginLeft: 6,
    letterSpacing: 0.1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  showPlanModeButton: {
    marginTop: 32,
    alignSelf: 'center',
  },
  showPlanModeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: 'rgba(56, 224, 123, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 12,
  },
  showPlanModeText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  modesContainer: {
    gap: 12,
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    marginHorizontal: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    padding: 20,
    minHeight: 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  textContainer: {
    flex: 1,
  },
  modeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  modeDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 8,
    paddingHorizontal: 0,
    paddingBottom: 4,
    position: 'relative',
  },
  featureBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 6,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    letterSpacing: 0.1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingGradient: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 36,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  errorMessage: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  resultsContainer: {
    paddingTop: 20,
  },
  celebrationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successContainer: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  successIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  successIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  successRipple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    top: -12,
    left: -12,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  freshBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  freshBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  aiRecommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  aiRecommendationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#667eea',
    marginLeft: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  aiMicroBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  resultsSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 22,
  },
  mealPlansContainer: {
    gap: 24,
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  planOverview: {
    marginBottom: 32,
  },
  overviewCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: 'rgba(102, 126, 234, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  overviewHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planMealCard: {
    marginBottom: 24,
    marginHorizontal: 4,
  },
  mealCardGradient: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  dayIconGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: -6,
    left: -6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dayActions: {
    marginLeft: 'auto',
  },
  dayActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  dayTextContainer: {
    flex: 1,
  },
  dayName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  dayNumber: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: 0.1,
    marginTop: 2,
  },
  mealsContainer: {
    gap: 16,
    marginTop: 20,
  },
  individualMealCard: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mealIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mealFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTags: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealTagText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  mealDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  mealTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#374151',
    flex: 1,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0.1,
    marginTop: 4,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Legacy shopping styles (keeping for compatibility)
  shoppingListCard: {
    marginHorizontal: 4,
    marginBottom: 32,
  },
  shoppingCardGradient: {
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 16,
  },
  shoppingListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shoppingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  shoppingIconGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: -8,
    left: -8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  shoppingSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  smartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  smartBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#f59e0b',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  shoppingTextContainer: {
    flex: 1,
  },
  shoppingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.2,
  },
  peopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  peopleText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  progressSection: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.1,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '800',
    color: '#667eea',
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  progressGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  shoppingItemsContainer: {
    gap: 12,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryEmoji: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
    letterSpacing: 0.1,
  },
  categoryCount: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  categoryCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667eea',
    letterSpacing: 0.2,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: 'rgba(0, 0, 0, 0.02)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkedItem: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    opacity: 0.8,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  checkedBox: {
    borderColor: '#10b981',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  itemEmojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  itemEmoji: {
    fontSize: 18,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    letterSpacing: 0.1,
  },
  itemActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    marginLeft: 12,
  },
  // MODERN SHOPPING PAGE STYLES - ULTRA PREMIUM DESIGN
  modernShoppingHeader: {
    marginBottom: 20,
  },
  
  shoppingHeaderGradient: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  
  shoppingHeaderContent: {
    gap: 20,
  },
  
  shoppingHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  shoppingTitleContainer: {
    flex: 1,
  },
  
  modernShoppingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  
  shoppingBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  
  aiSmartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  aiSmartText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f59e0b',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  
  itemCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  itemCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.2,
  },
  
  shoppingMenuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  modernProgressSection: {
    gap: 8,
  },
  
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  
  progressValue: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  
  modernProgressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  modernProgressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 3,
  },
  
  progressSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  
  // Modern Empty State
  modernEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    flex: 1,
  },
  
  emptyShoppingAnimation: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  
  emptyShoppingIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 2,
  },
  
  emptyShoppingRings: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  emptyRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 100,
  },
  
  ring1: {
    width: 120,
    height: 120,
  },
  
  ring2: {
    width: 140,
    height: 140,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  
  emptyShoppingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  
  emptyShoppingSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  
  createShoppingButton: {
    alignSelf: 'center',
  },
  
  createShoppingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  
  createShoppingText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginLeft: 8,
  },
  
  // Modern Shopping Content
  modernShoppingContent: {
    paddingHorizontal: 20,
  },
  
  modernShoppingContainer: {
    gap: 20,
  },
  
  quickActionsBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  
  quickActionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  
  // Modern Categories
  modernCategoriesContainer: {
    gap: 16,
  },
  
  modernCategoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  
  modernCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  modernCategoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  
  modernCategoryEmoji: {
    fontSize: 22,
    color: 'white',
  },
  
  modernCategoryInfo: {
    flex: 1,
  },
  
  modernCategoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  
  modernCategoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  modernCategoryCount: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  categoryProgressDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
  },
  
  modernCategoryProgress: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  
  categoryProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  modernItemsList: {
    gap: 8,
  },
  
  modernShoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  
  modernCheckedItem: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  
  modernCheckboxContainer: {
    marginRight: 12,
  },
  
  modernCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  
  modernCheckedBox: {
    borderColor: '#10b981',
  },
  
  checkmarkGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  modernItemContent: {
    flex: 1,
  },
  
  modernItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  modernItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  
  modernCheckedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  
  modernItemAction: {
    padding: 4,
  },
  
  modernItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  modernItemQuantity: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  
  completedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
  },
  
  // Modern Shopping Summary
  modernShoppingSummary: {
    marginTop: 8,
  },
  
  summaryGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  summaryContent: {
    gap: 16,
  },
  
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  summaryStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  summaryStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  
  summaryStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  
  summaryActionButton: {
    alignSelf: 'center',
  },
  
  summaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  
  summaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
});