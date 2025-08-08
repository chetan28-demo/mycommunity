import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Validation from '../../Components/ValidationCard/Validation';
import { Text, Card, Input } from '../../Components/UI';
import { COLORS, SPACING, SAFE_AREA } from '../../theme';

const FormSection = ({ title, icon, children }) => (
  <Card style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={24} color={COLORS.primary[600]} />
      <Text variant="h5" color="primary" style={styles.sectionTitle}>
        {title}
      </Text>
    </View>
    {children}
  </Card>
);

const Forms = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const [step1Data, setStep1Data] = useState({
    name: '',
    gender: '',
    maritalStatus: '',
    dob: '',
  });
  const [step2Data, setStep2Data] = useState({
    height: '',
    weight: '',
    bloodGroup: '',
  });
  const [step3Data, setStep3Data] = useState({
    fatherName: '',
    address: '',
    emergencyContact: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(true);

  const API_BASE = 'http://192.168.1.116:8080/api/auth';

  const validateStep1 = () => {
    const { name, gender, dob } = step1Data;
    if (!name || !gender || !dob) {
      Alert.alert('Error', 'Please fill all mandatory fields in Personal Details.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { height, weight, bloodGroup } = step2Data;
    if (!height || !weight || !bloodGroup) {
      Alert.alert('Error', 'Please fill all mandatory fields in Physical Attributes.');
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    const { fatherName, address, emergencyContact } = step3Data;
    if (!fatherName || !address || !emergencyContact) {
      Alert.alert('Error', 'Please fill all mandatory fields in Family Details.');
      return;
    }

    setLoading(true);
    setValidated(false);

    try {
      const mobile = await AsyncStorage.getItem('tempMobileNumber');
      const password = await AsyncStorage.getItem('tempPassword');

      if (!mobile || !password) {
        Alert.alert('Error', 'Missing mobile number or password.');
        return;
      }

      const finalData = {
        phoneNumber: mobile,
        password,
        role: 'USER',
        ...step1Data,
        ...step2Data,
        ...step3Data,
      };

      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        setSuccess(true);
        setValidated(true);
        await AsyncStorage.removeItem('tempMobileNumber');
        await AsyncStorage.removeItem('tempPassword');
      } else {
        const message = await response.text();
        Alert.alert('Error', message || 'Failed to register');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validated) {
      navigation.navigate('Home');
    }
  }, [validated, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="h2" color="primary" style={styles.title}>
            Complete Your Profile
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            Help us know you better
          </Text>
        </View>

        <ProgressSteps 
          activeStepIconBorderColor={COLORS.primary[600]}
          activeStepIconColor={COLORS.primary[600]}
          completedStepIconColor={COLORS.primary[600]}
          completedProgressBarColor={COLORS.primary[600]}
          activeProgressBarColor={COLORS.primary[600]}
          topOffset={20}
        >
          <ProgressStep label="Personal" onNext={validateStep1}>
            <FormSection title={t('Personal Details')} icon="person-outline">
              <Input
                label={t('Name')}
                placeholder="Enter your full name"
                value={step1Data.name}
                onChangeText={(text) => setStep1Data({ ...step1Data, name: text })}
                leftIcon="person-outline"
              />
              <Input
                label={t('Gender')}
                placeholder="Enter your gender"
                value={step1Data.gender}
                onChangeText={(text) => setStep1Data({ ...step1Data, gender: text })}
                leftIcon="male-female-outline"
              />
              <Input
                label={t('Marital Status')}
                placeholder="Enter your marital status"
                value={step1Data.maritalStatus}
                onChangeText={(text) => setStep1Data({ ...step1Data, maritalStatus: text })}
                leftIcon="heart-outline"
              />
              <Input
                label={t('Date of Birth')}
                placeholder="YYYY-MM-DD"
                value={step1Data.dob}
                onChangeText={(text) => setStep1Data({ ...step1Data, dob: text })}
                leftIcon="calendar-outline"
              />
            </FormSection>
          </ProgressStep>

          <ProgressStep label="Physical" onNext={validateStep2}>
            <FormSection title={t('Physical Attributes')} icon="fitness-outline">
              <Input
                label={t('Height')}
                placeholder="Enter your height (ft)"
                value={step2Data.height}
                onChangeText={(text) => setStep2Data({ ...step2Data, height: text })}
                leftIcon="resize-outline"
                keyboardType="numeric"
              />
              <Input
                label={t('Weight')}
                placeholder="Enter your weight (kg)"
                value={step2Data.weight}
                onChangeText={(text) => setStep2Data({ ...step2Data, weight: text })}
                leftIcon="barbell-outline"
                keyboardType="numeric"
              />
              <Input
                label={t('Blood Group')}
                placeholder="Enter your blood group"
                value={step2Data.bloodGroup}
                onChangeText={(text) => setStep2Data({ ...step2Data, bloodGroup: text })}
                leftIcon="water-outline"
              />
            </FormSection>
          </ProgressStep>

          <ProgressStep label="Family" onSubmit={onSubmit}>
            <FormSection title="Family Details" icon="home-outline">
              <Input
                label={t('Father Name')}
                placeholder="Enter father's name"
                value={step3Data.fatherName}
                onChangeText={(text) => setStep3Data({ ...step3Data, fatherName: text })}
                leftIcon="person-outline"
              />
              <Input
                label={t('Address')}
                placeholder="Enter your address"
                value={step3Data.address}
                onChangeText={(text) => setStep3Data({ ...step3Data, address: text })}
                leftIcon="location-outline"
                multiline
              />
              <Input
                label={t('Emergency Contact')}
                placeholder="Enter emergency contact"
                value={step3Data.emergencyContact}
                onChangeText={(text) => setStep3Data({ ...step3Data, emergencyContact: text })}
                leftIcon="call-outline"
                keyboardType="phone-pad"
              />
            </FormSection>
          </ProgressStep>
        </ProgressSteps>
      </ScrollView>

      {!validated && <Validation loading={loading} success={success} />}
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
    marginBottom: SPACING.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  sectionCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  sectionTitle: {
    marginLeft: SPACING.sm,
  },
});

export default Forms;