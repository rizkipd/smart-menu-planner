import React, { useState } from 'react';
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
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

export default function Profile() {
  const [includeBreakfast, setIncludeBreakfast] = useState(true);
  const [includeLunch, setIncludeLunch] = useState(true);
  const [includeDinner, setIncludeDinner] = useState(true);
  const [includeSnacks, setIncludeSnacks] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [servings, setServings] = useState(2);

  const handleBack = () => {
    console.log('Back pressed');
  };

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
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU9tQMrdGm3Z8-aGXtUCAO1iOrK5Igs6M3V2jbViXWOmlap-ciRrRC3P7U0pHbLNe1zAt0kUtIJThfQpZW8dlplw6og_d4JVTVhQjBWyDUNNhm6DXiHu8cDigyv99ACtjcUy829K2WbSJAKUuUJieaV-YN9kzaffyYqVsLcsJ333xDvUwm9pAY8OYjtvA7j-RZ8upCW99B7ZkWaAWxfygMPIkN5qt57M6TGYA8jTA48PKFu5cNhxk7gFc3WKm5yOg7A4_PgpzUQNc5' }}
                    style={styles.avatar}
                  />
                  <TouchableOpacity style={styles.editAvatarButton}>
                    <Text style={styles.editIcon}>✎</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Amelia-Rose</Text>
                  <Text style={styles.userEmail}>amelia.rose@email.com</Text>
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
                <Text style={styles.settingValue}>Vegan</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </View>

            {/* Allergies Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Allergies</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Peanuts, Shellfish"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            {/* Allergy Tags */}
            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Peanuts</Text>
                <TouchableOpacity style={styles.tagClose}>
                  <Text style={styles.tagCloseText}>×</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Shellfish</Text>
                <TouchableOpacity style={styles.tagClose}>
                  <Text style={styles.tagCloseText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Liked Ingredients Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Liked Ingredients</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Avocado, Salmon"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            {/* Disliked Ingredients Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Disliked Ingredients</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Olives, Cilantro"
                placeholderTextColor={Colors.textMuted}
              />
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
                value={includeBreakfast}
                onValueChange={setIncludeBreakfast}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Include Lunch</Text>
              <Switch
                value={includeLunch}
                onValueChange={setIncludeLunch}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Include Dinner</Text>
              <Switch
                value={includeDinner}
                onValueChange={setIncludeDinner}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Include Snacks</Text>
              <Switch
                value={includeSnacks}
                onValueChange={setIncludeSnacks}
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
                  onPress={() => setServings(Math.max(1, servings - 1))}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.servingsText}>{servings}</Text>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => setServings(servings + 1)}
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
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: Colors.textGray, true: Colors.primary }}
                thumbColor={Colors.textLight}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Units of Measurement</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>Metric</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
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
});