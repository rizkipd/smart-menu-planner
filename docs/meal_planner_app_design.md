# 📄 meal_planner_app_design.md

## 🍽 App Concept
An AI-powered mobile app that generates **7-day meal plans** with shopping lists.  

**✅ CURRENT STATUS: FULLY IMPLEMENTED AND OPERATIONAL**

Users start by selecting one of **3 modes**:  
1. 🥗 **Diet / Health** – nutrition, calories, health conditions  
2. 🍱 **Satisfaction / Delicious** – taste, premium variety  
3. 💰 **Economic / Saving** – cost efficiency, leftovers  

System checks DB first:  
- If existing menus → user can **reuse**  
- Or **generate new menu** (AI call → save to DB for future reuse)  

---

## 🏗 System Components (IMPLEMENTED)

### **Frontend** ✅
- **React Native + Expo** - Cross-platform mobile development  
- **NativeWind** - Tailwind CSS for React Native  
- **Premium Mobile UI** - Gradients, animations, modern design  
- **Screens Implemented**:  
  - Plan mode selection (3 beautiful gradient cards)  
  - Weekly menu view (breakfast/lunch/dinner × 7)  
  - Shopping list view (expandable sections)  
  - Loading states and error handling  
  - Pull-to-refresh functionality  

### **Backend** ✅
- **Python FastAPI** - Modern async web framework  
- **Automatic API Documentation** - Swagger UI at /docs  
- **Services Implemented**:  
  - **AI Service** → OpenAI GPT-3.5-turbo integration  
  - **Plan Service** → Meal plan generation and storage  
  - **Mobile API** → Optimized endpoints for React Native app  

### **Cache** 🔄
- **Redis** → Planned for **frequently used meal plans** (next enhancement)  

### **Database** ✅
- **SQLite with SQLAlchemy** → Production-ready **meal plans + variations**  
- **Models Implemented**: User, MealPlan, PlanVariation, Ingredient  

### **AI Layer** ✅
- **OpenAI GPT-3.5-turbo** - Production AI integration  
- **Structured prompts** for consistent meal plan generation  
- **JSON response parsing** with error handling  

---

## 🗃 Database Design

```mermaid
erDiagram
    USER {
        string user_id PK
        string email
        string plan_preference
    }

    MEAL_PLAN {
        string plan_id PK
        string plan_mode
        json weekly_plan
        json shopping_list
        date created_at
    }

    PLAN_VARIATION {
        string variation_id PK
        string plan_id FK
        string user_id FK
        string feedback (like/dislike)
        date created_at
    }
    
    INGREDIENT {
        string ingredient_id PK
        string name
        string unit
    }

    MEAL_PLAN ||--o{ PLAN_VARIATION : "has"
    MEAL_PLAN ||--o{ INGREDIENT : "includes"
    USER ||--o{ PLAN_VARIATION : "chooses"
```

---

## 📊 Data Model Example

```json
{
  "plan_id": "plan_001",
  "plan_mode": "Diet",
  "weekly_plan": [
    {
      "day": "Monday",
      "breakfast": "Oatmeal with banana",
      "lunch": "Grilled salmon + salad",
      "dinner": "Vegetable stir fry"
    },
    {
      "day": "Tuesday",
      "breakfast": "Greek yogurt + berries",
      "lunch": "Chicken breast + quinoa",
      "dinner": "Lentil soup"
    }
  ],
  "shopping_list": [
    {"ingredient": "oats", "quantity": "500g"},
    {"ingredient": "banana", "quantity": "7 pcs"},
    {"ingredient": "salmon", "quantity": "1kg"},
    {"ingredient": "lettuce", "quantity": "2 heads"}
  ],
  "created_at": "2025-09-29T00:00:00Z"
}
```

---

## 🔄 Implementation Flow (FULLY FUNCTIONAL)

### **Current Implementation** ✅
1. User selects **plan mode** from beautiful gradient cards  
2. Backend checks **SQLite DB for existing plans**  
3. If found → show existing plan(s) with shopping lists  
4. User chooses: **reuse OR generate new**  
5. If new → **OpenAI GPT-3.5-turbo** generates → save to DB → return to user  

### **Technical Implementation Details**
- **Mobile App**: React Native + Expo with premium UI
- **API Endpoints**: `/api/v1/mobile/*` for mobile optimization
- **Database**: SQLite with SQLAlchemy ORM
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Beautiful animations during AI generation

---

## 🚀 Development Status

### ✅ **Phase 1: COMPLETE** 
- [x] Plan mode selection with premium UI
- [x] Database integration and caching
- [x] AI meal plan generation with OpenAI
- [x] Shopping list generation and display
- [x] Mobile-optimized API endpoints
- [x] Cross-platform React Native app
- [x] Premium gradients and animations
- [x] Error handling and loading states

### 🔄 **Phase 2: IN PROGRESS** 
- [x] Basic personalization (plan modes)
- [ ] User profiles and preferences
- [ ] Enhanced personalization (age, allergies, goals)
- [ ] Export shopping list functionality
- [ ] Meal history and favorites

### ⏳ **Phase 3: FUTURE ENHANCEMENTS** 
- [ ] Redis caching implementation
- [ ] Seasonal menus and recommendations
- [ ] Leftover optimizer
- [ ] Gamification features
- [ ] Community sharing
- [ ] Multi-language support

---

## 🎯 **Current Production Status**

**🟢 LIVE AND READY FOR USE**

- **Backend**: http://localhost:8000 (FastAPI with docs)
- **Frontend**: http://localhost:8081 (Expo Metro bundler)
- **Mobile**: Scan QR code with Expo Go app
- **API Documentation**: Available at `/docs`

**Next Step**: Add OpenAI API key to `.env` file for AI meal generation  
