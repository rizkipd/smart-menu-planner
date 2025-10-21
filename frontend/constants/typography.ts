/**
 * Template-Exact Typography - Fresh Analysis from docs/smart menu/
 * Font families, sizes, weights extracted from template CSS
 */

export const Typography = {
  // Font families - consistent across all templates
  fontFamily: {
    display: 'Manrope',      // Primary font from templates: font-family: ["Manrope", "sans-serif"]
    body: 'Manrope',         // Body text uses same font for consistency  
    system: 'System',        // Fallback for iOS/Android system fonts
  },
  
  // Font sizes - exact template values
  fontSize: {
    xs: 12,        // Small labels and captions
    sm: 14,        // Secondary text, form labels (text-sm)
    base: 16,      // Body text, form inputs (text-base)
    lg: 18,        // Subheadings (text-lg)
    xl: 20,        // Large headings (text-xl)
    '2xl': 24,     // Page titles (text-2xl)
    '3xl': 28,     // Splash screen title (text-[28px] from template)
    '4xl': 32,     // Large page titles (text-[32px] from login template)
  },
  
  // Font weights - template values
  fontWeight: {
    light: '300',     // Light text
    normal: '400',    // Normal body text (font-normal)
    medium: '500',    // Medium emphasis (font-medium)
    semibold: '600',  // Semibold headings (font-semibold)
    bold: '700',      // Bold headings (font-bold)
    extrabold: '800', // Extra bold (font-extrabold)
  },
  
  // Line heights - template values
  lineHeight: {
    tight: 1.2,    // leading-tight from templates
    normal: 1.4,   // leading-normal from templates
    relaxed: 1.6,  // Relaxed reading
  },
  
  // Letter spacing - template values
  letterSpacing: {
    tight: -0.5,     // tracking-tight from templates
    normal: 0,       // Normal tracking
    wide: 0.5,       // Wide spacing
    template: 0.015, // tracking-[0.015em] from templates
  },
  
  // Text styles - common template patterns
  textStyles: {
    // Splash screen title
    splashTitle: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.5,
      lineHeight: 33.6, // 28 * 1.2
      fontFamily: 'Manrope',
    },
    
    // Login welcome title  
    loginTitle: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -0.5,
      lineHeight: 38.4, // 32 * 1.2
      fontFamily: 'Manrope',
    },
    
    // Header titles
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: -0.015 * 18,
      lineHeight: 25.2, // 18 * 1.4
      fontFamily: 'Manrope',
    },
    
    // Card titles
    cardTitle: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 24, // tight
      fontFamily: 'Manrope',
    },
    
    // Body text
    bodyText: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 22.4, // 16 * 1.4
      fontFamily: 'Manrope',
    },
    
    // Button text
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.015 * 16,
      lineHeight: 22.4,
      fontFamily: 'Manrope',
    },
  }
} as const;

export default Typography;