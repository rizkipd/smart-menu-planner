import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { MobileApiService } from '../services/api';

const { width } = Dimensions.get('window');

interface Meal {
  name: string;
  type: string;
  image: string;
}

interface MealPlan {
  [day: string]: Meal[];
}

// Fallback meal data when API is unavailable
const fallbackMealsData: MealPlan = {
  'Mon': [
    {
      name: 'Avocado Toast',
      type: 'Breakfast',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNIEFsK9yTwAhtyRyhyMU2nRVahy4zYjevAsnKtjFlA2jcQPhWB37clljw3gx8lackUpURffYfR5CgCYCgVO4rFMLpnaPP4tSnDm_Zq20VESGo6sInCXwT82hQSVL3swPtPmdJy2pOrsPh-Zurc9Ky64JxAoDwR7UpCVcX0ThLStFoU8PKf5HR4HWpTadl4sb3XR0fVrRkeipSxQxmxBtuzzyy7p1JyJ9A1BlNvqAOSadZSU0_s7DDLgK6-6PYKLw6feiTM2CwIgT'
    },
    {
      name: 'Chicken Salad',
      type: 'Lunch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwukDMt5cIZ79e5Ztal9eAtocmmME-J3qYrx6M9Gl6D-pOk_jAOiTNg6rf5VzcWfE-DRrssxUnNpJhMJ9lSpkSzin3V5Zq9FSZjNaO7dI6lpY4a-Ilq3WORRctyTX8DAXZkTxu9eQHe34q5M-eZ6SXZ1fsPD_jOTHqOAQXYZqf2I1GuZrc24LlkNudmNy7-b3QjPZ4cxhD8mDkuKCd76DuMEM8rZuAJNWWTa9d6yRfaOxvQXiBs3uhjN0SkBoUpVeZ2H5CifjLsKcN'
    },
    {
      name: 'Salmon with Veggies',
      type: 'Dinner',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrSXNUPhakc0mEHQ8dDVXObjOs0Tj1kYFp4V32XAE70RoH5srRA6XwCXq52PyJ1FjCT1A9tcnDZn95f5BvhyTX5C5zwnOZdCirvxIMmbIstg41zoRs286QY4Xx_fCLyDyoFjCkeCIgpHaBxKKxuLie_nOzv_fv1n--zwxCxDnxfAVyJ8hkpBNLRmtdz7lvD8JdtCjHSbUO99Bd4EU2_3yH12zUFtoImVGCcBwUwS2eUdEzrW8Ev14UNWpzjXavni_xLzsvzVYhX9x5'
    }
  ],
  'Tue': [
    {
      name: 'Greek Yogurt Bowl',
      type: 'Breakfast',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNIEFsK9yTwAhtyRyhyMU2nRVahy4zYjevAsnKtjFlA2jcQPhWB37clljw3gx8lackUpURffYfR5CgCYCgVO4rFMLpnaPP4tSnDm_Zq20VESGo6sInCXwT82hQSVL3swPtPmdJy2pOrsPh-Zurc9Ky64JxAoDwR7UpCVcX0ThLStFoU8PKf5HR4HWpTadl4sb3XR0fVrRkeipSxQxmxBtuzzyy7p1JyJ9A1BlNvqAOSadZSU0_s7DDLgK6-6PYKLw6feiTM2CwIgT'
    },
    {
      name: 'Quinoa Bowl',
      type: 'Lunch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwukDMt5cIZ79e5Ztal9eAtocmmME-J3qYrx6M9Gl6D-pOk_jAOiTNg6rf5VzcWfE-DRrssxUnNpJhMJ9lSpkSzin3V5Zq9FSZjNaO7dI6lpY4a-Ilq3WORRctyTX8DAXZkTxu9eQHe34q5M-eZ6SXZ1fsPD_jOTHqOAQXYZqf2I1GuZrc24LlkNudmNy7-b3QjPZ4cxhD8mDkuKCd76DuMEM8rZuAJNWWTa9d6yRfaOxvQXiBs3uhjN0SkBoUpVeZ2H5CifjLsKcN'
    },
    {
      name: 'Grilled Chicken',
      type: 'Dinner',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrSXNUPhakc0mEHQ8dDVXObjOs0Tj1kYFp4V32XAE70RoH5srRA6XwCXq52PyJ1FjCT1A9tcnDZn95f5BvhyTX5C5zwnOZdCirvxIMmbIstg41zoRs286QY4Xx_fCLyDyoFjCkeCIgpHaBxKKxuLie_nOzv_fv1n--zwxCxDnxfAVyJ8hkpBNLRmtdz7lvD8JdtCjHSbUO99Bd4EU2_3yH12zUFtoImVGCcBwUwS2eUdEzrW8Ev14UNWpzjXavni_xLzsvzVYhX9x5'
    }
  ],
  'Wed': [
    {
      name: 'Overnight Oats',
      type: 'Breakfast',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNIEFsK9yTwAhtyRyhyMU2nRVahy4zYjevAsnKtjFlA2jcQPhWB37clljw3gx8lackUpURffYfR5CgCYCgVO4rFMLpnaPP4tSnDm_Zq20VESGo6sInCXwT82hQSVL3swPtPmdJy2pOrsPh-Zurc9Ky64JxAoDwR7UpCVcX0ThLStFoU8PKf5HR4HWpTadl4sb3XR0fVrRkeipSxQxmxBtuzzyy7p1JyJ9A1BlNvqAOSadZSU0_s7DDLgK6-6PYKLw6feiTM2CwIgT'
    },
    {
      name: 'Veggie Wrap',
      type: 'Lunch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwukDMt5cIZ79e5Ztal9eAtocmmME-J3qYrx6M9Gl6D-pOk_jAOiTNg6rf5VzcWfE-DRrssxUnNpJhMJ9lSpkSzin3V5Zq9FSZjNaO7dI6lpY4a-Ilq3WORRctyTX8DAXZkTxu9eQHe34q5M-eZ6SXZ1fsPD_jOTHqOAQXYZqf2I1GuZrc24LlkNudmNy7-b3QjPZ4cxhD8mDkuKCd76DuMEM8rZuAJNWWTa9d6yRfaOxvQXiBs3uhjN0SkBoUpVeZ2H5CifjLsKcN'
    },
    {
      name: 'Steak and Salad',
      type: 'Dinner',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrSXNUPhakc0mEHQ8dDVXObjOs0Tj1kYFp4V32XAE70RoH5srRA6XwCXq52PyJ1FjCT1A9tcnDZn95f5BvhyTX5C5zwnOZdCirvxIMmbIstg41zoRs286QY4Xx_fCLyDyoFjCkeCIgpHaBxKKxuLie_nOzv_fv1n--zwxCxDnxfAVyJ8hkpBNLRmtdz7lvD8JdtCjHSbUO99Bd4EU2_3yH12zUFtoImVGCcBwUwS2eUdEzrW8Ev14UNWpzjXavni_xLzsvzVYhX9x5'
    }
  ],
};

