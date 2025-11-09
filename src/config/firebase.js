/**
 * Firebase Configuration
 * 
 * React Native Firebase automatically initializes using google-services.json (Android)
 * and GoogleService-Info.plist (iOS) files.
 * 
 * Make sure to:
 * 1. Place google-services.json in android/app/
 * 2. Place GoogleService-Info.plist in ios/
 * 3. Run: cd ios && pod install
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase is automatically initialized when the app starts
// No manual initialization needed with React Native Firebase

export {auth, firestore};

