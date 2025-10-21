/**
 * Template-Exact Colors - Fresh Analysis from docs/smart menu/
 * Every color value extracted directly from template HTML/CSS
 */

export const Colors = {
  // Primary brand colors - from template analysis
  primary: '#38e07b',        // Main green across all templates
  primaryAlt: '#4CAF50',     // Alternative green in selected_menu_page
  secondary: '#2196F3',      // Blue accent color
  accent: '#FF9800',         // Orange accent color
  
  // Background colors - template-exact values
  backgroundLight: '#f6f8f7', // Light backgrounds (splash, plan_mode_selection)
  backgroundDark: '#111714',  // Dark backgrounds (login, weekly_menu)
  backgroundDarkAlt: '#122017', // Alternative dark (plan_mode_selection)
  
  // Text colors - template-exact values
  textLight: '#333333',       // Light mode text
  textDark: '#FFFFFF',        // Dark mode text  
  textSecondary: '#8E8E93',   // Secondary text color
  textSecondaryDark: '#9eb7a8', // Template: text-gray-500 dark:text-[#9eb7a8]
  textMuted: '#9eb7a8',       // Muted/placeholder text
  textGray: '#6B7280',        // Gray text variations
  textGrayDark: '#9CA3AF',    // Dark gray text
  
  // Card and surface colors - template-exact
  cardLight: '#FFFFFF',       // Light mode cards
  cardDark: '#19241c',        // Dark mode cards
  cardSecondary: '#29382f',   // Secondary dark surfaces (forms, buttons)
  
  // Border and divider colors - template-exact
  borderLight: '#E5E7EB',     // Light borders
  borderDark: '#3d5245',      // Dark borders (shopping_list_view)
  dividerLight: '#F0F0F0',    // Light dividers
  dividerDark: '#29382f',     // Dark dividers
  
  // Status and semantic colors
  success: '#38e07b',         // Success = primary
  error: '#EF4444',          // Error states
  warning: '#F59E0B',        // Warning states
  info: '#2196F3',           // Info = secondary
  
  // Overlay and transparency colors - template patterns
  overlay50: 'rgba(0, 0, 0, 0.5)',
  overlay80: 'rgba(0, 0, 0, 0.8)',
  overlayGradient: 'rgba(0, 0, 0, 0.8)', // Card overlays in plan selection
  
  // Primary color variations - template usage
  primary20: 'rgba(56, 224, 123, 0.2)',  // Background tints
  primary30: 'rgba(56, 224, 123, 0.3)',  // Hover states
  primary50: 'rgba(56, 224, 123, 0.5)',  // Selection rings
  
  // Template-specific colors
  spaIconColor: '#6B8E23',    // Exact spa icon color from splash
  spaIconBg: '#6B8E2333',     // Spa icon background (20% opacity)
  
  // Gradient definitions - template gradients
  gradients: {
    primary: ['#38e07b', '#4CAF50'],
    health: ['#4CAF50', '#45a049'],     // Diet & Health card
    delicious: ['#FF6B6B', '#FF8E53'],  // Taste & Satisfaction card  
    economic: ['#4ECDC4', '#44A08D'],   // Budget Friendly card
    splash: ['rgba(246, 248, 247, 0.5)', 'transparent'], // Splash overlay
  }
} as const;

export type ColorKeys = keyof typeof Colors;

// Export individual colors for easy importing
export const {
  primary,
  primaryAlt,
  secondary,
  accent,
  backgroundLight,
  backgroundDark,
  backgroundDarkAlt,
  textLight,
  textDark,
  textSecondary,
  textMuted,
  cardLight,
  cardDark,
  cardSecondary,
  success,
  error,
  warning,
  gradients,
} = Colors;

export default Colors;