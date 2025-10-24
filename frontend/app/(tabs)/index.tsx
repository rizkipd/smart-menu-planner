import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface Meal {
  title: string;
  type: string;
  image: string;
}

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<DayKey>('Mon');
  
  const days: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Sample meal data for different days
  const mealsByDay: Record<DayKey, Meal[]> = {
    Mon: [
      { title: 'Avocado Toast', type: 'Breakfast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNIEFsK9yTwAhtyRyhyMU2nRVahy4zYjevAsnKtjFlA2jcQPhWB37clljw3gx8lackUpURffYfR5CgCYCgVO4rFMLpnaPP4tSnDm_Zq20VESGo6sInCXwT82hQSVL3swPtPmdJy2pOrsPh-Zurc9Ky64JxAoDwR7UpCVcX0ThLStFoU8PKf5HR4HWpTadl4sb3XR0fVrRkeipSxQxmxBtuzzyy7p1JyJ9A1BlNvqAOSadZSU0_s7DDLgK6-6PYKLw6feiTM2CwIgT' },
      { title: 'Chicken Salad', type: 'Lunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwukDMt5cIZ79e5Ztal9eAtocmmME-J3qYrx6M9Gl6D-pOk_jAOiTNg6rf5VzcWfE-DRrssxUnNpJhMJ9lSpkSzin3V5Zq9FSZjNaO7dI6lpY4a-Ilq3WORRctyTX8DAXZkTxu9eQHe34q5M-eZ6SXZ1fsPD_jOTHqOAQXYZqf2I1GuZrc24LlkNudmNy7-b3QjPZ4cxhD8mDkuKCd76DuMEM8rZuAJNWWTa9d6yRfaOxvQXiBs3uhjN0SkBoUpVeZ2H5CifjLsKcN' },
      { title: 'Salmon with Veggies', type: 'Dinner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrSXNUPhakc0mEHQ8dDVXObjOs0Tj1kYFp4V32XAE70RoH5srRA6XwCXq52PyJ1FjCT1A9tcnDZn95f5BvhyTX5C5zwnOZdCirvxIMmbIstg41zoRs286QY4Xx_fCLyDyoFjCkeCIgpHaBxKKxuLie_nOzv_fv1n--zwxCxDnxfAVyJ8hkpBNLRmtdz7lvD8JdtCjHSbUO99Bd4EU2_3yH12zUFtoImVGCcBwUwS2eUdEzrW8Ev14UNWpzjXavni_xLzsvzVYhX9x5' }
    ],
    Tue: [
      { title: 'Greek Yogurt Bowl', type: 'Breakfast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj669boyQkRUDAYgDSupO40KGfXp57iEV-HTTP38UAmUiXvNep2gzkpATdQJpqFjlG7jGuUcYgQ9afmrNGkG3GJMNWUGFoY1V7MV3ti8KatUcVp3KFsavD8_GxVWxpIUH_fgZuQRsG0HtCqMs4fwlpa06HcPL6tcS2oUi7vYY-0aLfHy3nN6DonvFpcgZJTljcpkZ5pI41W_U_dPrIGywKXFQjQUaGhpuVIz9j9UeZ6HOva2d67s-6IFOZqAkOcPJwK4uNZ6FxyNcH' },
      { title: 'Quinoa Bowl', type: 'Lunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHBwuyUSMxDflK3eOSwsbPz80ZfEyreEQ5mxMTdZYdBqLpj9pgD5Iznd9dcCG8TCKdIEVUcTCAtSVEtxpZ1RVLjd7pIaCSjNVTz4uMTamX7UGlQEBaNccVXr6cFeKvYdV8CD87BcjdL5-ucLMXnKjlFhKMruUCsqkXWpjtpBggzINsBTh4Wl8fDTGsAO93XES-zwKJ6RBac1tmWukW3Zsg8YWOYNmVO6S-H1owEQgnv1nbh19p5fj7-xOUZvvY8uODiKIJpGbm7tMx' },
      { title: 'Grilled Chicken', type: 'Dinner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApAlB5RpGz8jvf6N7rvmtBtJqExwVz8rQ2TPt5WfoJl8fFl6tqtay9r5IN0p73bpd0GFJ-FP3RrWKCvm1BhI2xqY-pd6vTtF9TLKUcnFPe1EbmVs4UGBroyfzA3RcFlvUDUNeoUGi6rU0SYMw4yWfINvVl5wJV-VIeA4yn8DhQclh3z_yIYaLEz55G7HETHFkrcgfbbMJvYRbS0zMFPSz3r8HXJpqXvmAdE1wJDNH12NUp4dVzDfLESOjoUjarig_-ZXbGolRYsuZG' }
    ],
    Wed: [
      { title: 'Oatmeal with Berries', type: 'Breakfast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36hVghfRUe8XuNInYG2WEy-LEVWYYBSlWTIxfgSe-4kxm6s3O8l2E4K5GTEX9y9dJWsgn_wqAgUsiq0EBnFh5cMmUcHo0ms05AcmCm1ZYtvjCwQot_9oxvNA9tovtoS9PApBNvZnOXOBI4xjif8uY003XPMOeqBuv3BeJrmxq4GLaSwkGkhNbiqHh7BBcPtPuy5m2u5TO9ZpIPBt-8kr1JERJqvSPaukxaMkekguzB5cEF4idbNr-6BQidpvUOjbsUIEEduAvFhg3' },
      { title: 'Veggie Wrap', type: 'Lunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTot7g1GHPdpU3b3myBwFEZdgTSujZTVtjfBJazeY4xzPpbvTS9tLA4zNxk8rJ31lXdcZqsRlXkB289XpMNW3cj_jNBDJFNkBnJovQrecXWURcfZVgn-SZAewGMwZubA5b7t08jyzuzmLDVqzuCz42bEMmAtHq_3ciHnEDkGL8xM43CZvo6gOTOj9GPlxd44HeM99UK_2oazM0YpHCG1o2JY2TkBi_xcN8ItF5NmFC85uBHTy4kpbE38I3DqiSPN7Ze5zlMsYSf__' },
      { title: 'Fish Tacos', type: 'Dinner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtoFWfoB4lQsm9f_0595CqBI2ByV9xnCvw03CY55R7O8l8mM3EopmU1Nox1ft03g-skCszHWy9ifCObHyRsNXgRQWIKApAQLptImxsIzev5EE0nDJ6Pcd1Ej6T9Fdb1i9pCn0eUlKxl3EdU4AN_oNq7s4prDd7YmoSbtoNiqVv-EmKdTyuUTFtWl0elXEYG_8BZtOuIayCloWr4uQxotOwZPKf0zvaLh9hM48JyFlw85L5SuFxmKGAT0zVpljzxHd5sUY1BT7EB-0W' }
    ],
    Thu: [
      { title: 'Smoothie Bowl', type: 'Breakfast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRReTItIhwYVXvsh-JN9fH62OT_BDHjTTXEN4uDgKcvQTju8fo58mKFbj7vHYQOgi2K0fmKwpwI1bHI-pAXkv-oA4e3l43NAqT6On1yFD0LmuirWja6DQy8wbKyTQZ98dUd2g_A5uh5Hp2pc9JrbYeF_F9nvuHKp6ISkmBRQ0E5J9gXog24UltdN_f6MsUc331IhgX_DHW7bsIWMDXjVqgV9MI_uw1bZOKK8QpKslEVi0hXwnEcHM3Z4ksu3xf6upu8mbNUncUEzRH' },
      { title: 'Turkey Sandwich', type: 'Lunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLiQaqcLfAPCOW3MdnDcQaDPFjWTRKeGe86dui583TQ4c3Zd0IxBq28bLYEO_MApvyMYWqcu2NUJRmKMI2VxaDrl8cS7Hnp9x8YhXzA3c3e1beBgDKkz1gJO4A9Meb6f8fwoEm4kAFGmfUPrqNboEhl4cOU-AvRF9WWJX34_JA0PovmOPmmQ-q3OJzGqK4yDjjLDev3Za0Hl7cO7KCMxh2hhACA1YNAKCRa86GByfubU7iCy-EtVUMNxPHYBbzwYxd5HzvPT1O9aHm' },
      { title: 'Pasta Primavera', type: 'Dinner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHMVq4BToNbMUX_OOI7gWtHmrPVCFEnJ5py2RlrbeXkD5zGTB2ApslUzbh8SPPY1I8ErBvqgr4eMxJf_6VT6p6qx4M-gcScUmgGd-rBp9wmR3T5CXRvmlzK9f5e58evU7XZLwvJAqgoECMNa45kwt_HPUvokmDlOykJYERpUNeSD7lJ5Sm5cAPM4reobp6dfzmWhnKB8pEHjECTA2CwynT6qo3KVM0jazHEliSZY_J7zUd0OWWQHXRBLTqgmf1pyMeecEjSjdvFc2U' }
    ],
    Fri: [
      { title: 'Pancakes', type: 'Breakfast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Y6ugkCtQZGEErRD-bccUBECelKvVym-7BbeZCl03tODQMF7sJ0RWy9fRanJz1Ec8RRvdhLwH74Mz-eqzdRIcVCMkO5MtvviNEBqxZU5owWEG4B6tRfAfHF4AlJUpapEmE0ij_jbZf-aVl46qA6XrFrayWqYc_0Gfa9ODG2qKmAzRlPib9WgDc0VWRGhINZAukwYSFvkVaKsrg6n3qilAWFmXtuZAq77fXQo2NOEBFvFkemyeeiCmWHgllWmRwialY8-zH_Q1J6DP' },
      { title: 'Caesar Salad', type: 'Lunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUFsm5FXvjpx6VEZvQOD9bKKNQ3PDbcw3xMaAUNqi69_KK0zv9RFMWSDgrS8m5d8e4zB5OQd0cL1wqb1fs4MEuSCZ3AzyzZsjLz4bRRQVH6wOaNr1jlLRb0LkJc0rDCirVFISCEdHFDkTkeLS7JbxJqVEcCaC8i_wNy3Vo4r0YxhlOqDF65OukXePTIYg17g1VPJKURscMDKdyWGQ1egTBTDFXSLgkXqwLz5JdJJ35LQX7fB2lfRg8_fiBtJuBO7f0CZmKqssyGeM' },
      { title: 'Pizza Night', type: 'Dinner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0__-scAJoHM_i1ZczuC0BbCoikQVyvANdTRczZ8t4pPVrn2DhMcVOuQndarKHeRxzFewzd_eratsNypCCYtMvOY8rjkFoLQrhVxovg5TtOxdldMycSj-nM-1G6eCestxW8npsNtfmfKr8jkf2DD8HJ3hmaVqcRYn9yHYkXIA8unZK5DVOlZZOzCPPPSilaYIKFfyVbgj7l341rnE0OKrEoPrpDJy6WynLcua8NXtVYOYO8i5_FS22CLXVGP7y8ED51X-tkS2618Um' }
    ],
    Sat: [
      { title: 'French Toast', type: 'Breakfast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNIEFsK9yTwAhtyRyhyMU2nRVahy4zYjevAsnKtjFlA2jcQPhWB37clljw3gx8lackUpURffYfR5CgCYCgVO4rFMLpnaPP4tSnDm_Zq20VESGo6sInCXwT82hQSVL3swPtPmdJy2pOrsPh-Zurc9Ky64JxAoDwR7UpCVcX0ThLStFoU8PKf5HR4HWpTadl4sb3XR0fVrRkeipSxQxmxBtuzzyy7p1JyJ9A1BlNvqAOSadZSU0_s7DDLgK6-6PYKLw6feiTM2CwIgT' },
      { title: 'Brunch Special', type: 'Lunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYfqNWsrYbxAjP3Zhl39vHaxnkhRsuzKxemDGxWKKwv08kw_IA5jQRqtoy0QkDqkahZ-qFpC1lvY-LrLO1reB18v2AIIlIsJ7jhizpcDDuTXggg1rEqbdJK0r-wQJK1cPjCHGfBu_ss5BxEW6ZiAv-oWsqUgAABWfNSvb9ePaA8htBYJElT8EnafBlbdhVfjQ67bKv875GBOsNDqUg7fcQOO6gyDuCjLdFswxoEChogperfwpMQKW_bckHTquh3xHXpoM_AwASu3se' },
      { title: 'Weekend BBQ', type: 'Dinner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApAlB5RpGz8jvf6N7rvmtBtJqExwVz8rQ2TPt5WfoJl8fFl6tqtay9r5IN0p73bpd0GFJ-FP3RrWKCvm1BhI2xqY-pd6vTtF9TLKUcnFPe1EbmVs4UGBroyfzA3RcFlvUDUNeoUGi6rU0SYMw4yWfINvVl5wJV-VIeA4yn8DhQclh3z_yIYaLEz55G7HETHFkrcgfbbMJvYRbS0zMFPSz3r8HXJpqXvmAdE1wJDNH12NUp4dVzDfLESOjoUjarig_-ZXbGolRYsuZG' }
    ],
    Sun: [
      { title: 'Sunday Brunch', type: 'Breakfast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRReTItIhwYVXvsh-JN9fH62OT_BDHjTTXEN4uDgKcvQTju8fo58mKFbj7vHYQOgi2K0fmKwpwI1bHI-pAXkv-oA4e3l43NAqT6On1yFD0LmuirWja6DQy8wbKyTQZ98dUd2g_A5uh5Hp2pc9JrbYeF_F9nvuHKp6ISkmBRQ0E5J9gXog24UltdN_f6MsUc331IhgX_DHW7bsIWMDXjVqgV9MI_uw1bZOKK8QpKslEVi0hXwnEcHM3Z4ksu3xf6upu8mbNUncUEzRH' },
      { title: 'Light Soup', type: 'Lunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTot7g1GHPdpU3b3myBwFEZdgTSujZTVtjfBJazeY4xzPpbvTS9tLA4zNxk8rJ31lXdcZqsRlXkB289XpMNW3cj_jNBDJFNkBnJovQrecXWURcfZVgn-SZAewGMwZubA5b7t08jyzuzmLDVqzuCz42bEMmAtHq_3ciHnEDkGL8xM43CZvo6gOTOj9GPlxd44HeM99UK_2oazM0YpHCG1o2JY2TkBi_xcN8ItF5NmFC85uBHTy4kpbE38I3DqiSPN7Ze5zlMsYSf__' },
      { title: 'Sunday Roast', type: 'Dinner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrSXNUPhakc0mEHQ8dDVXObjOs0Tj1kYFp4V32XAE70RoH5srRA6XwCXq52PyJ1FjCT1A9tcnDZn95f5BvhyTX5C5zwnOZdCirvxIMmbIstg41zoRs286QY4Xx_fCLyDyoFjCkeCIgpHaBxKKxuLie_nOzv_fv1n--zwxCxDnxfAVyJ8hkpBNLRmtdz7lvD8JdtCjHSbUO99Bd4EU2_3yH12zUFtoImVGCcBwUwS2eUdEzrW8Ev14UNWpzjXavni_xLzsvzVYhX9x5' }
    ]
  };

  const currentMeals = mealsByDay[selectedDay];

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
              {days.map((day) => (
                <TouchableOpacity 
                  key={day}
                  style={[
                    styles.dayChip, 
                    selectedDay === day && styles.activeDayChip
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={selectedDay === day ? styles.activeDayText : styles.inactiveDayText}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Today's Meals */}
            <View style={styles.mealsContainer}>
              {currentMeals.map((meal: Meal, index: number) => (
                <View key={index} style={styles.mealCard}>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealTitle}>{meal.title}</Text>
                    <Text style={styles.mealType}>{meal.type}</Text>
                  </View>
                  <Image 
                    source={{ uri: meal.image }}
                    style={styles.mealImage}
                  />
                </View>
              ))}
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
                <MaterialIcons name="shopping-cart" size={32} color={Colors.primary} />
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
    paddingTop: Platform.OS === 'ios' ? 65 : 25, // Platform-specific status bar spacing
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