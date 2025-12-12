/**
 * Sign Up Screen Component
 * Handles user registration with email, password, and name fields
 * Includes form validation and error handling
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

// Try to import Firebase - may fail in Expo Go
let FirebaseAuthService: any = null;
let isFirebaseAvailable = false;
try {
  FirebaseAuthService = require('../services/firebaseAuthService').FirebaseAuthService;
  isFirebaseAvailable = true;
} catch (error) {
  console.log('Firebase not available in SignUpScreen');
  isFirebaseAvailable = false;
}

interface SignUpScreenProps {
  onSignUp: (credentials: { name: string; email: string; password: string }) => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
}

export default function SignUpScreen({ onSignUp, onBackToLogin, isLoading = false }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter a password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle sign up form submission
   */
  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    if (!isFirebaseAvailable || !FirebaseAuthService) {
      Alert.alert(
        'Firebase Not Available',
        'Account creation requires a development build. In Expo Go, use the "Quick Demo" button on the login screen instead.',
        [{ text: 'OK', onPress: onBackToLogin }]
      );
      return;
    }

    try {
      const user = await FirebaseAuthService.signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      Alert.alert(
        'Success!',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => onSignUp({ name: user.displayName || name, email: user.email || email, password }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  /**
   * Update field and clear error
   */
  const updateField = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textDark} />
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Smart Menu Planner today</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Name Field */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Full Name"
                placeholderTextColor={Colors.textLight}
                value={name}
                onChangeText={(value) => updateField('name', value)}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email Address"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor={Colors.textLight}
                value={password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Confirm Password Field */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm Password"
                placeholderTextColor={Colors.textLight}
                value={confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, isLoading && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.textLight} />
            ) : (
              <Text style={styles.signUpButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.cardDark,
    borderRadius: 16,
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backText: {
    color: Colors.textLight,
    fontSize: 16,
    marginLeft: Spacing.sm,
    fontFamily: 'System',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    fontFamily: 'System',
  },
  form: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textLight,
    paddingVertical: Spacing.md,
    fontFamily: 'System',
  },
  inputError: {
    borderBottomColor: Colors.accent,
    borderBottomWidth: 1,
  },
  errorText: {
    color: Colors.accent,
    fontSize: 14,
    marginBottom: Spacing.sm,
    fontFamily: 'System',
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  disabledButton: {
    backgroundColor: Colors.cardSecondary,
    opacity: 0.6,
  },
  signUpButtonText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  termsText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System',
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});