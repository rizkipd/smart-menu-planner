# Smart Menu Planner - Frontend

A sophisticated React Native mobile application for meal planning and nutrition management, built with Expo and NativeWind.

## 📱 Features

- **Splash Screen**: Animated onboarding with spa-themed branding
- **Authentication**: Login with email/password and social login options
- **Plan Mode Selection**: Choose from Diet & Health, Taste & Satisfaction, or Budget Friendly modes
- **Tab Navigation**: 
  - Home: Dashboard with quick actions and recent plans
  - Plans: Manage active and completed meal plans
  - Shopping: Interactive shopping list with progress tracking
  - Profile: User settings and statistics

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. **Clone and navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Styling**: Custom Design System with StyleSheet
- **Icons**: Material Icons (@expo/vector-icons)
- **Language**: TypeScript
- **Animations**: React Native Animated API

## 📁 Project Structure

```
frontend/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home tab
│   │   ├── plans.tsx      # Plans tab
│   │   ├── shopping.tsx   # Shopping tab
│   │   └── profile.tsx    # Profile tab
│   ├── _layout.tsx        # Root layout with splash screen
│   ├── index.tsx          # Login screen
│   └── plan-mode-selection.tsx
├── components/            # Reusable components
│   ├── SplashScreen.tsx
│   ├── LoginScreen.tsx
│   └── PlanModeSelection.tsx
├── constants/             # Design system
│   ├── colors.ts          # Color palette
│   ├── typography.ts      # Font styles
│   └── spacing.ts         # Layout spacing
└── types/                 # TypeScript type definitions
```

## 🎨 Design System

The app follows a template-exact design system extracted from `docs/smart menu/` templates:

- **Colors**: Green primary theme (#38e07b) with dark mode support
- **Typography**: Manrope font family with consistent sizing  
- **Spacing**: 4px grid system for consistent layouts
- **Icons**: Material Design icons throughout
- **Implementation**: Custom StyleSheet with design constants instead of CSS classes

## 📱 Navigation Flow

1. **Splash Screen** → Auto-transitions after animations
2. **Login Screen** → Email/password or social login
3. **Plan Mode Selection** → Choose meal planning approach
4. **Tab Navigation** → Main app experience

## 🔧 Development

### Adding New Screens

1. Create new file in `app/` directory
2. Export React component as default
3. Navigation will be automatically handled by Expo Router

### Modifying Design Constants

- **Colors**: Edit `constants/colors.ts`
- **Typography**: Edit `constants/typography.ts`  
- **Spacing**: Edit `constants/spacing.ts`

### Running Tests

```bash
# Add test scripts as needed
npm test
```

### Building for Production

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

## 🌐 Platform Support

- **iOS**: iOS 11.0+
- **Android**: Android 5.0+ (API level 21)
- **Web**: Progressive Web App support via Expo

## 📝 Configuration Files

- `app.json`: Expo configuration
- `babel.config.js`: Babel configuration with Expo Router
- `metro.config.js`: Metro bundler configuration
- `tsconfig.json`: TypeScript configuration (auto-generated)

## 🚨 Troubleshooting

### Common Issues

1. **Metro bundler cache issues**:
   ```bash
   npx expo start --clear
   ```

2. **Styles not applying**:
   - Check that design constants are properly imported
   - Verify StyleSheet objects are correctly structured

3. **Navigation not working**:
   - Verify file structure matches Expo Router conventions
   - Check for typos in route names

### Getting Help

- Check Expo documentation: https://docs.expo.dev/
- React Native documentation: https://reactnative.dev/
- Expo Router documentation: https://docs.expo.dev/router/introduction/

## 📄 License

This project is part of the Smart Menu Planner application.