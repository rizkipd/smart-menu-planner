/**
 * Keyboard navigation utilities for Smart Menu Planner
 * Provides keyboard accessibility and navigation support
 */

import { Keyboard, KeyboardEvent } from 'react-native';
import { logger } from './logger';

export interface KeyboardNavigationConfig {
  enableArrowNavigation?: boolean;
  enableTabNavigation?: boolean;
  enableEnterActivation?: boolean;
  enableEscapeHandling?: boolean;
  circularNavigation?: boolean;
}

export interface NavigationItem {
  id: string;
  element: any; // React element or ref
  onActivate?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}

/**
 * Keyboard navigation manager for React Native
 * Handles focus management and keyboard interactions
 */
export class KeyboardNavigationManager {
  private items: NavigationItem[] = [];
  private currentFocusIndex: number = -1;
  private config: KeyboardNavigationConfig;
  private keyboardListeners: any[] = [];

  constructor(config: KeyboardNavigationConfig = {}) {
    this.config = {
      enableArrowNavigation: true,
      enableTabNavigation: true,
      enableEnterActivation: true,
      enableEscapeHandling: true,
      circularNavigation: true,
      ...config,
    };

    this.setupKeyboardListeners();
  }

  private setupKeyboardListeners() {
    // React Native doesn't have direct keyboard event support
    // This is primarily for web platform compatibility
    if (typeof window !== 'undefined') {
      const handleKeyDown = (event: any) => {
        this.handleKeyPress(event);
      };

      window.addEventListener('keydown', handleKeyDown);
      this.keyboardListeners.push(() => 
        window.removeEventListener('keydown', handleKeyDown)
      );
    }
  }

  private handleKeyPress(event: any) {
    if (this.items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (this.config.enableArrowNavigation) {
          event.preventDefault();
          this.focusNext();
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        if (this.config.enableArrowNavigation) {
          event.preventDefault();
          this.focusPrevious();
        }
        break;

      case 'Tab':
        if (this.config.enableTabNavigation) {
          event.preventDefault();
          if (event.shiftKey) {
            this.focusPrevious();
          } else {
            this.focusNext();
          }
        }
        break;

      case 'Enter':
      case ' ':
        if (this.config.enableEnterActivation) {
          event.preventDefault();
          this.activateCurrent();
        }
        break;

      case 'Escape':
        if (this.config.enableEscapeHandling) {
          event.preventDefault();
          this.clearFocus();
        }
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirst();
        break;

      case 'End':
        event.preventDefault();
        this.focusLast();
        break;
    }
  }

  registerItem(item: NavigationItem): () => void {
    this.items.push(item);
    logger.debug('Navigation item registered', { id: item.id });

    // Return cleanup function
    return () => {
      this.unregisterItem(item.id);
    };
  }

  unregisterItem(id: string) {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      if (index === this.currentFocusIndex) {
        this.clearFocus();
      } else if (index < this.currentFocusIndex) {
        this.currentFocusIndex--;
      }
      this.items.splice(index, 1);
      logger.debug('Navigation item unregistered', { id });
    }
  }

  focusNext() {
    if (this.items.length === 0) return;

    let nextIndex = this.currentFocusIndex + 1;
    
    // Skip disabled items
    while (nextIndex < this.items.length && this.items[nextIndex].disabled) {
      nextIndex++;
    }

    // Handle circular navigation
    if (nextIndex >= this.items.length && this.config.circularNavigation) {
      nextIndex = 0;
      while (nextIndex < this.items.length && this.items[nextIndex].disabled) {
        nextIndex++;
      }
    }

    if (nextIndex < this.items.length && !this.items[nextIndex].disabled) {
      this.focusItem(nextIndex);
    }
  }

  focusPrevious() {
    if (this.items.length === 0) return;

    let prevIndex = this.currentFocusIndex - 1;
    
    // Skip disabled items
    while (prevIndex >= 0 && this.items[prevIndex].disabled) {
      prevIndex--;
    }

    // Handle circular navigation
    if (prevIndex < 0 && this.config.circularNavigation) {
      prevIndex = this.items.length - 1;
      while (prevIndex >= 0 && this.items[prevIndex].disabled) {
        prevIndex--;
      }
    }

    if (prevIndex >= 0 && !this.items[prevIndex].disabled) {
      this.focusItem(prevIndex);
    }
  }

