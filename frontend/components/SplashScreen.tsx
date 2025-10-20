import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimations = () => {
      // Logo fade in and scale animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
      
      // Title slide up animation
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 500);
      
      // Progress bar animation
      setTimeout(() => {
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }).start(() => {
          setTimeout(onFinish, 500);
        });
      }, 1000);
    };
    
    startAnimations();
  }, [fadeAnim, scaleAnim, slideAnim, progressAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />
      
      {/* Exactly matching template structure */}
      <View style={styles.designRoot}>
        {/* Organic pattern background */}
        <View style={styles.organicPattern} />
        
        {/* Gradient overlay from template */}
        <LinearGradient
          colors={['rgba(248, 245, 238, 0.5)', 'transparent']}
          style={styles.gradientOverlay}
        />
        
        {/* Main content */}
        <View style={styles.contentWrapper}>
          <View style={styles.logoWrapper}>
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.logoCircle}>
                <MaterialIcons name="spa" size={96} color="#6B8E23" />
              </View>
            </Animated.View>
          </View>
          
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
            <Text style={styles.title}>Nourish Your Life, Naturally.</Text>
          </Animated.View>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressWrapper}>
            <View style={styles.progressTrack}>
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

// Exact template CSS converted to React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  designRoot: {
    position: 'relative', // template relative
    flexDirection: 'column', // template flex-col
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    height: '100%', // template h-screen
    width: '100%', // template w-full
    backgroundColor: '#F8F5EE', // template bg-background-light
    overflow: 'hidden', // template overflow-hidden
  },
  organicPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8F5EE',
    // Template bg-organic-pattern would be implemented here
  },
  gradientOverlay: {
    position: 'absolute', // template absolute
    top: 0, // template inset-0
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentWrapper: {
    flexDirection: 'column', // template flex-col
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    gap: 32, // template gap-8
    paddingHorizontal: 32, // template p-8
    position: 'relative', // template relative
    zIndex: 10, // template z-10
  },
  logoWrapper: {
    width: '100%', // template w-full
    flexGrow: 1, // template grow
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
  },
  logoContainer: {
    width: 144, // template w-36
  },
  logoCircle: {
    width: '100%', // template w-full
    gap: 4, // template gap-1
    overflow: 'hidden', // template overflow-hidden
    backgroundColor: 'rgba(107, 142, 35, 0.2)', // template bg-primary/20
    aspectRatio: 1, // template aspect-square
    borderRadius: 9999, // template rounded-full
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
  },
  titleWrapper: {
    // Template animate-slide-up styles are handled by animation
  },
  title: {
    color: '#4F4F4F', // template text-text-light
    letterSpacing: -0.5, // template tracking-tight
    fontSize: 28, // template text-[28px]
    fontWeight: '700', // template font-bold
    lineHeight: 36, // template leading-tight
    paddingHorizontal: 16, // template px-4
    textAlign: 'center', // template text-center
    fontFamily: 'System', // template font-display
  },
  progressContainer: {
    position: 'absolute', // template absolute
    bottom: 40, // template bottom-10
    width: '100%', // template w-full
    paddingHorizontal: 48, // template px-12
    zIndex: 10, // template z-10
  },
  progressWrapper: {
    flexDirection: 'column', // template flex-col
    gap: 12, // template gap-3
    padding: 16, // template p-4
  },
  progressTrack: {
    borderRadius: 9999, // template rounded-full
    backgroundColor: 'rgba(107, 142, 35, 0.2)', // template bg-primary/20
    height: 8, // template h-2
  },
  progressBar: {
    height: '100%', // template h-2
    borderRadius: 9999, // template rounded-full
    backgroundColor: '#6B8E23', // template bg-primary
    // Template animate-progress is handled by animation
  },
});