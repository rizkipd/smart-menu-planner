import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Meal {
  name: string;
  type: string;
  image: string;
}

interface SelectedMenuPageProps {
  onBack: () => void;
  planData?: any[];
  onShare?: () => void;
  onRegenerate?: () => void;
  onSavePlan?: () => void;
}

export default function SelectedMenuPage({ 
  onBack, 
  planData,
  onShare = () => {},
  onRegenerate = () => {},
  onSavePlan = () => {}
}: SelectedMenuPageProps) {
  const [activeTab, setActiveTab] = useState<'meal-plan' | 'shopping-list'>('meal-plan');
  const [selectedDay, setSelectedDay] = useState('Mon');
  
  // Safe area insets fallback for web and mobile
  const getSafeAreaInsets = () => {
    if (Platform.OS === 'web') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
    return { top: 44, bottom: 34, left: 0, right: 0 }; // iOS default safe area
  };
  
  const insets = getSafeAreaInsets();

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const mockMeals: Meal[] = [
    {
      name: 'Avocado Toast',
      type: 'Breakfast',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNIEFsK9yTwAhtyRyhyMU2nRVahy4zYjevAsnKtjFlA2jcQPhWB37clljw3gx8lackUpURffYfR5CgCYCgVO4rFMLpnaPP4tSnDm_Zq20VESGo6sInCXwT82hQSVL3swPtPmdJy2pOrsPh-Zurc9Ky64JxAoDwR7UpCVcX0ThLStFoU8PKf5HR4HWpTadl4sb3XR0fVrRkeipSxQxmxBtuzzyy7p1JyJ9A1BlNvqAOSadZSU0_s7DDLgK6-6PYKLw6feiTM2CwIgT',
    },
    {
      name: 'Chicken Salad',
      type: 'Lunch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwukDMt5cIZ79e5Ztal9eAtocmmME-J3qYrx6M9Gl6D-pOk_jAOiTNg6rf5VzcWfE-DRrssxUnNpJhMJ9lSpkSzin3V5Zq9FSZjNaO7dI6lpY4a-Ilq3WORRctyTX8DAXZkTxu9eQHe34q5M-eZ6SXZ1fsPD_jOTHqOAQXYZqf2I1GuZrc24LlkNudmNy7-b3QjPZ4cxhD8mDkuKCd76DuMEM8rZuAJNWWTa9d6yRfaOxvQXiBs3uhjN0SkBoUpVeZ2H5CifjLsKcN',
    },
    {
      name: 'Salmon with Veggies',
      type: 'Dinner',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrSXNUPhakc0mEHQ8dDVXObjOs0Tj1kYFp4V32XAE70RoH5srRA6XwCXq52PyJ1FjCT1A9tcnDZn95f5BvhyTX5C5zwnOZdCirvxIMmbIstg41zoRs286QY4Xx_fCLyDyoFjCkeCIgpHaBxKKxuLie_nOzv_fv1n--zwxCxDnxfAVyJ8hkpBNLRmtdz7lvD8JdtCjHSbUO99Bd4EU2_3yH12zUFtoImVGCcBwUwS2eUdEzrW8Ev14UNWpzjXavni_xLzsvzVYhX9x5',
    }
  ];

  const renderMealCard = (meal: Meal, index: number) => (
    <View key={index} style={styles.mealCard}>
      <View style={styles.mealContent}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealType}>{meal.type}</Text>
      </View>
      <View style={styles.mealImageContainer}>
        <Image
          source={{ uri: meal.image }}
          style={styles.mealImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );

  const renderDayChip = (day: string) => {
    const isSelected = selectedDay === day;
    return (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayChip,
          isSelected ? styles.dayChipSelected : styles.dayChipDefault
        ]}
        onPress={() => setSelectedDay(day)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dayChipText,
          isSelected ? styles.dayChipTextSelected : styles.dayChipTextDefault
        ]}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Low-Carb Weekly Plan</Text>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'meal-plan' ? styles.tabActive : styles.tabInactive
          ]}
          onPress={() => setActiveTab('meal-plan')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'meal-plan' ? styles.tabTextActive : styles.tabTextInactive
          ]}>
            Meal Plan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'shopping-list' ? styles.tabActive : styles.tabInactive
          ]}
          onPress={() => setActiveTab('shopping-list')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'shopping-list' ? styles.tabTextActive : styles.tabTextInactive
          ]}>
            Shopping List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Day Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.dayChipsContainer}
        contentContainerStyle={styles.dayChipsContent}
      >
        {days.map(renderDayChip)}
      </ScrollView>

      {/* Content */}
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mealsList}>
          {mockMeals.map(renderMealCard)}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
          style={styles.regenerateButton}
          onPress={onRegenerate}
          activeOpacity={0.8}
        >
          <Text style={styles.regenerateButtonText}>Regenerate</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={onSavePlan}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    zIndex: 10,
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
    color: '#333333',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.015,
  },
  shareButton: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
    letterSpacing: 0.015,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#F5F5F5',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 13,
    borderBottomWidth: 3,
  },
  tabActive: {
    borderBottomColor: '#4CAF50',
  },
  tabInactive: {
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.015,
  },
  tabTextActive: {
    color: '#4CAF50',
  },
  tabTextInactive: {
    color: '#9CA3AF',
  },
  dayChipsContainer: {
    backgroundColor: '#F5F5F5',
  },
  dayChipsContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  dayChip: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  dayChipDefault: {
    backgroundColor: '#E5E5E5',
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dayChipTextSelected: {
    color: '#4CAF50',
  },
  dayChipTextDefault: {
    color: '#333333',
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  mealsList: {
    gap: 16,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealContent: {
    flex: 2,
    gap: 4,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 24,
  },
  mealType: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    lineHeight: 20,
  },
  mealImageContainer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  regenerateButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  saveButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});