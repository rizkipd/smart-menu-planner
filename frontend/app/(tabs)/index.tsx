import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashScreen from '../../components/SplashScreen';

const API_BASE_URL = 'http://localhost:8000/api/v1/mobile';

interface PlanMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string[];
  features: string[];
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
  
  const insets = useSafeAreaInsets();

  const planModes: PlanMode[] = [
    {
      id: 'diet',
      name: 'Healthy Eating',
      description: 'Balanced nutrition for your family',
      icon: 'leaf',
      gradient: ['#FF6B6B', '#FF8E53'],
      features: ['Balanced nutrition', 'Fresh ingredients', 'Low calories', 'High protein']
    },
    {
      id: 'satisfaction',
      name: 'Balanced Meals',
      description: 'Delicious and satisfying recipes',
      icon: 'restaurant',
      gradient: ['#4ECDC4', '#44A08D'],
      features: ['Great taste', 'Filling portions', 'Comfort food', 'Family favorites']
    },
    {
      id: 'economic',
      name: 'Budget Smart',
      description: 'Affordable meals without compromising quality',
      icon: 'wallet',
      gradient: ['#667eea', '#764ba2'],
      features: ['Cost effective', 'Simple ingredients', 'Meal prep friendly', 'No waste']
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: mode,
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
      } else {
        setError(data.message || 'Failed to generate meal plan');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('API Error:', err);
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

  const PlanModeCard = ({ mode, index }: { mode: PlanMode; index: number }) => (
    <TouchableOpacity
      key={mode.id}
      onPress={() => handleModeSelect(mode.id)}
      disabled={loading}
      className="animate-slide-up"
      style={[
        styles.card,
        {
          opacity: loading ? 0.7 : 1,
          transform: [{ scale: loading ? 0.96 : 1 }, { translateY: 0 }],
        }
      ]}
    >
      <LinearGradient
        colors={mode.gradient}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.modeName}>{mode.name}</Text>
            <Text style={styles.modeDescription}>{mode.description}</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={mode.icon as any} 
            size={28} 
            color="white" 
          />
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

  const SuccessHeader = () => (
    <View style={styles.successHeader}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
      </View>
      <View style={styles.aiRecommendationBadge}>
        <Ionicons name="sparkles" size={16} color="#00a2ed" />
        <Text style={styles.aiRecommendationText}>AI Powered</Text>
      </View>
      <Text style={styles.successText}>Meal plan generated successfully</Text>
    </View>
  );

  const MealPlanCard = ({ day, dayIndex }: { day: WeeklyPlan; dayIndex: number }) => (
    <View key={day.day} style={[styles.mealCard, { animationDelay: `${dayIndex * 50}ms` }]}>
      <View style={styles.dayHeader}>
        <LinearGradient
          colors={['#fda4af', '#f472b6']}
          style={styles.dayIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="calendar" size={20} color="white" />
        </LinearGradient>
        <View style={styles.dayTextContainer}>
          <Text style={styles.dayName}>{day.day}</Text>
          <Text style={styles.dayNumber}>Day {dayIndex + 1} of 7</Text>
        </View>
      </View>
      
      <View style={styles.mealsContainer}>
        <View style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <View style={[styles.mealDot, { backgroundColor: '#fda4af' }]} />
            <Text style={styles.mealTitle}>Breakfast</Text>
          </View>
          <View style={styles.mealRow}>
            <Text style={styles.mealText}>{day.breakfast}</Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => {
                const key = `${day.day}-breakfast`;
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
                name={favoriteItems.has(`${day.day}-breakfast`) ? "heart" : "heart-outline"} 
                size={16} 
                color={favoriteItems.has(`${day.day}-breakfast`) ? "#ec4899" : "#94a3b8"} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <View style={[styles.mealDot, { backgroundColor: '#c4b5fd' }]} />
            <Text style={styles.mealTitle}>Lunch</Text>
          </View>
          <View style={styles.mealRow}>
            <Text style={styles.mealText}>{day.lunch}</Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => {
                const key = `${day.day}-lunch`;
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
                name={favoriteItems.has(`${day.day}-lunch`) ? "heart" : "heart-outline"} 
                size={16} 
                color={favoriteItems.has(`${day.day}-lunch`) ? "#ec4899" : "#94a3b8"} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <View style={[styles.mealDot, { backgroundColor: '#a78bfa' }]} />
            <Text style={styles.mealTitle}>Dinner</Text>
          </View>
          <View style={styles.mealRow}>
            <Text style={styles.mealText}>{day.dinner}</Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => {
                const key = `${day.day}-dinner`;
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
                name={favoriteItems.has(`${day.day}-dinner`) ? "heart" : "heart-outline"} 
                size={16} 
                color={favoriteItems.has(`${day.day}-dinner`) ? "#ec4899" : "#94a3b8"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const ShoppingListCard = () => {
    const categorizedItems = categorizeShoppingList(shoppingList || []);
    const totalItems = shoppingList?.length || 0;
    const checkedCount = checkedItems.size;
    const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

    return (
      <View style={styles.shoppingListCard}>
        <View style={styles.shoppingListHeader}>
          <LinearGradient
            colors={['#c4b5fd', '#a78bfa']}
            style={styles.shoppingIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="cart" size={20} color="white" />
          </LinearGradient>
          <View style={styles.shoppingTextContainer}>
            <Text style={styles.shoppingTitle}>Shopping List</Text>
            <View style={styles.peopleContainer}>
              <Ionicons name="people" size={16} color="#666" />
              <Text style={styles.peopleText}>For 2 people</Text>
            </View>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{checkedCount}/{totalItems} items ✓</Text>
        </View>

        {/* Categorized Shopping Items */}
        <View style={styles.shoppingItemsContainer}>
          {Object.entries(categorizedItems).map(([category, items]) => {
            if (items.length === 0) return null;
            return (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {items.map((item, index) => {
                  const globalIndex = (shoppingList || []).findIndex(i => i.ingredient === item.ingredient);
                  const isChecked = checkedItems.has(globalIndex);
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.shoppingItem, isChecked && styles.checkedItem]}
                      onPress={() => toggleItemCheck(globalIndex)}
                    >
                      <View style={styles.checkboxContainer}>
                        <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                          {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>
                      </View>
                      <Text style={styles.itemEmoji}>{item.emoji}</Text>
                      <Text style={[styles.itemText, isChecked && styles.checkedText]}>{item.ingredient}</Text>
                      <Text style={[styles.itemQuantity, isChecked && styles.checkedText]}>{item.quantity}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark-content" backgroundColor="transparent" translucent={true} />
      

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ec4899" />
        }
        showsVerticalScrollIndicator={false}
      >
        {!selectedMode && (
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>What's your goal?</Text>
            <Text style={styles.heroSubtitle}>
              Choose your meal planning approach
            </Text>
          </View>
        )}

        {/* Mode Selection */}
        {!selectedMode && (
          <View style={styles.modesContainer}>
            {planModes.map((mode, index) => (
              <PlanModeCard key={mode.id} mode={mode} index={index} />
            ))}
          </View>
        )}

        {/* Loading State */}
        {loading && <LoadingScreen />}

        {/* Error State */}
        {error && <ErrorScreen />}

        {/* Generated Plan */}
        {generatedPlan && !loading && (
          <View style={styles.resultsContainer}>
            <CelebrationEmojis />
            <SuccessHeader />
            
            <Text style={styles.resultsTitle}>Your Weekly Plan</Text>
            <Text style={styles.resultsSubtitle}>7 days of balanced meals</Text>

            {/* Meal Plans */}
            <View style={styles.mealPlansContainer}>
              {generatedPlan.map((day, index) => (
                <MealPlanCard key={day.day} day={day} dayIndex={index} />
              ))}
            </View>

            {/* Shopping List */}
            {shoppingList && <ShoppingListCard />}

            {/* Bottom Sheet Actions */}
            <View style={styles.bottomSheetContainer}>
              <View style={styles.bottomSheetHandle} />
              <View style={styles.bottomSheetContent}>
                <Text style={styles.bottomSheetTitle}>Meal Plan Actions</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => generateMealPlan(selectedMode!)}
                    disabled={loading}
                  >
                    <Ionicons name="refresh" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Generate New Plan</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.secondaryButton} onPress={resetToModeSelection}>
                    <Ionicons name="arrow-back" size={20} color="#00a2ed" style={styles.buttonIcon} />
                    <Text style={styles.secondaryButtonText}>Change Plan Type</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.tertiaryButton}>
                    <Ionicons name="share" size={20} color="#6b7280" style={styles.buttonIcon} />
                    <Text style={styles.tertiaryButtonText}>Share Plan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 32,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  modesContainer: {
    gap: 16,
    paddingBottom: 32,
    paddingHorizontal: 0,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    marginHorizontal: 0,
    backgroundColor: '#ffffff',
    borderWidth: 0,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  cardGradient: {
    padding: 24,
    minHeight: 120,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    flex: 1,
  },
  modeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontWeight: '400',
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
    paddingHorizontal: 24,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(20px)',
  },
  loadingContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(0, 162, 237, 0.15)',
    backdropFilter: 'blur(20px)',
    shadowColor: 'rgba(0, 162, 237, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingGradient: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 22,
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
    marginBottom: 28,
  },
  successIcon: {
    marginBottom: 12,
  },
  successText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#00a2ed',
    letterSpacing: 0.2,
  },
  aiRecommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 162, 237, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 162, 237, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: 'rgba(0, 162, 237, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  aiRecommendationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00a2ed',
    marginLeft: 6,
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
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  resultsSubtitle: {
    fontSize: 17,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 24,
  },
  mealPlansContainer: {
    gap: 24,
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  mealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 4,
    borderWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: 'rgba(244, 114, 182, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
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
    gap: 8,
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
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#64748b',
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    flex: 1,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
  shoppingListCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 28,
    marginHorizontal: 4,
    borderWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    marginBottom: 32,
  },
  shoppingListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shoppingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shoppingTextContainer: {
    flex: 1,
  },
  shoppingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  peopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  peopleText: {
    fontSize: 12,
    color: '#64748b',
  },
  progressContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(196, 181, 253, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.15)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00a2ed',
    borderRadius: 5,
    shadowColor: '#00a2ed',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00a2ed',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  shoppingItemsContainer: {
    gap: 12,
  },
  categorySection: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 12,
    paddingLeft: 6,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  checkedItem: {
    backgroundColor: 'rgba(196, 181, 253, 0.1)',
    opacity: 0.7,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c4b5fd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkedBox: {
    backgroundColor: '#c4b5fd',
    borderColor: '#c4b5fd',
  },
  itemEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  actionButtons: {
    gap: 16,
    paddingTop: 32,
    paddingHorizontal: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008BF7',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 56,
    elevation: 4,
    shadowColor: 'rgba(0, 139, 247, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    borderWidth: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: '#008BF7',
    shadowColor: 'rgba(0, 139, 247, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#008BF7',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  bottomSheetContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 24,
    marginTop: 24,
    marginHorizontal: -24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
    backdropFilter: 'blur(20px)',
  },
  bottomSheetHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSheetContent: {
    alignItems: 'center',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
    letterSpacing: -0.2,
  },
  tertiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    minHeight: 56,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  tertiaryButtonText: {
    color: '#6b7280',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});