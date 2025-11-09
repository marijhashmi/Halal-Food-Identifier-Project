/**
 * Profile Screen
 * User profile, settings, and account management
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {validateEmail, validatePassword} from '../utils/validation';

const ProfileScreen = () => {
  const {theme, themeMode, toggleTheme} = useTheme();
  const {user, signOut, updateEmail, updatePassword} = useAuth();
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleChangeEmail = async () => {
    if (!validateEmail(newEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await updateEmail(newEmail);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Email updated successfully');
      setShowChangeEmail(false);
      setNewEmail('');
    } else {
      Alert.alert('Error', result.error || 'Failed to update email');
    }
  };

  const handleChangePassword = async () => {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      Alert.alert(
        'Invalid Password',
        Object.values(passwordValidation.errors).filter(Boolean)[0],
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await updatePassword(newPassword);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Password updated successfully');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      Alert.alert('Error', result.error || 'Failed to update password');
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
          <View style={[styles.avatar, {backgroundColor: theme.colors.primary}]}>
            <Icon name="account" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.userName, {color: theme.colors.text}]}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={[styles.userEmail, {color: theme.colors.textSecondary}]}>
            {user?.email || ''}
          </Text>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Account Settings
          </Text>

          {/* Change Email */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
            ]}
            onPress={() => setShowChangeEmail(!showChangeEmail)}>
            <View style={styles.settingLeft}>
              <Icon
                name="email-outline"
                size={24}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.settingText, {color: theme.colors.text}]}>
                Change Email
              </Text>
            </View>
            <Icon
              name={showChangeEmail ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {showChangeEmail && (
            <View
              style={[
                styles.settingExpanded,
                {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
              ]}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                placeholder="New Email"
                placeholderTextColor={theme.colors.textSecondary}
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Button
                title="Update Email"
                onPress={handleChangeEmail}
                loading={loading}
                style={styles.updateButton}
              />
            </View>
          )}

          {/* Change Password */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
            ]}
            onPress={() => setShowChangePassword(!showChangePassword)}>
            <View style={styles.settingLeft}>
              <Icon
                name="lock-outline"
                size={24}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.settingText, {color: theme.colors.text}]}>
                Change Password
              </Text>
            </View>
            <Icon
              name={showChangePassword ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {showChangePassword && (
            <View
              style={[
                styles.settingExpanded,
                {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
              ]}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                placeholder="New Password"
                placeholderTextColor={theme.colors.textSecondary}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <Button
                title="Update Password"
                onPress={handleChangePassword}
                loading={loading}
                style={styles.updateButton}
              />
            </View>
          )}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            App Settings
          </Text>

          <View
            style={[
              styles.settingItem,
              {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
            ]}>
            <View style={styles.settingLeft}>
              <Icon
                name={themeMode === 'dark' ? 'weather-night' : 'weather-sunny'}
                size={24}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.settingText, {color: theme.colors.text}]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={(value) => toggleTheme(value ? 'dark' : 'light')}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            icon={<Icon name="logout" size={20} color="#FFFFFF" />}
            style={styles.logoutButton}
          />
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: theme.colors.textSecondary}]}>
            Halal Food Identifier v1.0.0
          </Text>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingExpanded: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: -12,
    marginBottom: 12,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  updateButton: {
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
  },
});

export default ProfileScreen;

