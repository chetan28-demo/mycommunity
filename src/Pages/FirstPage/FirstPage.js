
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import styles from './FirstPageStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from 'react-native-vector-icons';  // Icons

const API_URL = "http://192.168.1.116:8080/api/communities/names"; // ✅ Use local IP, not localhost

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
      <Text style={styles.title}>{t('samajname')}</Text>

      <View style={styles.pickerContainer}>
        <Ionicons name="people-outline" size={24} color="#212529" style={styles.icon} />

        {loading ? (
          <ActivityIndicator size="small" color="#212529" />
        ) : (
          <Picker
            selectedValue={selectedSamaj}
            onValueChange={(itemValue) => setSelectedSamaj(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label={t("samajDropdown.selectSamaj")} value="" />
            {samajList.map((name, index) => (
              <Picker.Item key={index} label={name} value={name} />
            ))}
          </Picker>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNavigate}>
        <Text style={styles.buttonText}>{t('continue')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.changeLanguageButton} onPress={changeLanguage}>
        <Text style={styles.changeLanguageText}>{t('changeLanguage')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FirstPage;
