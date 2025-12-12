/**
 * User Profile Service
 * Handles local storage of user preferences and settings
 * Easily upgradeable to backend API when available
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  // Basic user info
  uid?: string;  // Firebase user ID (optional for local profiles)
  name: string;
  email: string;
  avatar?: string;
  
  // Dietary preferences
  dietaryRestrictions: string[];
  allergies: string[];
  likedIngredients: string[];
  dislikedIngredients: string[];
  
  // Meal plan settings
  includeBreakfast: boolean;
  includeLunch: boolean;
  includeDinner: boolean;
  includeSnacks: boolean;
  servingsPerMeal: number;
  
  // App settings
  pushNotifications: boolean;
  unitsOfMeasurement: 'metric' | 'imperial';
}

export const defaultUserProfile: UserProfile = {
  name: 'Amelia-Rose',
  email: 'amelia.rose@email.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU9tQMrdGm3Z8-aGXtUCAO1iOrK5Igs6M3V2jbViXWOmlap-ciRrRC3P7U0pHbLNe1zAt0kUtIJThfQpZW8dlplw6og_d4JVTVhQjBWyDUNNhm6DXiHu8cDigyv99ACtjcUy829K2WbSJAKUuUJieaV-YN9kzaffyYqVsLcsJ333xDvUwm9pAY8OYjtvA7j-RZ8upCW99B7ZkWaAWxfygMPIkN5qt57M6TGYA8jTA48PKFu5cNhxk7gFc3WKm5yOg7A4_PgpzUQNc5',
  dietaryRestrictions: ['Vegan'],
  allergies: ['Peanuts', 'Shellfish'],
  likedIngredients: ['Avocado', 'Salmon'],
  dislikedIngredients: ['Olives', 'Cilantro'],
  includeBreakfast: true,
  includeLunch: true,
  includeDinner: true,
  includeSnacks: false,
  servingsPerMeal: 2,
  pushNotifications: true,
  unitsOfMeasurement: 'metric',
};

const USER_PROFILE_KEY = '@smart_menu_planner:user_profile';

export class UserProfileService {
  /**
   * Load user profile from local storage
   */
  static async loadProfile(): Promise<UserProfile> {
    try {
      const profileData = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (profileData) {
        const profile = JSON.parse(profileData);
        // Merge with defaults to handle any missing fields
        return { ...defaultUserProfile, ...profile };
      }
      return defaultUserProfile;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return defaultUserProfile;
    }
  }

  /**
   * Save user profile to local storage
   */
  static async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw new Error('Failed to save profile settings');
    }
  }

  /**
   * Update specific profile fields
   */
  static async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const currentProfile = await this.loadProfile();
      const updatedProfile = { ...currentProfile, ...updates };
      await this.saveProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error('Failed to update profile settings');
    }
  }

  /**
   * Add allergy to user profile
   */
  static async addAllergy(allergy: string): Promise<UserProfile> {
    const currentProfile = await this.loadProfile();
    if (!currentProfile.allergies.includes(allergy)) {
      currentProfile.allergies.push(allergy);
      await this.saveProfile(currentProfile);
    }
    return currentProfile;
  }

  /**
   * Remove allergy from user profile
   */
  static async removeAllergy(allergy: string): Promise<UserProfile> {
    const currentProfile = await this.loadProfile();
    currentProfile.allergies = currentProfile.allergies.filter(a => a !== allergy);
    await this.saveProfile(currentProfile);
    return currentProfile;
  }

  /**
   * Add liked ingredient to user profile
   */
  static async addLikedIngredient(ingredient: string): Promise<UserProfile> {
    const currentProfile = await this.loadProfile();
    if (!currentProfile.likedIngredients.includes(ingredient)) {
      currentProfile.likedIngredients.push(ingredient);
      await this.saveProfile(currentProfile);
    }
    return currentProfile;
  }

  /**
   * Remove liked ingredient from user profile
   */
  static async removeLikedIngredient(ingredient: string): Promise<UserProfile> {
    const currentProfile = await this.loadProfile();
    currentProfile.likedIngredients = currentProfile.likedIngredients.filter(i => i !== ingredient);
    await this.saveProfile(currentProfile);
    return currentProfile;
  }

  /**
   * Add disliked ingredient to user profile
   */
  static async addDislikedIngredient(ingredient: string): Promise<UserProfile> {
    const currentProfile = await this.loadProfile();
    if (!currentProfile.dislikedIngredients.includes(ingredient)) {
      currentProfile.dislikedIngredients.push(ingredient);
      await this.saveProfile(currentProfile);
    }
    return currentProfile;
  }

  /**
   * Remove disliked ingredient from user profile
   */
  static async removeDislikedIngredient(ingredient: string): Promise<UserProfile> {
    const currentProfile = await this.loadProfile();
    currentProfile.dislikedIngredients = currentProfile.dislikedIngredients.filter(i => i !== ingredient);
    await this.saveProfile(currentProfile);
    return currentProfile;
  }

  /**
   * Clear all profile data (for debugging/testing)
   */
  static async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
    } catch (error) {
      console.error('Failed to clear user profile:', error);
    }
  }
}

export default UserProfileService;