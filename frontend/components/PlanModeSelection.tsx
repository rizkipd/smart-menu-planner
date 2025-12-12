import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { MobileApiService } from '../services/api';

interface PlanMode {
  id: string;
  title: string;
  description: string;
  image: string;
  gradient: string[];
  selected?: boolean;
}

interface PlanModeSelectionProps {
  onBack: () => void;
  onPlanSelect: (selectedMode: PlanMode) => void;
}

// Fallback plan modes - used when API is unavailable
const fallbackPlanModes: PlanMode[] = [
  {
    id: 'diet_health',
    title: 'Diet & Health',
    description: 'Prioritizes nutritional goals and healthy eating.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaOg5RziT9w_V4wlcMr4oPfvPHMuL8cU56wKFRgxcf1yJ-Esrl-uPyYS5-xNGjRVRFu_7jX7-4XKW-nCq1w1RXHP_rHvGpLLkwDQjvlEs9pMoExv7lnZsIqzzcfQi2Vf1tbqiI8IEjWDquDDj-tfL-1DobzabQZxN9rd2d-LeIeoxD4oBBmo4mcIw2XITqmcZVZmbrKkrI1sB0X5S8eXnX2QxrSLCUMw1lBD97un-TNbjb2INh2KvKdnBjSllyfgug8m-n3vnuL-ez',
    gradient: Colors.gradients.health,
  },
  {
    id: 'taste_satisfaction',
    title: 'Taste & Satisfaction',
    description: 'Focuses on flavorful and enjoyable meal experiences.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAx5xPNlkSbWWu9d3v5wFEMqISovKmaqqqkpko4IDVzuS2egkbOBFbeGRGNEpyZ6aEa3NlKbjdWA7m_vuNTSc4w9VudTjGn8zpPMmouqhj4Bfe5DoeefW9hx5Ru44fXIBxgWx_v3qRdY2fi16b4JUeq4U5ddUT9osmx5h6oU0Zn5BShq_9tHX12aoLOSlcaokCnlKu_2ZhYx7jKYN7PYTTTXKBZvapGuVpP7bjwhGtDdmuKUPvF10QM-72X5-MenmIUtxx1JOKjdlK',
    gradient: Colors.gradients.delicious,
  },
  {
    id: 'budget_friendly',
    title: 'Budget Friendly',
    description: 'Generates cost-effective meal plans to help you save.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaukLgPSWZq6ULELdDIPVI6EDxJzcIM758cRS6E-ao5pKPsDhnHja2O3rlf5g4FUbmZJolB8_vSNjxh2aS_S0d_r7hrdbC1Rv5lIl39S4EOAleXA38QAjXuZgv42TAJkbgJB46N-S2g28gJLpR9MNZosGB52cUkj0ZjKcKz6aUic0RDiN6Z2WeR_R44F5iAocaSnbIxP7dddEvVQQAUgWBv9xYbBDXBzNBhFjxAxyWIcrIdIRzvSE8PeCTVsTrGSq1cnQTCz6fgVN7',
    gradient: Colors.gradients.economic,
    selected: true, // Default selection
  },
];

