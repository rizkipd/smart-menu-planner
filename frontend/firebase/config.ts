/**
 * Firebase Configuration
 * Initialize Firebase services for authentication, Firestore, and Storage
 * Using React Native Firebase SDK
 */

import FirebaseApp from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Note: React Native Firebase automatically initializes using google-services.json (Android) 
// and GoogleService-Info.plist (iOS) files in your project

// Export Firebase services
export { auth, firestore, storage };

// Type exports for better TypeScript support
export type { FirebaseAuthTypes };

// Export the default app instance
export const app = FirebaseApp;

/**
 * React Native Firebase Setup Instructions:
 * 
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" and create a new project
 * 3. Enable Authentication:
 *    - Go to Authentication → Sign-in method
 *    - Enable Email/Password and Google providers
 * 4. Enable Firestore Database:
 *    - Go to Firestore Database → Create database
 *    - Choose Start in test mode (for development)
 *    - Select a location (choose nearest to your users)
 * 5. Enable Cloud Storage (optional):
 *    - Go to Storage → Get started
 *    - Follow the security rules setup
 * 6. Download configuration files:
 *    - Android: Download google-services.json and place in android/app/
 *    - iOS: Download GoogleService-Info.plist and place in ios/smart-menu-planner/
 * 7. Add configuration files to your .gitignore for security
 * 
 * React Native Firebase will automatically initialize using these config files.
 */

/**
 * Firebase Project Setup Instructions:
 * 
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" and create a new project
 * 3. Enable Authentication:
 *    - Go to Authentication → Sign-in method
 *    - Enable Email/Password and Google providers
 * 4. Enable Firestore Database:
 *    - Go to Firestore Database → Create database
 *    - Choose Start in test mode (for development)
 *    - Select a location (choose nearest to your users)
 * 5. Enable Cloud Storage:
 *    - Go to Storage → Get started
 *    - Follow the security rules setup
 * 6. Replace the config values above with your actual project settings
 * 
 * For React Native with Expo:
 * - Download google-services.json (Android) and place in android/app/
 * - Download GoogleService-Info.plist (iOS) and place in ios/YourAppName/
 * - Add configuration files to your .gitignore for security
 */