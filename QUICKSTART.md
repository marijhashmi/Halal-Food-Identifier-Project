# Quick Start Guide

Get your Halal Food Identifier app running in 5 minutes!

## Prerequisites Check

- [ ] Node.js installed (v16+)
- [ ] React Native CLI installed: `npm install -g react-native-cli`
- [ ] Android Studio (for Android) or Xcode (for iOS)
- [ ] Firebase account

## Quick Setup

### 1. Install Dependencies

```bash
npm install
cd ios && pod install && cd ..  # iOS only
```

### 2. Firebase Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable **Authentication** > **Email/Password**
4. Create **Firestore Database** (test mode)
5. Download config files:
   - Android: `google-services.json` → `android/app/`
   - iOS: `GoogleService-Info.plist` → `ios/`

### 3. Test with Mock API

Create `mock_api.py`:

```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    return jsonify({
        'halalStatus': 'halal',
        'halalLogoDetected': True,
        'barcode': '1234567890123',
        'productName': 'Test Product',
        'ingredients': ['Water', 'Sugar', 'E100'],
        'eCodes': ['E100'],
        'confidence': 0.95
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

Run: `python mock_api.py`

### 4. Update API URL

Edit `src/config/api.js`:

```javascript
export const MODEL_API_URL = 'http://localhost:5000/predict';
// For Android emulator: 'http://10.0.2.2:5000/predict'
```

### 5. Run the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## First Run

1. Complete onboarding screens
2. Sign up with email/password
3. Grant camera permission when prompted
4. Try scanning a product!

## Next Steps

- Train your YOLOv8 model (see README.md)
- Deploy model to cloud
- Update API URL with production endpoint
- Customize UI/UX

## Troubleshooting

**Camera not working?**
- Check permissions in AndroidManifest.xml / Info.plist
- Grant permissions in device settings

**Firebase errors?**
- Verify config files are in correct locations
- Check Firebase project settings

**API connection failed?**
- Ensure Flask server is running
- Check CORS is enabled
- Use correct URL (10.0.2.2 for Android emulator)

For detailed setup, see [SETUP.md](./SETUP.md)

