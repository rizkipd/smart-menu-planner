import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimations = () => {
      // Logo fade in and scale animation (1.5s)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: Spacing.animation.splash,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: Spacing.animation.splash,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Title slide up animation (1s, delayed 0.5s)
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 500);
      
      // Progress bar animation (2.5s, delayed 1s)
      setTimeout(() => {
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: Spacing.animation.progress,
          useNativeDriver: false,
        }).start(() => {
          // Navigate after progress completes
          setTimeout(onFinish, 500);
        });
      }, 1000);
    };
    
    startAnimations();
  }, [fadeAnim, scaleAnim, slideAnim, progressAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Template-exact structure: relative flex-col items-center justify-center h-screen w-full */}
      <View style={styles.designRoot}>
        {/* Organic pattern background layer */}
        <View style={styles.organicPattern} />
        
        {/* Gradient overlay - template: bg-gradient-to-t from-background-light/50 to-transparent */}
        <LinearGradient
          colors={Colors.gradients.splash as [string, string]}
          style={styles.gradientOverlay}
        />
        
        {/* Main content wrapper - template: flex-col items-center justify-center gap-8 p-8 relative z-10 */}
        <View style={styles.contentWrapper}>
          {/* Center logo and title together */}
          <View style={styles.logoAndTitleWrapper}>
            {/* Logo section */}
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              {/* Logo circle - template: w-36 aspect-square rounded-full bg-primary/20 items-center justify-center */}
              <View style={styles.logoCircle}>
                <MaterialIcons 
                  name="spa" 
                  size={96} 
                  color={Colors.spaIconColor} 
                />
              </View>
            </Animated.View>
            
            {/* Title section with slide-up animation */}
            <Animated.View
              style={[
                styles.titleWrapper,
                {
                  opacity: slideAnim.interpolate({
                    inputRange: [0, 20],
                    outputRange: [1, 0],
                  }),
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Title - template: text-[28px] font-bold leading-tight tracking-tight px-4 text-center */}
              <Text style={styles.title}>
                Nourish Your Life, Naturally.
              </Text>
            </Animated.View>
          </View>
        </View>
        
        {/* Progress bar section - template: absolute bottom-10 w-full px-12 z-10 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressWrapper}>
            {/* Progress track - template: rounded-full bg-primary/20 h-2 */}
            <View style={styles.progressTrack}>
              {/* Progress bar - template: h-2 rounded-full bg-primary animate-progress */}
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    })
                  }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// Template-exact styles converted to React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Design root - template: relative flex-col items-center justify-center h-screen w-full bg-background-light overflow-hidden
  designRoot: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    height: height,
    width: width,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  
  // Organic pattern background
  organicPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundLight,
    // Future: Add organic pattern background image
  },
  
  // Gradient overlay - template: absolute inset-0
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Content wrapper - template: flex-col items-center justify-center gap-8 p-8 relative z-10
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl, // p-8 (32px)
    paddingBottom: 60, // Space for progress bar
    position: 'relative',
    zIndex: Spacing.zIndex.overlay,
    flex: 1,
  },
  
  // Logo and title wrapper - keeps them together
  logoAndTitleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Takes up center space
  },
  
  // Logo container - template: w-36
  logoContainer: {
    width: Spacing.widths.logoContainer, // 144px (w-36)
  },
  
  // Logo circle - template: w-full gap-1 overflow-hidden bg-primary/20 aspect-square rounded-full items-center justify-center
  logoCircle: {
    width: '100%',
    gap: Spacing.xs, // gap-1 (4px)
    overflow: 'hidden',
    backgroundColor: Colors.spaIconBg, // Primary/20 with spa icon color
    aspectRatio: 1, // aspect-square
    borderRadius: Spacing.borderRadius.full, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Title wrapper for animations
  titleWrapper: {
    // Animation styles handled by Animated.View
    marginTop: Spacing.lg, // Small gap below logo
  },
  
  // Title - template: text-[28px] font-bold leading-tight tracking-tight px-4 text-center text-text-light font-display
  title: {
    color: Colors.textLight,
    letterSpacing: Typography.letterSpacing.tight,
    fontSize: Typography.fontSize['3xl'], // 28px
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.textStyles.splashTitle.lineHeight, // 28 * 1.2
    paddingHorizontal: Spacing.lg, // px-4 (16px)
    textAlign: 'center',
    fontFamily: Typography.fontFamily.display,
  },
  
  // Progress container - template: absolute bottom-10 w-full px-12 z-10
  progressContainer: {
    position: 'absolute',
    bottom: 40, // bottom-10 (40px)
    width: '100%',
    paddingHorizontal: 48, // px-12 (48px)
    zIndex: Spacing.zIndex.overlay,
  },
  
  // Progress wrapper - template: flex-col gap-3 p-4
  progressWrapper: {
    flexDirection: 'column',
    gap: Spacing.md, // gap-3 (12px)
    padding: Spacing.lg, // p-4 (16px)
  },
  
  // Progress track - template: rounded-full bg-primary/20 h-2
  progressTrack: {
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: Colors.spaIconBg, // Use spa icon background color
    height: Spacing.heights.progressBar, // h-2 (8px)
  },
  
  // Progress bar - template: h-2 rounded-full bg-primary animate-progress
  progressBar: {
    height: '100%',
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: Colors.spaIconColor, // Use exact spa icon color
    // Width animated by progressAnim
  },
});