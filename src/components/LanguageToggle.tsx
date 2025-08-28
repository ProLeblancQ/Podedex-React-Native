import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { styles } from './styles/LanguageToggle';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Image
        source={language === 'fr' 
          ? require('../../assets/images/france.png')
          : require('../../assets/images/united-kingdom.png')
        }
        style={styles.flagImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};