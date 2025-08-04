
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./AuthStyles";
import { useMemberStatus } from "../../context/MemberStatusContext";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const API_BASE = "http://192.168.1.116:8080/api/auth";

const Auth = () => {
  const { memberStatus } = useMemberStatus();
  const { login } = useAuth();
  const navigation = useNavigation();

  const [isLogin, setIsLogin] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    setIsLogin(memberStatus === "existing");
  }, [memberStatus]);

  const resetForm = () => {
    setMobileNumber("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setGender("");
    setError("");
    setTermsAccepted(false);
  };

const handleLogin = async () => {
  if (!termsAccepted) {
    Alert.alert("Error", "Please accept the terms and conditions");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: mobileNumber,
        password,
      }),
    });

    if (!response.ok) {
      const errMessage = await response.text();
      setError(errMessage || "Login failed");
      return;
    }

    const data = await response.json(); // <-- assuming JSON like { token: "", userId: 2 }

    const token = data.token;
    const userId = data.userId;

    if (token && userId) {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", userId.toString()); // store as string
      login(); // context login
      resetForm();
      navigation.reset({
        index: 0,
        routes: [{ name: "TabNavigator" }],
      });
    } else {
      setError("Token or User ID missing from server.");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError("Login failed. Please try again.");
  }
};


  const handleRegister = async () => {
    if (!termsAccepted) {
      Alert.alert("Error", "Please accept the terms and conditions");
      return;
    }

    if (!gender || !firstName || !lastName || !mobileNumber || !password || password.length < 4) {
      Alert.alert("Error", "Please fill all fields properly.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          firstName,
          lastName,
          phoneNumber: mobileNumber,
          password,
          role: "USER",
        }),
      });

      const contentType = response.headers.get("content-type");
      let token;

      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          token = data.token;
        } else {
          token = await response.text();
        }

        if (token) {
          await AsyncStorage.setItem("token", token);
          login();
          resetForm();
          navigation.reset({
            index: 0,
            routes: [{ name: "TabNavigator" }],
          });
        } else {
          Alert.alert("Error", "Token not received.");
        }
      } else {
        const errorMessage = await response.text();
        Alert.alert("Error", errorMessage || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const CustomCheckbox = ({ value, onValueChange }) => {
    return (
      <TouchableOpacity
        style={[styles.checkbox, value && styles.checkboxChecked]}
        onPress={() => onValueChange(!value)}
      >
        {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header (Sticky) - Centered only for login */}
        <View style={[styles.header, isLogin && styles.headerCentered]}>
          <Text style={styles.logo}>
            <Text style={styles.logoBold}>MY</Text>
            <Text style={styles.logoLight}> Community</Text>
          </Text>

          <View style={[styles.toggleContainer, isLogin && styles.toggleContainerCentered]}>
            <TouchableOpacity
              style={[styles.toggle, isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
                {t("Login")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggle, !isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>
                {t("Register")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Form */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {!isLogin && (
              <>
                <Text style={styles.sectionTitle}>Select Gender</Text>
                <View style={styles.genderToggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      gender === "male" && styles.genderSelected,
                    ]}
                    onPress={() => setGender("male")}
                  >
                    <Text
                      style={
                        gender === "male"
                          ? styles.genderSelectedText
                          : styles.genderText
                      }
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      gender === "female" && styles.genderSelected,
                    ]}
                    onPress={() => setGender("female")}
                  >
                    <Text
                      style={
                        gender === "female"
                          ? styles.genderSelectedText
                          : styles.genderText
                      }
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.nameInputContainer}>
                    <TextInput
                      placeholder="First Name"
                      style={styles.nameInput}
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  <View style={styles.nameInputContainer}>
                    <TextInput
                      placeholder="Last Name"
                      style={styles.nameInput}
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
              </>
            )}

            <Text style={styles.sectionTitle}>Mobile Number</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="phone" size={24} color="gray" />
              <TextInput
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>

            <Text style={styles.sectionTitle}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={24} color="gray" />
              <TextInput
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Entypo
                  name={passwordVisible ? "eye" : "eye-with-line"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <>
                <Text style={styles.sectionTitle}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={24} color="gray" />
                  <TextInput
                    placeholder="Confirm your password"
                    secureTextEntry={!confirmPasswordVisible}
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    <Entypo
                      name={
                        confirmPasswordVisible ? "eye" : "eye-with-line"
                      }
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <Text style={styles.errorText}>
                      Passwords do not match
                    </Text>
                  )}
              </>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.termsContainer}>
              <CustomCheckbox 
                value={termsAccepted} 
                onValueChange={setTermsAccepted} 
              />
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                  Privacy Policy
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => navigation.navigate("TermsConditions")}
                >
                  Terms & Conditions
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, !termsAccepted && styles.disabledButton]}
              onPress={isLogin ? handleLogin : handleRegister}
              disabled={!termsAccepted}
            >
              <Text style={styles.actionButtonText}>
                {isLogin ? "Login" : "Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Auth;