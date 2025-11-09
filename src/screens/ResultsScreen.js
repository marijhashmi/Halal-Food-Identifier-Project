/**
 * Results Screen
 * Displays scan results with Halal status, ingredients, and E-codes
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useScanHistory} from '../context/ScanHistoryContext';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {E_CODES} from '../utils/constants';

const ResultsScreen = () => {
  const {theme} = useTheme();
  const {saveScan} = useScanHistory();
  const navigation = useNavigation();
  const route = useRoute();
  const {imageUri, result, scan} = route.params || {};
  const [saving, setSaving] = useState(false);

  // Use existing scan data or new result
  const scanData = scan || {
    imageUri,
    halalStatus: result?.halalStatus || 'mushbooh',
    halalLogoDetected: result?.halalLogoDetected || false,
    barcode: result?.barcode || null,
    productName: result?.productName || 'Unknown Product',
    ingredients: result?.ingredients || [],
    eCodes: result?.eCodes || [],
    confidence: result?.confidence || 0,
  };

  const handleSave = async () => {
    setSaving(true);
    const saveResult = await saveScan(scanData);
    setSaving(false);

    if (saveResult.success) {
      Alert.alert('Success', 'Scan saved to history', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
    } else {
      Alert.alert('Error', 'Failed to save scan. Please try again.');
    }
  };

  const highlightECodes = (text) => {
    if (!text || !scanData.eCodes || scanData.eCodes.length === 0) {
      return <Text style={{color: theme.colors.text}}>{text}</Text>;
    }

    const parts = [];
    let lastIndex = 0;
    const codesPattern = scanData.eCodes
      .map((code) => code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const regex = new RegExp(`\\b(${codesPattern})\\b`, 'gi');

    let match;
    let keyIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      parts.push(text.substring(lastIndex, match.index));
      const code = match[0].toUpperCase();
      const isHaram = E_CODES.HARAM.includes(code);
      parts.push(
        <Text
          key={`ecode-${keyIndex++}`}
          style={{
            backgroundColor: isHaram
              ? theme.colors.haram + '40'
              : theme.colors.mushbooh + '40',
            fontWeight: 'bold',
            color: isHaram ? theme.colors.haram : theme.colors.mushbooh,
          }}>
          {match[0]}
        </Text>,
      );
      lastIndex = regex.lastIndex;
    }
    parts.push(text.substring(lastIndex));

    return <Text style={{color: theme.colors.text}}>{parts}</Text>;
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
            Scan Results
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Image */}
        {scanData.imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: scanData.imageUri}}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor:
                scanData.halalStatus === 'halal'
                  ? theme.colors.halal
                  : scanData.halalStatus === 'haram'
                  ? theme.colors.haram
                  : theme.colors.mushbooh,
            },
          ]}>
          <Text style={[styles.statusLabel, {color: theme.colors.textSecondary}]}>
            Status
          </Text>
          <View style={styles.statusRow}>
            <StatusBadge status={scanData.halalStatus} size="large" />
            {scanData.confidence > 0 && (
              <Text
                style={[styles.confidence, {color: theme.colors.textSecondary}]}>
                {Math.round(scanData.confidence * 100)}% confidence
              </Text>
            )}
          </View>
        </View>

        {/* Product Info */}
        <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
            Product Information
          </Text>
          <View style={styles.infoRow}>
            <Icon
              name="package-variant"
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.infoText, {color: theme.colors.text}]}>
              {scanData.productName}
            </Text>
          </View>
          {scanData.barcode && (
            <View style={styles.infoRow}>
              <Icon
                name="barcode"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.infoText, {color: theme.colors.text}]}>
                Barcode: {scanData.barcode}
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Icon
              name={
                scanData.halalLogoDetected
                  ? 'check-circle'
                  : 'close-circle'
              }
              size={20}
              color={
                scanData.halalLogoDetected
                  ? theme.colors.halal
                  : theme.colors.textSecondary
              }
            />
            <Text style={[styles.infoText, {color: theme.colors.text}]}>
              Halal Logo: {scanData.halalLogoDetected ? 'Detected' : 'Not Detected'}
            </Text>
          </View>
        </View>

        {/* Ingredients */}
        {scanData.ingredients && scanData.ingredients.length > 0 && (
          <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
              Ingredients
            </Text>
            <View style={styles.ingredientsContainer}>
              {scanData.ingredients.map((ingredient, index) => (
                <View
                  key={index}
                  style={[
                    styles.ingredientItem,
                    {borderColor: theme.colors.border},
                  ]}>
                  <Text style={[styles.ingredientText, {color: theme.colors.text}]}>
                    {highlightECodes(ingredient)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* E-Codes */}
        {scanData.eCodes && scanData.eCodes.length > 0 && (
          <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
              E-Codes Found
            </Text>
            <View style={styles.eCodesContainer}>
              {scanData.eCodes.map((code, index) => {
                const isHaram = E_CODES.HARAM.includes(code.toUpperCase());
                return (
                  <View
                    key={index}
                    style={[
                      styles.eCodeBadge,
                      {
                        backgroundColor: isHaram
                          ? theme.colors.haram + '20'
                          : theme.colors.mushbooh + '20',
                        borderColor: isHaram
                          ? theme.colors.haram
                          : theme.colors.mushbooh,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.eCodeText,
                        {
                          color: isHaram
                            ? theme.colors.haram
                            : theme.colors.mushbooh,
                        },
                      ]}>
                      {code}
                    </Text>
                    <Text
                      style={[
                        styles.eCodeLabel,
                        {
                          color: isHaram
                            ? theme.colors.haram
                            : theme.colors.mushbooh,
                        },
                      ]}>
                      {isHaram ? 'Haram' : 'Mushbooh'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Legend */}
        <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
            Legend
          </Text>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {backgroundColor: theme.colors.halal},
              ]}
            />
            <Text style={[styles.legendText, {color: theme.colors.text}]}>
              Halal - Permitted
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {backgroundColor: theme.colors.haram},
              ]}
            />
            <Text style={[styles.legendText, {color: theme.colors.text}]}>
              Haram - Prohibited
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {backgroundColor: theme.colors.mushbooh},
              ]}
            />
            <Text style={[styles.legendText, {color: theme.colors.text}]}>
              Mushbooh - Questionable
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      {!scan && (
        <View
          style={[
            styles.footer,
            {backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border},
          ]}>
          <Button
            title="Save to History"
            onPress={handleSave}
            loading={saving}
            icon={<Icon name="bookmark" size={20} color="#FFFFFF" />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confidence: {
    fontSize: 12,
  },
  card: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  ingredientsContainer: {
    marginTop: 8,
  },
  ingredientItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    lineHeight: 20,
  },
  eCodesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  eCodeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eCodeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  eCodeLabel: {
    fontSize: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
});

export default ResultsScreen;

