import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PlanMode {
  id: string;
  title: string;
  description: string;
  image: string;
  selected?: boolean;
}

interface PlanModeSelectionProps {
  onBack: () => void;
  onPlanSelect: (selectedMode: PlanMode) => void;
}

const planModes: PlanMode[] = [
  {
    id: 'diet_health',
    title: 'Diet & Health',
    description: 'Prioritizes nutritional goals and healthy eating.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaOg5RziT9w_V4wlcMr4oPfvPHMuL8cU56wKFRgxcf1yJ-Esrl-uPyYS5-xNGjRVRFu_7jX7-4XKW-nCq1w1RXHP_rHvGpLLkwDQjvlEs9pMoExv7lnZsIqzzcfQi2Vf1tbqiI8IEjWDquDDj-tfL-1DobzabQZxN9rd2d-LeIeoxD4oBBmo4mcIw2XITqmcZVZmbrKkrI1sB0X5S8eXnX2QxrSLCUMw1lBD97un-TNbjb2INh2KvKdnBjSllyfgug8m-n3vnuL-ez',
  },
  {
    id: 'taste_satisfaction',
    title: 'Taste & Satisfaction',
    description: 'Focuses on flavorful and enjoyable meal experiences.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAx5xPNlkSbWWu9d3v5wFEMqISovKmaqqqkpko4IDVzuS2egkbOBFbeGRGNEpyZ6aEa3NlKbjdWA7m_vuNTSc4w9VudTjGn8zpPMmouqhj4Bfe5DoeefW9hx5Ru44fXIBxgWx_v3qRdY2fi16b4JUeq4U5ddUT9osmx5h6oU0Zn5BShq_9tHX12aoLOSlcaokCnlKu_2ZhYx7jKYN7PYTTTXKBZvapGuVpP7bjwhGtDdmuKUPvF10QM-72X5-MenmIUtxx1JOKjdlK',
  },
  {
    id: 'budget_friendly',
    title: 'Budget Friendly',
    description: 'Generates cost-effective meal plans to help you save.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaukLgPSWZq6ULELdDIPVI6EDxJzcIM758cRS6E-ao5pKPsDhnHja2O3rlf5g4FUbmZJolB8_vSNjxh2aS_S0d_r7hrdbC1Rv5lIl39S4EOAleXA38QAjXuZgv42TAJkbgJB46N-S2g28gJLpR9MNZosGB52cUkj0ZjKcKz6aUic0RDiN6Z2WeR_R44F5iAocaSnbIxP7dddEvVQQAUgWBv9xYbBDXBzNBhFjxAxyWIcrIdIRzvSE8PeCTVsTrGSq1cnQTCz6fgVN7',
    selected: true,
  },
];

