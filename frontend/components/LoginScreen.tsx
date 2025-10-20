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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('demo@example.com'); // Pre-filled for demo
  const [password, setPassword] = useState('password123'); // Pre-filled for demo
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Info', 'Google login will be implemented soon');
  };

  const handleAppleLogin = () => {
    Alert.alert('Info', 'Apple login will be implemented soon');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset will be implemented soon');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="light-content" backgroundColor="#111714" />
      
      {/* Exactly matching template structure */}
      <View style={styles.designRoot}>
        {/* Main content area */}
        <View style={styles.flexGrow}>
          <View style={styles.contentCenter}>
            <View style={styles.maxWidthMd}>
              {/* Logo section */}
              <View style={styles.logoContainer}>
                <View style={styles.svgLogo}>
                  <MaterialIcons name="lightbulb" size={48} color="#38e07b" />
                </View>
              </View>
              
              {/* Welcome text */}
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to continue to your meal plan.</Text>
              
              {/* Form fields */}
              <View style={styles.formContainer}>
                {/* Email field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#9eb7a8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                {/* Password field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#9eb7a8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                      style={styles.visibilityToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <MaterialIcons 
                        name={showPassword ? "visibility-off" : "visibility"} 
                        size={24} 
                        color="#9eb7a8" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              {/* Forgot password */}
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
              
              {/* Login button */}
              <View style={styles.loginButtonContainer}>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
                
                {/* Quick Demo Button */}
                <TouchableOpacity 
                  style={styles.demoButton}
                  onPress={() => onLogin()}
                  disabled={loading}
                >
                  <Text style={styles.demoButtonText}>🚀 Quick Demo (Skip Login)</Text>
                </TouchableOpacity>
              </View>
              
              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
              
              {/* Social login buttons */}
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXDL1f1i2EbgmjiFWJDvwHutqy3ng9pr6l-ud0OWL7iNPZX5c5Pn_bG-TxobjJbuztJzkC3JJADbqBslYO-2_Y_GkWqa26DsETZDsyJjFDOaXllYfyjIjiHFRbsayvLU_giPN7I9kYCRZCIWwq-sJi-_mkCeYlQ38Qh2kUAHm36FrhoEoO1VBsfDLMA2dlf3LEDqdlY99kXw1fXqC1YbDW94AvQx9XkTFx-SusMdrlsz4yh8kffk_jW16Ur4uo-ohBHy_FBq2EUF3m' }}
                    style={styles.socialIcon} 
                  />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                  <View style={styles.appleIcon}>
                    <MaterialIcons name="apple" size={24} color="white" />
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        {/* Sign up link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink} onPress={onSignUp}>Sign Up</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Exact template CSS converted to React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111714', // template bg-background-dark
  },
  scrollContent: {
    flexGrow: 1,
  },
  designRoot: {
    position: 'relative', // template relative
    flexDirection: 'column', // template flex-col
    minHeight: '100%', // template min-h-screen
    width: '100%', // template w-full
    backgroundColor: '#111714', // template bg-background-dark
    padding: 16, // template p-4
  },
  flexGrow: {
    flexGrow: 1, // template flex-grow
    flexDirection: 'column', // template flex-col
    justifyContent: 'center', // template justify-center
    alignItems: 'center', // template items-center
  },
  contentCenter: {
    flexDirection: 'column', // template flex-col
    justifyContent: 'center', // template justify-center
    alignItems: 'center', // template items-center
  },
  maxWidthMd: {
    width: '100%',
    maxWidth: 448, // template max-w-md
  },
  logoContainer: {
    justifyContent: 'center', // template justify-center
    alignItems: 'center', // template flex (center)
    marginBottom: 32, // template mb-8
  },
  svgLogo: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    color: '#FFFFFF', // template text-white
    fontSize: 32, // template text-[32px]
    fontWeight: '700', // template font-bold
    lineHeight: 38, // template leading-tight
    paddingHorizontal: 16, // template px-4
    textAlign: 'center', // template text-center
    paddingBottom: 12, // template pb-3
    paddingTop: 24, // template pt-6
    // // fontFamily: 'Manrope', // template font-display
  },
  subtitle: {
    color: '#9CA3AF', // template text-gray-400
    fontSize: 16, // template text-base
    fontWeight: '400', // template font-normal
    lineHeight: 24, // template leading-normal
    paddingBottom: 24, // template pb-6
    paddingHorizontal: 16, // template px-4
    textAlign: 'center', // template text-center
    // fontFamily: 'Manrope',
  },
  formContainer: {
    flexDirection: 'column', // template flex-col
    gap: 16, // template gap-4
    paddingHorizontal: 16, // template px-4
    paddingVertical: 12, // template py-3
  },
  fieldContainer: {
    flexDirection: 'column', // template flex-col
    minWidth: 160, // template min-w-40
    flex: 1,
  },
  fieldLabel: {
    color: '#FFFFFF', // template text-white
    fontSize: 16, // template text-base
    fontWeight: '500', // template font-medium
    lineHeight: 23, // template leading-normal
    paddingBottom: 8, // template pb-2
    // fontFamily: 'Manrope',
  },
  textInput: {
    flex: 1,
    minHeight: 56, // template h-14
    backgroundColor: '#29382f', // template bg-[#29382f]
    borderRadius: 12, // template rounded-xl
    paddingHorizontal: 16, // template p-4
    paddingVertical: 16, // template p-4 (vertical centering)
    color: '#FFFFFF', // template text-white
    fontSize: 16, // template text-base
    fontWeight: '400', // template font-normal
    lineHeight: 23, // template leading-normal
    borderWidth: 0,
  },
  passwordContainer: {
    flexDirection: 'row', // template flex
    width: '100%',
    flex: 1,
    alignItems: 'stretch', // template items-stretch
    backgroundColor: '#29382f', // template bg-[#29382f]
    borderRadius: 12, // template rounded-xl
  },
  passwordInput: {
    flex: 1,
    minHeight: 56, // template h-14
    backgroundColor: 'transparent',
    borderTopLeftRadius: 12, // template rounded-l-xl
    borderBottomLeftRadius: 12, // template rounded-l-xl
    paddingHorizontal: 16, // template p-4
    paddingVertical: 16, // template p-4 (vertical centering)
    paddingRight: 8, // template pr-2
    color: '#FFFFFF', // template text-white
    fontSize: 16, // template text-base
    fontWeight: '400', // template font-normal
    lineHeight: 23, // template leading-normal
    borderWidth: 0,
  },
  visibilityToggle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16, // template pr-4
    borderTopRightRadius: 12, // template rounded-r-xl
    borderBottomRightRadius: 12, // template rounded-r-xl
    borderStyle: 'solid',
    borderWidth: 0,
  },
  forgotPassword: {
    color: '#9eb7a8', // template text-[#9eb7a8]
    fontSize: 14, // template text-sm
    fontWeight: '400', // template font-normal
    lineHeight: 20, // template leading-normal
    paddingBottom: 12, // template pb-3
    paddingTop: 4, // template pt-1
    paddingHorizontal: 16, // template px-4
    textAlign: 'right', // template text-right
    textDecorationLine: 'underline', // template underline
    // fontFamily: 'Manrope',
  },
  loginButtonContainer: {
    paddingHorizontal: 16, // template px-4
    paddingVertical: 12, // template py-3
    justifyContent: 'center', // template justify-center
    marginTop: 16, // template mt-4
  },
  loginButton: {
    flexDirection: 'row', // template flex
    minWidth: 84, // template min-w-[84px]
    maxWidth: 480, // template max-w-[480px]
    justifyContent: 'center', // template items-center
    alignItems: 'center', // template items-center
    overflow: 'hidden', // template overflow-hidden
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    paddingHorizontal: 20, // template px-5
    flex: 1,
    backgroundColor: '#38e07b', // template bg-primary
  },
  loginButtonText: {
    color: '#111714', // template text-[#111714]
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 23, // template leading-normal
    letterSpacing: 0.24, // template tracking-[0.015em]
    // fontFamily: 'Manrope',
  },
  demoButton: {
    flexDirection: 'row', // template flex
    minWidth: 84, // template min-w-[84px]
    cursor: 'pointer', // template cursor-pointer
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    overflow: 'hidden', // template overflow-hidden
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    paddingHorizontal: 20, // template px-5
    flex: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.2)', // template bg-blue/20
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.4)',
    marginTop: 12, // template mt-3
  },
  demoButtonText: {
    color: '#667eea', // template text-blue
    fontSize: 16, // template text-base
    fontWeight: '600', // template font-semibold
    lineHeight: 23, // template leading-normal
    letterSpacing: 0.24, // template tracking-[0.015em]
    // fontFamily: 'Manrope',
  },
  dividerContainer: {
    flexDirection: 'row', // template flex
    alignItems: 'center', // template items-center
    paddingHorizontal: 16, // template px-4
    marginVertical: 24, // template my-6
  },
  dividerLine: {
    flexGrow: 1, // template flex-grow
    borderTopWidth: 1, // template border-t
    borderColor: '#374151', // template border-gray-700
  },
  dividerText: {
    paddingHorizontal: 16, // template px-4
    color: '#6B7280', // template text-gray-500
    fontSize: 14, // template text-sm
    // fontFamily: 'Manrope',
  },
  socialButtonsContainer: {
    flexDirection: 'column', // template flex-col
    gap: 16, // template gap-4
    paddingHorizontal: 16, // template px-4
    paddingVertical: 12, // template py-3
  },
  socialButton: {
    flexDirection: 'row', // template flex
    minWidth: 84, // template min-w-[84px]
    maxWidth: 480, // template max-w-[480px]
    justifyContent: 'center', // template items-center
    alignItems: 'center', // template items-center
    overflow: 'hidden', // template overflow-hidden
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    paddingHorizontal: 20, // template px-5
    flex: 1,
    backgroundColor: '#29382f', // template bg-[#29382f]
  },
  socialIcon: {
    width: 24, // template w-6
    height: 24, // template h-6
    marginRight: 12, // template mr-3
  },
  appleIcon: {
    width: 24, // template w-6
    height: 24, // template h-6
    marginRight: 12, // template mr-3
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#FFFFFF', // template text-white
    fontSize: 16, // template text-base
    fontWeight: '500', // template font-medium
    lineHeight: 23, // template leading-normal
    letterSpacing: 0.24, // template tracking-[0.015em]
    // fontFamily: 'Manrope',
  },
  signUpContainer: {
    textAlign: 'center', // template text-center
    paddingVertical: 16, // template py-4
  },
  signUpText: {
    color: '#9eb7a8', // template text-[#9eb7a8]
    fontSize: 14, // template text-sm
    // fontFamily: 'Manrope',
  },
  signUpLink: {
    color: '#38e07b', // template text-primary
    fontWeight: '700', // template font-bold
    textDecorationLine: 'underline', // template underline
    // fontFamily: 'Manrope',
  },
});