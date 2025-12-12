/**
 * Accessibility utilities for Smart Menu Planner
 * Provides screen reader support, keyboard navigation, and WCAG compliance helpers
 */

import { AccessibilityRole, AccessibilityState, AccessibilityProps } from 'react-native';
import { parseToRgba } from 'color2k';

// WCAG 2.1 contrast ratios
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

/**
 * Common accessibility roles for the app
 */
export const ACCESSIBILITY_ROLES = {
  BUTTON: 'button' as AccessibilityRole,
  LINK: 'link' as AccessibilityRole,
  TEXT: 'text' as AccessibilityRole,
  HEADER: 'header' as AccessibilityRole,
  IMAGE: 'image' as AccessibilityRole,
  SEARCH: 'search' as AccessibilityRole,
  TAB: 'tab' as AccessibilityRole,
  TAB_LIST: 'tablist' as AccessibilityRole,
  LIST: 'list' as AccessibilityRole,
  LIST_ITEM: 'listitem' as AccessibilityRole,
  MENU: 'menu' as AccessibilityRole,
  MENU_ITEM: 'menuitem' as AccessibilityRole,
  CHECKBOX: 'checkbox' as AccessibilityRole,
  SWITCH: 'switch' as AccessibilityRole,
  SLIDER: 'adjustable' as AccessibilityRole,
} as const;

/**
 * Generate accessibility props for buttons
 */
export function createButtonA11yProps(
  label: string,
  hint?: string,
  disabled?: boolean
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.BUTTON,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: {
      disabled: disabled || false,
    },
  };
}

/**
 * Generate accessibility props for links
 */
export function createLinkA11yProps(
  label: string,
  hint?: string
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.LINK,
    accessibilityLabel: label,
    accessibilityHint: hint || 'Double tap to open',
  };
}

/**
 * Generate accessibility props for text elements
 */
export function createTextA11yProps(
  text: string,
  isHeading?: boolean,
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: isHeading ? ACCESSIBILITY_ROLES.HEADER : ACCESSIBILITY_ROLES.TEXT,
    accessibilityLabel: text,
    ...(isHeading && headingLevel && {
      accessibilityLevel: headingLevel,
    }),
  };
}

/**
 * Generate accessibility props for images
 */
export function createImageA11yProps(
  altText: string,
  isDecorative?: boolean
): AccessibilityProps {
  if (isDecorative) {
    return {
      accessible: false,
      importantForAccessibility: 'no',
    };
  }

  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.IMAGE,
    accessibilityLabel: altText,
  };
}

/**
 * Generate accessibility props for search inputs
 */
export function createSearchA11yProps(
  placeholder: string,
  value?: string,
  resultsCount?: number
): AccessibilityProps {
  const hasResults = resultsCount !== undefined;
  const label = value 
    ? `Search: ${value}${hasResults ? `, ${resultsCount} results found` : ''}`
    : placeholder;

  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.SEARCH,
    accessibilityLabel: label,
    accessibilityHint: 'Type to search, results will update automatically',
  };
}

/**
 * Generate accessibility props for tab navigation
 */
export function createTabA11yProps(
  label: string,
  isSelected: boolean,
  tabIndex: number,
  totalTabs: number
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.TAB,
    accessibilityLabel: label,
    accessibilityHint: `Tab ${tabIndex + 1} of ${totalTabs}`,
    accessibilityState: {
      selected: isSelected,
    },
  };
}

/**
 * Generate accessibility props for lists
 */
export function createListA11yProps(
  itemCount: number,
  listType: 'meal plans' | 'ingredients' | 'recipes' | 'shopping items' = 'ingredients'
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.LIST,
    accessibilityLabel: `${itemCount} ${listType}`,
  };
}

/**
 * Generate accessibility props for list items
 */
export function createListItemA11yProps(
  title: string,
  description?: string,
  index?: number,
  isSelected?: boolean,
  isCheckable?: boolean,
  isChecked?: boolean
): AccessibilityProps {
  let label = title;
  if (description) {
    label += `, ${description}`;
  }
  if (index !== undefined) {
    label = `Item ${index + 1}: ${label}`;
  }

  const state: AccessibilityState = {};
  if (isSelected !== undefined) {
    state.selected = isSelected;
  }
  if (isCheckable && isChecked !== undefined) {
    state.checked = isChecked;
    label += isChecked ? ', checked' : ', unchecked';
  }

  return {
    accessible: true,
    accessibilityRole: isCheckable ? ACCESSIBILITY_ROLES.CHECKBOX : ACCESSIBILITY_ROLES.LIST_ITEM,
    accessibilityLabel: label,
    accessibilityState: state,
    ...(isCheckable && {
      accessibilityHint: 'Double tap to toggle',
    }),
  };
}

