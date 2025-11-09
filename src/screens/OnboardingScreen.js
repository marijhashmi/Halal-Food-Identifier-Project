/**
 * Onboarding Screen
 * First-time user introduction to the app
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const OnboardingScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);

  const onboardingData = [
    {
      title: 'Welcome to Halal Food Identifier',
      description:
        'Scan products to instantly check if they are Halal, Haram, or Mushbooh',
      icon: '🕌',
    },
    {
      title: 'Smart Detection',
      description:
        'Uses AI to detect Halal logos, barcodes, and analyze ingredients automatically',
      icon: '🤖',
    },
    {
      title: 'E-Code Analysis',
      description:
        'Identifies E-codes in ingredients and flags potential Haram or Mushbooh additives',
      icon: '🔍',
    },
    {
      title: 'Scan History',
      description:
        'Keep track of all your scans and access them anytime from your profile',
      icon: '📜',
    },
  ];

  const handleNext = async () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      await AsyncStorage.setItem('hasLaunched', 'true');
      navigation.replace('Auth');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    navigation.replace('Auth');
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentPage(page);
        }}>
        {onboardingData.map((item, index) => (
          <View key={index} style={[styles.page, {width}]}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              {item.title}
            </Text>
            <Text style={[styles.description, {color: theme.colors.textSecondary}]}>
              {item.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === currentPage
                      ? theme.colors.primary
                      : theme.colors.border,
                  width: index === currentPage ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentPage < onboardingData.length - 1 && (
            <Button
              title="Skip"
              onPress={handleSkip}
              variant="secondary"
              style={styles.skipButton}
            />
          )}
          <Button
            title={currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 2,
  },
});

export default OnboardingScreen;