// Image mapping for modes from API
const modeImages: Record<string, string> = {
  'diet_health': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaOg5RziT9w_V4wlcMr4oPfvPHMuL8cU56wKFRgxcf1yJ-Esrl-uPyYS5-xNGjRVRFu_7jX7-4XKW-nCq1w1RXHP_rHvGpLLkwDQjvlEs9pMoExv7lnZsIqzzcfQi2Vf1tbqiI8IEjWDquDDj-tfL-1DobzabQZxN9rd2d-LeIeoxD4oBBmo4mcIw2XITqmcZVZmbrKkrI1sB0X5S8eXnX2QxrSLCUMw1lBD97un-TNbjb2INh2KvKdnBjSllyfgug8m-n3vnuL-ez',
  'taste_satisfaction': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAx5xPNlkSbWWu9d3v5wFEMqISovKmaqqqkpko4IDVzuS2egkbOBFbeGRGNEpyZ6aEa3NlKbjdWA7m_vuNTSc4w9VudTjGn8zpPMmouqhj4Bfe5DoeefW9hx5Ru44fXIBxgWx_v3qRdY2fi16b4JUeq4U5ddUT9osmx5h6oU0Zn5BShq_9tHX12aoLOSlcaokCnlKu_2ZhYx7jKYN7PYTTTXKBZvapGuVpP7bjwhGtDdmuKUPvF10QM-72X5-MenmIUtxx1JOKjdlK',
  'budget_friendly': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaukLgPSWZq6ULELdDIPVI6EDxJzcIM758cRS6E-ao5pKPsDhnHja2O3rlf5g4FUbmZJolB8_vSNjxh2aS_S0d_r7hrdbC1Rv5lIl39S4EOAleXA38QAjXuZgv42TAJkbgJB46N-S2g28gJLpR9MNZosGB52cUkj0ZjKcKz6aUic0RDiN6Z2WeR_R44F5iAocaSnbIxP7dddEvVQQAUgWBv9xYbBDXBzNBhFjxAxyWIcrIdIRzvSE8PeCTVsTrGSq1cnQTCz6fgVN7',
};

const modeGradients: Record<string, string[]> = {
  'diet_health': Colors.gradients.health,
  'taste_satisfaction': Colors.gradients.delicious,
  'budget_friendly': Colors.gradients.economic,
};

const { width, height } = Dimensions.get('window');

