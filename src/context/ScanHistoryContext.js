/**
 * Scan History Context
 * Manages scan history and saves to Firestore
 */

import React, {createContext, useState, useEffect, useContext} from 'react';
import {firestore} from '../config/firebase';
import {useAuth} from './AuthContext';

const ScanHistoryContext = createContext({});

export const useScanHistory = () => {
  const context = useContext(ScanHistoryContext);
  if (!context) {
    throw new Error('useScanHistory must be used within ScanHistoryProvider');
  }
  return context;
};

export const ScanHistoryProvider = ({children}) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();

  useEffect(() => {
    if (user) {
      loadScanHistory();
    } else {
      setScans([]);
    }
  }, [user]);

  /**
   * Load scan history from Firestore
   */
  const loadScanHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const scansRef = firestore()
        .collection('scans')
        .where('userId', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .limit(50);

      const snapshot = await scansRef.get();
      const scanList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setScans(scanList);
    } catch (error) {
      console.error('Error loading scan history:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save a new scan to Firestore
   */
  const saveScan = async (scanData) => {
    if (!user) {
      throw new Error('User must be logged in to save scans');
    }

    try {
      const scanDoc = {
        userId: user.uid,
        ...scanData,
        timestamp: firestore().FieldValue.serverTimestamp(),
      };

      const docRef = await firestore().collection('scans').add(scanDoc);
      const newScan = {id: docRef.id, ...scanDoc};

      setScans((prev) => [newScan, ...prev]);
      return {success: true, scan: newScan};
    } catch (error) {
      console.error('Error saving scan:', error);
      return {success: false, error: error.message};
    }
  };

  /**
   * Delete a scan from history
   */
  const deleteScan = async (scanId) => {
    try {
      await firestore().collection('scans').doc(scanId).delete();
      setScans((prev) => prev.filter((scan) => scan.id !== scanId));
      return {success: true};
    } catch (error) {
      console.error('Error deleting scan:', error);
      return {success: false, error: error.message};
    }
  };

  const value = {
    scans,
    loading,
    saveScan,
    deleteScan,
    loadScanHistory,
  };

  return (
    <ScanHistoryContext.Provider value={value}>
      {children}
    </ScanHistoryContext.Provider>
  );
};

