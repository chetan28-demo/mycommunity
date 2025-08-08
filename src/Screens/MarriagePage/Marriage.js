import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  Keyboard,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Card, Input, Button } from "../../Components/UI";
import { COLORS, SPACING, SAFE_AREA } from "../../theme";

const GenderOption = React.memo(({ option, selected, onPress }) => (
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
      color={selected ? COLORS.white : COLORS.primary[600]}
    />
    <Text
      variant="label"
      style={[
        styles.genderText,
        { color: selected ? COLORS.white : COLORS.primary[600] }
      ]}
    >
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </Text>
  </TouchableOpacity>
));

const StatusOption = React.memo(({ option, selected, onPress }) => (
  <TouchableOpacity
    style={styles.radioOption}
    onPress={() => onPress(option)}
    activeOpacity={0.8}
  >
    <RadioButton 
      value={option} 
      status={selected ? 'checked' : 'unchecked'}
      color={COLORS.primary[600]} 
    />
    <Text variant="body1" color="primary" style={styles.radioText}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </Text>
  </TouchableOpacity>
));

const Marriage = () => {
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
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
    } finally {
      setLoading(false);
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
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="heart" size={32} color={COLORS.primary[600]} />
          <Text variant="h2" color="primary" style={styles.title}>
            Find Your Match
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            Discover meaningful connections
          </Text>
        </View>

        {/* Form Card */}
        <Card style={styles.formCard}>
          {/* Gender Selection */}
          <View style={styles.section}>
            <Text variant="h6" color="primary" style={styles.sectionTitle}>
              Looking for
            </Text>
            <View style={styles.genderRow}>
              {genderOptions.map((option) => (
                <GenderOption
                  key={option}
                  option={option}
                  selected={gender === option}
                  onPress={handleGenderSelect}
                />
              ))}
            </View>
          </View>

          {/* Age Range */}
          <View style={styles.section}>
            <Text variant="h6" color="primary" style={styles.sectionTitle}>
              Age Range
            </Text>
            <View style={styles.ageRow}>
              <Input
                placeholder="From"
                value={ageFrom}
                onChangeText={setAgeFrom}
                keyboardType="numeric"
                maxLength={2}
                style={styles.ageInput}
                leftIcon="calendar-outline"
              />
              <View style={styles.ageSeparator}>
                <Text variant="h6" color="secondary">-</Text>
              </View>
              <Input
                placeholder="To"
                value={ageTo}
                onChangeText={setAgeTo}
                keyboardType="numeric"
                maxLength={2}
                style={styles.ageInput}
                leftIcon="calendar-outline"
              />
            </View>
          </View>

          {/* Marital Status */}
          <View style={styles.section}>
            <Text variant="h6" color="primary" style={styles.sectionTitle}>
              Marital Status
            </Text>
            <RadioButton.Group onValueChange={handleStatusSelect} value={status}>
              <View style={styles.radioGroup}>
                {statusOptions.map((option) => (
                  <StatusOption
                    key={option}
                    option={option}
                    selected={status === option}
                    onPress={handleStatusSelect}
                  />
                ))}
              </View>
            </RadioButton.Group>
          </View>

          {/* Search Button */}
          <Button
            onPress={fetchMatches}
            disabled={!isFormValid}
            loading={loading}
            size="large"
            style={styles.searchButton}
          >
            <Ionicons name="search" size={20} color={COLORS.white} style={styles.buttonIcon} />
            Find Matches
          </Button>
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
  scrollContent: {
    paddingTop: SAFE_AREA.top,
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  title: {
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  genderRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  genderButtonSelected: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  genderText: {
    marginLeft: SPACING.sm,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  ageInput: {
    flex: 1,
  },
  ageSeparator: {
    paddingHorizontal: SPACING.sm,
  },
  radioGroup: {
    gap: SPACING.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  radioText: {
    marginLeft: SPACING.sm,
  },
  searchButton: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
});

export default Marriage;