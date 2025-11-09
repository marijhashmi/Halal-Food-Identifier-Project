# Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 3. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "Halal Food Identifier"
4. Follow the setup wizard

#### Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click Save

#### Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location close to your users
5. Click "Enable"

#### Update Firestore Rules

Go to **Firestore Database** > **Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own scans
    match /scans/{scanId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### Download Configuration Files

**For Android:**
1. Go to **Project Settings** > **Your apps**
2. Click Android icon
3. Register app with package name: `com.halalfoodidentifier` (or your package name)
4. Download `google-services.json`
5. Place it in `android/app/google-services.json`

**For iOS:**
1. Go to **Project Settings** > **Your apps**
2. Click iOS icon
3. Register app with bundle ID: `com.halalfoodidentifier` (or your bundle ID)
4. Download `GoogleService-Info.plist`
5. Place it in `ios/GoogleService-Info.plist` (root of ios folder)

### 4. Update App Identifiers

#### Android

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.halalfoodidentifier" // Change to your package name
        // ... other config
    }
}
```

#### iOS

1. Open `ios/YourApp.xcworkspace` in Xcode
2. Select your project in the navigator
3. Go to **Signing & Capabilities**
4. Update **Bundle Identifier** to match Firebase

### 5. Add Permissions

#### Android

Edit `android/app/src/main/AndroidManifest.xml` and add:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

#### iOS

Edit `ios/YourApp/Info.plist` and add:

```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to scan products</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to select images</string>
```

### 6. ML Model API Setup

#### Option A: Quick Test with Mock API

For testing without a trained model, you can create a mock API:

```python
# mock_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    # Mock response for testing
    return jsonify({
        'halalStatus': 'halal',
        'halalLogoDetected': True,
        'barcode': '1234567890123',
        'productName': 'Test Product',
        'ingredients': ['Water', 'Sugar', 'E100', 'E200'],
        'eCodes': ['E100', 'E200'],
        'confidence': 0.95
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

Run: `python mock_api.py`

#### Option B: Deploy Trained Model

See README.md for full model training and deployment instructions.

### 7. Update API URL

Edit `src/config/api.js`:

```javascript
export const MODEL_API_URL = 'http://your-api-url.com/predict';
// For local testing: 'http://localhost:5000/predict'
// For Colab ngrok: 'https://your-ngrok-url.ngrok.io/predict'
```

### 8. Run the App

#### Android

```bash
npm run android
```

#### iOS

```bash
npm run ios
```

## Troubleshooting

### Firebase Not Initializing

- Ensure `google-services.json` and `GoogleService-Info.plist` are in correct locations
- Run `cd ios && pod install` again
- Clean build: `cd android && ./gradlew clean`

### Camera Not Working

- Check permissions are added to AndroidManifest.xml and Info.plist
- Grant permissions manually in device settings
- Restart the app after granting permissions

### API Connection Issues

- Check API URL is correct
- Ensure CORS is enabled on your Flask API
- For Android emulator, use `10.0.2.2` instead of `localhost`
- Check network connectivity

### Build Errors

- Clear cache: `npm start -- --reset-cache`
- Clean builds:
  - Android: `cd android && ./gradlew clean`
  - iOS: `cd ios && rm -rf build && pod install`

## Next Steps

1. Train your YOLOv8 model with Halal logo and barcode datasets
2. Integrate EasyOCR for ingredient extraction
3. Deploy model to cloud service
4. Update API URL in `src/config/api.js`
5. Test with real products
6. Customize UI/UX as needed

