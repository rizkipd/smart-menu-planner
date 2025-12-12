/**
 * Firebase Authentication Service
 * Handles user authentication with Firebase Auth
 * Includes sign up, sign in, sign out, and user management
 * Using React Native Firebase SDK
 */

import auth, { 
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { defaultUserProfile, UserProfile } from './userProfile';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name: string;
}

export class FirebaseAuthService {
  private static authStateUnsubscribe: (() => void) | null = null;

  /**
   * Sign up a new user with email and password
   */
  static async signUp(credentials: SignUpCredentials): Promise<FirebaseAuthTypes.User> {
    try {
      const { email, password, name } = credentials;
      
      // Create user with Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await user.updateProfile({ displayName: name });

      // Create user profile in Firestore
      await this.createUserProfile(user, name);

      return user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn(credentials: SignInCredentials): Promise<FirebaseAuthTypes.User> {
    try {
      const { email, password } = credentials;
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get the currently authenticated user
   */
  static getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  /**
   * Check if a user is currently authenticated
   */
  static isAuthenticated(): boolean {
    return auth().currentUser !== null;
  }

  /**
   * Listen to authentication state changes
   */
  static onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void): () => void {
    return auth().onAuthStateChanged(callback);
  }

  /**
   * Create user profile in Firestore
   */
  private static async createUserProfile(user: FirebaseAuthTypes.User, name: string): Promise<void> {
    const userProfile: UserProfile = {
      ...defaultUserProfile,
      uid: user.uid,
      name: name,
      email: user.email || '',
      avatar: user.photoURL || defaultUserProfile.avatar,
    };

    try {
      await firestore().collection('users').doc(user.uid).set({
        ...userProfile,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      // Don't throw here - auth succeeded but profile creation failed
      // This can be recovered later
    }
  }

  /**
   * Handle authentication errors and provide user-friendly messages
   */
  private static handleAuthError(error: any): Error {
    let message = 'An unknown error occurred. Please try again.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email address is already registered. Please sign in or use a different email.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters long.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email address. Please sign up first.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later or reset your password.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection and try again.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password authentication is not enabled. Please contact support.';
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }

  /**
   * Set up persistent auth state listener
   */
  static setupAuthStateListener(callback: (user: FirebaseAuthTypes.User | null) => void): void {
    // Clean up existing listener
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
    }

    // Set up new listener
    this.authStateUnsubscribe = auth().onAuthStateChanged(callback);
  }

  /**
   * Clean up auth state listener
   */
  static cleanupAuthStateListener(): void {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
      this.authStateUnsubscribe = null;
    }
  }

  /**
   * Update user profile information
   */
  static async updateUserProfile(updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      await user.updateProfile(updates);
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  }
}

export default FirebaseAuthService;