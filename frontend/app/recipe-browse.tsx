import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';

const { width } = Dimensions.get('window');

// Responsive breakpoints
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;
const isLargeScreen = width >= 414;

const getResponsiveSpacing = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

const getResponsiveFontSize = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

export default function RecipeBrowse() {
  const router = useRouter();

  // Sample recipe data based on template
  const recipes = [
    {
      day: 'Monday',
      meals: [
        {
          name: 'Avocado Toast with Egg',
          type: 'Breakfast - A healthy and quick breakfast option.',
          ingredients: 'Key Ingredients: Avocado, egg, whole-wheat bread, salt, pepper.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIyN4C4neKWgZwHxY0C9G63qCsKhPzaSDSIZqn1CCeOXYAZawiwyWu3GzWn6AxZ5yogHB5XxWj6QnxMResKqmdm0YKgzQRmhdPG4FSCxYWe3kP36qh4KHNLssccEF-O-hGB_9QwYdehXD-j3C-zrxZkBUeg-qkgxF5DE5IpyoF4rfvYrhz3ZI7C_LgR2N9AdaPKFuhufNzTN8r8A8WNgbJer9kORgz46d9IzjkD-duj3LjIkNR05xiM4tmoB8M6va79Gt1yLxIKuWx'
        },
        {
          name: 'Quinoa Salad with Grilled Chicken',
          type: 'Lunch - A light and protein-rich salad.',
          ingredients: 'Key Ingredients: Quinoa, grilled chicken, cucumber, tomatoes, lemon vinaigrette.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmuvZco8ev-noSac-L6ZkDfTNgCpAn1qNSOJfb-wDPPkRpOjbj4BKqn9sbakCYo8ajG7ifNGvmWVlCo4ZvYPgldBkc3LVDID1A5IV7qSxSgdCLQTgm9coODWR2TeO_dcMlldHy73I9tgGuf2qmbeoz0deuzl1U0LAMz6mzk9rJaMC-CIrbMwQfNSv-49UJEpfPQnDju_1IUr2Z2pqF9F4oHtC4ubx1nmzuEqowC4eXVwD5_Xg6V58pXgM4u2vJiLm8H60uaqukLjG'
        },
        {
          name: 'Salmon with Roasted Vegetables',
          type: 'Dinner - A flavorful and balanced meal.',
          ingredients: 'Key Ingredients: Salmon fillet, broccoli, bell peppers, olive oil, herbs.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2eVGaWbte2gFS_pBWSR6fz5avyekicVb6K5brRzW4L0-uiK-3E5p3fQX2eHPfXTH55ZHquAuxjxa4jovhcXYVQuvmHth5Vt2XSSDWQatGJ0E_oTjyIrGtf7PhSntCrxR3j6U9ZprQNMj8iO4X8si1RVQCD2eDi0tCHQjLO26BnNy2BvhASZgGwHL5AIqYkRiO75o07b4UF8_vN27bKVDO6Zm3Chryo3i92g5ftIM4x9bZs34fZzIFkur75VHpvJz8ckkkWojeY_l3'
        }
      ]
    },
    {
      day: 'Tuesday',
      meals: [
        {
          name: 'Greek Yogurt with Berries',
          type: 'Breakfast - A simple and nutritious start to your day.',
          ingredients: 'Key Ingredients: Greek yogurt, mixed berries, honey (optional).',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvHPEyHbXMYRPNfYCEHt8P_08oU6cxYE5jGXEH0YwzyFFHdBslrH1miyP5zZldoxPo6yYc7XRvOZBmP_SAOh7yXSUR77M5sWsDb0knV8m2oNZ-980AqkQVzxC5dZwL6OLw2xYPEQBC5_AEOw05Eb1VZv-TVnjqMogZTdU294DCdBim8rXp8GpLg6Td4rFy7eBMEK0tV1GN9U5jCTElezYFxJcOvxfTr9g5dU_rhXuNtgKbXPUXXqAhWWqkkqV-KGivKHtJ8cGmsFP0'
        },
        {
          name: 'Lentil Soup',
          type: 'Lunch - A hearty and comforting vegetarian soup.',
          ingredients: 'Key Ingredients: Lentils, carrots, celery, onion, vegetable broth.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl6L__ihitd8mBmPcDvQvgC5P-eJR6xcSVJotrNQMHrz8Ad-7s9xXGsb41jIFVyURjx3370bCHOC1aTnmqEEoGcTPPY3Kpg550cWIbd2xBZBDDG1jpj4-P9XtK7gJgpM5uM8XRO5gmq7BlGP-BQnxXooG5a7R018fPqXZnvuHqe4do65feZElkQcw3MV7yISXwIfm4e8Y2FHhCeftkao9ABhB0elsdmNosHQ3W1LSi7nHaibwN48Apqm6HParALtQk2WpWTzScgAyg'
        }
      ]
    }
  ];

  const handleBack = () => {
    router.back();
  };

  const handleQuickViewRecipe = (recipeName: string) => {
    // Quick view functionality
    console.log('Quick view recipe:', recipeName);
  };

  const handleGenerateNew = () => {
    // Generate new recipes
    console.log('Generate new recipes');
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
          <Text style={styles.headerTitle}>Your Recipe Book</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.back()}
          >
            <Text style={styles.actionButtonText}>Browse Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryActionButton]}
            onPress={handleGenerateNew}
          >
            <Text style={styles.primaryActionButtonText}>Generate New</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe List */}
        <ScrollView style={styles.recipeList} showsVerticalScrollIndicator={false}>
          {recipes.map((dayGroup, dayIndex) => (
            <View key={dayIndex}>
              <Text style={styles.dayTitle}>{dayGroup.day}</Text>
              <View style={styles.mealSection}>
                {dayGroup.meals.map((meal, mealIndex) => (
                  <View key={mealIndex} style={styles.recipeCard}>
                    <Image 
                      source={{ uri: meal.image }} 
                      style={styles.recipeImage}
                      resizeMode="cover"
                    />
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeName}>{meal.name}</Text>
                      <Text style={styles.recipeType}>{meal.type}</Text>
                      <Text style={styles.recipeIngredients}>{meal.ingredients}</Text>
                      <TouchableOpacity 
                        style={styles.viewRecipeButton}
                        onPress={() => handleQuickViewRecipe(meal.name)}
                      >
                        <Text style={styles.viewRecipeButtonText}>Quick View Recipe</Text>
                      </TouchableOpacity>
                    </View>
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

  headerSpacer: {
    width: 48,
  },

  // Action Buttons - template: flex justify-stretch px-4 py-3
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'stretch',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.lg,
  },

  actionButton: {
    flex: 1,
    minWidth: 84,
    maxWidth: 480,
    height: Spacing.heights.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardSecondary,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.padding.lg,
  },

  actionButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  primaryActionButton: {
    backgroundColor: Colors.primary,
  },

  primaryActionButtonText: {
    color: Colors.backgroundDark,
    fontSize: 16,
    fontWeight: '700',
  },

  // Recipe List
  recipeList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Day Title - template: text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] py-4
  dayTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: Spacing.lg,
  },

  // Meal Section - template: space-y-4
  mealSection: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  // Recipe Card - template: flex flex-col gap-4 rounded-xl bg-zinc-100 dark:bg-[#19241c] p-4
  recipeCard: {
    flexDirection: 'column',
    gap: Spacing.lg,
    backgroundColor: Colors.cardSecondary,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
  },

  // Recipe Image - template: w-full h-48 bg-center bg-no-repeat aspect-square bg-cover rounded-xl
  recipeImage: {
    width: '100%',
    height: 192,
    borderRadius: Spacing.borderRadius.lg,
  },

  // Recipe Info - template: flex flex-col gap-1 flex-1
  recipeInfo: {
    flexDirection: 'column',
    gap: Spacing.xs,
    flex: 1,
  },

  // Recipe Name - template: text-black dark:text-white text-base font-bold leading-tight
  recipeName: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  // Recipe Type - template: text-zinc-500 dark:text-[#9eb7a8] text-sm font-normal leading-normal
  recipeType: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '400',
  },

  // Recipe Ingredients - template: text-zinc-500 dark:text-[#9eb7a8] text-sm font-normal leading-normal
  recipeIngredients: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '400',
  },

  // View Recipe Button - template: flex items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em]
  viewRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Spacing.heights.button,
    backgroundColor: Colors.primary,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.padding.lg,
    overflow: 'hidden',
  },

  viewRecipeButtonText: {
    color: Colors.backgroundDark,
    fontSize: 16,
    fontWeight: '700',
  },
});