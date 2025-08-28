import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
      }}
      activeOpacity={0.7}
    >
      <Text style={{ fontSize: 16 }}>
        {language === 'fr' ? '🇫🇷' : '🇬🇧'}
      </Text>
    </TouchableOpacity>
  );
};