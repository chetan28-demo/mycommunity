import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { Text, Card, Input, Button } from '../../Components/UI';
import { COLORS, SPACING, SHADOWS, SAFE_AREA } from '../../theme';

const ProfileField = React.memo(({ 
  label, 
  value, 
  icon, 
  editing, 
  onChange, 
  multiline = false, 
  unit = '',
  ...props 
}) => (
  <View style={styles.fieldContainer}>
    <View style={styles.fieldHeader}>
      <MaterialIcons name={icon} size={20} color={COLORS.primary[600]} />
      <Text variant="label" color="primary" style={styles.fieldLabel}>
        {label}
      </Text>
    </View>
    
    {editing ? (
      <Input
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        style={styles.fieldInput}
        {...props}
      />
    ) : (
      <View style={styles.fieldValueContainer}>
        <Text variant="body1" color="primary" style={styles.fieldValue}>
          {value || 'Not specified'}
        </Text>
        {unit && (
          <Text variant="caption" color="secondary" style={styles.fieldUnit}>
            {unit}
          </Text>
        )}
      </View>
    )}
  </View>
));

const ProfilePage = ({ navigation }) => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    maritalStatus: '',
    dob: '',
    height: '',
    weight: '',
    bloodGroup: '',
    fatherName: '',
    address: '',
    emergencyContact: '',
  });

  const API_BASE = useMemo(() => "http://192.168.1.116:8080/api", []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          }
        },
      ]
    );
  }, [logout, navigation]);

  const fetchProfile = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        gender: data.gender || '',
        maritalStatus: data.maritalStatus || '',
        dob: data.dob || '',
        height: data.height || '',
        weight: data.weight || '',
        bloodGroup: data.bloodGroup || '',
        fatherName: data.fatherName || '',
        address: data.address || '',
        emergencyContact: data.emergencyContact || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Update failed');
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }, [formData, API_BASE]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleEditing = useCallback(() => {
    setEditing(prev => !prev);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text variant="body2" color="secondary" style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error[500]} />
        <Text variant="h6" color="primary" style={styles.errorTitle}>
          Failed to load profile
        </Text>
        <Button onPress={fetchProfile} style={styles.retryButton}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text variant="h5" style={[styles.headerTitle, { color: COLORS.white }]}>
          Profile
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <Card style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300' }}
              style={styles.avatar}
            />
            {editing && (
              <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
                <MaterialIcons name="camera-alt" size={20} color={COLORS.white} />
              </TouchableOpacity>
            )}
            <View style={styles.onlineIndicator} />
          </View>
          
          <Text variant="h3" color="primary" style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          
          <Text variant="body2" color="secondary" style={styles.username}>
            @{profile.firstName?.toLowerCase()}{profile.lastName?.toLowerCase()}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="h6" color="primary">12</Text>
              <Text variant="caption" color="secondary">Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="h6" color="primary">248</Text>
              <Text variant="caption" color="secondary">Connections</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="h6" color="primary">1.2k</Text>
              <Text variant="caption" color="secondary">Likes</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {editing ? (
            <View style={styles.editingActions}>
              <Button 
                variant="secondary"
                onPress={() => setEditing(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleSave}
                loading={saving}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
            </View>
          ) : (
            <Button
              variant="outline"
              onPress={toggleEditing}
              style={styles.editButton}
            >
              <MaterialIcons name="edit" size={20} color={COLORS.primary[600]} />
              Edit Profile
            </Button>
          )}
        </View>

        {/* Personal Information */}
        <Card style={styles.sectionCard}>
          <Text variant="h5" color="primary" style={styles.cardTitle}>
            Personal Information
          </Text>
          
          <ProfileField 
            label="First Name"
            icon="person"
            value={editing ? formData.firstName : profile.firstName}
            editing={editing}
            onChange={(val) => handleChange('firstName', val)}
          />
          
          <ProfileField 
            label="Last Name"
            icon="person"
            value={editing ? formData.lastName : profile.lastName}
            editing={editing}
            onChange={(val) => handleChange('lastName', val)}
          />
          
          <ProfileField 
            label="Gender"
            icon="wc"
            value={editing ? formData.gender : profile.gender}
            editing={editing}
            onChange={(val) => handleChange('gender', val)}
          />
          
          <ProfileField 
            label="Date of Birth"
            icon="cake"
            value={editing ? formData.dob : profile.dob}
            editing={editing}
            onChange={(val) => handleChange('dob', val)}
            placeholder="YYYY-MM-DD"
          />
          
          <ProfileField 
            label="Marital Status"
            icon="favorite"
            value={editing ? formData.maritalStatus : profile.maritalStatus}
            editing={editing}
            onChange={(val) => handleChange('maritalStatus', val)}
          />
        </Card>

        {/* Physical Information */}
        <Card style={styles.sectionCard}>
          <Text variant="h5" color="primary" style={styles.cardTitle}>
            Physical Information
          </Text>
          
          <View style={styles.row}>
            <View style={styles.halfField}>
              <ProfileField 
                label="Height"
                icon="straighten"
                value={editing ? formData.height : profile.height}
                editing={editing}
                onChange={(val) => handleChange('height', val)}
                unit="ft"
              />
            </View>
            <View style={styles.halfField}>
              <ProfileField 
                label="Weight"
                icon="monitor-weight"
                value={editing ? formData.weight : profile.weight}
                editing={editing}
                onChange={(val) => handleChange('weight', val)}
                unit="kg"
              />
            </View>
          </View>
          
          <ProfileField 
            label="Blood Group"
            icon="bloodtype"
            value={editing ? formData.bloodGroup : profile.bloodGroup}
            editing={editing}
            onChange={(val) => handleChange('bloodGroup', val)}
          />
        </Card>

        {/* Contact Information */}
        <Card style={styles.sectionCard}>
          <Text variant="h5" color="primary" style={styles.cardTitle}>
            Contact Information
          </Text>
          
          <ProfileField 
            label="Father's Name"
            icon="family-restroom"
            value={editing ? formData.fatherName : profile.fatherName}
            editing={editing}
            onChange={(val) => handleChange('fatherName', val)}
          />
          
          <ProfileField 
            label="Address"
            icon="home"
            value={editing ? formData.address : profile.address}
            editing={editing}
            onChange={(val) => handleChange('address', val)}
            multiline
          />
          
          <ProfileField 
            label="Emergency Contact"
            icon="phone"
            value={editing ? formData.emergencyContact : profile.emergencyContact}
            editing={editing}
            onChange={(val) => handleChange('emergencyContact', val)}
            keyboardType="phone-pad"
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SAFE_AREA.top,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary[600],
    ...SHADOWS.md,
  },
  headerButton: {
    padding: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: SPACING.sm,
  },
  errorTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.md,
  },
  profileHeaderCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
    ...SHADOWS.md,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary[600],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success[500],
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  name: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  username: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  statItem: {
    alignItems: 'center',
  },
  actionContainer: {
    marginBottom: SPACING.lg,
  },
  editingActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  cardTitle: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  fieldContainer: {
    marginBottom: SPACING.lg,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  fieldLabel: {
    marginLeft: SPACING.sm,
  },
  fieldInput: {
    marginBottom: 0,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  fieldValue: {
    flex: 1,
  },
  fieldUnit: {
    marginLeft: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfField: {
    flex: 1,
  },
});

export default ProfilePage;