# 🍽️ Smart Menu Planner

A sophisticated AI-powered meal planning application that creates personalized meal plans based on your preferences and goals. Built with React Native + Expo for cross-platform mobile compatibility.

## ✨ Features

### 🤖 AI-Powered Meal Generation
- **OpenAI GPT-3.5-turbo Integration**: Intelligent meal plan generation
- **Three Planning Modes**:
  - 🥗 **Diet/Health**: Focus on nutritional goals and dietary restrictions
  - 😋 **Satisfaction/Delicious**: Prioritize taste preferences and food satisfaction
  - 💰 **Economic/Saving**: Optimize for budget-friendly meal options

### 📱 Premium Mobile Experience
- **Cross-Platform**: Native Android and iPhone support
- **Modern UI**: Beautiful gradients, animations, and mobile-first design
- **Responsive Layout**: Optimized for all screen sizes and safe areas
- **Interactive Elements**: Smooth transitions and loading states

### 🛠️ Technical Features
- **FastAPI Backend**: High-performance Python API with automatic documentation
- **SQLite Database**: Reliable data storage with SQLAlchemy ORM
- **Mobile-Optimized API**: Structured endpoints for mobile app integration
- **Real-time Updates**: Hot reload development environment

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Python 3.8+
- OpenAI API key (for AI meal generation)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd smart-menu-planner
```

2. **Backend Setup**
```bash
cd backend
source ../../../forcasting/myenv/bin/activate  # or your preferred Python environment
pip install -r requirements.txt
```

3. **Configure Environment**
```bash
# Create .env file in root directory
cp .env.example .env
# Edit .env with your OpenAI API key:
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Start Backend Server**
```bash
cd backend
source ../../../forcasting/myenv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. **Frontend Setup**
```bash
cd frontend
npm install
```

6. **Start Mobile Development Server**
```bash
cd frontend
npm start
```

### 📱 Running the App

**Mobile Device Testing:**
1. Install Expo Go app on your phone
2. Scan QR code from terminal
3. Enjoy the native mobile experience

**Web Testing:**
- Access via browser at the Metro bundler URL
- Full functionality available in web environment

## 🏗️ Project Structure

```
smart-menu-planner/
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── schemas/        # Pydantic models
│   ├── main.py             # FastAPI application entry
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Native + Expo frontend
│   ├── app/
│   │   ├── (tabs)/         # Tab navigation
│   │   └── _layout.tsx     # App layout
│   ├── components/         # Reusable UI components
│   ├── tailwind.config.js  # NativeWind configuration
│   └── package.json        # Node.js dependencies
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **OpenAI GPT-3.5-turbo**: AI meal plan generation
- **SQLAlchemy**: Python ORM for database operations
- **SQLite**: Lightweight database for development
- **Pydantic**: Data validation and settings management

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **NativeWind**: Tailwind CSS for React Native
- **Expo Router**: File-based routing
- **Linear Gradients**: Beautiful UI components

### Development
- **Metro Bundler**: JavaScript bundling for React Native
- **Hot Reload**: Instant development feedback
- **TypeScript**: Type-safe development
- **Safe Area Insets**: Notch phone compatibility

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints
- `GET /api/v1/mobile/modes` - Get available meal planning modes
- `POST /api/v1/mobile/select-mode` - Select a planning mode
- `POST /api/v1/mobile/generate` - Generate AI meal plan
- `POST /api/v1/mobile/feedback` - Submit feedback on plans

## 🎯 Usage

1. **Select Your Planning Mode**: Choose between Diet/Health, Satisfaction/Delicious, or Economic/Saving
2. **Generate AI Meal Plan**: Tap to generate personalized meal recommendations
3. **Review & Customize**: Browse through meals, recipes, and shopping lists
4. **Save & Share**: Store your favorite plans for later use

## 🔮 Future Enhancements

- [ ] Redis caching for improved performance
- [ ] User authentication and profiles
- [ ] Meal history and favorites
- [ ] Nutritional information tracking
- [ ] Grocery list integration
- [ ] Social sharing features
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the API documentation at http://localhost:8000/docs
- Review the troubleshooting section below
- Open an issue on GitHub

### Troubleshooting

**Backend Issues:**
- Ensure Python environment is activated
- Verify all dependencies are installed
- Check that OpenAI API key is properly configured

**Frontend Issues:**
- Clear Metro cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo CLI version compatibility

---

Built with ❤️ using modern mobile and AI technologies