export default function PlanModeSelection({ onBack, onPlanSelect }: PlanModeSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<PlanMode>(
    planModes.find(mode => mode.selected) || planModes[0]
  );

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
        <Image
          source={{ uri: mode.image }}
          style={styles.planCardImage}
          resizeMode="cover"
        />
        <View style={styles.planCardOverlay}>
          <Text style={styles.planCardTitle}>{mode.title}</Text>
          <Text style={styles.planCardDescription}>{mode.description}</Text>
          <TouchableOpacity
            style={[
              styles.planCardButton,
              isSelected ? styles.planCardButtonSelected : styles.planCardButtonDefault
            ]}
            onPress={() => handleModeSelect(mode)}
          >
            <Text style={styles.planCardButtonText}>
              {isSelected ? 'Selected' : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#122017" />
      
      {/* Exact template structure */}
      <View style={styles.designRoot}>
        {/* Header exactly matching template */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Curated Gallery</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content area */}
        <View style={styles.content}>
          <ScrollView 
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {planModes.map(renderPlanCard)}
          </ScrollView>
        </View>

        {/* Continue button */}
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

// Exact template CSS converted to React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  designRoot: {
    position: 'relative', // template relative
    flexDirection: 'column', // template flex-col
    height: '100%', // template h-auto min-h-screen
    minHeight: 884, // template min-h-screen
    width: '100%', // template w-full
    backgroundColor: '#122017', // template bg-background-light dark:bg-background-dark
    overflow: 'hidden', // template overflow-x-hidden
  },
  // Header exactly matching template
  header: {
    flexDirection: 'row', // template flex
    alignItems: 'center', // template items-center
    paddingHorizontal: 16, // template p-4
    paddingVertical: 8, // template pb-2
    justifyContent: 'space-between', // template justify-between
    backgroundColor: '#122017', // template bg-background-light dark:bg-background-dark
  },
  backButton: {
    flexDirection: 'row', // template flex
    width: 40, // template size-10
    height: 40,
    flexShrink: 0, // template shrink-0
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    borderRadius: 20, // template rounded-full
  },
  headerTitle: {
    color: '#FFFFFF', // template text-zinc-900 dark:text-white
    fontSize: 18, // template text-lg
    fontWeight: '700', // template font-bold
    lineHeight: 28, // template leading-tight
    letterSpacing: -0.015 * 18, // template tracking-[-0.015em]
    flex: 1, // template flex-1
    textAlign: 'center', // template text-center
    fontFamily: 'Manrope', // template font-display
  },
  headerSpacer: {
    width: 40, // template size-10
  },
  content: {
    flex: 1, // template flex-1
    paddingHorizontal: 16, // template p-4
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    gap: 16, // template space-y-4
    paddingVertical: 16, // template p-4
  },
  // Plan cards exactly matching template
  planCard: {
    position: 'relative', // template relative
    width: '100%', // template w-full
    height: 192, // template h-48
    borderRadius: 12, // template rounded-xl
    overflow: 'hidden', // template overflow-hidden
    borderWidth: 4, // template ring-4
    borderColor: 'transparent', // template ring-transparent
    // Template focus-within:ring-primary/50 hover:ring-primary/50 would be handled by interaction states
  },
  planCardSelected: {
    borderColor: 'rgba(56, 224, 123, 0.5)', // template ring-primary/50
  },
  planCardImage: {
    position: 'absolute', // template absolute
    top: 0, // template inset-0
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%', // template w-full
    height: '100%', // template h-full
  },
  planCardOverlay: {
    position: 'absolute', // template absolute
    top: 0, // template inset-0
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // template bg-gradient-to-t from-black/80 to-transparent
    paddingHorizontal: 16, // template p-4
    flexDirection: 'column', // template flex-col
    justifyContent: 'flex-end', // template justify-end
    paddingBottom: 16,
  },
  planCardTitle: {
    color: 'white', // template text-white
    fontSize: 20, // template text-xl
    fontWeight: '700', // template font-bold
    lineHeight: 28, // template leading-tight
  },
  planCardDescription: {
    color: '#e4e4e7', // template text-zinc-200
    fontSize: 14, // template text-sm
    fontWeight: '400', // template font-normal
    lineHeight: 20, // template leading-normal
    marginTop: 4, // template mt-1
  },
  planCardButton: {
    marginTop: 12, // template mt-3
    paddingHorizontal: 16, // template px-4
    paddingVertical: 8, // template py-2
    borderRadius: 9999, // template rounded-full
    fontSize: 14, // template text-sm
    fontWeight: '600', // template font-semibold
    alignSelf: 'flex-start', // template self-start
    // Template opacity-0 group-hover/card:opacity-100 transition-opacity would be handled by interaction states
  },
  planCardButtonDefault: {
    backgroundColor: 'white', // template bg-white
  },
  planCardButtonSelected: {
    backgroundColor: '#38e07b', // template bg-primary
  },
  planCardButtonText: {
    color: '#18181b', // template text-zinc-900
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Manrope',
  },
  bottomContainer: {
    paddingHorizontal: 16, // template p-4
    paddingVertical: 16,
    marginTop: 'auto', // template mt-auto
  },
  continueButton: {
    flexDirection: 'row', // template flex
    minWidth: 84, // template min-w-[84px]
    width: '100%', // template w-full
    maxWidth: 480, // template max-w-[480px]
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    overflow: 'hidden', // template overflow-hidden
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    paddingHorizontal: 20, // template px-5
    backgroundColor: '#38e07b', // template bg-primary
    marginHorizontal: 'auto', // template mx-auto
  },
  continueButtonText: {
    color: '#18181b', // template text-zinc-900
    fontSize: 16, // template text-base
    fontWeight: '700', // template font-bold
    lineHeight: 24, // template leading-normal
    letterSpacing: 0.015 * 16, // template tracking-[0.015em]
    fontFamily: 'Manrope',
  },
});