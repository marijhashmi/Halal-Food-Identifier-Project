/**
 * Home Screen
 * Main dashboard with scan options and recent scans
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import {useScanHistory} from '../context/ScanHistoryContext';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const {theme} = useTheme();
  const {user} = useAuth();
  const {scans, loading, loadScanHistory} = useScanHistory();
  const navigation = useNavigation();

  useEffect(() => {
    loadScanHistory();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <View>
          <Text style={[styles.greeting, {color: theme.colors.textSecondary}]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, {color: theme.colors.text}]}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={[styles.profileButton, {backgroundColor: theme.colors.primary}]}>
          <Icon name="account" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadScanHistory}
            tintColor={theme.colors.primary}
          />
        }>
        {/* Scan Actions */}
        <View style={styles.scanSection}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Scan Product
          </Text>
          <View style={styles.scanButtons}>
            <TouchableOpacity
              style={[
                styles.scanCard,
                {
                  backgroundColor: theme.colors.primary,
                  shadowColor: theme.colors.primary,
                },
              ]}
              onPress={() => navigation.navigate('Scan')}>
              <Icon name="camera" size={32} color="#FFFFFF" />
              <Text style={styles.scanCardText}>Camera Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.scanCard,
                {
                  backgroundColor: theme.colors.secondary,
                  shadowColor: theme.colors.secondary,
                },
              ]}
              onPress={() => {
                // Handle gallery picker
                navigation.navigate('Scan', {fromGallery: true});
              }}>
              <Icon name="image" size={32} color="#FFFFFF" />
              <Text style={styles.scanCardText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Recent Scans
            </Text>
            {scans.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('ScanHistory')}>
                <Text style={[styles.seeAll, {color: theme.colors.primary}]}>
                  See All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {loading && scans.length === 0 ? (
            <LoadingSpinner message="Loading scans..." />
          ) : scans.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon
                name="barcode-scan"
                size={64}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
                No scans yet
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  {color: theme.colors.textSecondary},
                ]}>
                Start scanning products to see your history
              </Text>
            </View>
          ) : (
            scans.slice(0, 5).map((scan) => (
              <TouchableOpacity
                key={scan.id}
                style={[
                  styles.scanItem,
                  {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
                ]}
                onPress={() => navigation.navigate('Results', {scan})}>
                <View style={styles.scanItemContent}>
                  {scan.imageUri && (
                    <Image
                      source={{uri: scan.imageUri}}
                      style={styles.scanItemImage}
                    />
                  )}
                  <View style={styles.scanItemInfo}>
                    <Text
                      style={[styles.scanItemName, {color: theme.colors.text}]}
                      numberOfLines={1}>
                      {scan.productName || 'Unknown Product'}
                    </Text>
                    <Text
                      style={[
                        styles.scanItemDate,
                        {color: theme.colors.textSecondary},
                      ]}>
                      {formatDate(scan.timestamp)}
                    </Text>
                  </View>
                  <StatusBadge status={scan.halalStatus} size="small" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scanSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scanButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  historySection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  scanItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scanItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  scanItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  scanItemInfo: {
    flex: 1,
  },
  scanItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scanItemDate: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;