  focusFirst() {
    const firstEnabledIndex = this.items.findIndex(item => !item.disabled);
    if (firstEnabledIndex !== -1) {
      this.focusItem(firstEnabledIndex);
    }
  }

  focusLast() {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (!this.items[i].disabled) {
        this.focusItem(i);
        break;
      }
    }
  }

  focusItem(index: number) {
    if (index < 0 || index >= this.items.length || this.items[index].disabled) {
      return;
    }

    // Blur current item
    if (this.currentFocusIndex !== -1 && this.currentFocusIndex !== index) {
      const currentItem = this.items[this.currentFocusIndex];
      currentItem.onBlur?.();
    }

    // Focus new item
    this.currentFocusIndex = index;
    const item = this.items[index];
    item.onFocus?.();

    logger.debug('Navigation focus changed', { 
      itemId: item.id, 
      index 
    });
  }

  focusById(id: string) {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.focusItem(index);
    }
  }

  activateCurrent() {
    if (this.currentFocusIndex !== -1) {
      const item = this.items[this.currentFocusIndex];
      if (!item.disabled) {
        item.onActivate?.();
        logger.user('Navigation item activated', { id: item.id });
      }
    }
  }

  clearFocus() {
    if (this.currentFocusIndex !== -1) {
      const item = this.items[this.currentFocusIndex];
      item.onBlur?.();
      this.currentFocusIndex = -1;
      logger.debug('Navigation focus cleared');
    }
  }

  updateItemState(id: string, updates: Partial<NavigationItem>) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      Object.assign(item, updates);
      logger.debug('Navigation item updated', { id, updates });
    }
  }

  getItems() {
    return [...this.items];
  }

  getCurrentFocusIndex() {
    return this.currentFocusIndex;
  }

  getCurrentItem() {
    return this.currentFocusIndex !== -1 ? this.items[this.currentFocusIndex] : null;
  }

  destroy() {
    this.items = [];
    this.currentFocusIndex = -1;
    this.keyboardListeners.forEach(cleanup => cleanup());
    this.keyboardListeners = [];
    logger.debug('Keyboard navigation manager destroyed');
  }
}

/**
 * React hook for keyboard navigation
 */
export function useKeyboardNavigation(config?: KeyboardNavigationConfig) {
  const [manager] = React.useState(() => new KeyboardNavigationManager(config));

  React.useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, [manager]);

  return {
    registerItem: (item: NavigationItem) => manager.registerItem(item),
    unregisterItem: (id: string) => manager.unregisterItem(id),
    focusNext: () => manager.focusNext(),
    focusPrevious: () => manager.focusPrevious(),
    focusById: (id: string) => manager.focusById(id),
    activateCurrent: () => manager.activateCurrent(),
    clearFocus: () => manager.clearFocus(),
    getCurrentItem: () => manager.getCurrentItem(),
  };
}

/**
 * Keyboard shortcuts manager
 */
export class KeyboardShortcuts {
  private shortcuts = new Map<string, () => void>();

  register(key: string, callback: () => void) {
    this.shortcuts.set(key.toLowerCase(), callback);
    logger.debug('Keyboard shortcut registered', { key });
  }

  unregister(key: string) {
    this.shortcuts.delete(key.toLowerCase());
    logger.debug('Keyboard shortcut unregistered', { key });
  }

  handleKeyPress(event: any) {
    const key = event.key?.toLowerCase();
    const hasModifier = event.ctrlKey || event.metaKey || event.altKey;
    
    if (hasModifier) {
      const shortcutKey = `${event.ctrlKey ? 'ctrl+' : ''}${event.metaKey ? 'cmd+' : ''}${event.altKey ? 'alt+' : ''}${key}`;
      const callback = this.shortcuts.get(shortcutKey);
      
      if (callback) {
        event.preventDefault();
        callback();
        logger.user('Keyboard shortcut activated', { shortcut: shortcutKey });
      }
    }
  }

  clear() {
    this.shortcuts.clear();
  }
}

// Import React for the hook
const React = require('react');

// Default keyboard navigation manager instance
export const globalKeyboardNavigation = new KeyboardNavigationManager();

// Default keyboard shortcuts instance
export const globalKeyboardShortcuts = new KeyboardShortcuts();