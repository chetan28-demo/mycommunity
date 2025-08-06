import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useMemberStatus } from '../../context/MemberStatusContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Text, Card, Input, Button } from '../../Components/UI';
import { COLORS, SPACING, SAFE_AREA } from '../../theme';

const Auth = () => {
  const navigation = useNavigation();
  const { memberStatus } = useMemberStatus();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const API_BASE = useMemo(() => 'http://192.168.1.116:8080/api/auth', []);

  const isFormValid = useMemo(() => {
    const { mobileNumber, password, confirmPassword } = formData;
    const basicValid = mobileNumber.length >= 10 && password.length >= 6;
    
    if (isLogin) {
      return basicValid;
    }
    
    return basicValid && 
           password === confirmPassword && 
           termsAccepted;
  }, [formData, isLogin, termsAccepted]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login Logic
        const response = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: formData.mobileNumber,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('userId', data.userId.toString());
          await login(data.token);
          navigation.navigate('TabNavigator');
        } else {
          Alert.alert('Login Failed', data.message || 'Invalid credentials');
        }
      } else {
        // Registration Logic
        if (memberStatus === 'new') {
          await AsyncStorage.setItem('tempMobileNumber', formData.mobileNumber);
          await AsyncStorage.setItem('tempPassword', formData.password);
          navigation.navigate('Forms');
        } else {
          Alert.alert('Info', 'Existing member registration not implemented yet');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [isFormValid, isLogin, formData, API_BASE, memberStatus, login, navigation]);

  const toggleMode = useCallback(() => {
    setIsLogin(prev => !prev);
    setFormData({ mobileNumber: '', password: '', confirmPassword: '' });
    setTermsAccepted(false);
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="people-circle" size={64} color={COLORS.primary[600]} />
          </View>
          <Text variant="h2" color="primary" style={styles.appName}>
            Community
          </Text>
          <Text variant="body1" color="secondary" style={styles.tagline}>
            Connect with your community
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(true)}
          >
            <Text 
              variant="label" 
              color={isLogin ? "inverse" : "secondary"}
              style={styles.toggleText}
            >
              {t('Login')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(false)}
          >
            <Text 
              variant="label" 
              color={!isLogin ? "inverse" : "secondary"}
              style={styles.toggleText}
            >
              {t('Register')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <Card style={styles.formCard}>
          <Text variant="h4" color="primary" style={styles.formTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text variant="body2" color="secondary" style={styles.formSubtitle}>
            {isLogin ? 'Sign in to continue' : 'Join our community today'}
          </Text>

          <Input
            label="Mobile Number"
            placeholder="Enter your mobile number"
            value={formData.mobileNumber}
            onChangeText={(value) => handleInputChange('mobileNumber', value)}
            keyboardType="phone-pad"
            leftIcon="call-outline"
            maxLength={10}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry={!showPassword}
            leftIcon="lock-closed-outline"
          />

          {!isLogin && (
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              leftIcon="lock-closed-outline"
              error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 
                     'Passwords do not match' : ''}
            />
          )}

          {!isLogin && (
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && (
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                )}
              </View>
              <Text variant="caption" color="secondary" style={styles.termsText}>
                I agree to the{' '}
                <Text variant="caption" color={COLORS.primary[600]}>
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text variant="caption" color={COLORS.primary[600]}>
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          )}

          <Button
            onPress={handleSubmit}
            disabled={!isFormValid}
            loading={loading}
            size="large"
            style={styles.submitButton}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text variant="body2" color={COLORS.primary[600]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Switch Mode */}
        <View style={styles.switchModeContainer}>
          <Text variant="body2" color="secondary">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text variant="body2" color={COLORS.primary[600]} style={styles.switchModeText}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: SAFE_AREA.top,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
  },
  logoContainer: {
    marginBottom: SPACING.md,
  },
  appName: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  tagline: {
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: COLORS.primary[600],
  },
  toggleText: {
    fontWeight: '600',
  },
  formCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  formSubtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  termsText: {
    flex: 1,
    lineHeight: 18,
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  switchModeText: {
    fontWeight: '600',
  },
});

export default Auth;