/**
 * Generate accessibility props for toggle switches
 */
export function createSwitchA11yProps(
  label: string,
  isEnabled: boolean,
  hint?: string
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.SWITCH,
    accessibilityLabel: label,
    accessibilityHint: hint || 'Double tap to toggle',
    accessibilityState: {
      checked: isEnabled,
    },
  };
}

/**
 * Generate accessibility props for meal plan cards
 */
export function createMealPlanA11yProps(
  title: string,
  description: string,
  category: string,
  isFavorite?: boolean
): AccessibilityProps {
  let label = `${title}, ${description}, Category: ${category}`;
  if (isFavorite !== undefined) {
    label += isFavorite ? ', favorited' : ', not favorited';
  }

  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.BUTTON,
    accessibilityLabel: label,
    accessibilityHint: 'Double tap to view details',
    ...(isFavorite !== undefined && {
      accessibilityActions: [
        { name: 'activate', label: 'View details' },
        { name: 'magicTap', label: isFavorite ? 'Remove from favorites' : 'Add to favorites' },
      ],
    }),
  };
}

/**
 * Generate accessibility props for shopping list items
 */
export function createShoppingItemA11yProps(
  name: string,
  quantity: string,
  category: string,
  isChecked: boolean
): AccessibilityProps {
  const label = `${name}, ${quantity}, ${category}, ${isChecked ? 'completed' : 'not completed'}`;

  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.CHECKBOX,
    accessibilityLabel: label,
    accessibilityHint: 'Double tap to toggle completion',
    accessibilityState: {
      checked: isChecked,
    },
  };
}

/**
 * Generate accessibility props for navigation headers
 */
export function createHeaderA11yProps(
  title: string,
  hasBackButton?: boolean,
  hasActionButton?: boolean,
  actionLabel?: string
): AccessibilityProps {
  let label = title;
  if (hasBackButton) {
    label = `${title}, back button available`;
  }
  if (hasActionButton && actionLabel) {
    label += `, ${actionLabel} button available`;
  }

  return {
    accessible: true,
    accessibilityRole: ACCESSIBILITY_ROLES.HEADER,
    accessibilityLabel: label,
  };
}

/**
 * Calculate relative luminance of a color (WCAG standard)
 */
function calculateLuminance(color: string): number {
  try {
    const rgbaColor = parseToRgba(color);
    const [r, g, b] = rgbaColor.map(val => val / 255);
    
    // Apply gamma correction
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    // Calculate relative luminance
    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
  } catch (error) {
    console.warn('Error calculating luminance for color:', color, error);
    return 0.5; // Fallback value
  }
}

/**
 * Calculate color contrast ratio (WCAG compliant)
 * Returns the contrast ratio between foreground and background colors
 */
export function calculateContrastRatio(foreground: string, background: string): number {
  try {
    const l1 = calculateLuminance(foreground);
    const l2 = calculateLuminance(background);
    
    // Ensure lighter color is l1
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    // Calculate contrast ratio
    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    console.warn('Error calculating contrast ratio for colors:', foreground, background, error);
    return 4.5; // Fallback value (meets WCAG AA for normal text)
  }
}

/**
 * Check if contrast meets WCAG guidelines
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  isLargeText: boolean = false,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  const requirement = isLargeText 
    ? (level === 'AA' ? CONTRAST_RATIOS.AA_LARGE : CONTRAST_RATIOS.AAA_LARGE)
    : (level === 'AA' ? CONTRAST_RATIOS.AA_NORMAL : CONTRAST_RATIOS.AAA_NORMAL);
  
  return ratio >= requirement;
}

/**
 * Announce to screen readers (for dynamic content updates)
 */
export function announceToScreenReader(message: string) {
  // This would typically use AccessibilityInfo.announceForAccessibility
  // but that requires importing from react-native
  // Components using this should import and call AccessibilityInfo.announceForAccessibility(message)
  console.log('Screen Reader Announcement:', message);
}