import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

// Sample weekly menu data from template
const weeklyMenuData = [
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
  const handleBack = () => {
    console.log('Back pressed');
  };

  const handleBrowseRecipes = () => {
    console.log('Browse Recipes pressed');
  };

  const handleGenerateNew = () => {
    console.log('Generate New pressed');
  };

  const handleQuickViewRecipe = (mealId: number) => {
    console.log('Quick View Recipe:', mealId);
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
            <TouchableOpacity style={styles.browseButton} onPress={handleBrowseRecipes}>
              <Text style={styles.browseButtonText}>Browse Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateNew}>
              <Text style={styles.generateButtonText}>Generate New</Text>
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
});