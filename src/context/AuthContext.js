/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

import React, {createContext, useState, useEffect, useContext} from 'react';
import {auth} from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await AsyncStorage.setItem('user', JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Sign up with email and password
   */
  const signUp = async (email, password) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      return {success: true, user: userCredential.user};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      return {success: true, user: userCredential.user};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('user');
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  /**
   * Update user password
   */
  const updatePassword = async (newPassword) => {
    try {
      await auth().currentUser.updatePassword(newPassword);
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  /**
   * Update user email
   */
  const updateEmail = async (newEmail) => {
    try {
      await auth().currentUser.updateEmail(newEmail);
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updatePassword,
    updateEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

