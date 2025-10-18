import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  Easing,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { BlurView } from 'expo-blur'; // Commented out as not used in current implementation

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const floatAnim4 = useRef(new Animated.Value(0)).current;
  const floatAnim5 = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim1 = useRef(new Animated.Value(0)).current;
  const sparkleAnim2 = useRef(new Animated.Value(0)).current;
  const sparkleAnim3 = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animations for food icons
    const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start floating animations
    createFloatingAnimation(floatAnim1, 0).start();
    createFloatingAnimation(floatAnim2, 600).start();
    createFloatingAnimation(floatAnim3, 1200).start();
    createFloatingAnimation(floatAnim4, 300).start();
    createFloatingAnimation(floatAnim5, 900).start();

    // Sparkle animations
    const createSparkleAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createSparkleAnimation(sparkleAnim1, 0).start();
    createSparkleAnimation(sparkleAnim2, 500).start();
    createSparkleAnimation(sparkleAnim3, 1000).start();

    // Glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave effect
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Particle animations
    const createParticleAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.timing(animValue, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          delay,
        })
      );
    };

    createParticleAnimation(particleAnim1, 0).start();
    createParticleAnimation(particleAnim2, 1000).start();
    createParticleAnimation(particleAnim3, 2000).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Main sequence
    const sequence = Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
      // Text slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Progress bar
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]);

    sequence.start(() => {
      setTimeout(() => {
        onFinish();
      }, 500);
    });
  }, [fadeAnim, scaleAnim, slideAnim, rotateAnim, pulseAnim, floatAnim1, floatAnim2, floatAnim3, floatAnim4, floatAnim5, progressAnim, sparkleAnim1, sparkleAnim2, sparkleAnim3, glowAnim, particleAnim1, particleAnim2, particleAnim3, waveAnim, onFinish]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const float1Y = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const float2Y = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const float3Y = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const float4Y = floatAnim4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const float5Y = floatAnim5.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });

  const sparkleOpacity = sparkleAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const sparkleScale = sparkleAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 0.5],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const waveRotation = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const particleY1 = particleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const particleY2 = particleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const particleY3 = particleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#FF6B6B', '#FF8E53']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated Background Waves */}
        <Animated.View
          style={[
            styles.waveBackground,
            {
              transform: [{ rotate: waveRotation }],
              opacity: 0.1,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.wave}
          />
        </Animated.View>

        {/* Floating Particles */}
        <Animated.View
          style={[
            styles.particle,
            {
              left: width * 0.1,
              transform: [{ translateY: particleY1 }],
            },
          ]}
        >
          <View style={[styles.particleDot, { backgroundColor: 'rgba(255,255,255,0.6)' }]} />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.particle,
            {
              left: width * 0.7,
              transform: [{ translateY: particleY2 }],
            },
          ]}
        >
          <View style={[styles.particleDot, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.particle,
            {
              left: width * 0.9,
              transform: [{ translateY: particleY3 }],
            },
          ]}
        >
          <View style={[styles.particleDot, { backgroundColor: 'rgba(255,255,255,0.5)' }]} />
        </Animated.View>
        <View style={styles.content}>
          {/* Floating Food Icons */}
          <Animated.View 
            style={[
              styles.floatingIcon, 
              styles.float1,
              { transform: [{ translateY: float1Y }] }
            ]}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.iconCircle}
            >
              <Ionicons name="restaurant" size={24} color="white" />
            </LinearGradient>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.floatingIcon, 
              styles.float2,
              { transform: [{ translateY: float2Y }] }
            ]}
          >
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.iconCircle}
            >
              <Ionicons name="leaf" size={24} color="white" />
            </LinearGradient>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.floatingIcon, 
              styles.float3,
              { transform: [{ translateY: float3Y }] }
            ]}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.iconCircle}
            >
              <Ionicons name="wallet" size={24} color="white" />
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.floatingIcon, 
              styles.float4,
              { transform: [{ translateY: float4Y }] }
            ]}
          >
            <LinearGradient
              colors={['#a8edea', '#fed6e3']}
              style={styles.iconCircle}
            >
              <Ionicons name="pizza" size={20} color="white" />
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.floatingIcon, 
              styles.float5,
              { transform: [{ translateY: float5Y }] }
            ]}
          >
            <LinearGradient
              colors={['#fbc2eb', '#a6c1ee']}
              style={styles.iconCircle}
            >
              <Ionicons name="ice-cream" size={20} color="white" />
            </LinearGradient>
          </Animated.View>

          {/* Sparkle Effects */}
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle1,
              {
                opacity: sparkleOpacity,
                transform: [{ scale: sparkleScale }],
              },
            ]}
          >
            <Ionicons name="sparkles" size={16} color="rgba(255,255,255,0.9)" />
          </Animated.View>

          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle2,
              {
                opacity: sparkleAnim2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1, 0],
                }),
                transform: [{
                  scale: sparkleAnim2.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1.2, 0.5],
                  }),
                }],
              },
            ]}
          >
            <Ionicons name="star" size={12} color="rgba(255,255,255,0.8)" />
          </Animated.View>

          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle3,
              {
                opacity: sparkleAnim3.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1, 0],
                }),
                transform: [{
                  scale: sparkleAnim3.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1.2, 0.5],
                  }),
                }],
              },
            ]}
          >
            <Ionicons name="diamond" size={14} color="rgba(255,255,255,0.7)" />
          </Animated.View>

          {/* Main Logo with Glow Effect */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: Animated.multiply(scaleAnim, pulseAnim) },
                  { rotate: rotation }
                ],
              },
            ]}
          >
            {/* Glow Effect */}
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowOpacity,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', 'transparent']}
                style={styles.glowCircle}
              />
            </Animated.View>
            
            <LinearGradient
              colors={['#ffffff', '#f8fafc', '#e2e8f0']}
              style={styles.logoCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.logoContent}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.iconBackground}
                >
                  <Ionicons name="nutrition" size={52} color="white" />
                </LinearGradient>
              </View>
            </LinearGradient>
            
            {/* Logo Border Glow */}
            <Animated.View
              style={[
                styles.logoBorderGlow,
                {
                  opacity: glowOpacity,
                },
              ]}
            />
          </Animated.View>

          {/* App Name and Tagline */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.appName}>NutriPlan</Text>
            <Text style={styles.tagline}>Smart Meal Planning Made Easy</Text>
            <View style={styles.featureRow}>
              <View style={styles.featurePill}>
                <Ionicons name="sparkles" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.featureText}>AI Powered</Text>
              </View>
              <View style={styles.featurePill}>
                <Ionicons name="heart" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.featureText}>Made with Love</Text>
              </View>
            </View>
          </Animated.View>
          
          {/* Enhanced Progress Bar */}
          <Animated.View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  { width: progressWidth }
                ]} 
              >
                <LinearGradient
                  colors={['#ffffff', '#f8fafc', '#e2e8f0']}
                  style={styles.progressGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
              <View style={styles.progressGlow} />
            </View>
            <View style={styles.loadingTextContainer}>
              <Ionicons name="refresh" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.loadingText}>Preparing your culinary journey...</Text>
            </View>
          </Animated.View>

        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  waveBackground: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    width: width * 2,
    height: height * 2,
    borderRadius: width,
  },
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  particleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  logoContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBorderGlow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: 'rgba(255, 255, 255, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -1.5,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    elevation: 10,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  floatingIcon: {
    position: 'absolute',
  },
  float1: {
    top: height * 0.15,
    left: width * 0.1,
  },
  float2: {
    top: height * 0.2,
    right: width * 0.15,
  },
  float3: {
    bottom: height * 0.3,
    left: width * 0.2,
  },
  float4: {
    top: height * 0.35,
    right: width * 0.05,
  },
  float5: {
    bottom: height * 0.15,
    right: width * 0.25,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: height * 0.25,
    left: width * 0.8,
  },
  sparkle2: {
    top: height * 0.4,
    left: width * 0.15,
  },
  sparkle3: {
    bottom: height * 0.4,
    right: width * 0.1,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  progressGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(255, 255, 255, 0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});