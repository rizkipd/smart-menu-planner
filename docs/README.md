# 🍽 AI-Powered Family Meal Planner

## 📌 Overview
The **AI-Powered Family Meal Planner** generates **7-day meal plans** (Breakfast, Lunch, Dinner) with shopping lists.  

Users start by selecting one of **3 plan modes**:
1. 🥗 Diet / Health – optimized for nutrition  
2. 🍱 Satisfaction / Delicious – optimized for taste  
3. 💰 Economic / Saving – optimized for budget  

The system first checks the database:  
- If plans exist → users can reuse instantly (no AI cost)  
- If not satisfied → users can generate a new variation (AI → DB)  

---

## 🏗 Components
- **Frontend**: React Native / Flutter / Next.js  
- **Backend**: Node.js / FastAPI  
- **Database**: PostgreSQL / MongoDB  
- **Cache**: Redis (fast lookups)  
- **AI**: GPT-based model for plan generation  

---

## 🗃 Database Design
- **USER** → user info & preferences  
- **MEAL_PLAN** → stores plan mode + weekly menu  
- **PLAN_VARIATION** → allows multiple versions per mode  
- **INGREDIENT** → standardized list for shopping  

See [docs/meal_planner_app_design.md](docs/meal_planner_app_design.md) for ER diagram.  

---

## 📊 Features
- 🎯 Start simple → 3 plan modes  
- 🗃 Database of menu variations  
- ✅ Reuse existing menus  
- 🔄 Generate new menus when needed  
- 🛒 Shopping list included  
- ⚡ Optimized to reduce API costs  

---

## 🚀 Roadmap
- **Phase 1 (MVP)**: Plan selection, DB check, reuse/new menu, shopping list  
- **Phase 2**: Personalization (age, allergies, health), grocery export  
- **Phase 3**: Seasonal/local menus, leftover optimizer, gamification, multi-language  

---

## 📦 Installation
```bash
git clone https://github.com/rizkipd/smart-menu-planner.git
cd smart-menu-planner
```

Backend (Python example):  
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

Frontend:  
```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing
Contributions welcome via PRs.  

## 📜 License
MIT License
