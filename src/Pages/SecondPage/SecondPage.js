
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "./SecondPageStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemberStatus } from "../../context/MemberStatusContext";
import { useTranslation } from 'react-i18next';

const SecondPage = ({ navigation }) => {
  const [selectedMemberStatus, setSelectedMemberStatus] = useState(null);
  const { setMemberStatus } = useMemberStatus();

  const handleSubmit = () => {
    if (selectedMemberStatus) {
      setMemberStatus(selectedMemberStatus); 
      navigation.navigate("Auth"); 
    } else {
      alert("Please select a member status before proceeding.");
    }
  };

  const { t, i18n } = useTranslation(); 

  const changeLanguage = () => {
    if (i18n.language === "en") {
      i18n.changeLanguage('gj');
    } else {
      i18n.changeLanguage('en');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('MemberStatus')}</Text>
      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>
          {t('existingOrNewMember')}
        </Text>

        {/* Existing member option - entire area is clickable */}
        <TouchableOpacity
          style={styles.radioButtonContainer}
          onPress={() => setSelectedMemberStatus("existing")}
          activeOpacity={0.7}
        >
          <View pointerEvents="none">
            <RadioButton
              value="existing"
              status={selectedMemberStatus === "existing" ? "checked" : "unchecked"}
              color="#242526"
              uncheckedColor="#ccc"
            />
          </View>
          <Text style={styles.radioButtonText}>{t('Already a Member')}</Text>
        </TouchableOpacity>

        {/* New member option - entire area is clickable */}
        <TouchableOpacity
          style={styles.radioButtonContainer}
          onPress={() => setSelectedMemberStatus("new")}
          activeOpacity={0.7}
        >
          <View pointerEvents="none">
            <RadioButton
              value="new"
              status={selectedMemberStatus === "new" ? "checked" : "unchecked"}
              color="#242526"
              uncheckedColor="#ccc"
            />
          </View>
          <Text style={styles.radioButtonText}>{t('New Member')}</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <Text style={styles.submitButtonText}>{t('submit')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SecondPage;

