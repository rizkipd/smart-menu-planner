/**
 * Template-Exact Spacing - Fresh Analysis from docs/smart menu/
 * Spacing, padding, margins, border radius from template CSS
 */

export const Spacing = {
  // Base spacing scale - 4px grid system from templates
  xs: 4,    // gap-1, p-1 (4px)
  sm: 8,    // gap-2, p-2 (8px)
  md: 12,   // gap-3, p-3 (12px) 
  lg: 16,   // gap-4, p-4 (16px) - most common in templates
  xl: 24,   // gap-6, p-6 (24px)
  xxl: 32,  // gap-8, p-8 (32px)
  xxxl: 48, // gap-12, p-12 (48px)
  
  // Template-specific spacings - extracted from actual usage
  template: {
    cardGap: 16,      // gap-4 between cards in plan selection
    pageMargin: 16,   // p-4 on page containers  
    sectionGap: 32,   // gap-8 between major sections
    elementGap: 12,   // gap-3 between form elements
    headerPadding: 16, // p-4 on headers
    contentPadding: 16, // p-4 on content areas
  },
  
  // Component-specific padding - based on template analysis
  padding: {
    xs: 8,     // Small elements (py-2)
    sm: 12,    // Medium elements (py-3)
    md: 16,    // Standard padding (p-4)
    lg: 20,    // Large elements (px-5)
    xl: 24,    // Extra large (p-6)
    form: 15,  // p-[15px] from login form template
  },
  
  // Margin values - template patterns
  margin: {
    xs: 4,     // Small margins (m-1)
    sm: 8,     // Medium margins (m-2)
    md: 16,    // Standard margins (m-4)
    lg: 24,    // Large margins (m-6)
    xl: 32,    // Extra large margins (m-8)
  },
  
  // Border radius - exact template values
  borderRadius: {
    sm: 8,     // rounded (0.5rem)
    md: 12,    // rounded-lg (0.75rem) - used in login forms
    lg: 16,    // rounded-xl (1rem) - most common in templates
    xl: 24,    // rounded-2xl (1.5rem)
    full: 9999, // rounded-full - used for profile images, buttons
  },
  
  // Heights commonly used in templates - extracted values
  heights: {
    input: 56,      // h-14 for form inputs (login template)
    button: 48,     // h-12 for buttons (standard across templates)
    tabBar: 48,     // Height for tab navigation
    header: 64,     // Header height
    card: 192,      // h-48 for meal cards (plan selection)
    profileImage: 128, // w-32 h-32 for profile images
    icon: 40,       // size-10 for header icons
    progressBar: 8, // h-2 for progress bars
  },
  
  // Widths commonly used - template patterns
  widths: {
    avatar: 128,    // w-32 for profile images
    icon: 24,       // Standard icon size (w-6)
    iconLarge: 32,  // Large icons (w-8)
    iconHeader: 40, // Header icon container (size-10)
    dayChip: 32,    // h-8 for day selector chips
    maxContent: 448, // max-w-md for content containers
    logoContainer: 144, // w-36 for splash logo
  },
  
  // Z-index values - template layering
  zIndex: {
    base: 0,
    overlay: 10,     // z-10 for overlays and floating content
    modal: 20,       // z-20 for modals
    dropdown: 30,    // z-30 for dropdowns
    tooltip: 40,     // z-40 for tooltips
  },
  
  // Shadow and elevation - template shadow patterns
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', // shadow-sm from templates
  },
  
  // Animation durations - template timing
  animation: {
    fast: 150,     // 150ms for quick interactions
    normal: 300,   // 300ms for standard transitions
    slow: 500,     // 500ms for complex animations
    splash: 1500,  // 1500ms for splash animations
    progress: 2500, // 2500ms for progress bars
  }
} as const;

export default Spacing;