/**
 * Scan History Screen
 * Displays all saved scans
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useScanHistory} from '../context/ScanHistoryContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const ScanHistoryScreen = () => {
  const {theme} = useTheme();
  const {scans, loading, loadScanHistory, deleteScan} = useScanHistory();
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

  const handleDelete = (scanId) => {
    Alert.alert('Delete Scan', 'Are you sure you want to delete this scan?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteScan(scanId);
        },
      },
    ]);
  };

  const renderScanItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.scanItem,
        {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
      ]}
      onPress={() => navigation.navigate('Results', {scan: item})}>
      {item.imageUri && (
        <Image source={{uri: item.imageUri}} style={styles.scanImage} />
      )}
      <View style={styles.scanInfo}>
        <Text
          style={[styles.scanName, {color: theme.colors.text}]}
          numberOfLines={1}>
          {item.productName || 'Unknown Product'}
        </Text>
        <Text
          style={[styles.scanDate, {color: theme.colors.textSecondary}]}>
          {formatDate(item.timestamp)}
        </Text>
        {item.barcode && (
          <Text
            style={[styles.scanBarcode, {color: theme.colors.textSecondary}]}>
            Barcode: {item.barcode}
          </Text>
        )}
      </View>
      <View style={styles.scanActions}>
        <StatusBadge status={item.halalStatus} size="small" />
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}>
          <Icon name="delete-outline" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
          Scan History
        </Text>
        <View style={styles.placeholder} />
      </View>

      {loading && scans.length === 0 ? (
        <LoadingSpinner message="Loading history..." />
      ) : scans.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon
            name="history"
            size={64}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
            No scan history
          </Text>
          <Text
            style={[
              styles.emptySubtext,
              {color: theme.colors.textSecondary},
            ]}>
            Your saved scans will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={scans}
          renderItem={renderScanItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadScanHistory}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  listContent: {
    padding: 20,
  },
  scanItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scanImage: {
    width: 80,
    height: 80,
  },
  scanInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  scanName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scanDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  scanBarcode: {
    fontSize: 11,
  },
  scanActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
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

export default ScanHistoryScreen;

