

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './FormsStyles';
import Validation from '../../Components/ValidationCard/Validation';
import { useTranslation } from 'react-i18next';

const Forms = () => {
  const navigation = useNavigation();
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

  // if (validated) {
  //   navigation.navigate('Home'); // or 'TabNavigator' or any post-registration screen
  // }

useEffect(() => {
  if (validated) {
    navigation.navigate('Home');
  }
}, [validated]);


  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'gj' : 'en');
  };

  return (
    <View style={styles.container}>
      <ProgressSteps topOffset={50}>
        <ProgressStep label="Personal Details" onNext={validateStep1}>
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Name')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={step1Data.name}
                onChangeText={(text) => setStep1Data({ ...step1Data, name: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Gender')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your gender"
                value={step1Data.gender}
                onChangeText={(text) => setStep1Data({ ...step1Data, gender: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Marital Status')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your marital status"
                value={step1Data.maritalStatus}
                onChangeText={(text) => setStep1Data({ ...step1Data, maritalStatus: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Date of Birth')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your date of birth"
                value={step1Data.dob}
                onChangeText={(text) => setStep1Data({ ...step1Data, dob: text })}
              />
            </View>
          </View>
        </ProgressStep>

        <ProgressStep label="Physical Attributes" onNext={validateStep2}>
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Height')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your height"
                value={step2Data.height}
                onChangeText={(text) => setStep2Data({ ...step2Data, height: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Weight')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your weight"
                value={step2Data.weight}
                onChangeText={(text) => setStep2Data({ ...step2Data, weight: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Blood Group')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your blood group"
                value={step2Data.bloodGroup}
                onChangeText={(text) => setStep2Data({ ...step2Data, bloodGroup: text })}
              />
            </View>
          </View>
        </ProgressStep>

        <ProgressStep label="Family Details" onSubmit={onSubmit}>
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Father Name')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter father's name"
                value={step3Data.fatherName}
                onChangeText={(text) => setStep3Data({ ...step3Data, fatherName: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Address')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                value={step3Data.address}
                onChangeText={(text) => setStep3Data({ ...step3Data, address: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Emergency Contact')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter emergency contact"
                value={step3Data.emergencyContact}
                onChangeText={(text) => setStep3Data({ ...step3Data, emergencyContact: text })}
              />
            </View>
          </View>
        </ProgressStep>
      </ProgressSteps>

      {!validated && <Validation loading={loading} success={success} />}
    </View>
  );
};

export default Forms;
