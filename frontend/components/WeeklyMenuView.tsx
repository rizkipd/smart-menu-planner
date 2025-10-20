import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Meal {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner';
  description: string;
  ingredients: string;
  image: string;
}

interface DayMeals {
  day: string;
  meals: Meal[];
}

interface WeeklyMenuViewProps {
  onBack: () => void;
  onBrowseRecipes: () => void;
  onGenerateNew: () => void;
  onViewRecipe: (meal: Meal) => void;
  weeklyPlan?: any[]; // Optional weekly plan from API
}

const weeklyData: DayMeals[] = [
  {
    day: 'Monday',
    meals: [
      {
        id: 'mon-breakfast',
        name: 'Avocado Toast with Egg',
        type: 'Breakfast',
        description: 'A healthy and quick breakfast option.',
        ingredients: 'Avocado, egg, whole-wheat bread, salt, pepper.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIyN4C4neKWgZwHxY0C9G63qCsKhPzaSDSIZqn1CCeOXYAZawiwyWu3GzWn6AxZ5yogHB5XxWj6QnxMResKqmdm0YKgzQRmhdPG4FSCxYWe3kP36qh4KHNLssccEF-O-hGB_9QwYdehXD-j3C-zrxZkBUeg-qkgxF5DE5IpyoF4rfvYrhz3ZI7C_LgR2N9AdaPKFuhufNzTN8r8A8WNgbJer9kORgz46d9IzjkD-duj3LjIkNR05xiM4tmoB8M6va79Gt1yLxIKuWx',
      },
      {
        id: 'mon-lunch',
        name: 'Quinoa Salad with Grilled Chicken',
        type: 'Lunch',
        description: 'A light and protein-rich salad.',
        ingredients: 'Quinoa, grilled chicken, cucumber, tomatoes, lemon vinaigrette.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmuvZco8ev-noSac-L6ZkDfTNgCpAn1qNSOJfb-wDPPkRpOjbj4BKqn9sbakCYo8ajG7ifNGvmWVlCo4ZvYPgldBkc3LVDID1A5IV7qSxSgdCLQTgm9coODWR2TeO_dcMlldHy73I9tgGuf2qmbeoz0deuzl1U0LAMz6mzk9rJaMC-CIrbMwQfNSv-49UJEpfPQnDju_1IUr2Z2pqF9F4oHtC4ubx1nmzuEqowC4eXVwD5_Xg6V58pXgM4u2vJiLm8H60uaqukLjG',
      },
      {
        id: 'mon-dinner',
        name: 'Salmon with Roasted Vegetables',
        type: 'Dinner',
        description: 'A flavorful and balanced meal.',
        ingredients: 'Salmon fillet, broccoli, bell peppers, olive oil, herbs.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2eVGaWbte2gFS_pBWSR6fz5avyekicVb6K5brRzW4L0-uiK-3E5p3fQX2eHPfXTH55ZHquAuxjxa4jovhcXYVQuvmHth5Vt2XSSDWQatGJ0E_oTjyIrGtf7PhSntCrxR3j6U9ZprQNMj8iO4X8si1RVQCD2eDi0tCHQjLO26BnNy2BvhASZgGwHL5AIqYkRiO75o07b4UF8_vN27bKVDO6Zm3Chryo3i92g5ftIM4x9bZs34fZzIFkur75VHpvJz8ckkkWojeY_l3',
      },
    ],
  },
  {
    day: 'Tuesday',
    meals: [
      {
        id: 'tue-breakfast',
        name: 'Greek Yogurt with Berries',
        type: 'Breakfast',
        description: 'A simple and nutritious start to your day.',
        ingredients: 'Greek yogurt, mixed berries, honey (optional).',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvHPEyHbXMYRPNfYCEHt8P_08oU6cxYE5jGXEH0YwzyFFHdBslrH1miyP5zZldoxPo6yYc7XRvOZBmP_SAOh7yXSUR77M5sWsDb0knV8m2oNZ-980AqkQVzxC5dZwL6OLw2xYPEQBC5_AEOw05Eb1VZv-TVnjqMogZTdU294DCdBim8rXp8GpLg6Td4rFy7eBMEK0tV1GN9U5jCTElezYFxJcOvxfTr9g5dU_rhXuNtgKbXPUXXqAhWWqkkqV-KGivKHtJ8cGmsFP0',
      },
      {
        id: 'tue-lunch',
        name: 'Lentil Soup',
        type: 'Lunch',
        description: 'A hearty and comforting vegetarian soup.',
        ingredients: 'Lentils, carrots, celery, onion, vegetable broth.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl6L__ihitd8mBmPcDvQvgC5P-eJR6xcSVJotrNQMHrz8Ad-7s9xXGsb41jIFVyURjx3370bCHOC1aTnmqEEoGcTPPY3Kpg550cWIbd2xBZBDDG1jpj4-P9XtK7gJgpM5uM8XRO5gmq7BlGP-BQnxXooG5a7R018fPqXZnvuHqe4do65feZElkQcw3MV7yISXwIfm4e8Y2FHhCeftkao9ABhB0elsdmNosHQ3W1LSi7nHaibwN48Apqm6HParALtQk2WpWTzScgAyg',
      },
      {
        id: 'tue-dinner',
        name: 'Chicken Stir-fry',
        type: 'Dinner',
        description: 'A quick and customizable weeknight meal.',
        ingredients: 'Chicken breast, mixed vegetables, soy sauce, ginger, garlic.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCk2oj3r_R1-m2SjfU00dLtqZ69954cHeFO1FqAfw2Zq4u8iQf0uhOBqBvplpDdduB2_zFAcOlM3U8pstFoBg-0QIX8eKA1fR8WEtaN43ijfIIzQIN9P5JQH16Z0ZsspWiLp0FjFGISMfjiKLdvk8G9xDBNtHcmbuWUJlxwWkcfWuiQmJLorVxnii9TVbSTBN3Qc__63TFTrRgejVGEbFiNM_qSfgsmWYiMngFHMd3wWjuA0bqX7ZxSBaF9BeCAXpJ6nYEf4qKpLhC8',
      },
    ],
  },
  {
    day: 'Wednesday',
    meals: [
      {
        id: 'wed-breakfast',
        name: 'Oatmeal with Nuts and Seeds',
        type: 'Breakfast',
        description: 'A warm and filling breakfast to power your day.',
        ingredients: 'Rolled oats, milk (or water), mixed nuts, chia seeds, fruit.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY7_WyIVPXuWRAB7MjeKBMsSpemGoGo3K9_gTa-7hu5l1xfInF0yEO7WUk05gOu8-Gj-U4_bjZKAvReaqcvWwK3sTVUzl-y9DRTbzCsAhZF-6gAm1XmjDaaFeTjSzp67jq_w-5sVQsP0LwjYW-dZLwLD-nqk50ZY6MKViJy9HGdRKQrycItROWgTSDR5xNRn8Api_6l55ZIBBJPYaVPljqItttiTzn7tPzIcyzgbv6zO5-Hdb4pDZ_QF6XHtWVu6QEguFL7PQt2sLb',
      },
      {
        id: 'wed-lunch',
        name: 'Caprese Salad',
        type: 'Lunch',
        description: 'A refreshing and simple Italian classic.',
        ingredients: 'Fresh mozzarella, ripe tomatoes, basil, balsamic glaze, olive oil.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX96twYdr1BZkKqfqlWnrN1I0_VUw_J-Xad_oHpfL7VNO34kD3x1nxoJnd3bGYymy46vW5U7iOR0v57q8rL_KsG_FfU6-3vijtpGY_gGAknkDCczl0KbXLnIzy0vzZacUVmk9Own_4Ega3oOMr5YBxMloOm4RFEn5nyPOR7sygD3MWRhT-UDg5ioUOTTgUc5AUTh00I7KqiUgkUlVt-Xlq6ol2EiGjYVgmKbkGvCDhhHJvoTO2KXeD3gVTrkogZcRv6aDCRjHX3gQv',
      },
      {
        id: 'wed-dinner',
        name: 'Pasta with Pesto and Cherry Tomatoes',
        type: 'Dinner',
        description: 'A quick and flavorful vegetarian pasta dish.',
        ingredients: 'Pasta, basil pesto, cherry tomatoes, Parmesan cheese.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcL8gYmC2Xxf-CIFyedna0uuUjxoywY2kqTXKsr6jp4uFUZsGRT7Gtnudc8m0fIc-z9a_7mdzJvTQl312tIwp2MTyoccUs-KrjvbgAV4cFwAbtUZOuqw3pvuwCRyaXQXzbrxp-Vx9_zMHdO0bDFjx-BsHT8VyMCPozb8VGbi3AcoR6HQbyFhFgOdywLKfEEUAtfLCRP0FoF9qT0u88DnU9kTCCjqaqQCz5eTESiY3-JUAlNJJU58jSZBx08QOwKaugq5lVY6dv5U6A',
      },
    ],
  },
];

