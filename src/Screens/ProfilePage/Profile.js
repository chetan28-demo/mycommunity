import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

const ProfileField = React.memo(({ 
  label, 
  value, 
  icon, 
  editing, 
  onChange, 
  multiline = false, 
  containerStyle = {}, 
  unit = '',
  ...props 
}) => (
  <View style={[styles.fieldContainer, containerStyle]}>
    <View style={styles.fieldLabelContainer}>
      <MaterialIcons name={icon} size={20} color="#212529" /> 
      <Text style={styles.fieldLabel}>{label}</Text>
    </View>
    {editing ? (
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholderTextColor="#212529"
        {...props}
      />
    ) : (
      <View style={styles.fieldValueContainer}>
        <Text style={styles.fieldValue}>{value || 'Not specified'}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
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
        <ActivityIndicator size="large" color="#6b46c1" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.avatar}
            />
            {editing && (
              <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
                <MaterialIcons name="edit" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          
          <Text style={styles.username}>
            @{profile.firstName?.toLowerCase()}{profile.lastName?.toLowerCase()}
          </Text>
        </View>

        {/* Edit/Save Button */}
        <View style={styles.actionContainer}>
          {editing ? (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={toggleEditing}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
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
            icon="transgender"
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
          
          <Text style={styles.sectionTitle}>Physical Information</Text>
          
          <View style={styles.row}>
            <ProfileField 
              label="Height"
              icon="straighten"
              value={editing ? formData.height : profile.height}
              editing={editing}
              onChange={(val) => handleChange('height', val)}
              containerStyle={{ flex: 1, marginRight: 10 }}
              unit="ft"
            />
            <ProfileField 
              label="Weight"
              icon="monitor-weight"
              value={editing ? formData.weight : profile.weight}
              editing={editing}
              onChange={(val) => handleChange('weight', val)}
              containerStyle={{ flex: 1 }}
              unit="kg"
            />
          </View>
          
          <ProfileField 
            label="Blood Group"
            icon="bloodtype"
            value={editing ? formData.bloodGroup : profile.bloodGroup}
            editing={editing}
            onChange={(val) => handleChange('bloodGroup', val)}
          />
          
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
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
            icon="emergency"
            value={editing ? formData.emergencyContact : profile.emergencyContact}
            editing={editing}
            onChange={(val) => handleChange('emergencyContact', val)}
            keyboardType="phone-pad"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6b46c1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '3%',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#001219',
    elevation: 3,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#242526',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#242526',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 20,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  editButton: {
    backgroundColor: '#212529',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#242e28ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    marginTop: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  fieldValue: {
    fontSize: 16,
    color: '#2d3748',
    flex: 1,
  },
  unit: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProfilePage;