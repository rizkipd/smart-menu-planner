import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProfilePageProps {
  onBack: () => void;
  onEditProfile: () => void;
  onDietaryRestrictions: () => void;
  onUnitsOfMeasurement: () => void;
  onChangePassword: () => void;
  onLogOut: () => void;
  onDeleteAccount: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  profileImage: string;
  dietaryRestriction: string;
  allergies: string[];
  likedIngredients: string;
  dislikedIngredients: string;
  includeBreakfast: boolean;
  includeLunch: boolean;
  includeDinner: boolean;
  includeSnacks: boolean;
  servingsPerMeal: number;
  pushNotifications: boolean;
  unitsOfMeasurement: string;
}

export default function ProfilePage({
  onBack,
  onEditProfile,
  onDietaryRestrictions,
  onUnitsOfMeasurement,
  onChangePassword,
  onLogOut,
  onDeleteAccount,
}: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Amelia-Rose',
    email: 'amelia.rose@email.com',
    profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU9tQMrdGm3Z8-aGXtUCAO1iOrK5Igs6M3V2jbViXWOmlap-ciRrRC3P7U0pHbLNe1zAt0kUtIJThfQpZW8dlplw6og_d4JVTVhQjBWyDUNNhm6DXiHu8cDigyv99ACtjcUy829K2WbSJAKUuUJieaV-YN9kzaffyYqVsLcsJ333xDvUwm9pAY8OYjtvA7j-RZ8upCW99B7ZkWaAWxfygMPIkN5qt57M6TGYA8jTA48PKFu5cNhxk7gFc3WKm5yOg7A4_PgpzUQNc5',
    dietaryRestriction: 'Vegan',
    allergies: ['Peanuts', 'Shellfish'],
    likedIngredients: '',
    dislikedIngredients: '',
    includeBreakfast: true,
    includeLunch: true,
    includeDinner: true,
    includeSnacks: false,
    servingsPerMeal: 2,
    pushNotifications: true,
    unitsOfMeasurement: 'Metric',
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [likedInput, setLikedInput] = useState('');
  const [dislikedInput, setDislikedInput] = useState('');

  const handleToggle = (field: keyof UserProfile) => {
    setProfile(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleServingChange = (increment: boolean) => {
    setProfile(prev => ({
      ...prev,
      servingsPerMeal: increment 
        ? Math.min(prev.servingsPerMeal + 1, 10)
        : Math.max(prev.servingsPerMeal - 1, 1),
    }));
  };

  const removeAllergy = (allergyToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.filter(allergy => allergy !== allergyToRemove),
    }));
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !profile.allergies.includes(allergyInput.trim())) {
      setProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()],
      }));
      setAllergyInput('');
    }
  };

  const renderAllergyTag = (allergy: string) => (
    <View key={allergy} style={styles.allergyTag}>
      <Text style={styles.allergyText}>{allergy}</Text>
      <TouchableOpacity onPress={() => removeAllergy(allergy)}>
        <MaterialIcons name="close" size={14} color="#6EEB83" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#122017" />
      
      {/* Exactly matching template structure */}
      <View style={styles.designRoot}>
        {/* Header exactly matching template */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section exactly matching template */}
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: profile.profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
                <TouchableOpacity style={styles.editImageButton}>
                  <MaterialIcons name="edit" size={18} color="#333333" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={onEditProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>

          {/* Dietary Preferences Section exactly matching template */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
            
            {/* Dietary Restrictions Row */}
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBorder]}
              onPress={onDietaryRestrictions}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <MaterialIcons name="restaurant" size={20} color="#6EEB83" />
                </View>
                <Text style={styles.settingTitle}>Dietary Restrictions</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{profile.dietaryRestriction}</Text>
                <MaterialIcons name="chevron-right" size={16} color="#8E8E93" />
              </View>
            </TouchableOpacity>

            {/* Allergies Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Allergies</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Peanuts, Shellfish"
                placeholderTextColor="#8E8E93"
                value={allergyInput}
                onChangeText={setAllergyInput}
                onSubmitEditing={addAllergy}
                returnKeyType="done"
              />
            </View>

            {profile.allergies.length > 0 && (
              <View style={styles.tagsContainer}>
                {profile.allergies.map(renderAllergyTag)}
              </View>
            )}

            {/* Liked Ingredients */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Liked Ingredients</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Avocado, Salmon"
                placeholderTextColor="#8E8E93"
                value={likedInput}
                onChangeText={setLikedInput}
              />
            </View>

            {/* Disliked Ingredients */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Disliked Ingredients</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Olives, Cilantro"
                placeholderTextColor="#8E8E93"
                value={dislikedInput}
                onChangeText={setDislikedInput}
              />
            </View>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>

          {/* Meal Plan Settings Section exactly matching template */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal Plan Settings</Text>
            
            {/* Include Breakfast */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <Text style={styles.settingTitle}>Include Breakfast</Text>
              <Switch
                value={profile.includeBreakfast}
                onValueChange={() => handleToggle('includeBreakfast')}
                thumbColor="white"
                trackColor={{ false: '#374151', true: '#6EEB83' }}
                style={styles.switch}
              />
            </View>
            
            {/* Include Lunch */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <Text style={styles.settingTitle}>Include Lunch</Text>
              <Switch
                value={profile.includeLunch}
                onValueChange={() => handleToggle('includeLunch')}
                thumbColor="white"
                trackColor={{ false: '#374151', true: '#6EEB83' }}
                style={styles.switch}
              />
            </View>
            
            {/* Include Dinner */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <Text style={styles.settingTitle}>Include Dinner</Text>
              <Switch
                value={profile.includeDinner}
                onValueChange={() => handleToggle('includeDinner')}
                thumbColor="white"
                trackColor={{ false: '#374151', true: '#6EEB83' }}
                style={styles.switch}
              />
            </View>
            
            {/* Include Snacks */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <Text style={styles.settingTitle}>Include Snacks</Text>
              <Switch
                value={profile.includeSnacks}
                onValueChange={() => handleToggle('includeSnacks')}
                thumbColor="white"
                trackColor={{ false: '#374151', true: '#6EEB83' }}
                style={styles.switch}
              />
            </View>

            {/* Servings Per Meal */}
            <View style={styles.settingRow}>
              <Text style={styles.settingTitle}>Servings Per Meal</Text>
              <View style={styles.servingControls}>
                <TouchableOpacity
                  style={styles.servingButton}
                  onPress={() => handleServingChange(false)}
                >
                  <Text style={styles.servingButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.servingCount}>{profile.servingsPerMeal}</Text>
                <TouchableOpacity
                  style={styles.servingButton}
                  onPress={() => handleServingChange(true)}
                >
                  <Text style={styles.servingButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>

          {/* App Settings Section exactly matching template */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            {/* Push Notifications */}
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Switch
                value={profile.pushNotifications}
                onValueChange={() => handleToggle('pushNotifications')}
                thumbColor="white"
                trackColor={{ false: '#374151', true: '#6EEB83' }}
                style={styles.switch}
              />
            </View>

            {/* Units of Measurement */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={onUnitsOfMeasurement}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Units of Measurement</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{profile.unitsOfMeasurement}</Text>
                <MaterialIcons name="chevron-right" size={16} color="#8E8E93" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>

          {/* Account Actions Section exactly matching template */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onChangePassword}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={onLogOut}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>Log Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={onDeleteAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Exact template CSS converted to React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122017', // template bg-background-light dark:bg-background-dark
  },
  designRoot: {
    position: 'relative', // template relative
    flexDirection: 'column', // template flex-col
    height: '100%', // template h-auto min-h-screen
    minHeight: 884, // template min-h-screen
    width: '100%', // template w-full
    overflow: 'hidden', // template overflow-x-hidden
  },
  // Header exactly matching template
  header: {
    flexDirection: 'row', // template flex
    alignItems: 'center', // template items-center
    backgroundColor: '#122017', // template bg-background-light dark:bg-background-dark
    paddingHorizontal: 16, // template p-4
    paddingVertical: 8, // template pb-2
    justifyContent: 'space-between', // template justify-between
    position: 'absolute', // template sticky top-0
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // template z-10
  },
  backButton: {
    width: 48, // template size-12
    height: 48,
    justifyContent: 'center', // template items-center
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF', // template text-text-dark dark:text-white
    fontSize: 20, // template text-xl
    fontWeight: '700', // template font-bold
    lineHeight: 28, // template leading-tight
    letterSpacing: -0.015 * 20, // template tracking-[-0.015em]
    flex: 1, // template flex-1
    textAlign: 'center', // template text-center
    fontFamily: 'Manrope', // template font-display
  },
  headerSpacer: {
    width: 48, // template w-12
  },
  content: {
    flex: 1,
    marginTop: 64, // Account for fixed header
  },
  contentContainer: {
    flexGrow: 1,
  },
  // Profile section exactly matching template
  profileSection: {
    padding: 16, // template p-4
  },
  profileInfo: {
    flexDirection: 'row', // template flex
    gap: 16, // template gap-4
    alignItems: 'center', // template items-center
    // Responsive: @[520px]:flex-row @[520px]:justify-between @[520px]:items-center
  },
  profileImageContainer: {
    position: 'relative', // template relative
  },
  profileImage: {
    width: 128, // template min-h-32 w-32
    height: 128,
    borderRadius: 64, // template rounded-full
    backgroundColor: '#374151',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 4, // template bottom-1
    right: 4, // template right-1
    width: 32, // template size-8
    height: 32,
    borderRadius: 16, // template rounded-full
    backgroundColor: '#6EEB83', // template bg-primary
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    flexDirection: 'column', // template flex-col
    justifyContent: 'center', // template justify-center
  },
  profileName: {
    color: '#FFFFFF', // template text-text-dark dark:text-white
    fontSize: 22, // template text-[22px]
    fontWeight: '700', // template font-bold
    lineHeight: 28, // template leading-tight
    letterSpacing: -0.015 * 22, // template tracking-[-0.015em]
    fontFamily: 'Manrope',
  },
  profileEmail: {
    color: '#8E8E93', // template text-text-light dark:text-gray-400
    fontSize: 16, // template text-base
    fontWeight: '400', // template font-normal
    lineHeight: 24, // template leading-normal
    fontFamily: 'Manrope',
  },
  editProfileButton: {
    flexDirection: 'row', // template flex
    minWidth: 84, // template min-w-[84px]
    cursor: 'pointer', // template cursor-pointer
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    overflow: 'hidden', // template overflow-hidden
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    paddingHorizontal: 24, // template px-6
    backgroundColor: 'rgba(110, 235, 131, 0.2)', // template bg-primary/20
    width: '100%', // template w-full
    maxWidth: 480, // template max-w-[480px]
    marginTop: 16, // template @[480px]:w-auto becomes default mobile behavior
  },
  editProfileButtonText: {
    color: '#6EEB83', // template text-primary
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 24, // template leading-normal
    letterSpacing: 0.015 * 16, // template tracking-[0.015em]
    fontFamily: 'Manrope',
  },
  dividerContainer: {
    paddingHorizontal: 16, // template px-4
  },
  divider: {
    height: 1,
    backgroundColor: '#374151', // template border-gray-200 dark:border-gray-700
  },
  section: {
    padding: 16, // template p-4
  },
  sectionTitle: {
    color: '#FFFFFF', // template text-text-dark dark:text-white
    fontSize: 18, // template text-lg
    fontWeight: '700', // template font-bold
    lineHeight: 28, // template leading-tight
    letterSpacing: -0.015 * 18, // template tracking-[-0.015em]
    paddingBottom: 8, // template pb-2
    paddingTop: 16, // template pt-4
    fontFamily: 'Manrope',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center', // template items-center
    justifyContent: 'space-between', // template justify-between
    paddingVertical: 12, // template py-3
    minHeight: 56, // template min-h-14
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937', // template border-gray-200 dark:border-gray-800
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // template gap-4
    flex: 1,
  },
  settingIcon: {
    width: 40, // template size-10
    height: 40,
    borderRadius: 8, // template rounded-lg
    backgroundColor: 'rgba(110, 235, 131, 0.2)', // template bg-primary/20
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    color: '#FFFFFF', // template text-text-dark dark:text-white
    fontSize: 16, // template text-base
    fontWeight: '500', // template font-medium
    lineHeight: 24, // template leading-normal
    flex: 1, // template flex-1
    fontFamily: 'Manrope',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // template gap-2
    flexShrink: 0, // template shrink-0
  },
  settingValue: {
    color: '#8E8E93', // template text-text-light dark:text-gray-400
    fontSize: 16, // template text-base
    fontWeight: '400', // template font-normal
    lineHeight: 24, // template leading-normal
    fontFamily: 'Manrope',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // template gap-4
  },
  servingButton: {
    width: 32, // template size-8
    height: 32,
    borderRadius: 16, // template rounded-full
    backgroundColor: 'rgba(110, 235, 131, 0.2)', // template bg-primary/20
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingButtonText: {
    color: '#6EEB83', // template text-primary
    fontSize: 18,
    fontWeight: '600',
  },
  servingCount: {
    color: '#FFFFFF', // template text-text-dark dark:text-white
    fontSize: 16,
    fontWeight: '500', // template font-medium
    minWidth: 24,
    textAlign: 'center',
    fontFamily: 'Manrope',
  },
  inputContainer: {
    maxWidth: 480, // template max-w-[480px]
    paddingVertical: 12, // template py-3
  },
  inputLabel: {
    color: '#FFFFFF', // template text-text-dark dark:text-white
    fontSize: 16, // template text-base
    fontWeight: '500', // template font-medium
    lineHeight: 24, // template leading-normal
    paddingBottom: 8, // template pb-2
    fontFamily: 'Manrope',
  },
  textInput: {
    flex: 1,
    height: 56, // template h-14
    borderWidth: 1,
    borderColor: '#374151', // template border-gray-300 dark:border-gray-600
    borderRadius: 12, // template rounded-xl
    paddingHorizontal: 15, // template p-[15px]
    color: '#FFFFFF', // template text-text-dark dark:text-white
    fontSize: 16, // template text-base
    fontWeight: '400', // template font-normal
    lineHeight: 24, // template leading-normal
    backgroundColor: '#FFFFFF', // template bg-white dark:bg-background-dark
    fontFamily: 'Manrope',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // template gap-2
    paddingTop: 8, // template pt-2
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(110, 235, 131, 0.2)', // template bg-primary/20
    borderRadius: 20, // template rounded-full
    paddingHorizontal: 12, // template px-3
    paddingVertical: 6, // template py-1.5
    gap: 4, // template gap-1
  },
  allergyText: {
    color: '#6EEB83', // template text-primary
    fontSize: 14, // template text-sm
    fontWeight: '500', // template font-medium
    fontFamily: 'Manrope',
  },
  actionButtonsContainer: {
    gap: 12, // template space-y-3
  },
  actionButton: {
    flexDirection: 'row', // template flex
    minWidth: 84, // template min-w-[84px]
    cursor: 'pointer', // template cursor-pointer
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    overflow: 'hidden', // template overflow-hidden
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    paddingHorizontal: 24, // template px-6
    backgroundColor: '#1f2937', // template bg-gray-200 dark:bg-gray-800
    width: '100%', // template w-full
  },
  actionButtonText: {
    color: '#FFFFFF', // template text-text-dark dark:text-white
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 24, // template leading-normal
    letterSpacing: 0.015 * 16, // template tracking-[0.015em]
    fontFamily: 'Manrope',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)', // template bg-accent/20
  },
  deleteButtonText: {
    color: '#FFA500', // template text-accent
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 24, // template leading-normal
    letterSpacing: 0.015 * 16, // template tracking-[0.015em]
    fontFamily: 'Manrope',
  },
  bottomSpacer: {
    height: 40, // template h-10
  },
});