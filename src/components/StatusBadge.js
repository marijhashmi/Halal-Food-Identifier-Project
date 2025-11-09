/**
 * Status Badge Component
 * Displays Halal/Haram/Mushbooh status with color coding
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {HALAL_STATUS_LABELS} from '../utils/constants';

const StatusBadge = ({status, size = 'medium'}) => {
  const {theme} = useTheme();

  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'halal':
        return theme.colors.halal;
      case 'haram':
        return theme.colors.haram;
      case 'mushbooh':
        return theme.colors.mushbooh;
      default:
        return theme.colors.textSecondary;
    }
  };

  const sizeStyles = {
    small: {padding: 6, fontSize: 12},
    medium: {padding: 10, fontSize: 14},
    large: {padding: 14, fontSize: 18},
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getStatusColor() + '20',
          borderColor: getStatusColor(),
          ...sizeStyles[size],
        },
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: getStatusColor(),
            fontSize: sizeStyles[size].fontSize,
            fontWeight: 'bold',
          },
        ]}>
        {HALAL_STATUS_LABELS[status?.toLowerCase()] || status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  text: {
    textTransform: 'uppercase',
  },
});

export default StatusBadge;