export default function PlanModeSelection({ onBack, onPlanSelect }: PlanModeSelectionProps) {
  const [planModes, setPlanModes] = useState<PlanMode[]>(fallbackPlanModes);
  const [selectedMode, setSelectedMode] = useState<PlanMode>(fallbackPlanModes[2]); // Default to budget_friendly
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plan modes from API
  useEffect(() => {
    const fetchModes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await MobileApiService.getPlanModes();

        if (response.success && response.data?.modes) {
          // Map API response to PlanMode interface
          const apiModes: PlanMode[] = response.data.modes.map((mode: any) => ({
            id: mode.id || mode.mode_id,
            title: mode.title || mode.name,
            description: mode.description,
            image: modeImages[mode.id || mode.mode_id] || fallbackPlanModes[0].image,
            gradient: modeGradients[mode.id || mode.mode_id] || Colors.gradients.health,
          }));

          if (apiModes.length > 0) {
            setPlanModes(apiModes);
            setSelectedMode(apiModes[0]);
          }
        } else {
          // Use fallback if API returns no data
          console.log('Using fallback plan modes');
        }
      } catch (err: any) {
        console.error('Failed to fetch plan modes:', err);
        setError('Could not load plan modes. Using defaults.');
        // Keep using fallback modes
      } finally {
        setLoading(false);
      }
    };

    fetchModes();
  }, []);

  const handleModeSelect = (mode: PlanMode) => {
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    onPlanSelect(selectedMode);
  };

  const renderPlanCard = (mode: PlanMode) => {
    const isSelected = selectedMode.id === mode.id;

    return (
      <TouchableOpacity
        key={mode.id}
        style={[
          styles.planCard,
          isSelected && styles.planCardSelected
        ]}
        onPress={() => handleModeSelect(mode)}
        activeOpacity={0.9}
      >
        {/* Background image - template: absolute inset-0 w-full h-full object-cover */}
        <Image
          source={{ uri: mode.image }}
          style={styles.planCardImage}
          resizeMode="cover"
        />
        
        {/* Overlay with gradient - template: absolute inset-0 bg-gradient-to-t from-black/80 to-transparent */}
        <View style={styles.planCardOverlay}>
          {/* Card content - template: p-4 flex-col justify-end */}
          <View style={styles.planCardContent}>
            {/* Title - template: text-white text-xl font-bold leading-tight */}
            <Text style={styles.planCardTitle}>{mode.title}</Text>
            
            {/* Description - template: text-zinc-200 text-sm font-normal leading-normal mt-1 */}
            <Text style={styles.planCardDescription}>{mode.description}</Text>
            
            {/* Select button - template: mt-3 px-4 py-2 rounded-full text-sm font-semibold self-start */}
            <TouchableOpacity
              style={[
                styles.planCardButton,
                isSelected ? styles.planCardButtonSelected : styles.planCardButtonDefault
              ]}
              onPress={() => handleModeSelect(mode)}
            >
              <Text style={[
                styles.planCardButtonText,
                isSelected ? styles.planCardButtonTextSelected : styles.planCardButtonTextDefault
              ]}>
                {isSelected ? '✓ Selected' : 'Select'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDarkAlt} />
      
      {/* Template-exact structure: relative flex-col h-auto min-h-screen w-full bg-background-dark overflow-x-hidden */}
      <View style={styles.designRoot}>
        
        {/* Header - template: flex items-center p-4 pb-2 justify-between bg-background-dark */}
        <View style={styles.header}>
          {/* Back button - template: flex size-10 shrink-0 items-center justify-center */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={Colors.textDark} 
            />
          </TouchableOpacity>
          
          {/* Header title - template: text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center */}
          <Text style={styles.headerTitle}>Curated Gallery</Text>
          
          {/* Spacer for alignment */}
          <View style={styles.headerSpacer} />
        </View>

        {/* Content area - template: flex-1 p-4 */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading plan options...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              {planModes.map(renderPlanCard)}
            </ScrollView>
          )}
        </View>

        {/* Continue button - template: p-4 mt-auto */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
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
  
  // Design root - template: relative flex-col h-auto min-h-screen w-full bg-background-dark overflow-x-hidden
  designRoot: {
    position: 'relative',
    flexDirection: 'column',
    height: height,
    minHeight: 884, // min-h-screen equivalent
    width: '100%',
    backgroundColor: Colors.backgroundDarkAlt, // #122017
    overflow: 'hidden',
  },
  
  // Header - template: flex items-center p-4 pb-2 justify-between bg-background-dark
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50, // Mobile status bar spacing
    paddingHorizontal: Spacing.lg, // p-4
    paddingBottom: Spacing.sm, // pb-2
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundDarkAlt,
  },
  
  // Back button - template: flex size-10 shrink-0 items-center justify-center
  backButton: {
    flexDirection: 'row',
    width: Spacing.widths.iconHeader, // size-10 (40px)
    height: Spacing.widths.iconHeader,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.borderRadius.full,
  },
  
  // Header title - template: text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display
  headerTitle: {
    color: Colors.textDark,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.textStyles.headerTitle.lineHeight,
    letterSpacing: Typography.letterSpacing.tight,
    flex: 1,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.display,
  },
  
  // Header spacer for alignment
  headerSpacer: {
    width: Spacing.widths.iconHeader, // size-10 (40px)
  },
  
  // Content area - template: flex-1 p-4
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg, // p-4
  },
  
  scrollArea: {
    flex: 1,
  },
  
  // Scroll content - template: space-y-4 p-4
  scrollContent: {
    gap: Spacing.lg, // space-y-4 (16px)
    paddingVertical: Spacing.lg, // p-4
  },
  
  // Plan card - template: relative w-full h-48 rounded-xl overflow-hidden ring-4 ring-transparent
  planCard: {
    position: 'relative',
    width: '100%',
    height: Spacing.heights.card, // h-48 (192px)
    borderRadius: Spacing.borderRadius.lg, // rounded-xl
    overflow: 'hidden',
    borderWidth: 4, // ring-4
    borderColor: 'transparent', // ring-transparent
  },
  
  // Plan card selected - template: ring-primary/50
  planCardSelected: {
    borderColor: Colors.primary + '80', // primary/50 (50% opacity)
  },
  
  // Plan card image - template: absolute inset-0 w-full h-full object-cover
  planCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  
  // Plan card overlay - template: absolute inset-0 bg-gradient-to-t from-black/80 to-transparent
  planCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlayGradient, // from-black/80 to-transparent
  },
  
  // Plan card content - template: p-4 flex-col justify-end
  planCardContent: {
    padding: Spacing.lg, // p-4
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%',
  },
  
  // Plan card title - template: text-white text-xl font-bold leading-tight
  planCardTitle: {
    color: 'white',
    fontSize: Typography.fontSize.xl, // text-xl
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.textStyles.cardTitle.lineHeight, // leading-tight
    fontFamily: Typography.fontFamily.display,
  },
  
  // Plan card description - template: text-zinc-200 text-sm font-normal leading-normal mt-1
  planCardDescription: {
    color: '#e4e4e7', // zinc-200
    fontSize: Typography.fontSize.sm, // text-sm
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal, // leading-normal
    marginTop: Spacing.xs, // mt-1
    fontFamily: Typography.fontFamily.body,
  },
  
  // Plan card button - template: mt-3 px-4 py-2 rounded-full text-sm font-semibold self-start
  planCardButton: {
    marginTop: Spacing.md, // mt-3
    paddingHorizontal: Spacing.lg, // px-4
    paddingVertical: Spacing.sm, // py-2
    borderRadius: Spacing.borderRadius.full, // rounded-full
    alignSelf: 'flex-start', // self-start
  },
  
  // Plan card button default state
  planCardButtonDefault: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)', // Dark semi-transparent
  },
  
  // Plan card button selected state - template: bg-primary
  planCardButtonSelected: {
    backgroundColor: Colors.primary,
  },
  
  // Plan card button text
  planCardButtonText: {
    fontSize: Typography.fontSize.sm, // text-sm
    fontWeight: Typography.fontWeight.semibold, // font-semibold
    fontFamily: Typography.fontFamily.display,
  },
  
  // Plan card button text default
  planCardButtonTextDefault: {
    color: '#e4e4e7', // zinc-200
  },
  
  // Plan card button text selected
  planCardButtonTextSelected: {
    color: Colors.backgroundDark, // Dark text on light button
  },
  
  // Bottom container - template: p-4 mt-auto
  bottomContainer: {
    paddingHorizontal: Spacing.lg, // p-4
    paddingVertical: Spacing.lg,
    marginTop: 'auto', // mt-auto
  },
  
  // Continue button - template: flex min-w-[84px] w-full max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary mx-auto
  continueButton: {
    flexDirection: 'row',
    minWidth: 84, // min-w-[84px]
    width: '100%', // w-full
    maxWidth: 480, // max-w-[480px]
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: Spacing.borderRadius.lg, // rounded-xl
    height: Spacing.heights.button, // h-12
    paddingHorizontal: Spacing.padding.lg, // px-5
    backgroundColor: Colors.primary,
    marginHorizontal: 'auto', // mx-auto
  },
  
  // Continue button text - template: text-zinc-900 text-base font-bold leading-normal tracking-[0.015em] font-display
  continueButtonText: {
    color: '#18181b', // zinc-900 (dark text on light button)
    fontSize: Typography.fontSize.base, // text-base
    fontWeight: Typography.fontWeight.bold, // font-bold
    lineHeight: Typography.textStyles.buttonText.lineHeight, // leading-normal
    letterSpacing: Typography.letterSpacing.template, // tracking-[0.015em]
    fontFamily: Typography.fontFamily.display,
  },

  // Loading container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },

  loadingText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.md,
    fontFamily: Typography.fontFamily.body,
  },

  // Error text
  errorText: {
    color: Colors.warning,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.warning + '20',
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.body,
  },
});