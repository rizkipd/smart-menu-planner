import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import MobileApiService, { MealPlan, PlanMode } from '../../services/api';

// Interface for the meal data structure we'll display
interface MealItem {
  id: number;
  title: string;
  mealType: string;
  description: string;
  ingredients: string;
  image: string;
}

interface DayMealData {
  day: string;
  meals: MealItem[];
}

// Sample weekly menu data as fallback (will be replaced with API data)
const fallbackWeeklyMenuData: DayMealData[] = [
  {
    day: 'Monday',
    meals: [
      {
        id: 1,
        title: 'Avocado Toast with Egg',
        mealType: 'Breakfast',
        description: 'A healthy and quick breakfast option.',
        ingredients: 'Avocado, egg, whole-wheat bread, salt, pepper.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIyN4C4neKWgZwHxY0C9G63qCsKhPzaSDSIZqn1CCeOXYAZawiwyWu3GzWn6AxZ5yogHB5XxWj6QnxMResKqmdm0YKgzQRmhdPG4FSCxYWe3kP36qh4KHNLssccEF-O-hGB_9QwYdehXD-j3C-zrxZkBUeg-qkgxF5DE5IpyoF4rfvYrhz3ZI7C_LgR2N9AdaPKFuhufNzTN8r8A8WNgbJer9kORgz46d9IzjkD-duj3LjIkNR05xiM4tmoB8M6va79Gt1yLxIKuWx'
      },
      {
        id: 2,
        title: 'Quinoa Salad with Grilled Chicken',
        mealType: 'Lunch',
        description: 'A light and protein-rich salad.',
        ingredients: 'Quinoa, grilled chicken, cucumber, tomatoes, lemon vinaigrette.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmuvZco8ev-noSac-L6ZkDfTNgCpAn1qNSOJfb-wDPPkRpOjbj4BKqn9sbakCYo8ajG7ifNGvmWVlCo4ZvYPgldBkc3LVDID1A5IV7qSxSgdCLQTgm9coODWR2TeO_dcMlldHy73I9tgGuf2qmbeoz0deuzl1U0LAMz6mzk9rJaMC-CIrbMwQfNSv-49UJEpfPQnDju_1IUr2Z2pqF9F4oHtC4ubx1nmzuEqowC4eXVwD5_Xg6V58pXgM4u2vJiLm8H60uaqukLjG'
      },
      {
        id: 3,
        title: 'Salmon with Roasted Vegetables',
        mealType: 'Dinner',
        description: 'A flavorful and balanced meal.',
        ingredients: 'Salmon fillet, broccoli, bell peppers, olive oil, herbs.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2eVGaWbte2gFS_pBWSR6fz5avyekicVb6K5brRzW4L0-uiK-3E5p3fQX2eHPfXTH55ZHquAuxjxa4jovhcXYVQuvmHth5Vt2XSSDWQatGJ0E_oTjyIrGtf7PhSntCrxR3j6U9ZprQNMj8iO4X8si1RVQCD2eDi0tCHQjLO26BnNy2BvhASZgGwHL5AIqYkRiO75o07b4UF8_vN27bKVDO6Zm3Chryo3i92g5ftIM4x9bZs34fZzIFkur75VHpvJz8ckkkWojeY_l3'
      }
    ]
  },
  {
    day: 'Tuesday',
    meals: [
      {
        id: 4,
        title: 'Greek Yogurt with Berries',
        mealType: 'Breakfast',
        description: 'A simple and nutritious start to your day.',
        ingredients: 'Greek yogurt, mixed berries, honey (optional).',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvHPEyHbXMYRPNfYCEHt8P_08oU6cxYE5jGXEH0YwzyFFHdBslrH1miyP5zZldoxPo6yYc7XRvOZBmP_SAOh7yXSUR77M5sWsDb0knV8m2oNZ-980AqkQVzxC5dZwL6OLw2xYPEQBC5_AEOw05Eb1VZv-TVnjqMogZTdU294DCdBim8rXp8GpLg6Td4rFy7eBMEK0tV1GN9U5jCTElezYFxJcOvxfTr9g5dU_rhXuNtgKbXPUXXqAhWWqkkqV-KGivKHtJ8cGmsFP0'
      },
      {
        id: 5,
        title: 'Lentil Soup',
        mealType: 'Lunch',
        description: 'A hearty and comforting vegetarian soup.',
        ingredients: 'Lentils, carrots, celery, onion, vegetable broth.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl6L__ihitd8mBmPcDvQvgC5P-eJR6xcSVJotrNQMHrz8Ad-7s9xXGsb41jIFVyURjx3370bCHOC1aTnmqEEoGcTPPY3Kpg550cWIbd2xBZBDDG1jpj4-P9XtK7gJgpM5uM8XRO5gmq7BlGP-BQnxXooG5a7R018fPqXZnvuHqe4do65feZElkQcw3MV7yISXwIfm4e8Y2FHhCeftkao9ABhB0elsdmNosHQ3W1LSi7nHaibwN48Apqm6HParALtQk2WpWTzScgAyg'
      },
      {
        id: 6,
        title: 'Chicken Stir-fry',
        mealType: 'Dinner',
        description: 'A quick and customizable weeknight meal.',
        ingredients: 'Chicken breast, mixed vegetables, soy sauce, ginger, garlic.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk2oj3r_R1-m2SjfU00dLtqZ69954cHeFO1FqAfw2Zq4u8iQf0uhOBqBvplpDdduB2_zFAcOlM3U8pstFoBg-0QIX8eKA1fR8WEtaN43ijfIIzQIN9P5JQH16Z0ZsspWiLp0FjFGISMfjiKLdvk8G9xDBNtHcmbuWUJlxwWkcfWuiQmJLorVxnii9TVbSTBN3Qc__63TFTrRgejVGEbFiNM_qSfgsmWYiMngFHMd3wWjuA0bqX7ZxSBaF9BeCAXpJ6nYEf4qKpLhC8'
      }
    ]
  }
];