export default function WeeklyMenuView({ 
  onBack, 
  onBrowseRecipes, 
  onGenerateNew, 
  onViewRecipe,
  weeklyPlan 
}: WeeklyMenuViewProps) {

  // Convert API data to component format if available
  const displayData = weeklyPlan ? weeklyPlan.map((day: any) => ({
    day: day.day,
    meals: [
      {
        id: `${day.day}-breakfast`,
        name: day.breakfast,
        type: 'Breakfast',
        description: 'A healthy meal option.',
        ingredients: 'Fresh ingredients and spices.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIyN4C4neKWgZwHxY0C9G63qCsKhPzaSDSIZqn1CCeOXYAZawiwyWu3GzWn6AxZ5yogHB5XxWj6QnxMResKqmdm0YKgzQRmhdPG4FSCxYWe3kP36qh4KHNLssccEF-O-hGB_9QwYdehXD-j3C-zrxZkBUeg-qkgxF5DE5IpyoF4rfvYrhz3ZI7C_LgR2N9AdaPKFuhufNzTN8r8A8WNgbJer9kORgz46d9IzjkD-duj3LjIkNR05xiM4tmoB8M6va79Gt1yLxIKuWx',
      },
      {
        id: `${day.day}-lunch`,
        name: day.lunch,
        type: 'Lunch',
        description: 'A delicious meal option.',
        ingredients: 'Fresh ingredients and spices.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNmuvZco8ev-noSac-L6ZkDfTNgCpAn1qNSOJfb-wDPPkRpOjbj4BKqn9sbakCYo8ajG7ifNGvmWVlCo4ZvYPgldBkc3LVDID1A5IV7qSxSgdCLQTgm9coODWR2TeO_dcMlldHy73I9tgGuf2qmbeoz0deuzl1U0LAMz6mzk9rJaMC-CIrbMwQfNSv-49UJEpfPQnDju_1IUr2Z2pqF9F4oHtC4ubx1nmzuEqowC4eXVwD5_Xg6V58pXgM4u2vJiLm8H60uaqukLjG',
      },
      {
        id: `${day.day}-dinner`,
        name: day.dinner,
        type: 'Dinner',
        description: 'A flavorful meal option.',
        ingredients: 'Fresh ingredients and spices.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2eVGaWbte2gFS_pBWSR6fz5avyekicVb6K5brRzW4L0-uiK-3E5p3fQX2eHPfXTH55ZHquAuxjxa4jovhcXYVQuvmHth5Vt2XSSDWQatGJ0E_oTjyIrGtf7PhSntCrxR3j6U9ZprQNMj8iO4X8si1RVQCD2eDi0tCHQjLO26BnNy2BvhASZgGwHL5AIqYkRiO75o07b4UF8_vN27bKVDO6Zm3Chryo3i92g5ftIM4x9bZs34fZzIFkur75VHpvJz8ckkkWojeY_l3',
      }
    ]
  })) : weeklyData;

  const renderMealCard = (meal: Meal) => (
    <View key={meal.id} style={styles.mealCard}>
      <View style={styles.mealImageContainer}>
        <Image
          source={{ uri: meal.image }}
          style={styles.mealImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.mealContent}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealDescription}>
          {meal.type} - {meal.description}
        </Text>
        <Text style={styles.mealIngredients}>
          Key Ingredients: {meal.ingredients}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.viewRecipeButton}
        onPress={() => onViewRecipe(meal)}
        activeOpacity={0.9}
      >
        <Text style={styles.viewRecipeButtonText}>Quick View Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDaySection = (dayData: DayMeals) => (
    <View key={dayData.day}>
      <Text style={styles.dayTitle}>{dayData.day}</Text>
      <View style={styles.mealsContainer}>
        {dayData.meals.map(renderMealCard)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f6f8f7" />
      
      {/* Exact template structure */}
      <View style={styles.designRoot}>
        {/* Header exactly matching template */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Recipe Book</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Action buttons exactly matching template */}
        <View style={styles.actionContainer}>
          <View style={styles.actionButtonsWrapper}>
            <TouchableOpacity
              style={[styles.actionButton, styles.browseButton]}
              onPress={onBrowseRecipes}
              activeOpacity={0.9}
            >
              <Text style={styles.browseButtonText}>Browse Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.generateButton]}
              onPress={onGenerateNew}
              activeOpacity={0.9}
            >
              <Text style={styles.generateButtonText}>Generate New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content exactly matching template */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {displayData.map(renderDaySection)}
        </ScrollView>
      </View>
    </View>
  );
}

// Exact template CSS converted to React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  designRoot: {
    position: 'relative', // template relative
    flexDirection: 'column', // template flex-col
    height: '100%', // template h-auto min-h-screen
    minHeight: 884, // template min-h-screen
    width: '100%', // template w-full
    backgroundColor: '#f6f8f7', // template bg-background-light dark:bg-background-dark
    overflow: 'hidden', // template overflow-x-hidden
  },
  // Header exactly matching template
  header: {
    flexDirection: 'row', // template flex
    alignItems: 'center', // template items-center
    backgroundColor: '#f6f8f7', // template bg-background-light dark:bg-background-dark
    paddingHorizontal: 16, // template p-4
    paddingVertical: 8, // template pb-2
    justifyContent: 'space-between', // template justify-between
    position: 'relative', // template sticky top-0 z-10
    zIndex: 10,
  },
  backButton: {
    color: 'white', // template text-white
    flexDirection: 'row', // template flex
    width: 48, // template size-12
    height: 48,
    flexShrink: 0, // template shrink-0
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
  },
  headerTitle: {
    color: 'black', // template text-black dark:text-white
    fontSize: 18, // template text-lg
    fontWeight: '700', // template font-bold
    lineHeight: 28, // template leading-tight
    letterSpacing: -0.015 * 18, // template tracking-[-0.015em]
    flex: 1, // template flex-1
    textAlign: 'center', // template text-center
  },
  headerSpacer: {
    width: 48, // template w-12
  },
  // Action buttons exactly matching template
  actionContainer: {
    justifyContent: 'stretch', // template justify-stretch
    paddingHorizontal: 16, // template px-4
    paddingVertical: 12, // template py-3
  },
  actionButtonsWrapper: {
    flexDirection: 'row', // template flex
    flex: 1, // template flex-1
    gap: 12, // template gap-3
    flexWrap: 'wrap', // template flex-wrap
    justifyContent: 'flex-start', // template justify-start
  },
  actionButton: {
    flex: 1, // template flex-1
    minWidth: 84, // template min-w-[84px]
    maxWidth: 480, // template max-w-[480px]
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    overflow: 'hidden', // template overflow-hidden
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    paddingHorizontal: 20, // template px-5
  },
  browseButton: {
    backgroundColor: '#e4e4e7', // template bg-zinc-200 dark:bg-[#29382f]
  },
  browseButtonText: {
    color: 'black', // template text-black dark:text-white
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 24, // template leading-normal
    letterSpacing: 0.015 * 16, // template tracking-[0.015em]
  },
  generateButton: {
    backgroundColor: '#38e07b', // template bg-primary
  },
  generateButtonText: {
    color: '#111714', // template text-background-dark
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 24, // template leading-normal
    letterSpacing: 0.015 * 16, // template tracking-[0.015em]
  },
  // Content exactly matching template
  scrollContainer: {
    paddingHorizontal: 16, // template px-4
    paddingBottom: 16, // template pb-4
  },
  scrollContent: {
    paddingBottom: 16,
  },
  dayTitle: {
    color: 'black', // template text-black dark:text-white
    fontSize: 18, // template text-lg
    fontWeight: '700', // template font-bold
    lineHeight: 28, // template leading-tight
    letterSpacing: -0.015 * 18, // template tracking-[-0.015em]
    paddingVertical: 16, // template py-4
  },
  mealsContainer: {
    gap: 16, // template space-y-4
  },
  // Meal cards exactly matching template
  mealCard: {
    flexDirection: 'column', // template flex-col
    gap: 16, // template gap-4
    borderRadius: 12, // template rounded-xl
    backgroundColor: '#f4f4f5', // template bg-zinc-100 dark:bg-[#19241c]
    padding: 16, // template p-4
  },
  mealImageContainer: {
    width: '100%', // template w-full
    height: 192, // template h-48
    backgroundColor: 'transparent', // template bg-center bg-no-repeat
    borderRadius: 12, // template rounded-xl
    overflow: 'hidden',
    aspectRatio: 1, // template aspect-square
  },
  mealImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  mealContent: {
    flexDirection: 'column', // template flex-col
    gap: 4, // template gap-1
    flex: 1, // template flex-1
  },
  mealName: {
    color: 'black', // template text-black dark:text-white
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 24, // template leading-tight
  },
  mealDescription: {
    color: '#71717a', // template text-zinc-500 dark:text-[#9eb7a8]
    fontSize: 14, // template text-sm
    fontWeight: '400', // template font-normal
    lineHeight: 20, // template leading-normal
  },
  mealIngredients: {
    color: '#71717a', // template text-zinc-500 dark:text-[#9eb7a8]
    fontSize: 14, // template text-sm
    fontWeight: '400', // template font-normal
    lineHeight: 20, // template leading-normal
  },
  viewRecipeButton: {
    flexDirection: 'row', // template flex
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    overflow: 'hidden', // template overflow-hidden
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    paddingHorizontal: 20, // template px-5
    backgroundColor: '#38e07b', // template bg-primary
  },
  viewRecipeButtonText: {
    color: '#111714', // template text-background-dark
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 24, // template leading-normal
    letterSpacing: 0.015 * 16, // template tracking-[0.015em]
  },
});