import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'fr' | 'en';

interface Translations {
  // Header
  appTitle: string;
  
  // Pokemon List
  searchPlaceholder: string;
  sortById: string;
  sortByName: string;
  noPokemonFound: string;
  
  // Pokemon Detail
  about: string;
  weight: string;
  height: string;
  moves: string;
  baseStats: string;
  loadError: string;
  
  // Stats abbreviations
  hp: string;
  attack: string;
  defense: string;
  specialAttack: string;
  specialDefense: string;
  speed: string;
}

const translations: Record<Language, Translations> = {
  fr: {
    // Header
    appTitle: 'Pokédex',
    
    // Pokemon List
    searchPlaceholder: 'Rechercher un Pokémon...',
    sortById: 'Trier par ID',
    sortByName: 'Trier par Nom',
    noPokemonFound: 'Aucun Pokémon trouvé pour',
    
    // Pokemon Detail
    about: 'À propos',
    weight: 'Poids',
    height: 'Taille',
    moves: 'Capacités',
    baseStats: 'Statistiques de base',
    loadError: 'Impossible de charger ce Pokémon.',
    
    // Stats
    hp: 'PV',
    attack: 'ATQ',
    defense: 'DEF',
    specialAttack: 'ATQ SP',
    specialDefense: 'DEF SP',
    speed: 'VIT',
  },
  en: {
    // Header
    appTitle: 'Pokédex',
    
    // Pokemon List
    searchPlaceholder: 'Search a Pokémon...',
    sortById: 'Sort by ID',
    sortByName: 'Sort by Name',
    noPokemonFound: 'No Pokémon found for',
    
    // Pokemon Detail
    about: 'About',
    weight: 'Weight',
    height: 'Height',
    moves: 'Moves',
    baseStats: 'Base Stats',
    loadError: 'Unable to load this Pokémon.',
    
    // Stats
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    specialAttack: 'SATK',
    specialDefense: 'SDEF',
    speed: 'SPD',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@pokeapp_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    loadLanguage();
  }, []);

  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
        setLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement de la langue:', error);
    }
  };

  const saveLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde de la langue:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};