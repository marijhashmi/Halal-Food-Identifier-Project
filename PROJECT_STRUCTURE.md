# Project Structure

## Overview

This is a complete React Native application for identifying Halal food products using AI. The app uses YOLOv8 for object detection (Halal logos, barcodes) and EasyOCR for ingredient text extraction.

## Directory Structure

```
halal-food-identifier/
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Button.js           # Custom button with variants
│   │   ├── StatusBadge.js      # Halal/Haram/Mushbooh badge
│   │   └── LoadingSpinner.js   # Loading indicator
│   │
│   ├── config/                  # Configuration files
│   │   ├── firebase.js         # Firebase setup
│   │   └── api.js              # ML model API configuration
│   │
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.js      # Authentication state
│   │   ├── ThemeContext.js     # Theme (light/dark) management
│   │   └── ScanHistoryContext.js # Scan history state
│   │
│   ├── navigation/              # Navigation setup
│   │   ├── AppNavigator.js     # Root navigator
│   │   ├── AuthNavigator.js    # Auth flow navigation
│   │   └── MainNavigator.js    # Main app navigation (tabs)
│   │
│   ├── screens/                 # App screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.js      # Login page
│   │   │   └── SignupScreen.js     # Registration page
│   │   ├── HomeScreen.js           # Main dashboard
│   │   ├── CameraScreen.js         # Camera scanner
│   │   ├── ResultsScreen.js        # Scan results display
│   │   ├── ProfileScreen.js        # User profile & settings
│   │   ├── ScanHistoryScreen.js    # Scan history list
│   │   └── OnboardingScreen.js     # First-time user intro
│   │
│   ├── utils/                   # Utility functions
│   │   ├── validation.js       # Form validation helpers
│   │   └── constants.js        # App constants (E-codes, etc.)
│   │
│   └── App.js                   # Root component
│
├── android/                     # Android native code
├── ios/                         # iOS native code
│
├── package.json                 # Dependencies
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler config
├── .gitignore                  # Git ignore rules
│
├── README.md                    # Main documentation
├── SETUP.md                     # Detailed setup guide
├── QUICKSTART.md               # Quick start guide
└── PROJECT_STRUCTURE.md        # This file

```

## Key Features

### Authentication
- Email/password authentication via Firebase
- Password strength validation
- Session management
- Password/email update functionality

### Scanning
- Real-time camera scanning
- Gallery image selection
- Image processing and API integration
- Loading states and error handling

### Results Display
- Halal status with color coding
- Product information
- Ingredient list with E-code highlighting
- E-code classification (Haram/Mushbooh)
- Save to history functionality

### History Management
- Firestore integration for scan storage
- List view with filtering
- Delete functionality
- Pull-to-refresh

### UI/UX
- Modern, professional design
- Light/dark theme support
- Smooth animations
- Responsive layout
- Error handling and loading states

## Technology Stack

### Frontend
- **React Native** 0.72.6
- **React Navigation** 6.x (Stack + Bottom Tabs)
- **React Native Paper** (UI components)
- **React Native Vision Camera** (camera access)
- **React Native Image Picker** (gallery access)

### Backend
- **Firebase Authentication** (user auth)
- **Cloud Firestore** (data storage)
- **Custom ML API** (YOLOv8 + EasyOCR)

### State Management
- React Context API
- AsyncStorage (local storage)

## Data Flow

1. **User Authentication**
   - User signs up/logs in → Firebase Auth
   - Auth state managed by AuthContext
   - Protected routes based on auth state

2. **Product Scanning**
   - User captures/selects image
   - Image sent to ML API endpoint
   - API returns detection results
   - Results displayed on ResultsScreen

3. **History Management**
   - Scan results saved to Firestore
   - History loaded from Firestore
   - Real-time updates via context

## API Integration

### Expected API Response Format

```json
{
  "halalStatus": "halal" | "haram" | "mushbooh",
  "halalLogoDetected": boolean,
  "barcode": string | null,
  "productName": string | null,
  "ingredients": string[],
  "eCodes": string[],
  "confidence": number (0-1)
}
```

### API Endpoint

Configure in `src/config/api.js`:
- Default: `https://your-model-api-url.com/predict`
- Method: POST
- Body: FormData with image file
- Headers: `Content-Type: multipart/form-data`

## Customization

### Theme Colors
Edit `src/context/ThemeContext.js`:
- Primary color (Halal green)
- Error color (Haram red)
- Warning color (Mushbooh yellow)
- Background/surface colors

### E-Code Lists
Edit `src/utils/constants.js`:
- Add/remove Haram E-codes
- Add/remove Mushbooh E-codes

### UI Components
All components in `src/components/` are reusable and customizable.

## Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Camera permission and access
- [ ] Image capture and selection
- [ ] API integration and response handling
- [ ] Results display and saving
- [ ] History loading and deletion
- [ ] Theme switching
- [ ] Profile updates
- [ ] Error handling

## Deployment

### Android
1. Generate signed APK/AAB
2. Update Firebase config
3. Test on physical devices
4. Upload to Google Play Store

### iOS
1. Configure signing in Xcode
2. Update Firebase config
3. Test on physical devices
4. Upload to App Store

## Future Enhancements

- [ ] Barcode API integration for product lookup
- [ ] Social login (Google, Apple)
- [ ] Offline mode with local caching
- [ ] Push notifications
- [ ] Product favorites
- [ ] Sharing functionality
- [ ] Multi-language support
- [ ] Advanced filtering in history

