/**
 * API Service Layer for Smart Menu Planner
 * Handles all HTTP communication with the FastAPI backend
 */

import { getFullApiUrl, getApiTimeout, getHealthUrl } from '../config/api';

// API Configuration
const API_BASE_URL = getFullApiUrl();
const API_TIMEOUT = getApiTimeout();

// Response interfaces matching backend schemas
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error_code?: string;
}

export interface PlanMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface MealPlan {
  id: number;
  mode: string;
  weekly_plan: WeeklyMealPlan[];
  shopping_list: ShoppingListItem[];
  created_at: string;
}

export interface WeeklyMealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks?: string;
}

export interface ShoppingListItem {
  name?: string;
  ingredient?: string; // API returns ingredient field
  quantity: string;
  category: string;
  checked?: boolean;
  price?: string;
}

export interface PlanModeSelection {
  mode: string;
}

export interface GeneratePlanRequest {
  mode: string;
  preferences?: {
    dietary_restrictions?: string[];
    allergies?: string[];
    liked_ingredients?: string[];
    disliked_ingredients?: string[];
    servings?: number;
  };
}

// HTTP Client with error handling
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your connection');
        }
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error('Unknown network error');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Initialize API client
const apiClient = new ApiClient(API_BASE_URL);

// Mobile API Service
export class MobileApiService {
  /**
   * Get available meal planning modes
   */
  static async getPlanModes(): Promise<ApiResponse<{ modes: PlanMode[] }>> {
    return apiClient.get('/mobile/modes');
  }

  /**
   * Select a planning mode and check for existing plans
   */
  static async selectPlanMode(request: PlanModeSelection): Promise<ApiResponse<any>> {
    return apiClient.post('/mobile/select-mode', request);
  }

  /**
   * Generate a new meal plan using AI
   */
  static async generateMealPlan(request: GeneratePlanRequest): Promise<ApiResponse<MealPlan>> {
    return apiClient.post('/mobile/generate', request);
  }

  /**
   * Get detailed meal plan by ID
   */
  static async getPlanDetails(planId: number): Promise<ApiResponse<MealPlan>> {
    return apiClient.get(`/mobile/plan/${planId}`);
  }

  /**
   * Get shopping list for a specific plan
   */
  static async getShoppingList(planId: number): Promise<ApiResponse<{
    plan_id: number;
    shopping_list: ShoppingListItem[];
    categorized_list: Record<string, ShoppingListItem[]>;
    total_items: number;
  }>> {
    return apiClient.get(`/mobile/shopping-list/${planId}`);
  }

  /**
   * Get popular plans for a specific mode
   */
  static async getPopularPlans(mode: string, limit: number = 10): Promise<ApiResponse<{
    popular_plans: Array<{
      id: number;
      created_at: string;
      preview: string;
    }>;
    mode: string;
  }>> {
    return apiClient.get(`/mobile/popular/${mode}?limit=${limit}`);
  }

  /**
   * Submit feedback for a meal plan
   */
  static async submitPlanFeedback(
    planId: number, 
    feedback: string, 
    userEmail: string = 'guest@mobile.app'
  ): Promise<ApiResponse<{ feedback: string; plan_id: number }>> {
    return apiClient.post(`/mobile/plan/${planId}/feedback`, {
      feedback,
      user_email: userEmail
    });
  }
}

// Health check and connection testing
export class ApiHealthService {
  /**
   * Check if the backend API is reachable
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), getApiTimeout());
      
      const response = await fetch(getHealthUrl(), {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get API base URL for debugging
   */
  static getApiUrl(): string {
    return API_BASE_URL;
  }
}

export default MobileApiService;