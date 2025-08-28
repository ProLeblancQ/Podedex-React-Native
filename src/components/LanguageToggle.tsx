import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const FrenchFlag = () => (
  <View style={{ width: 24, height: 16, flexDirection: 'row', borderRadius: 2, overflow: 'hidden' }}>
    <View style={{ flex: 1, backgroundColor: '#002395' }} />
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
    <View style={{ flex: 1, backgroundColor: '#ED2939' }} />
  </View>
);

const BritishFlag = () => (
  <View style={{ width: 24, height: 16, backgroundColor: '#012169', borderRadius: 2, position: 'relative' }}>
    {/* Croix blanche diagonale */}
    <View style={{ 
      position: 'absolute', 
      width: '141%', 
      height: 2, 
      backgroundColor: '#FFFFFF',
      top: 7,
      left: -3,
      transform: [{ rotate: '26.57deg' }]
    }} />
    <View style={{ 
      position: 'absolute', 
      width: '141%', 
      height: 2, 
      backgroundColor: '#FFFFFF',
      top: 7,
      left: -3,
      transform: [{ rotate: '-26.57deg' }]
    }} />
    {/* Croix rouge diagonale */}
    <View style={{ 
      position: 'absolute', 
      width: '141%', 
      height: 1, 
      backgroundColor: '#C8102E',
      top: 7.5,
      left: -3,
      transform: [{ rotate: '26.57deg' }]
    }} />
    <View style={{ 
      position: 'absolute', 
      width: '141%', 
      height: 1, 
      backgroundColor: '#C8102E',
      top: 7.5,
      left: -3,
      transform: [{ rotate: '-26.57deg' }]
    }} />
    {/* Croix blanche verticale/horizontale */}
    <View style={{ 
      position: 'absolute', 
      width: '100%', 
      height: 3, 
      backgroundColor: '#FFFFFF',
      top: 6.5,
    }} />
    <View style={{ 
      position: 'absolute', 
      width: 3, 
      height: '100%', 
      backgroundColor: '#FFFFFF',
      left: 10.5,
    }} />
    {/* Croix rouge verticale/horizontale */}
    <View style={{ 
      position: 'absolute', 
      width: '100%', 
      height: 2, 
      backgroundColor: '#C8102E',
      top: 7,
    }} />
    <View style={{ 
      position: 'absolute', 
      width: 2, 
      height: '100%', 
      backgroundColor: '#C8102E',
      left: 11,
    }} />
  </View>
);

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      style={{
        width: 36,
        height: 28,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
      }}
      activeOpacity={0.7}
    >
      {language === 'fr' ? <FrenchFlag /> : <BritishFlag />}
    </TouchableOpacity>
  );
};