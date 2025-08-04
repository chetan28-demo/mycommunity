import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./MarriageStyles";

const GenderButton = React.memo(({ option, selected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.genderButton,
      selected && styles.genderButtonSelected
    ]}
    onPress={() => onPress(option)}
    activeOpacity={0.8}
  >
    <MaterialCommunityIcons
      name={`gender-${option}`}
      size={28}
      color={selected ? "#fff" : "#000"}
    />
    <Text
      style={[
        styles.genderText,
        selected && styles.genderTextSelected
      ]}
    >
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </Text>
  </TouchableOpacity>
));

const RadioOption = React.memo(({ option, selected, onPress }) => (
  <TouchableOpacity
    style={styles.radioOption}
    onPress={() => onPress(option)}
    activeOpacity={0.8}
  >
    <RadioButton value={option} color="#000" />
    <Text style={styles.radioText}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </Text>
  </TouchableOpacity>
));

const Marriage = () => {
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const navigation = useNavigation();

  const API_BASE = useMemo(() => "http://192.168.1.116:8080/api/users", []);

  const isFormValid = useMemo(() => {
    return (
      gender !== "" &&
      status !== "" &&
      ageFrom !== "" &&
      ageTo !== "" &&
      Number(ageFrom) <= Number(ageTo) &&
      Number(ageFrom) > 0 &&
      Number(ageTo) > 0
    );
  }, [ageFrom, ageTo, gender, status]);

  const resetForm = useCallback(() => {
    setAgeFrom("");
    setAgeTo("");
    setGender("");
    setStatus("");
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [resetForm])
  );

  const handleGenderSelect = useCallback((selectedGender) => {
    setGender(selectedGender);
  }, []);

  const handleStatusSelect = useCallback((selectedStatus) => {
    setStatus(selectedStatus);
  }, []);

  const fetchMatches = useCallback(async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill all fields correctly");
      return;
    }

    Keyboard.dismiss();

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const queryParams = new URLSearchParams({
        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
        maritalStatus: status.charAt(0).toUpperCase() + status.slice(1),
        ageFrom,
        ageTo
      });

      const response = await fetch(
        `${API_BASE}/filter?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch matches");

      const data = await response.json();
      navigation.navigate("SearchResults", { matches: data });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [isFormValid, gender, status, ageFrom, ageTo, API_BASE, navigation]);

  const genderOptions = useMemo(() => ["male", "female"], []);
  const statusOptions = useMemo(() => ["single", "widowed", "divorcee"], []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Find Your Match</Text>
          <Text style={styles.subtitle}>Enter your preferences below</Text>
        </View>

        {/* Gender */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I'm looking for*</Text>
          <View style={styles.genderRow}>
            {genderOptions.map((option) => (
              <GenderButton
                key={option}
                option={option}
                selected={gender === option}
                onPress={handleGenderSelect}
              />
            ))}
          </View>
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Range*</Text>
          <View style={styles.ageRow}>
            <TextInput
              style={styles.ageInput}
              placeholder="From"
              placeholderTextColor="#999"
              value={ageFrom}
              onChangeText={setAgeFrom}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.ageSeparator}>-</Text>
            <TextInput
              style={styles.ageInput}
              placeholder="To"
              placeholderTextColor="#999"
              value={ageTo}
              onChangeText={setAgeTo}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>

        {/* Marital Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marital Status*</Text>
          <RadioButton.Group onValueChange={handleStatusSelect} value={status}>
            <View style={styles.radioGroup}>
              {statusOptions.map((option) => (
                <RadioOption
                  key={option}
                  option={option}
                  selected={status === option}
                  onPress={handleStatusSelect}
                />
              ))}
            </View>
          </RadioButton.Group>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            !isFormValid && styles.searchButtonDisabled
          ]}
          onPress={fetchMatches}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text style={styles.searchButtonText}>Find Matches</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Marriage;