import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isSmallScreen = width < 375; // iPhone SE
const isMediumScreen = width >= 375 && width < 414; // iPhone 12/13
const isLargeScreen = width >= 414; // iPhone Plus/Max and larger

// Responsive spacing function
const getResponsiveSpacing = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

// Responsive font size function
const getResponsiveFontSize = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

export default function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  // Form state
  const [email, setEmail] = useState('demo@example.com'); // Pre-filled for demo
  const [password, setPassword] = useState('password123'); // Pre-filled for demo
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  // Form validation
  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 500);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google authentication will be implemented in the next phase');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Apple authentication will be implemented in the next phase');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset feature will be implemented in the next phase');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      {/* Template-exact structure: relative flex-col min-h-screen w-full bg-background-dark p-4 */}
      <View style={styles.designRoot}>
        {/* Main content area - template: flex-grow flex-col justify-center items-center */}
        <View style={styles.flexGrow}>
          <View style={styles.contentCenter}>
            {/* Content container - template: max-w-md */}
            <View style={styles.maxWidthMd}>
              
              {/* Logo section - template: flex justify-center mb-8 */}
              <View style={styles.logoContainer}>
                <View style={styles.svgLogo}>
                  <MaterialIcons 
                    name="lightbulb" 
                    size={48} 
                    color={Colors.primary} 
                  />
                </View>
              </View>
              
              {/* Welcome text - template: text-white text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6 */}
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              
              {/* Subtitle - template: text-gray-400 text-base font-normal leading-normal pb-6 px-4 text-center */}
              <Text style={styles.subtitle}>
                Log in to continue to your meal plan.
              </Text>
              
              {/* Form container - template: flex-col gap-4 px-4 py-3 */}
              <View style={styles.formContainer}>
                
                {/* Email field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <TextInput
                    style={[styles.textInput, errors.email && styles.inputError]}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.textMuted}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors(prev => ({...prev, email: undefined}));
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>
                
                {/* Password field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor={Colors.textMuted}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) {
                          setErrors(prev => ({...prev, password: undefined}));
                        }
                      }}
                      secureTextEntry={!showPassword}
                      autoCorrect={false}
                    />
                    <TouchableOpacity 
                      style={styles.visibilityToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <MaterialIcons 
                        name={showPassword ? "visibility-off" : "visibility"} 
                        size={24} 
                        color={Colors.textMuted} 
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>
              </View>
              
              {/* Forgot password - template: text-[#9eb7a8] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-right underline */}
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
              
              {/* Login buttons container */}
              <View style={styles.loginButtonContainer}>
                {/* Main login button - template: bg-primary h-12 rounded-xl */}
                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Logging In...' : 'Log In'}
                  </Text>
                </TouchableOpacity>
                
                {/* Quick Demo Button */}
                <TouchableOpacity 
                  style={[styles.demoButton, loading && styles.buttonDisabled]}
                  onPress={handleQuickDemo}
                  disabled={loading}
                >
                  <Text style={styles.demoButtonText}>
                    🚀 Quick Demo (Skip Login)
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Divider - template: flex items-center px-4 my-6 */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
              
              {/* Social login buttons - template: flex-col gap-4 px-4 py-3 */}
              <View style={styles.socialButtonsContainer}>
                {/* Google login button */}
                <TouchableOpacity 
                  style={[styles.socialButton, loading && styles.buttonDisabled]} 
                  onPress={handleGoogleLogin}
                  disabled={loading}
                >
                  <Image 
                    source={{ 
                      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXDL1f1i2EbgmjiFWJDvwHutqy3ng9pr6l-ud0OWL7iNPZX5c5Pn_bG-TxobjJbuztJzkC3JJADbqBslYO-2_Y_GkWqa26DsETZDsyJjFDOaXllYfyjIjiHFRbsayvLU_giPN7I9kYCRZCIWwq-sJi-_mkCeYlQ38Qh2kUAHm36FrhoEoO1VBsfDLMA2dlf3LEDqdlY99kXw1fXqC1YbDW94AvQx9XkTFx-SusMdrlsz4yh8kffk_jW16Ur4uo-ohBHy_FBq2EUF3m' 
                    }}
                    style={styles.socialIcon} 
                  />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>
                
                {/* Apple login button */}
                <TouchableOpacity 
                  style={[styles.socialButton, loading && styles.buttonDisabled]} 
                  onPress={handleAppleLogin}
                  disabled={loading}
                >
                  <View style={styles.appleIcon}>
                    <MaterialIcons name="apple" size={24} color="white" />
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        {/* Sign up link - template: text-center py-4 */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don't have an account?{' '}
            <Text style={styles.signUpLink} onPress={onSignUp}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Template-exact styles converted to React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  
  // Design root - template: relative flex-col min-h-screen w-full bg-background-dark p-4 (responsive)
  designRoot: {
    position: 'relative',
    flexDirection: 'column',
    minHeight: height,
    width: '100%',
    backgroundColor: Colors.backgroundDark,
    padding: getResponsiveSpacing(8, 8, 12), // Reduced padding for wider elements
  },
  
  // Flex grow container - template: flex-grow flex-col justify-center items-center
  flexGrow: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Content center - template: flex-col justify-center items-center
  contentCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Max width container - template: max-w-md
  maxWidthMd: {
    width: '100%',
    maxWidth: 800, // Increased from 448px to 800px for wider login form
  },
  
  // Logo container - template: flex justify-center mb-8 (responsive)
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(20, 24, 32), // Responsive mb: small-20px, medium-24px, large-32px
  },
  
  svgLogo: {
    width: getResponsiveSpacing(36, 42, 48), // Responsive icon size
    height: getResponsiveSpacing(36, 42, 48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Welcome title - template: text-white text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6 (responsive)
  welcomeTitle: {
    color: Colors.textDark,
    fontSize: getResponsiveFontSize(24, 28, 32), // Responsive font: small-24px, medium-28px, large-32px
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.textStyles.loginTitle.lineHeight,
    paddingHorizontal: getResponsiveSpacing(12, 16, 20), // Responsive px
    textAlign: 'center',
    paddingBottom: getResponsiveSpacing(8, 10, 12), // Responsive pb
    paddingTop: getResponsiveSpacing(16, 20, 24), // Responsive pt
    fontFamily: Typography.fontFamily.display,
  },
  
  // Subtitle - template: text-gray-400 text-base font-normal leading-normal pb-6 px-4 text-center (responsive)
  subtitle: {
    color: Colors.textGrayDark,
    fontSize: getResponsiveFontSize(14, 15, 16), // Responsive font: small-14px, medium-15px, large-16px
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.textStyles.bodyText.lineHeight,
    paddingBottom: getResponsiveSpacing(16, 20, 24), // Responsive pb: small-16px, medium-20px, large-24px
    paddingHorizontal: getResponsiveSpacing(12, 16, 20), // Responsive px
    textAlign: 'center',
    fontFamily: Typography.fontFamily.body,
  },
  
  // Form container - template: flex-col gap-4 px-4 py-3 (responsive)
  formContainer: {
    flexDirection: 'column',
    gap: getResponsiveSpacing(12, 14, 16), // Responsive gap: small-12px, medium-14px, large-16px
    paddingHorizontal: getResponsiveSpacing(4, 8, 12), // Reduced horizontal padding for wider elements
    paddingVertical: getResponsiveSpacing(8, 10, 12), // Responsive py
  },
  
  // Field container - template: flex-col min-w-40 (responsive)
  fieldContainer: {
    flexDirection: 'column',
    width: '100%', // Full width
    maxWidth: 800, // Even wider max width
    marginBottom: getResponsiveSpacing(2, 3, 4), // Small margin between fields
  },
  
  // Field label - template: text-white text-base font-medium leading-normal pb-2 (responsive)
  fieldLabel: {
    color: Colors.textDark,
    fontSize: getResponsiveFontSize(14, 15, 16), // Responsive font: small-14px, medium-15px, large-16px
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.textStyles.bodyText.lineHeight,
    paddingBottom: getResponsiveSpacing(6, 7, 8), // Responsive pb: small-6px, medium-7px, large-8px
    fontFamily: Typography.fontFamily.body,
  },
  
  // Text input - template: h-14 bg-[#29382f] rounded-xl p-4 text-white text-base font-normal leading-normal (responsive)
  textInput: {
    height: getResponsiveSpacing(44, 48, 52), // Fixed height: small-44px, medium-48px, large-52px
    backgroundColor: Colors.cardSecondary, // #29382f
    borderRadius: getResponsiveSpacing(10, 12, 14), // Responsive border radius
    paddingHorizontal: getResponsiveSpacing(12, 16, 20), // Responsive px
    paddingVertical: getResponsiveSpacing(10, 12, 14), // Responsive py
    color: Colors.textDark,
    fontSize: 18, // Increased to 18px
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.textStyles.bodyText.lineHeight,
    borderWidth: 0,
  },
  
  // Password container - template: flex items-stretch bg-[#29382f] rounded-xl (responsive)
  passwordContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'stretch',
    backgroundColor: Colors.cardSecondary,
    borderRadius: getResponsiveSpacing(10, 12, 14), // Responsive border radius
  },
  
  // Password input (responsive)
  passwordInput: {
    flex: 1,
    minHeight: getResponsiveSpacing(44, 48, 52), // Responsive h: small-44px, medium-48px, large-52px
    backgroundColor: 'transparent',
    borderTopLeftRadius: getResponsiveSpacing(10, 12, 14),
    borderBottomLeftRadius: getResponsiveSpacing(10, 12, 14),
    paddingHorizontal: getResponsiveSpacing(12, 16, 20), // Responsive px
    paddingVertical: getResponsiveSpacing(10, 12, 14), // Responsive py
    paddingRight: getResponsiveSpacing(6, 8, 10), // Responsive pr
    color: Colors.textDark,
    fontSize: 18, // Increased to 18px
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.textStyles.bodyText.lineHeight,
    borderWidth: 0,
  },
  
  // Visibility toggle (responsive)
  visibilityToggle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: getResponsiveSpacing(12, 16, 20), // Responsive pr
    borderTopRightRadius: getResponsiveSpacing(10, 12, 14),
    borderBottomRightRadius: getResponsiveSpacing(10, 12, 14),
  },
  
  // Input error styling
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  
  // Error text
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
    fontFamily: Typography.fontFamily.body,
  },
  
  // Forgot password - template: text-[#9eb7a8] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-right underline
  forgotPassword: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    paddingBottom: Spacing.md, // pb-3
    paddingTop: Spacing.xs, // pt-1
    paddingHorizontal: Spacing.lg, // px-4
    textAlign: 'right',
    textDecorationLine: 'underline',
    fontFamily: Typography.fontFamily.body,
  },
  
  // Login button container
  loginButtonContainer: {
    paddingHorizontal: 4, // Reduced horizontal padding for wider buttons
    paddingVertical: Spacing.md, // py-3
    justifyContent: 'center',
    marginTop: Spacing.lg, // mt-4
  },
  
  // Login button - template: bg-primary h-12 rounded-xl px-5 (responsive)
  loginButton: {
    flexDirection: 'row',
    width: '100%', // Full width
    maxWidth: 800, // Even wider max width
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: getResponsiveSpacing(10, 12, 14), // Responsive border radius
    height: getResponsiveSpacing(40, 44, 48), // Original height: small-40px, medium-44px, large-48px
    paddingHorizontal: getResponsiveSpacing(16, 18, 20), // Responsive px
    backgroundColor: Colors.primary,
    marginBottom: getResponsiveSpacing(8, 10, 12), // Responsive mb
  },
  
  // Login button text - template: text-[#111714] text-base font-bold leading-normal tracking-[0.015em] (responsive)
  loginButtonText: {
    color: Colors.backgroundDark, // Dark text on light button
    fontSize: 18, // Increased to 18px
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.textStyles.buttonText.lineHeight,
    letterSpacing: Typography.letterSpacing.template,
    fontFamily: Typography.fontFamily.display,
  },
  
  // Demo button (responsive)
  demoButton: {
    flexDirection: 'row',
    width: '100%', // Full width
    maxWidth: 800, // Even wider max width
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: getResponsiveSpacing(10, 12, 14), // Responsive border radius
    height: getResponsiveSpacing(40, 44, 48), // Original height: small-40px, medium-44px, large-48px
    paddingHorizontal: getResponsiveSpacing(16, 18, 20), // Responsive px
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.4)',
  },
  
  // Demo button text
  demoButtonText: {
    color: '#667eea',
    fontSize: 18, // Increased to 18px
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.textStyles.buttonText.lineHeight,
    letterSpacing: Typography.letterSpacing.template,
    fontFamily: Typography.fontFamily.display,
  },
  
  // Button disabled state
  buttonDisabled: {
    opacity: 0.6,
  },
  
  // Divider container - template: flex items-center px-4 my-6
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg, // px-4
    marginVertical: Spacing.xl, // my-6
  },
  
  // Divider line - template: flex-grow border-t border-gray-700
  dividerLine: {
    flexGrow: 1,
    borderTopWidth: 1,
    borderColor: Colors.borderDark,
  },
  
  // Divider text - template: px-4 text-gray-500 text-sm
  dividerText: {
    paddingHorizontal: Spacing.lg, // px-4
    color: Colors.textGray,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.body,
  },
  
  // Social buttons container - template: flex-col gap-4 px-4 py-3 (responsive)
  socialButtonsContainer: {
    flexDirection: 'column',
    gap: getResponsiveSpacing(12, 14, 16), // Responsive gap: small-12px, medium-14px, large-16px
    paddingHorizontal: getResponsiveSpacing(4, 8, 12), // Reduced horizontal padding for wider buttons
    paddingVertical: getResponsiveSpacing(8, 10, 12), // Responsive py
  },
  
  // Social button - template: bg-[#29382f] h-12 rounded-xl px-5 (responsive)
  socialButton: {
    flexDirection: 'row',
    width: '100%', // Full width
    maxWidth: 800, // Even wider max width
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: getResponsiveSpacing(10, 12, 14), // Responsive border radius
    height: getResponsiveSpacing(40, 44, 48), // Original height: small-40px, medium-44px, large-48px
    paddingHorizontal: getResponsiveSpacing(16, 18, 20), // Responsive px
    backgroundColor: Colors.cardSecondary, // #29382f
  },
  
  // Social icon - template: w-6 h-6 mr-3 (responsive)
  socialIcon: {
    width: getResponsiveSpacing(18, 21, 24), // Responsive w: small-18px, medium-21px, large-24px
    height: getResponsiveSpacing(18, 21, 24), // Responsive h: small-18px, medium-21px, large-24px
    marginRight: getResponsiveSpacing(10, 12, 14), // Responsive mr: small-10px, medium-12px, large-14px
  },
  
  // Apple icon container
  appleIcon: {
    width: Spacing.widths.icon,
    height: Spacing.widths.icon,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Social button text - template: text-white text-base font-medium leading-normal tracking-[0.015em]
  socialButtonText: {
    color: Colors.textDark,
    fontSize: 18, // Increased to 18px
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.textStyles.bodyText.lineHeight,
    letterSpacing: Typography.letterSpacing.template,
    fontFamily: Typography.fontFamily.body,
  },
  
  // Sign up container - template: text-center py-4
  signUpContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg, // py-4
  },
  
  // Sign up text - template: text-[#9eb7a8] text-sm
  signUpText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.body,
  },
  
  // Sign up link - template: text-primary font-bold underline
  signUpLink: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
    textDecorationLine: 'underline',
    fontFamily: Typography.fontFamily.body,
  },
});