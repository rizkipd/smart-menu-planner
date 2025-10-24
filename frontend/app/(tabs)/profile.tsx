import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import UserProfileService, { UserProfile } from '../../services/userProfile';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const [likedInput, setLikedInput] = useState('');
  const [dislikedInput, setDislikedInput] = useState('');

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await UserProfileService.loadProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile settings');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    try {
      setSaving(true);
      const updatedProfile = await UserProfileService.updateProfile(updates);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to save profile settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAllergy = async () => {
    if (!allergyInput.trim()) return;
    
    try {
      const updatedProfile = await UserProfileService.addAllergy(allergyInput.trim());
      setProfile(updatedProfile);
      setAllergyInput('');
    } catch (error) {
      console.error('Failed to add allergy:', error);
      Alert.alert('Error', 'Failed to add allergy');
    }
  };

  const handleRemoveAllergy = async (allergy: string) => {
    try {
      const updatedProfile = await UserProfileService.removeAllergy(allergy);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to remove allergy:', error);
      Alert.alert('Error', 'Failed to remove allergy');
    }
  };

  const handleAddLiked = async () => {
    if (!likedInput.trim()) return;
    
    try {
      const updatedProfile = await UserProfileService.addLikedIngredient(likedInput.trim());
      setProfile(updatedProfile);
      setLikedInput('');
    } catch (error) {
      console.error('Failed to add liked ingredient:', error);
      Alert.alert('Error', 'Failed to add liked ingredient');
    }
  };

  const handleRemoveLiked = async (ingredient: string) => {
    try {
      const updatedProfile = await UserProfileService.removeLikedIngredient(ingredient);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to remove liked ingredient:', error);
      Alert.alert('Error', 'Failed to remove liked ingredient');
    }
  };

  const handleAddDisliked = async () => {
    if (!dislikedInput.trim()) return;
    
    try {
      const updatedProfile = await UserProfileService.addDislikedIngredient(dislikedInput.trim());
      setProfile(updatedProfile);
      setDislikedInput('');
    } catch (error) {
      console.error('Failed to add disliked ingredient:', error);
      Alert.alert('Error', 'Failed to add disliked ingredient');
    }
  };

  const handleRemoveDisliked = async (ingredient: string) => {
    try {
      const updatedProfile = await UserProfileService.removeDislikedIngredient(ingredient);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to remove disliked ingredient:', error);
      Alert.alert('Error', 'Failed to remove disliked ingredient');
    }
  };

  const handleBack = () => {
    console.log('Back pressed');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.designRoot}>
        {/* Top App Bar - template: flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Section - template: p-4 @container */}
          <View style={styles.profileSection}>
            <View style={styles.profileRow}>
              <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: profile.avatar }}
                    style={styles.avatar}
                  />
                  <TouchableOpacity style={styles.editAvatarButton}>
                    <Text style={styles.editIcon}>✎</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{profile.name}</Text>
                  <Text style={styles.userEmail}>{profile.email}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Dietary Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
            
            {/* Dietary Restrictions Row */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>🍽️</Text>
                </View>
                <Text style={styles.settingLabel}>Dietary Restrictions</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>
                  {profile.dietaryRestrictions.join(', ') || 'None'}
                </Text>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </View>

            {/* Allergies Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Allergies</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.textInput, styles.inputExpanded]}
                  placeholder="e.g. Peanuts, Shellfish"
                  placeholderTextColor={Colors.textMuted}
                  value={allergyInput}
                  onChangeText={setAllergyInput}
                  onSubmitEditing={handleAddAllergy}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddAllergy}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Allergy Tags */}
            <View style={styles.tagsContainer}>
              {profile.allergies.map((allergy, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{allergy}</Text>
                  <TouchableOpacity 
                    style={styles.tagClose}
                    onPress={() => handleRemoveAllergy(allergy)}
                  >
                    <Text style={styles.tagCloseText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Liked Ingredients Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Liked Ingredients</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.textInput, styles.inputExpanded]}
                  placeholder="e.g. Avocado, Salmon"
                  placeholderTextColor={Colors.textMuted}
                  value={likedInput}
                  onChangeText={setLikedInput}
                  onSubmitEditing={handleAddLiked}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddLiked}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {profile.likedIngredients.map((ingredient, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{ingredient}</Text>
                    <TouchableOpacity 
                      style={styles.tagClose}
                      onPress={() => handleRemoveLiked(ingredient)}
                    >
                      <Text style={styles.tagCloseText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Disliked Ingredients Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Disliked Ingredients</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.textInput, styles.inputExpanded]}
                  placeholder="e.g. Olives, Cilantro"
                  placeholderTextColor={Colors.textMuted}
                  value={dislikedInput}
                  onChangeText={setDislikedInput}
                  onSubmitEditing={handleAddDisliked}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddDisliked}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {profile.dislikedIngredients.map((ingredient, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{ingredient}</Text>
                    <TouchableOpacity 
                      style={styles.tagClose}
                      onPress={() => handleRemoveDisliked(ingredient)}
                    >
                      <Text style={styles.tagCloseText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Meal Plan Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal Plan Settings</Text>
            
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Include Breakfast</Text>
              <Switch
                value={profile.includeBreakfast}
                onValueChange={(value) => updateProfile({ includeBreakfast: value })}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Include Lunch</Text>
              <Switch
                value={profile.includeLunch}
                onValueChange={(value) => updateProfile({ includeLunch: value })}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Include Dinner</Text>
              <Switch
                value={profile.includeDinner}
                onValueChange={(value) => updateProfile({ includeDinner: value })}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Include Snacks</Text>
              <Switch
                value={profile.includeSnacks}
                onValueChange={(value) => updateProfile({ includeSnacks: value })}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            {/* Servings Counter */}
            <View style={styles.counterRow}>
              <Text style={styles.toggleLabel}>Servings Per Meal</Text>
              <View style={styles.counter}>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => updateProfile({ servingsPerMeal: Math.max(1, profile.servingsPerMeal - 1) })}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.servingsText}>{profile.servingsPerMeal}</Text>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => updateProfile({ servingsPerMeal: profile.servingsPerMeal + 1 })}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* App Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Switch
                value={profile.pushNotifications}
                onValueChange={(value) => updateProfile({ pushNotifications: value })}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => updateProfile({ unitsOfMeasurement: profile.unitsOfMeasurement === 'metric' ? 'imperial' : 'metric' })}
            >
              <Text style={styles.settingLabel}>Units of Measurement</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>
                  {profile.unitsOfMeasurement === 'metric' ? 'Metric' : 'Imperial'}
                </Text>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
          
          {/* Saving Indicator */}
          {saving && (
            <View style={styles.savingIndicator}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.savingText}>Saving...</Text>
            </View>
          )}
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
    paddingTop: Platform.OS === 'ios' ? 65 : 25, // Platform-specific status bar spacing
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    justifyContent: 'space-between',
  },
  
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
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
  
  content: {
    flex: 1,
  },

  // Profile Section - template: p-4 @container
  profileSection: {
    padding: Spacing.lg,
  },

  profileRow: {
    flexDirection: 'column',
    gap: Spacing.lg,
  },

  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },

  avatarContainer: {
    position: 'relative',
  },

  avatar: {
    width: 128, // w-32 h-32 from template
    height: 128,
    borderRadius: 64, // rounded-full
    backgroundColor: Colors.cardSecondary,
  },

  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editIcon: {
    color: Colors.textLight,
    fontSize: 16,
    fontFamily: 'System',
  },

  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  userName: {
    color: Colors.textDark,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },

  userEmail: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '400',
  },

  editProfileButton: {
    backgroundColor: Colors.primary + '33', // bg-primary/20
    borderRadius: Spacing.borderRadius.lg,
    height: 48, // h-12
    paddingHorizontal: Spacing.xl, // px-6
    alignItems: 'center',
    justifyContent: 'center',
  },

  editProfileText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  // Divider - template: border-gray-200 dark:border-gray-700
  divider: {
    height: 1,
    backgroundColor: Colors.borderDark,
    marginHorizontal: Spacing.lg,
  },

  // Section - template: p-4
  section: {
    padding: Spacing.lg,
  },

  sectionTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    paddingBottom: 8,
    paddingTop: 16,
  },

  // Setting Row - template: flex items-center gap-4 bg-background-light dark:bg-background-dark px-0 py-3 min-h-14 justify-between border-b
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    minHeight: 56, // min-h-14
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    flex: 1,
  },

  iconContainer: {
    width: 40, // size-10
    height: 40,
    backgroundColor: Colors.primary + '33', // bg-primary/20
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 20,
  },

  settingLabel: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },

  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  settingValue: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '400',
  },

  arrowIcon: {
    color: Colors.textMuted,
    fontSize: 16,
    fontFamily: 'System',
  },

  // Input Container - template: flex max-w-[480px] flex-wrap items-end gap-4 py-3
  inputContainer: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
  },

  inputLabel: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },

  textInput: {
    height: 56,
    backgroundColor: Colors.backgroundDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '400',
  },

  // Tags Container - template: flex gap-2 pt-2
  tagsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    flexWrap: 'wrap',
  },

  tag: {
    backgroundColor: Colors.primary + '33', // bg-primary/20
    borderRadius: 9999, // rounded-full
    paddingHorizontal: Spacing.md, // px-3
    paddingVertical: 6, // py-1.5
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
  },

  tagText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },

  tagClose: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tagCloseText: {
    color: Colors.primary,
    fontSize: 12,
  },

  // Toggle Row - template: flex items-center justify-between py-3 border-b
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },

  toggleLabel: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '400',
  },

  // Counter Row - template: flex items-center justify-between py-3
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },

  counterButton: {
    width: 32, // size-8
    height: 32,
    backgroundColor: Colors.primary + '33', // bg-primary/20
    borderRadius: 16, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },

  servingsText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '500',
  },

  bottomSpacing: {
    height: Spacing.xxl,
  },

  scrollContent: {
    paddingBottom: 100, // Footer height + extra spacing
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: Colors.textDark,
    fontSize: 16,
    marginTop: 16,
  },

  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  inputExpanded: {
    flex: 1,
  },

  addButton: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: Colors.textLight,
    fontSize: 24,
    fontWeight: '500',
  },

  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },

  savingText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});