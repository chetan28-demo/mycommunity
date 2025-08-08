import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Text, Card, Button } from '../../Components/UI';
import { COLORS, SPACING, SHADOWS, SAFE_AREA } from '../../theme';

const calculateAge = (dobString) => {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const DetailItem = React.memo(({ icon, label, value, color = COLORS.primary[600] }) => {
  if (!value) return null;
  
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.detailContent}>
        <Text variant="caption" color="secondary" style={styles.detailLabel}>
          {label}
        </Text>
        <Text variant="body1" color="primary" style={styles.detailValue}>
          {value}
        </Text>
      </View>
    </View>
  );
});

const TreeBox = ({ label }) => (
  <View style={styles.treeBox}>
    <Ionicons name="person" size={20} color={COLORS.primary[600]} />
    <Text variant="caption" color="primary" style={styles.treeBoxLabel}>
      {label}
    </Text>
  </View>
);

const UserProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTree, setShowTree] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found in storage");
        return;
      }

      const res = await fetch(`http://192.168.1.116:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      if (!text) {
        console.error("Empty response from API");
        return;
      }

      const data = JSON.parse(text);
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

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

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error[500]} />
        <Text variant="h6" color="primary" style={styles.errorTitle}>
          User data not found
        </Text>
        <Button onPress={fetchUserDetails} style={styles.retryButton}>
          Try Again
        </Button>
      </View>
    );
  }

  const {
    firstName,
    lastName,
    gender,
    maritalStatus,
    dob,
    height,
    weight,
    bloodGroup,
    fatherName,
    motherName,
    address,
    emergencyContact,
  } = user;

  const age = calculateAge(dob);

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
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300" }}
              style={styles.avatar}
            />
            <View style={styles.onlineIndicator} />
          </View>
          
          <Text variant="h3" color="primary" style={styles.name}>
            {firstName} {lastName}
          </Text>
          
          <View style={styles.basicInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.primary[600]} />
              <Text variant="body2" color="secondary" style={styles.infoText}>
                {age} years old
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.primary[600]} />
              <Text variant="body2" color="secondary" style={styles.infoText}>
                {address || 'Location not specified'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Personal Details */}
        <Card style={styles.detailsCard}>
          <Text variant="h5" color="primary" style={styles.sectionTitle}>
            Personal Information
          </Text>
          
          <DetailItem icon="person-outline" label="Gender" value={gender} />
          <DetailItem icon="heart-outline" label="Marital Status" value={maritalStatus} />
          <DetailItem icon="calendar-outline" label="Date of Birth" value={dob} />
        </Card>

        {/* Physical Information */}
        <Card style={styles.detailsCard}>
          <Text variant="h5" color="primary" style={styles.sectionTitle}>
            Physical Information
          </Text>
          
          <DetailItem 
            icon="resize-outline" 
            label="Height" 
            value={height ? `${height} ft` : null}
            color={COLORS.secondary[600]}
          />
          <DetailItem 
            icon="barbell-outline" 
            label="Weight" 
            value={weight ? `${weight} kg` : null}
            color={COLORS.secondary[600]}
          />
          <DetailItem 
            icon="water-outline" 
            label="Blood Group" 
            value={bloodGroup}
            color={COLORS.error[500]}
          />
        </Card>

        {/* Family Information */}
        <Card style={styles.detailsCard}>
          <Text variant="h5" color="primary" style={styles.sectionTitle}>
            Family Details
          </Text>
          
          <DetailItem 
            icon="man-outline" 
            label="Father" 
            value={fatherName}
            color={COLORS.accent[600]}
          />
          <DetailItem 
            icon="woman-outline" 
            label="Mother" 
            value={motherName}
            color={COLORS.accent[600]}
          />
          <DetailItem 
            icon="call-outline" 
            label="Emergency Contact" 
            value={emergencyContact}
            color={COLORS.warning[600]}
          />
        </Card>

        {/* Family Tree Button */}
        <Button
          variant="outline"
          onPress={() => setShowTree(true)}
          style={styles.familyTreeButton}
        >
          <MaterialIcons name="account-tree" size={20} color={COLORS.primary[600]} />
          View Family Tree
        </Button>
      </ScrollView>

      {/* Family Tree Modal */}
      <Modal transparent visible={showTree} animationType="fade">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text variant="h5" color="primary" style={styles.modalTitle}>
                Family Tree
              </Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowTree(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.neutral[600]} />
              </TouchableOpacity>
            </View>

            <View style={styles.treeContainer}>
              <View style={styles.treeRow}>
                <TreeBox label="Grandfather" />
                <TreeBox label="Grandmother" />
              </View>
              <View style={styles.treeRow}>
                <TreeBox label="Father" />
                <TreeBox label="Mother" />
              </View>
              <View style={styles.treeRow}>
                <TreeBox label="You" />
              </View>
            </View>
          </Card>
        </View>
      </Modal>
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
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
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
  profileCard: {
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
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
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
    marginBottom: SPACING.md,
  },
  basicInfo: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: SPACING.xs,
  },
  detailsCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  detailIcon: {
    width: 32,
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  detailLabel: {
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontWeight: '600',
  },
  familyTreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    padding: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
  },
  treeContainer: {
    alignItems: 'center',
  },
  treeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  treeBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: COLORS.primary[600],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
  },
  treeBoxLabel: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default UserProfile;