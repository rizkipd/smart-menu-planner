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

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.designRoot}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Smart Menu Planner</Text>
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialIcons 
                name="notifications" 
                size={24} 
                color={Colors.textDark} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Let's plan your meals for a healthier lifestyle
            </Text>
          </View>

          {/* Selected Menu Page - Full Content */}
          <View style={styles.selectedMenuSection}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Low-Carb Weekly Plan</Text>
              <Text style={styles.shareText}>Share</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={styles.activeTabText}>Meal Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.inactiveTabText}>Shopping List</Text>
              </TouchableOpacity>
            </View>

            {/* Day Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
              <TouchableOpacity style={[styles.dayChip, styles.activeDayChip]}>
                <Text style={styles.activeDayText}>Mon</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dayChip}>
                <Text style={styles.inactiveDayText}>Tue</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dayChip}>
                <Text style={styles.inactiveDayText}>Wed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dayChip}>
                <Text style={styles.inactiveDayText}>Thu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dayChip}>
                <Text style={styles.inactiveDayText}>Fri</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Today's Meals */}
            <View style={styles.mealsContainer}>
              {/* Breakfast */}
              <View style={styles.mealCard}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealTitle}>Avocado Toast</Text>
                  <Text style={styles.mealType}>Breakfast</Text>
                </View>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNIEFsK9yTwAhtyRyhyMU2nRVahy4zYjevAsnKtjFlA2jcQPhWB37clljw3gx8lackUpURffYfR5CgCYCgVO4rFMLpnaPP4tSnDm_Zq20VESGo6sInCXwT82hQSVL3swPtPmdJy2pOrsPh-Zurc9Ky64JxAoDwR7UpCVcX0ThLStFoU8PKf5HR4HWpTadl4sb3XR0fVrRkeipSxQxmxBtuzzyy7p1JyJ9A1BlNvqAOSadZSU0_s7DDLgK6-6PYKLw6feiTM2CwIgT' }}
                  style={styles.mealImage}
                />
              </View>

              {/* Lunch */}
              <View style={styles.mealCard}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealTitle}>Chicken Salad</Text>
                  <Text style={styles.mealType}>Lunch</Text>
                </View>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwukDMt5cIZ79e5Ztal9eAtocmmME-J3qYrx6M9Gl6D-pOk_jAOiTNg6rf5VzcWfE-DRrssxUnNpJhMJ9lSpkSzin3V5Zq9FSZjNaO7dI6lpY4a-Ilq3WORRctyTX8DAXZkTxu9eQHe34q5M-eZ6SXZ1fsPD_jOTHqOAQXYZqf2I1GuZrc24LlkNudmNy7-b3QjPZ4cxhD8mDkuKCd76DuMEM8rZuAJNWWTa9d6yRfaOxvQXiBs3uhjN0SkBoUpVeZ2H5CifjLsKcN' }}
                  style={styles.mealImage}
                />
              </View>

              {/* Dinner */}
              <View style={styles.mealCard}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealTitle}>Salmon with Veggies</Text>
                  <Text style={styles.mealType}>Dinner</Text>
                </View>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrSXNUPhakc0mEHQ8dDVXObjOs0Tj1kYFp4V32XAE70RoH5srRA6XwCXq52PyJ1FjCT1A9tcnDZn95f5BvhyTX5C5zwnOZdCirvxIMmbIstg41zoRs286QY4Xx_fCLyDyoFjCkeCIgpHaBxKKxuLie_nOzv_fv1n--zwxCxDnxfAVyJ8hkpBNLRmtdz7lvD8JdtCjHSbUO99Bd4EU2_3yH12zUFtoImVGCcBwUwS2eUdEzrW8Ev14UNWpzjXavni_xLzsvzVYhX9x5' }}
                  style={styles.mealImage}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.planActions}>
              <TouchableOpacity style={styles.regenerateButton}>
                <Text style={styles.regenerateButtonText}>Regenerate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.savePlanButton}>
                <Text style={styles.savePlanButtonText}>Save Plan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <MaterialIcons name="add" size={32} color={Colors.primary} />
                <Text style={styles.actionTitle}>Create Plan</Text>
                <Text style={styles.actionSubtitle}>Start a new meal plan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <MaterialIcons name="shopping_cart" size={32} color={Colors.primary} />
                <Text style={styles.actionTitle}>Shopping List</Text>
                <Text style={styles.actionSubtitle}>View ingredients needed</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  designRoot: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  
  header: {
    backgroundColor: Colors.backgroundDark,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  headerTitle: {
    color: Colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },
  
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundDarkAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  scrollContent: {
    paddingBottom: 100, // Footer height + extra spacing
  },
  
  welcomeSection: {
    marginBottom: Spacing.xxl,
  },
  
  welcomeTitle: {
    color: Colors.textDark,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  
  welcomeSubtitle: {
    color: Colors.textSecondaryDark,
    fontSize: 16,
  },

  selectedMenuSection: {
    marginBottom: Spacing.xxl,
  },

  selectedMenuCard: {
    backgroundColor: Colors.backgroundDarkAlt,
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },

  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  menuTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
  },

  shareText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '700',
  },

  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },

  activeTab: {
    borderBottomColor: Colors.primary,
  },

  activeTabText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  inactiveTabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700',
  },

  daySelector: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginBottom: 16,
  },

  dayChip: {
    height: 32,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeDayChip: {
    backgroundColor: Colors.primary + '33',
  },

  activeDayText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },

  inactiveDayText: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '500',
  },

  mealsContainer: {
    gap: 16,
    marginBottom: 24,
  },

  mealCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 16,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    padding: 16,
  },

  mealInfo: {
    flexDirection: 'column',
    gap: 4,
    flex: 2,
  },

  mealTitle: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  mealType: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
  },

  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.cardSecondary,
  },

  planActions: {
    flexDirection: 'row',
    gap: 16,
  },

  regenerateButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#374151',
  },

  regenerateButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  savePlanButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FF9800',
  },

  savePlanButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },
  
  quickActions: {
    marginBottom: Spacing.xxl,
  },
  
  sectionTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  
  actionGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  
  actionCard: {
    flex: 1,
    backgroundColor: Colors.backgroundDarkAlt,
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
  },
  
  actionTitle: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  
  actionSubtitle: {
    color: Colors.textSecondaryDark,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  
  recentSection: {
    marginBottom: Spacing.xxl,
  },
  
  planCard: {
    backgroundColor: Colors.backgroundDarkAlt,
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  
  planTitle: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  planDescription: {
    color: Colors.textSecondaryDark,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  
  planStatus: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
});