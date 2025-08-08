import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useMemberStatus } from "../../context/MemberStatusContext";
import { useTranslation } from 'react-i18next';
import { Text, Card, Button } from "../../Components/UI";
import { COLORS, SPACING, SAFE_AREA } from "../../theme";

const MemberOption = React.memo(({ value, selected, onPress, title, description, icon }) => (
  <TouchableOpacity
    style={[styles.optionCard, selected && styles.selectedOption]}
    onPress={() => onPress(value)}
    activeOpacity={0.8}
  >
    <View style={styles.optionHeader}>
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={selected ? COLORS.white : COLORS.primary[600]} 
        />
      </View>
      <View style={styles.optionContent}>
        <Text variant="h6" color="primary" style={styles.optionTitle}>
          {title}
        </Text>
        <Text variant="body2" color="secondary" style={styles.optionDescription}>
          {description}
        </Text>
      </View>
      <RadioButton
        value={value}
        status={selected ? "checked" : "unchecked"}
        color={COLORS.primary[600]}
      />
    </View>
  </TouchableOpacity>
));

const SecondPage = ({ navigation }) => {
  const [selectedMemberStatus, setSelectedMemberStatus] = useState(null);
  const { setMemberStatus } = useMemberStatus();
  const { t, i18n } = useTranslation();

  const handleSubmit = () => {
    if (selectedMemberStatus) {
      setMemberStatus(selectedMemberStatus); 
      navigation.navigate("Auth"); 
    } else {
      alert("Please select a member status before proceeding.");
    }
  };

  const changeLanguage = () => {
    if (i18n.language === "en") {
      i18n.changeLanguage('gj');
    } else {
      i18n.changeLanguage('en');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="person-add" size={64} color={COLORS.primary[600]} />
          <Text variant="h2" color="primary" style={styles.title}>
            {t('MemberStatus')}
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            {t('existingOrNewMember')}
          </Text>
        </View>

        {/* Options Card */}
        <Card style={styles.optionsCard}>
          <MemberOption
            value="existing"
            selected={selectedMemberStatus === "existing"}
            onPress={setSelectedMemberStatus}
            title={t('Already a Member')}
            description="Continue with your existing account"
            icon="person-circle"
          />

          <MemberOption
            value="new"
            selected={selectedMemberStatus === "new"}
            onPress={setSelectedMemberStatus}
            title={t('New Member')}
            description="Create a new account and join us"
            icon="person-add-outline"
          />
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            onPress={handleSubmit}
            disabled={!selectedMemberStatus}
            size="large"
            style={styles.submitButton}
          >
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            {t('submit')}
          </Button>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  content: {
    flex: 1,
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
  optionsCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
  },
  selectedOption: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  selectedIconContainer: {
    backgroundColor: COLORS.primary[600],
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    lineHeight: 20,
  },
  actionContainer: {
    gap: SPACING.md,
  },
  submitButton: {
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
  },
  languageText: {
    marginLeft: SPACING.sm,
    fontWeight: '600',
  },
});

export default FirstPage;