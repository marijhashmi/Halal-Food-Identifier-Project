/**
 * Loading Spinner Component
 * Displays a loading indicator
 */

import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const LoadingSpinner = ({message = 'Loading...', size = 'large'}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text style={[styles.message, {color: theme.colors.text}]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default LoadingSpinner;