export default function WeeklyPlan() {
  const router = useRouter();
  const params = useLocalSearchParams<{ modeId?: string; planId?: string }>();
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [activeTab, setActiveTab] = useState('meal'); // 'meal' or 'shopping'
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mealsData, setMealsData] = useState<MealPlan>(fallbackMealsData);
  const [planTitle, setPlanTitle] = useState('Weekly Plan');
  const [error, setError] = useState<string | null>(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Fetch meal plan from API
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        setError(null);

        // If planId is provided, fetch existing plan
        if (params.planId) {
          const planIdNum = parseInt(params.planId, 10);
          if (!isNaN(planIdNum)) {
            const response = await MobileApiService.getPlanDetails(planIdNum);
            if (response.success && response.data) {
              const plan = response.data as any;
              setPlanTitle(plan.title || plan.name || 'Weekly Plan');
              if (plan.weekly_plan) {
                setMealsData(transformApiMeals(plan.weekly_plan));
              }
            }
          }
        }
        // Otherwise, if modeId is provided, generate a new plan
        else if (params.modeId) {
          setGenerating(true);
          const response = await MobileApiService.generateMealPlan({ mode: params.modeId });
          if (response.success && response.data) {
            const plan = response.data as any;
            setPlanTitle(plan.title || plan.name || 'Weekly Plan');
            if (plan.weekly_plan) {
              setMealsData(transformApiMeals(plan.weekly_plan));
            }
          }
          setGenerating(false);
        }
        // Use fallback data if no params
      } catch (err: any) {
        console.error('Failed to fetch meal plan:', err);
        setError('Could not load meal plan. Using sample data.');
        // Keep using fallback data
      } finally {
        setLoading(false);
        setGenerating(false);
      }
    };

    fetchMealPlan();
  }, [params.planId, params.modeId]);

  // Transform API meal data to component format
  const transformApiMeals = (weeklyPlan: any): MealPlan => {
    const transformed: MealPlan = {};
    const dayMap: Record<string, string> = {
      'monday': 'Mon',
      'tuesday': 'Tue',
      'wednesday': 'Wed',
      'thursday': 'Thu',
      'friday': 'Fri',
      'saturday': 'Sat',
      'sunday': 'Sun'
    };

    for (const [day, meals] of Object.entries(weeklyPlan)) {
      const shortDay = dayMap[day.toLowerCase()] || day.substring(0, 3);
      if (Array.isArray(meals)) {
        transformed[shortDay] = meals.map((meal: any) => ({
          name: meal.name || meal.title || 'Unknown',
          type: meal.type || meal.meal_type || 'Meal',
          image: meal.image || meal.image_url || getDefaultImage(meal.type || meal.meal_type)
        }));
      }
    }

    return Object.keys(transformed).length > 0 ? transformed : fallbackMealsData;
  };

  // Default images for meal types
  const getDefaultImage = (mealType: string): string => {
    const defaultImages: Record<string, string> = {
      'Breakfast': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNIEFsK9yTwAhtyRyhyMU2nRVahy4zYjevAsnKtjFlA2jcQPhWB37clljw3gx8lackUpURffYfR5CgCYCgVO4rFMLpnaPP4tSnDm_Zq20VESGo6sInCXwT82hQSVL3swPtPmdJy2pOrsPh-Zurc9Ky64JxAoDwR7UpCVcX0ThLStFoU8PKf5HR4HWpTadl4sb3XR0fVrRkeipSxQxmxBtuzzyy7p1JyJ9A1BlNvqAOSadZSU0_s7DDLgK6-6PYKLw6feiTM2CwIgT',
      'Lunch': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwukDMt5cIZ79e5Ztal9eAtocmmME-J3qYrx6M9Gl6D-pOk_jAOiTNg6rf5VzcWfE-DRrssxUnNpJhMJ9lSpkSzin3V5Zq9FSZjNaO7dI6lpY4a-Ilq3WORRctyTX8DAXZkTxu9eQHe34q5M-eZ6SXZ1fsPD_jOTHqOAQXYZqf2I1GuZrc24LlkNudmNy7-b3QjPZ4cxhD8mDkuKCd76DuMEM8rZuAJNWWTa9d6yRfaOxvQXiBs3uhjN0SkBoUpVeZ2H5CifjLsKcN',
      'Dinner': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrSXNUPhakc0mEHQ8dDVXObjOs0Tj1kYFp4V32XAE70RoH5srRA6XwCXq52PyJ1FjCT1A9tcnDZn95f5BvhyTX5C5zwnOZdCirvxIMmbIstg41zoRs286QY4Xx_fCLyDyoFjCkeCIgpHaBxKKxuLie_nOzv_fv1n--zwxCxDnxfAVyJ8hkpBNLRmtdz7lvD8JdtCjHSbUO99Bd4EU2_3yH12zUFtoImVGCcBwUwS2eUdEzrW8Ev14UNWpzjXavni_xLzsvzVYhX9x5',
    };
    return defaultImages[mealType] || defaultImages['Lunch'];
  };

  // Get meals for the selected day, fallback to Mon if day not found
  const getMealsForDay = (day: string) => {
    return mealsData[day] || mealsData['Mon'] || [];
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    // Share functionality
    console.log('Share plan');
  };

  const handleBrowseRecipes = () => {
    router.push('/recipe-browse');
  };

  const handleSavePlan = () => {
    // Save plan and navigate to tabs
    router.push('/(tabs)');
  };

  const handleRegenerate = () => {
    // Navigate to recipe browse for regeneration
    router.push('/recipe-browse');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.designRoot}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{planTitle}</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Loading/Generating State */}
        {(loading || generating) && (
          <View style={styles.loadingBanner}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingBannerText}>
              {generating ? 'Generating your meal plan...' : 'Loading...'}
            </Text>
          </View>
        )}

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'meal' && styles.activeTab]}
            onPress={() => setActiveTab('meal')}
          >
            <Text style={[styles.tabText, activeTab === 'meal' && styles.activeTabText]}>
              Meal Plan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'shopping' && styles.activeTab]}
            onPress={() => setActiveTab('shopping')}
          >
            <Text style={[styles.tabText, activeTab === 'shopping' && styles.activeTabText]}>
              Shopping List
            </Text>
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}
        >
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayChip,
                selectedDay === day && styles.selectedDayChip
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayChipText,
                selectedDay === day && styles.selectedDayChipText
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content Area - Show Meal Plan or Shopping List based on active tab */}
        {activeTab === 'meal' ? (
          <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.mealList}>
              {getMealsForDay(selectedDay).map((meal, index) => (
                <View key={index} style={styles.mealCard}>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealType}>{meal.type}</Text>
                  </View>
                  <Image 
                    source={{ uri: meal.image }} 
                    style={styles.mealImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.shoppingListContent}>
              <Text style={styles.comingSoonText}>Shopping List</Text>
              <Text style={styles.comingSoonSubtext}>Your shopping list will appear here</Text>
            </View>
          </ScrollView>
        )}

        {/* Bottom Actions - template: grid grid-cols-2 gap-4 */}
        <View style={styles.bottomActions}>
          <View style={styles.gridContainer}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleRegenerate}
            >
              <Text style={styles.secondaryButtonText}>Regenerate</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleSavePlan}
            >
              <Text style={styles.primaryButtonText}>Save Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
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

  // Header - template: flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10
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

  headerTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },

  shareButton: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  shareText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '700',
  },

  backIcon: {
    color: Colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
  },

  // Tab Navigation - template: flex border-b border-gray-200 dark:border-gray-700 px-4 justify-between
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    paddingHorizontal: Spacing.lg,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.lg,
  },

  activeTab: {
    borderBottomColor: Colors.primary,
  },

  tabText: {
    color: Colors.textGray,
    fontSize: 14,
    fontWeight: '700',
  },

  activeTabText: {
    color: Colors.primary,
  },

  // Day Selector - template: flex gap-3 p-4 overflow-x-auto
  daySelector: {
    flexDirection: 'row',
    gap: Spacing.lg, // gap-3
    padding: Spacing.lg, // p-4
  },

  dayChip: {
    height: 32, // h-8 from template
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999, // rounded-full
    backgroundColor: '#374151', // bg-gray-200 dark:bg-gray-700 from template
    paddingHorizontal: Spacing.lg, // px-4
  },

  selectedDayChip: {
    backgroundColor: Colors.primary + '33', // bg-primary/20 from template
  },

  dayChipText: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '500',
  },

  selectedDayChipText: {
    color: Colors.primary,
  },

  // Content ScrollView - Remove flex: 1 to prevent unwanted gaps
  contentScrollView: {
    flexGrow: 1,
  },

  // Meal List - template: flex flex-col gap-4 p-4
  mealList: {
    flexDirection: 'column',
    gap: Spacing.lg, // gap-4
    padding: Spacing.lg, // p-4
  },

  // Shopping List Content
  shoppingListContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },

  comingSoonText: {
    color: Colors.textDark,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },

  comingSoonSubtext: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },

  mealCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: Spacing.lg, // gap-4
    backgroundColor: '#1F2937', // bg-white dark:bg-gray-800 from template
    borderRadius: Spacing.borderRadius.lg, // rounded-xl
    padding: Spacing.lg, // p-4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // shadow-sm from template
  },

  mealInfo: {
    flex: 2, // flex-[2_2_0px] from template
    flexDirection: 'column',
    gap: Spacing.xs, // gap-1
  },

  mealName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  mealType: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
  },

  mealImage: {
    flex: 1, // flex-1 from template
    width: '100%',
    aspectRatio: 1, // aspect-square
    borderRadius: Spacing.borderRadius.md, // rounded-lg
  },

  // Bottom Actions - template: p-4 mt-auto sticky bottom-0 bg-background-light dark:bg-background-dark
  bottomActions: {
    padding: Spacing.lg, // p-4
    paddingBottom: Spacing.xxl, // Extra padding for safe area
    backgroundColor: Colors.backgroundDark,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.lg, // gap-4
  },

  // Grid layout - template: grid grid-cols-2 gap-4
  gridContainer: {
    flexDirection: 'row',
    gap: Spacing.lg, // gap-4
  },

  secondaryButton: {
    flex: 1, // grid-cols-2
    height: 48, // h-12 from template
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151', // bg-gray-200 dark:bg-gray-700 from template
    borderRadius: Spacing.borderRadius.lg, // rounded-xl
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  primaryButton: {
    flex: 1, // grid-cols-2
    height: 48, // h-12 from template
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800', // bg-accent from template (orange)
    borderRadius: Spacing.borderRadius.lg, // rounded-xl
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Loading and error banners
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary + '20',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  loadingBannerText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },

  errorBanner: {
    backgroundColor: Colors.warning + '20',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  errorBannerText: {
    color: Colors.warning,
    fontSize: 14,
    textAlign: 'center',
  },
});