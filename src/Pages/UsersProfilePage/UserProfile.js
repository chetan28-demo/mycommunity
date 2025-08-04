
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
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

const UserProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
    console.log("Received userId:", userId); // ✅ Debug


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTree, setShowTree] = useState(false); // Popup toggle

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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#212529" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: "#333" }}>User data not found.</Text>
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Profile Avatar + Name */}
        <View style={styles.profileTop}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{firstName}</Text>
          <Text style={styles.name}>{lastName}</Text>
        </View>

        {/* Profile Detail Card */}
        <View style={styles.card}>
          {renderDetail("Age", age)}
          {renderDetail("Gender", gender)}
          {renderDetail("Marital Status", maritalStatus)}
          {renderDetail("Height", height ? `${height} ft` : null)}
          {renderDetail("Weight", weight ? `${weight} kg` : null)}
          {renderDetail("Blood Group", bloodGroup)}
          {renderDetail("Address", address)}
          {renderDetail("Emergency Contact", emergencyContact)}
        </View>

        {/* Family Info Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Family Details</Text>
          {renderDetail("Father", fatherName)}
          {renderDetail("Mother", motherName)}
        </View>

        {/* Button to open family tree popup */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setShowTree(true)}
        >
          <MaterialIcons name="account-tree" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>View Family Tree</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Popup Family Tree */}
      <Modal transparent visible={showTree} animationType="fade">
        <View style={popupStyles.overlay}>
          <View style={popupStyles.popup}>
            <TouchableOpacity style={popupStyles.closeButton} onPress={() => setShowTree(false)}>
              <Ionicons name="close" size={22} color="#000" />
            </TouchableOpacity>
            <Text style={popupStyles.title}>Family Tree</Text>

            <View style={popupStyles.treeContainer}>
              <View style={popupStyles.row}>
                <TreeBox label="Grandfather" />
                <TreeBox label="Grandmother" />
              </View>
              <View style={popupStyles.row}>
                <TreeBox label="Father" />
                <TreeBox label="Mother" />
              </View>
              <View style={popupStyles.row}>
                <TreeBox label="You" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const TreeBox = ({ label }) => (
  <View style={popupStyles.box}>
    <Text style={popupStyles.boxLabel}>{label}</Text>
  </View>
);

const renderDetail = (label, value) => {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#212529",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  profileTop: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  detailLabel: {
    fontWeight: "500",
    color: "#495057",
  },
  detailValue: {
    color: "#343a40",
  },
  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212529",
    paddingVertical: 14,
    marginTop: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Popup styles
const popupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 20,
    width: "85%",
    borderRadius: 12,
    position: "relative",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#212529",
  },
  treeContainer: {
    alignItems: "center",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  box: {
    width: 70,
    height: 70,
    borderWidth: 1.5,
    borderColor: "#212529",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#f1f3f5",
  },
  boxLabel: {
    fontSize: 12,
    color: "#343a40",
    textAlign: "center",
  },
});

export default UserProfile;
