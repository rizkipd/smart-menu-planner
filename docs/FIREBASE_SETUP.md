# Firebase Setup Guide for Smart Menu Planner

This guide walks you through setting up Firebase for the Smart Menu Planner app.

## Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `Smart Menu Planner` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**
6. Wait for project creation to complete

## Step 2: Enable Authentication

1. In the Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click **"Save"**

### Optional: Enable Social Login

**Google Sign-In:**
1. Click on "Google" in the Sign-in providers list
2. Toggle "Enable" to ON
3. Add a support email
4. Click **"Save"**

**Apple Sign-In (iOS only):**
1. Click on "Apple" in the Sign-in providers list
2. Toggle "Enable" to ON
3. Follow Apple's setup instructions for Sign in with Apple
4. Click **"Save"**

## Step 3: Setup Firestore Database

1. In the sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a Cloud Firestore location closest to your users
5. Click **"Enable"**

### Production Security Rules

For production, update Firestore rules in the Firebase Console:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated users to read meal plans
    match /mealPlans/{planId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 4: Setup Cloud Storage (for Avatar Images)

1. In the sidebar, click **"Storage"**
2. Click **"Get started"**
3. Choose **"Start in test mode"** (for development)
4. Click **"Next"** and then **"Done"**

### Production Storage Rules

For production, update Storage rules:

```firestore
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 5: Add Android App

1. In Firebase Console, click the gear icon (⚙️) → **"Project settings"**
2. Under "Your apps", click the **Android icon** (robot)
3. Enter the following:
   - **Android package name:** `com.smartmenu.planner`
   - **App nickname:** `Smart Menu Planner`
   - (Optional) Debug signing certificate SHA-1
4. Click **"Register app"**
5. Download `google-services.json`
6. Place the file in:
   ```
   frontend/android/app/google-services.json
   ```

## Step 6: Add iOS App

1. In Firebase Console → Project settings
2. Click **"Add app"** → **iOS icon** (Apple logo)
3. Enter the following:
   - **Apple bundle ID:** `com.smartmenu.planner`
   - **App nickname:** `Smart Menu Planner`
4. Click **"Register app"**
5. Download `GoogleService-Info.plist`
6. Place the file in:
   ```
   frontend/ios/SmartMenuPlanner/GoogleService-Info.plist
   ```

## Step 7: Verify Setup

### Check Configuration Files

Ensure the following files exist:

```
frontend/
├── android/
│   └── app/
│       └── google-services.json    ← Android config
├── ios/
│   └── SmartMenuPlanner/
│       └── GoogleService-Info.plist ← iOS config
└── firebase/
    └── config.ts                    ← Already configured
```

### Test Authentication

1. Start the app:
   ```bash
   cd frontend && npm start
   ```

2. Try to create an account via **"Sign Up"**

3. Check Firebase Console → Authentication → Users
   - You should see the newly created user

### Common Issues

**"Firebase not initialized" error:**
- Ensure `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) is in the correct location
- Rebuild the app after adding config files

**"Network error" on login:**
- Check internet connectivity
- Verify Firebase project is active

**"User not found" error:**
- The user hasn't been created yet
- Use "Sign Up" to create a new account first

## Firebase SDK Packages

The following Firebase packages are already installed:

```json
{
  "@react-native-firebase/app": "^18.6.1",
  "@react-native-firebase/auth": "^18.6.1",
  "@react-native-firebase/firestore": "^18.6.1",
  "@react-native-firebase/storage": "^18.6.1"
}
```

No additional package installation is required.

## Firebase Services Used

| Service | Purpose |
|---------|---------|
| Authentication | User sign up, login, password reset |
| Firestore | User profile storage, meal plan data |
| Cloud Storage | Avatar image uploads |

## Environment Variables

Firebase configuration is handled automatically by the native config files. No additional environment variables are needed for Firebase.

## Security Best Practices

1. **Never commit config files to version control:**
   - Add to `.gitignore`:
     ```
     google-services.json
     GoogleService-Info.plist
     ```

2. **Use production security rules** before deploying

3. **Enable App Check** for additional security (optional)

4. **Monitor usage** in Firebase Console to detect unusual activity

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com)
