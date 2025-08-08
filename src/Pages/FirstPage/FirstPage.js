import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, Button } from '../../Components/UI';
import { COLORS, SPACING, SAFE_AREA, SHADOWS } from '../../theme';

const API_URL = "http://192.168.1.116:8080/api/communities/names";

const FirstPage = () => {
  const [selectedSamaj, setSelectedSamaj] = useState('');
  const [samajList, setSamajList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchSamajNames = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();

        if (response.ok && json.communities) {
          setSamajList(json.communities);
        } else {
          console.error("Invalid response format:", json);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSamajNames();
  }, []);

  const handleNavigate = () => {
    if (selectedSamaj) {
      navigation.navigate('SecondPage', { samaj: selectedSamaj });
    } else {
      alert('Please select your Samaj.');
    }
  };

  const changeLanguage = () => {
    const newLang = i18n.language === "en" ? "gj" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="people-circle" size={80} color={COLORS.primary[600]} />
          <Text variant="h1" color="primary" style={styles.title}>
            {t('samajname')}
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            Choose your community to get started
          </Text>
        </View>

        {/* Selection Card */}
        <Card style={styles.selectionCard}>
          <View style={styles.pickerHeader}>
            <Ionicons name="people-outline" size={24} color={COLORS.primary[600]} />
            <Text variant="h6" color="primary" style={styles.pickerTitle}>
              {t("samajDropdown.selectSamaj")}
            </Text>
          </View>

          <View style={styles.pickerContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary[600]} />
                <Text variant="body2" color="secondary" style={styles.loadingText}>
                  Loading communities...
                </Text>
              </View>
            ) : (
              <Picker
                selectedValue={selectedSamaj}
                onValueChange={(itemValue) => setSelectedSamaj(itemValue)}
                style={styles.picker}
              >
                <Picker.Item 
                  label={t("samajDropdown.selectSamaj")} 
                  value="" 
                  color={COLORS.neutral[400]}
                />
                {samajList.map((name, index) => (
                  <Picker.Item 
                    key={index} 
                    label={name} 
                    value={name}
                    color={COLORS.text.primary}
                  />
                ))}
              </Picker>
            )}
          </View>

          <Button
            onPress={handleNavigate}
            disabled={!selectedSamaj}
            size="large"
            style={styles.continueButton}
          >
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            {t('continue')}
          </Button>
        </Card>

        {/* Language Toggle */}
        <TouchableOpacity 
          style={styles.languageButton} 
          onPress={changeLanguage}
          activeOpacity={0.8}
        >
          <Ionicons name="language" size={20} color={COLORS.primary[600]} />
          <Text variant="body2" style={[styles.languageText, { color: COLORS.primary[600] }]}>
            {t('changeLanguage')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  content: {
    flex: 1,
    paddingTop: SAFE_AREA.top,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  title: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  subtitle: {
    textAlign: 'center',
  },
  selectionCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  pickerTitle: {
    marginLeft: SPACING.sm,
  },
  pickerContainer: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    marginBottom: SPACING.lg,
    minHeight: 50,
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  loadingText: {
    marginLeft: SPACING.sm,
  },
  picker: {
    height: 50,
    color: COLORS.text.primary,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
    ...SHADOWS.sm,
  },
  languageText: {
    marginLeft: SPACING.sm,
    fontWeight: '600',
  },
});

export default FirstPage;