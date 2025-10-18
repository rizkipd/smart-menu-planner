import openai
import json
from typing import Dict, List, Any
from app.core.config import settings
from app.models.schemas import WeeklyMealPlan, ShoppingListItem


class AIService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.client = None
        
        # Only initialize OpenAI client if API key is provided and not a placeholder
        if (self.api_key and 
            self.api_key != "your_openai_api_key_here" and 
            not self.api_key.startswith("your_") and 
            len(self.api_key) > 10):
            try:
                self.client = openai.OpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Could not initialize OpenAI client: {e}")
                self.client = None
    
    async def generate_meal_plan(self, mode: str, preferences: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Generate a 7-day meal plan based on the selected mode and user preferences.
        
        Args:
            mode: "Diet", "Satisfaction", or "Economic"
            preferences: User preferences like allergies, budget, people count, etc.
        
        Returns:
            Dictionary containing weekly_plan and shopping_list
        """
        
        # If OpenAI client is not available, return mock data
        if not self.client:
            return self._generate_mock_meal_plan(mode, preferences)
        
        # Build the prompt based on mode and preferences
        system_prompt = self._build_system_prompt(mode, preferences)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": "Generate a complete 7-day meal plan with shopping list."}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the AI response
            meal_plan_data = self._parse_ai_response(response.choices[0].message.content)
            
            return meal_plan_data
            
        except Exception as e:
            # Fallback to mock data if AI service fails
            print(f"AI service failed, using mock data: {e}")
            return self._generate_mock_meal_plan(mode, preferences)
    
    def _build_system_prompt(self, mode: str, preferences: Dict[str, Any] = None) -> str:
        """Build a detailed prompt for meal plan generation."""
        
        # Map frontend mode IDs to internal mode names
        mode_mapping = {
            "diet": "Diet",
            "satisfaction": "Satisfaction", 
            "economic": "Economic"
        }
        
        # Normalize mode to handle both lowercase and capitalized inputs
        normalized_mode = mode_mapping.get(mode.lower(), mode.capitalize())
        
        mode_instructions = {
            "Diet": {
                "focus": "health-focused with optimized nutrition, balanced calories, and health benefits",
                "guidelines": "Include nutritional information, focus on whole foods, lean proteins, vegetables, and controlled portions"
            },
            "Satisfaction": {
                "focus": "taste-focused with delicious, flavorful, and satisfying meals",
                "guidelines": "Include variety of flavors, textures, and appealing presentations. Don't compromise on taste"
            },
            "Economic": {
                "focus": "budget-focused with cost-effective ingredients and minimal waste",
                "guidelines": "Use affordable ingredients, plan for leftovers, choose seasonal produce, and minimize costs"
            }
        }
        
        base_prompt = f"""
You are a professional meal planner creating a 7-day meal plan for mobile users.

MODE: {normalized_mode}
FOCUS: {mode_instructions[normalized_mode]['focus']}
GUIDELINES: {mode_instructions[normalized_mode]['guidelines']}

Requirements:
1. Create exactly 7 days (Monday to Sunday)
2. Each day must have: breakfast, lunch, and dinner
3. Each meal should be practical for mobile users (clear instructions, common ingredients)
4. Include a complete shopping list with quantities
5. Consider meal prep and storage for busy mobile users

"""
        
        # Add user preferences if provided
        if preferences:
            if preferences.get("allergies"):
                base_prompt += f"ALLERGIES TO AVOID: {preferences['allergies']}\n"
            if preferences.get("people_count"):
                base_prompt += f"NUMBER OF PEOPLE: {preferences['people_count']}\n"
            if preferences.get("budget_limit"):
                base_prompt += f"BUDGET LIMIT: {preferences['budget_limit']}\n"
            if preferences.get("dietary_restrictions"):
                base_prompt += f"DIETARY RESTRICTIONS: {preferences['dietary_restrictions']}\n"
        
        base_prompt += """

IMPORTANT: Respond with valid JSON in this exact format:
{
  "weekly_plan": [
    {
      "day": "Monday",
      "breakfast": "Meal description with brief prep notes",
      "lunch": "Meal description with brief prep notes", 
      "dinner": "Meal description with brief prep notes"
    }
  ],
  "shopping_list": [
    {
      "ingredient": "ingredient name",
      "quantity": "amount with unit",
      "category": "category (protein, vegetable, grain, etc)"
    }
  ]
}
"""
        
        return base_prompt
    
    def _parse_ai_response(self, response_content: str) -> Dict[str, Any]:
        """Parse and validate the AI response."""
        try:
            # Extract JSON from response
            if "```json" in response_content:
                json_start = response_content.find("```json") + 7
                json_end = response_content.find("```", json_start)
                json_content = response_content[json_start:json_end].strip()
            else:
                # Try to find JSON directly
                json_start = response_content.find("{")
                json_end = response_content.rfind("}") + 1
                json_content = response_content[json_start:json_end]
            
            meal_plan_data = json.loads(json_content)
            
            # Validate structure
            if not self._validate_meal_plan_structure(meal_plan_data):
                raise ValueError("Invalid meal plan structure from AI")
            
            return meal_plan_data
            
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse AI response as JSON: {e}")
        except Exception as e:
            raise Exception(f"Error processing AI response: {e}")
    
    def _validate_meal_plan_structure(self, data: Dict[str, Any]) -> bool:
        """Validate the meal plan structure."""
        required_keys = ["weekly_plan", "shopping_list"]
        if not all(key in data for key in required_keys):
            return False
        
        # Validate weekly plan
        if not isinstance(data["weekly_plan"], list) or len(data["weekly_plan"]) != 7:
            return False
        
        required_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        for day_plan in data["weekly_plan"]:
            if not all(meal in day_plan for meal in ["day", "breakfast", "lunch", "dinner"]):
                return False
            if day_plan["day"] not in required_days:
                return False
        
        # Validate shopping list
        if not isinstance(data["shopping_list"], list):
            return False
        
        for item in data["shopping_list"]:
            if not all(key in item for key in ["ingredient", "quantity"]):
                return False
        
        return True
    
    def _generate_mock_meal_plan(self, mode: str, preferences: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate mock meal plan data for testing when OpenAI is not available."""
        
        # Normalize mode
        mode_mapping = {"diet": "Diet", "satisfaction": "Satisfaction", "economic": "Economic"}
        normalized_mode = mode_mapping.get(mode.lower(), mode.capitalize())
        
        mock_plans = {
            "Diet": {
                "weekly_plan": [
                    {"day": "Monday", "breakfast": "Greek yogurt with berries and granola", "lunch": "Quinoa salad with grilled chicken", "dinner": "Baked salmon with steamed vegetables"},
                    {"day": "Tuesday", "breakfast": "Overnight oats with chia seeds", "lunch": "Turkey and avocado wrap", "dinner": "Grilled tofu with brown rice"},
                    {"day": "Wednesday", "breakfast": "Smoothie bowl with protein powder", "lunch": "Lentil soup with whole grain bread", "dinner": "Lean beef stir-fry with vegetables"},
                    {"day": "Thursday", "breakfast": "Egg white omelet with spinach", "lunch": "Chickpea and vegetable curry", "dinner": "Grilled chicken breast with sweet potato"},
                    {"day": "Friday", "breakfast": "Avocado toast on whole grain bread", "lunch": "Tuna salad with mixed greens", "dinner": "Baked cod with quinoa pilaf"},
                    {"day": "Saturday", "breakfast": "Protein pancakes with fresh fruit", "lunch": "Black bean and vegetable bowl", "dinner": "Turkey meatballs with zucchini noodles"},
                    {"day": "Sunday", "breakfast": "Chia pudding with almond milk", "lunch": "Grilled vegetable and hummus wrap", "dinner": "Herb-crusted pork tenderloin with roasted vegetables"}
                ],
                "shopping_list": [
                    {"ingredient": "Greek yogurt", "quantity": "32 oz container", "category": "dairy"},
                    {"ingredient": "Mixed berries", "quantity": "2 cups", "category": "fruit"},
                    {"ingredient": "Granola", "quantity": "1 bag", "category": "grain"},
                    {"ingredient": "Quinoa", "quantity": "2 cups", "category": "grain"},
                    {"ingredient": "Chicken breast", "quantity": "2 lbs", "category": "protein"},
                    {"ingredient": "Salmon fillets", "quantity": "1 lb", "category": "protein"},
                    {"ingredient": "Mixed vegetables", "quantity": "3 cups", "category": "vegetable"},
                    {"ingredient": "Eggs", "quantity": "1 dozen", "category": "protein"},
                    {"ingredient": "Spinach", "quantity": "5 oz bag", "category": "vegetable"},
                    {"ingredient": "Avocado", "quantity": "4 pieces", "category": "fruit"}
                ]
            },
            "Satisfaction": {
                "weekly_plan": [
                    {"day": "Monday", "breakfast": "Fluffy pancakes with maple syrup", "lunch": "Bacon cheeseburger with fries", "dinner": "Creamy chicken alfredo pasta"},
                    {"day": "Tuesday", "breakfast": "French toast with strawberries", "lunch": "BBQ pulled pork sandwich", "dinner": "Beef lasagna with garlic bread"},
                    {"day": "Wednesday", "breakfast": "Breakfast burrito with cheese", "lunch": "Loaded nachos with guacamole", "dinner": "Grilled ribeye steak with mashed potatoes"},
                    {"day": "Thursday", "breakfast": "Belgian waffles with whipped cream", "lunch": "Fish and chips with tartar sauce", "dinner": "Mushroom risotto with parmesan"},
                    {"day": "Friday", "breakfast": "Eggs benedict with hollandaise", "lunch": "Chicago deep dish pizza", "dinner": "Honey glazed ham with roasted vegetables"},
                    {"day": "Saturday", "breakfast": "Cinnamon rolls with icing", "lunch": "Philly cheesesteak sandwich", "dinner": "Lobster mac and cheese"},
                    {"day": "Sunday", "breakfast": "Breakfast pizza with bacon", "lunch": "Buffalo wings with blue cheese", "dinner": "Prime rib with Yorkshire pudding"}
                ],
                "shopping_list": [
                    {"ingredient": "Pancake mix", "quantity": "2 lbs", "category": "grain"},
                    {"ingredient": "Maple syrup", "quantity": "1 bottle", "category": "pantry"},
                    {"ingredient": "Ground beef", "quantity": "2 lbs", "category": "protein"},
                    {"ingredient": "Bacon", "quantity": "1 lb", "category": "protein"},
                    {"ingredient": "Cheese slices", "quantity": "1 package", "category": "dairy"},
                    {"ingredient": "Pasta", "quantity": "2 lbs", "category": "grain"},
                    {"ingredient": "Heavy cream", "quantity": "1 pint", "category": "dairy"},
                    {"ingredient": "Chicken breasts", "quantity": "3 lbs", "category": "protein"},
                    {"ingredient": "Potatoes", "quantity": "5 lbs", "category": "vegetable"},
                    {"ingredient": "Butter", "quantity": "1 lb", "category": "dairy"}
                ]
            },
            "Economic": {
                "weekly_plan": [
                    {"day": "Monday", "breakfast": "Oatmeal with banana", "lunch": "Peanut butter and jelly sandwich", "dinner": "Rice and beans with vegetables"},
                    {"day": "Tuesday", "breakfast": "Toast with butter and jam", "lunch": "Egg salad sandwich", "dinner": "Spaghetti with marinara sauce"},
                    {"day": "Wednesday", "breakfast": "Scrambled eggs with toast", "lunch": "Canned soup with crackers", "dinner": "Baked potato with cheese"},
                    {"day": "Thursday", "breakfast": "Cereal with milk", "lunch": "Tuna sandwich", "dinner": "Chicken and rice casserole"},
                    {"day": "Friday", "breakfast": "Pancakes from mix", "lunch": "Ramen noodles with vegetables", "dinner": "Bean and vegetable stew"},
                    {"day": "Saturday", "breakfast": "French toast from day-old bread", "lunch": "Grilled cheese and tomato soup", "dinner": "Fried rice with frozen vegetables"},
                    {"day": "Sunday", "breakfast": "Bagel with cream cheese", "lunch": "Leftover stew", "dinner": "Pasta with butter and parmesan"}
                ],
                "shopping_list": [
                    {"ingredient": "Oatmeal", "quantity": "42 oz container", "category": "grain"},
                    {"ingredient": "Bananas", "quantity": "2 lbs", "category": "fruit"},
                    {"ingredient": "Bread", "quantity": "2 loaves", "category": "grain"},
                    {"ingredient": "Peanut butter", "quantity": "1 jar", "category": "pantry"},
                    {"ingredient": "Jelly", "quantity": "1 jar", "category": "pantry"},
                    {"ingredient": "Rice", "quantity": "5 lbs", "category": "grain"},
                    {"ingredient": "Dried beans", "quantity": "2 lbs", "category": "protein"},
                    {"ingredient": "Eggs", "quantity": "2 dozen", "category": "protein"},
                    {"ingredient": "Pasta", "quantity": "3 lbs", "category": "grain"},
                    {"ingredient": "Canned tomatoes", "quantity": "4 cans", "category": "vegetable"}
                ]
            }
        }
        
        return mock_plans.get(normalized_mode, mock_plans["Satisfaction"])


# Global AI service instance
ai_service = AIService()