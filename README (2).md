# Halal Food Identifier App

A professional React Native cross-platform mobile application that uses AI (YOLOv8 + EasyOCR) to identify Halal, Haram, and Mushbooh food products by detecting Halal logos, barcodes, and analyzing ingredients.

## Features

- 🔐 **Authentication**: Email/password authentication with Firebase
- 📷 **Product Scanning**: Real-time camera scanning and gallery image upload
- 🤖 **AI Detection**: YOLOv8 model for Halal logo and barcode detection
- 📝 **OCR Analysis**: EasyOCR for ingredient list extraction
- 🏷️ **E-Code Detection**: Automatic identification of Haram/Mushbooh E-codes
- 📊 **Scan History**: Save and manage your scan history with Firestore
- 🎨 **Modern UI**: Professional design with light/dark theme support
- 📱 **Cross-Platform**: Works on both iOS and Android

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Firebase account
- CocoaPods (for iOS)

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd halal-food-identifier
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 4. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Download configuration files:
   - **Android**: Download `google-services.json` and place it in `android/app/`
   - **iOS**: Download `GoogleService-Info.plist` and place it in `ios/`
5. Update `src/config/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### 5. ML Model API Configuration

1. Train your YOLOv8 + EasyOCR model (see Model Training section)
2. Deploy the model to a cloud service (Colab, Heroku, AWS, etc.)
3. Update `src/config/api.js` with your model API URL:

```javascript
export const MODEL_API_URL = 'https://your-model-api-url.com/predict';
```

## Model Training & Deployment

### Option 1: Google Colab

1. Create a new Colab notebook
2. Install required packages:
```python
!pip install ultralytics easyocr flask flask-cors
```

3. Train YOLOv8 model:
```python
from ultralytics import YOLO

# Load pre-trained model
model = YOLO('yolov8n.pt')

# Train on your dataset
model.train(data='path/to/your/dataset.yaml', epochs=100, imgsz=640)
```

4. Create Flask API endpoint:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# Load models
yolo_model = YOLO('path/to/your/trained_model.pt')
ocr_reader = easyocr.Reader(['en'])

@app.route('/predict', methods=['POST'])
def predict():
    # Get image from request
    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # YOLOv8 detection
    results = yolo_model(img)
    halal_logo_detected = False
    barcode = None
    
    # Process detections
    for result in results:
        boxes = result.boxes
        for box in boxes:
            cls = int(box.cls[0])
            # Check if halal logo or barcode detected
            if cls == 0:  # Halal logo class
                halal_logo_detected = True
            elif cls == 1:  # Barcode class
                # Extract barcode value
                barcode = extract_barcode(img, box)
    
    # OCR for ingredients
    ocr_results = ocr_reader.readtext(img)
    ingredients = []
    e_codes = []
    
    for detection in ocr_results:
        text = detection[1]
        ingredients.append(text)
        # Extract E-codes
        import re
        codes = re.findall(r'E\d{3}', text)
        e_codes.extend(codes)
    
    # Determine Halal status
    halal_status = determine_halal_status(
        halal_logo_detected, 
        e_codes, 
        ingredients
    )
    
    return jsonify({
        'halalStatus': halal_status,
        'halalLogoDetected': halal_logo_detected,
        'barcode': barcode,
        'productName': None,  # Can be fetched from barcode API
        'ingredients': ingredients,
        'eCodes': list(set(e_codes)),
        'confidence': 0.95
    })

def determine_halal_status(halal_logo, e_codes, ingredients):
    # Your logic here
    haram_codes = ['E120', 'E441', 'E542', ...]
    if halal_logo:
        return 'halal'
    elif any(code in haram_codes for code in e_codes):
        return 'haram'
    else:
        return 'mushbooh'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

5. Deploy using ngrok for testing:
```python
!pip install pyngrok
from pyngrok import ngrok

public_url = ngrok.connect(5000)
print(f'Public URL: {public_url}')
```

### Option 2: Deploy to Cloud

- **Heroku**: Use Heroku CLI to deploy Flask app
- **AWS Lambda**: Use Serverless Framework
- **Google Cloud Run**: Containerize your Flask app
- **Azure Functions**: Deploy as serverless function

## Running the App

### Android

```bash
npm run android
# or
yarn android
```

### iOS

```bash
npm run ios
# or
yarn ios
```

## Project Structure

```
halal-food-identifier/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── StatusBadge.js
│   │   └── LoadingSpinner.js
│   ├── config/              # Configuration files
│   │   ├── firebase.js
│   │   └── api.js
│   ├── context/             # React Context providers
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── ScanHistoryContext.js
│   ├── navigation/          # Navigation setup
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── screens/             # App screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── SignupScreen.js
│   │   ├── HomeScreen.js
│   │   ├── CameraScreen.js
│   │   ├── ResultsScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ScanHistoryScreen.js
│   │   └── OnboardingScreen.js
│   ├── utils/               # Utility functions
│   │   ├── validation.js
│   │   └── constants.js
│   └── App.js               # Root component
├── android/                 # Android native code
├── ios/                     # iOS native code
├── package.json
└── README.md
```

## Key Features Implementation

### Authentication
- Email/password authentication using Firebase Auth
- Password validation (min 8 chars, 1 number, 1 special char)
- Secure session management

### Camera Integration
- Real-time camera using `react-native-vision-camera`
- Image picker for gallery selection
- Image processing and API integration

### State Management
- Context API for global state
- AuthContext for user session
- ThemeContext for theme management
- ScanHistoryContext for scan data

### Navigation
- React Navigation with Stack and Bottom Tabs
- Smooth transitions and animations
- Deep linking support

## Troubleshooting

### Camera Permission Issues

**Android**: Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

**iOS**: Add to `ios/YourApp/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan products</string>
```

### Firebase Issues

- Ensure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are correctly placed
- Check Firebase project settings match your app bundle ID
- Verify Firestore rules allow authenticated users to read/write

### Model API Issues

- Ensure CORS is enabled on your Flask API
- Check API endpoint is accessible from mobile device
- Verify image format is correctly sent (FormData)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## Acknowledgments

- YOLOv8 by Ultralytics
- EasyOCR for text recognition
- React Native community
- Firebase for backend services