export default function Plans() {
  // State management
  const [weeklyMenuData, setWeeklyMenuData] = useState<DayMealData[]>(fallbackWeeklyMenuData);
  const [loading, setLoading] = useState(false);
  const [, setPlanModes] = useState<PlanMode[]>([]);
  const [, setCurrentPlanId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load available plan modes on component mount
  useEffect(() => {
    loadPlanModes();
    // Try to load existing plans (you can expand this to show recent plans)
    loadRecentPlans();
  }, []);

  const loadPlanModes = async () => {
    try {
      const response = await MobileApiService.getPlanModes();
      if (response.success && response.data) {
        setPlanModes(response.data.modes);
      }
    } catch (error) {
      console.error('Failed to load plan modes:', error);
    }
  };

  const loadRecentPlans = async () => {
    // For now, we'll load popular plans as example data
    try {
      setLoading(true);
      const response = await MobileApiService.getPopularPlans('diet', 5);
      if (response.success && response.data) {
        // For demo purposes, we'll keep the fallback data
        // In a full implementation, you'd transform the API data to match your UI structure
        console.log('Popular plans loaded:', response.data.popular_plans);
      }
    } catch (error) {
      console.error('Failed to load recent plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    console.log('Back pressed');
  };

  const handleBrowseRecipes = async () => {
    try {
      setLoading(true);
      const response = await MobileApiService.getPopularPlans('satisfaction', 10);
      if (response.success && response.data) {
        Alert.alert(
          'Browse Recipes',
          `Found ${response.data.popular_plans.length} popular recipes!`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to browse recipes. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = async () => {
    try {
      setIsGenerating(true);
      
      // Generate a new meal plan using AI
      const generateRequest = {
        mode: 'diet', // Default mode, you can make this selectable
        preferences: {
          dietary_restrictions: ['vegetarian'],
          servings: 2,
        }
      };

      const response = await MobileApiService.generateMealPlan(generateRequest);
      
      if (response.success && response.data) {
        setCurrentPlanId(response.data.id);
        
        // Transform API data to match our UI structure
        const transformedData = transformApiDataToUI(response.data);
        setWeeklyMenuData(transformedData);
        
        Alert.alert(
          'Success!',
          'New meal plan generated successfully!',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(response.message || 'Generation failed');
      }
    } catch (error) {
      Alert.alert(
        'Generation Failed',
        'Failed to generate new meal plan. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const transformApiDataToUI = (planData: MealPlan): DayMealData[] => {
    // Transform the API meal plan data to match our UI structure
    if (!planData.weekly_plan || planData.weekly_plan.length === 0) {
      return fallbackWeeklyMenuData;
    }

    return planData.weekly_plan.map((dayPlan, index) => {
      const meals: MealItem[] = [];
      let mealId = index * 10; // Generate unique IDs

      if (dayPlan.breakfast) {
        meals.push({
          id: mealId++,
          title: dayPlan.breakfast,
          mealType: 'Breakfast',
          description: 'AI-generated healthy breakfast option',
          ingredients: 'Fresh ingredients as specified in recipe',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIyN4C4neKWgZwHxY0C9G63qCsKhPzaSDSIZqn1CCeOXYAZawiwyWu3GzWn6AxZ5yogHB5XxWj6QnxMResKqmdm0YKgzQRmhdPG4FSCxYWe3kP36qh4KHNLssccEF-O-hGB_9QwYdehXD-j3C-zrxZkBUeg-qkgxF5DE5IpyoF4rfvYrhz3ZI7C_LgR2N9AdaPKFuhufNzTN8r8A8WNgbJer9kORgz46d9IzjkD-duj3LjIkNR05xiM4tmoB8M6va79Gt1yLxIKuWx'
        });
      }

      if (dayPlan.lunch) {
        meals.push({
          id: mealId++,
          title: dayPlan.lunch,
          mealType: 'Lunch',
          description: 'AI-generated nutritious lunch',
          ingredients: 'Fresh ingredients as specified in recipe',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmuvZco8ev-noSac-L6ZkDfTNgCpAn1qNSOJfb-wDPPkRpOjbj4BKqn9sbakCYo8ajG7ifNGvmWVlCo4ZvYPgldBkc3LVDID1A5IV7qSxSgdCLQTgm9coODWR2TeO_dcMlldHy73I9tgGuf2qmbeoz0deuzl1U0LAMz6mzk9rJaMC-CIrbMwQfNSv-49UJEpfPQnDju_1IUr2Z2pqF9F4oHtC4ubx1nmzuEqowC4eXVwD5_Xg6V58pXgM4u2vJiLm8H60uaqukLjG'
        });
      }

      if (dayPlan.dinner) {
        meals.push({
          id: mealId++,
          title: dayPlan.dinner,
          mealType: 'Dinner',
          description: 'AI-generated delicious dinner',
          ingredients: 'Fresh ingredients as specified in recipe',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2eVGaWbte2gFS_pBWSR6fz5avyekicVb6K5brRzW4L0-uiK-3E5p3fQX2eHPfXTH55ZHquAuxjxa4jovhcXYVQuvmHth5Vt2XSSDWQatGJ0E_oTjyIrGtf7PhSntCrxR3j6U9ZprQNMj8iO4X8si1RVQCD2eDi0tCHQjLO26BnNy2BvhASZgGwHL5AIqYkRiO75o07b4UF8_vN27bKVDO6Zm3Chryo3i92g5ftIM4x9bZs34fZzIFkur75VHpvJz8ckkkWojeY_l3'
        });
      }

      if (dayPlan.snacks) {
        meals.push({
          id: mealId++,
          title: dayPlan.snacks,
          mealType: 'Snacks',
          description: 'AI-generated healthy snacks',
          ingredients: 'Fresh ingredients as specified in recipe',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvHPEyHbXMYRPNfYCEHt8P_08oU6cxYE5jGXEH0YwzyFFHdBslrH1miyP5zZldoxPo6yYc7XRvOZBmP_SAOh7yXSUR77M5sWsDb0knV8m2oNZ-980AqkQVzxC5dZwL6OLw2xYPEQBC5_AEOw05Eb1VZv-TVnjqMogZTdU294DCdBim8rXp8GpLg6Td4rFy7eBMEK0tV1GN9U5jCTElezYFxJcOvxfTr9g5dU_rhXuNtgKbXPUXXqAhWWqkkqV-KGivKHtJ8cGmsFP0'
        });
      }

      return {
        day: dayPlan.day,
        meals: meals
      };
    });
  };

  const handleQuickViewRecipe = (mealId: number) => {
    Alert.alert(
      'Recipe Details',
      'Recipe view functionality will be implemented in the next phase. For now, this shows the meal ID: ' + mealId,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.designRoot}>
        {/* Header - template: flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Recipe Book</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Action Buttons - template: flex justify-stretch px-4 py-3 */}
        <View style={styles.actionSection}>
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.browseButton, loading && styles.buttonDisabled]} 
              onPress={handleBrowseRecipes}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.textDark} />
              ) : (
                <Text style={styles.browseButtonText}>Browse Recipes</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.generateButton, isGenerating && styles.buttonDisabled]} 
              onPress={handleGenerateNew}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color={Colors.backgroundDark} />
              ) : (
                <Text style={styles.generateButtonText}>Generate New</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Menu Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {weeklyMenuData.map((dayData) => (
            <View key={dayData.day} style={styles.daySection}>
              {/* Day Title - template: text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] py-4 */}
              <Text style={styles.dayTitle}>{dayData.day}</Text>
              
              {/* Meals - template: space-y-4 */}
              <View style={styles.mealsContainer}>
                {dayData.meals.map((meal) => (
                  <View key={meal.id} style={styles.mealCard}>
                    {/* Recipe Image - template: w-full h-48 bg-center bg-no-repeat aspect-square bg-cover rounded-xl */}
                    <Image source={{ uri: meal.image }} style={styles.mealImage} />
                    
                    {/* Recipe Info - template: flex flex-col gap-1 flex-1 */}
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealTitle}>{meal.title}</Text>
                      <Text style={styles.mealDescription}>
                        {meal.mealType} - {meal.description}
                      </Text>
                      <Text style={styles.mealIngredients}>
                        Key Ingredients: {meal.ingredients}
                      </Text>
                    </View>
                    
                    {/* Quick View Button - template: flex items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-background-dark */}
                    <TouchableOpacity 
                      style={styles.quickViewButton}
                      onPress={() => handleQuickViewRecipe(meal.id)}
                    >
                      <Text style={styles.quickViewButtonText}>Quick View Recipe</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
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

  backIcon: {
    color: Colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  headerTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },

  placeholder: {
    width: 48,
  },
  
  // Action Section - template: flex justify-stretch px-4 py-3
  actionSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  // Browse Button - template: bg-zinc-200 dark:bg-[#29382f] text-black dark:text-white
  browseButton: {
    flex: 1,
    minWidth: 84,
    maxWidth: 480,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#29382f',
    paddingHorizontal: 20,
  },

  browseButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  // Generate Button - template: bg-primary text-background-dark
  generateButton: {
    flex: 1,
    minWidth: 84,
    maxWidth: 480,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
  },

  generateButtonText: {
    color: Colors.backgroundDark,
    fontSize: 16,
    fontWeight: '700',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  
  // Day Section
  daySection: {
    marginBottom: 16,
  },

  // Day Title - template: text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] py-4
  dayTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 16,
  },

  // Meals Container - template: space-y-4
  mealsContainer: {
    gap: 16,
  },

  // Meal Card - template: flex flex-col gap-4 rounded-xl bg-zinc-100 dark:bg-[#19241c] p-4
  mealCard: {
    flexDirection: 'column',
    gap: 16,
    borderRadius: 12,
    backgroundColor: '#19241c',
    padding: 16,
  },

  // Meal Image - template: w-full h-48 bg-center bg-no-repeat aspect-square bg-cover rounded-xl
  mealImage: {
    width: '100%',
    height: 192, // h-48 = 12rem = 192px
    borderRadius: 12,
    backgroundColor: Colors.cardSecondary,
  },

  // Meal Info - template: flex flex-col gap-1 flex-1
  mealInfo: {
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },

  // Meal Title - template: text-black dark:text-white text-base font-bold leading-tight
  mealTitle: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  // Meal Description - template: text-zinc-500 dark:text-[#9eb7a8] text-sm font-normal leading-normal
  mealDescription: {
    color: '#9eb7a8',
    fontSize: 14,
    fontWeight: '400',
  },

  // Meal Ingredients - template: text-zinc-500 dark:text-[#9eb7a8] text-sm font-normal leading-normal
  mealIngredients: {
    color: '#9eb7a8',
    fontSize: 14,
    fontWeight: '400',
  },

  // Quick View Button - template: flex items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-background-dark
  quickViewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
  },

  quickViewButtonText: {
    color: Colors.backgroundDark,
    fontSize: 16,
    fontWeight: '700',
  },

  scrollContent: {
    paddingBottom: 100, // Footer height + extra spacing
  },

  // Button disabled state
  buttonDisabled: {
    opacity: 0.6,
  },
});