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

  // Pokemon Types
  types: {
    normal: string;
    fire: string;
    water: string;
    electric: string;
    grass: string;
    ice: string;
    fighting: string;
    poison: string;
    ground: string;
    flying: string;
    psychic: string;
    bug: string;
    rock: string;
    ghost: string;
    dragon: string;
    dark: string;
    steel: string;
    fairy: string;
  };

  // Common abilities (most frequent ones)
  abilities: {
    overgrow: string;
    blaze: string;
    torrent: string;
    'shield-dust': string;
    'compound-eyes': string;
    swarm: string;
    'keen-eye': string;
    guts: string;
    'shed-skin': string;
    'sand-veil': string;
    static: string;
    lightning_rod: string;
    'sand-rush': string;
    'poison-point': string;
    rivalry: string;
    sheer_force: string;
    hustle: string;
    'inner-focus': string;
    infiltrator: string;
    chlorophyll: string;
    synchronize: string;
    'clear-body': string;
    'liquid-ooze': string;
    'rock-head': string;
    sturdy: string;
    magnet_pull: string;
    'water-absorb': string;
    'volt-absorb': string;
    'flash-fire': string;
    levitate: string;
    'effect-spore': string;
    dry_skin: string;
    damp: string;
    wonder_guard: string;
    arena_trap: string;
    'hyper-cutter': string;
    'sand-stream': string;
    intimidate: string;
    'rock-slide': string;
    'air-lock': string;
    'huge-power': string;
    'pure-power': string;
    'shell-armor': string;
    'battle-armor': string;
    'thick-fat': string;
    rough_skin: string;
    'wonder-skin': string;
    'water-veil': string;
    'magma-armor': string;
    'water-absorb': string;
    'lightning-rod': string;
    'storm-drain': string;
    'sap-sipper': string;
    'motor-drive': string;
    'flame-body': string;
    swiftness: string;
    'early-bird': string;
    drought: string;
    'trace': string;
    'download': string;
    'forecast': string;
  };
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

    // Types
    types: {
      normal: 'Normal',
      fire: 'Feu',
      water: 'Eau',
      electric: 'Électrik',
      grass: 'Plante',
      ice: 'Glace',
      fighting: 'Combat',
      poison: 'Poison',
      ground: 'Sol',
      flying: 'Vol',
      psychic: 'Psy',
      bug: 'Insecte',
      rock: 'Roche',
      ghost: 'Spectre',
      dragon: 'Dragon',
      dark: 'Ténèbres',
      steel: 'Acier',
      fairy: 'Fée',
    },

    // Abilities
    abilities: {
      overgrow: 'Engrais',
      blaze: 'Brasier',
      torrent: 'Torrent',
      'shield-dust': 'Écran Poudre',
      'compound-eyes': 'Œil Composé',
      swarm: 'Essaim',
      'keen-eye': 'Regard Vif',
      guts: 'Cran',
      'shed-skin': 'Mue',
      'sand-veil': 'Voile Sable',
      static: 'Statik',
      lightning_rod: 'Paratonnerre',
      'sand-rush': 'Baigne Sable',
      'poison-point': 'Point Poison',
      rivalry: 'Rivalité',
      sheer_force: 'Force Brute',
      hustle: 'Agitation',
      'inner-focus': 'Attention',
      infiltrator: 'Infiltration',
      chlorophyll: 'Chlorophylle',
      synchronize: 'Synchro',
      'clear-body': 'Corps Sain',
      'liquid-ooze': 'Suintement',
      'rock-head': 'Tête de Roc',
      sturdy: 'Fermeté',
      magnet_pull: 'Magnépiège',
      'water-absorb': 'Absorb Eau',
      'volt-absorb': 'Absorb Volt',
      'flash-fire': 'Torche',
      levitate: 'Lévitation',
      'effect-spore': 'Sporulation',
      dry_skin: 'Peau Sèche',
      damp: 'Moiteur',
      wonder_guard: 'Garde Mystik',
      arena_trap: 'Piège Sable',
      'hyper-cutter': 'Hyper Cutter',
      'sand-stream': 'Tempête Sable',
      intimidate: 'Intimidation',
      'rock-slide': 'Éboulement',
      'air-lock': 'Air Lock',
      'huge-power': 'Force Pure',
      'pure-power': 'Force Pure',
      'shell-armor': 'Coque Armure',
      'battle-armor': 'Armure Bataille',
      'thick-fat': 'Graisse',
      rough_skin: 'Peau Dure',
      'wonder-skin': 'Peau Miracle',
      'water-veil': 'Voile Eau',
      'magma-armor': 'Armumagma',
      'storm-drain': 'Lavabo',
      'sap-sipper': 'Herbivore',
      'motor-drive': 'Motorisé',
      'flame-body': 'Corps Ardent',
      swiftness: 'Vélocité',
      'early-bird': 'Matinal',
      drought: 'Sécheresse',
      'trace': 'Calque',
      'download': 'Télécharge',
      'forecast': 'Météo',
    },
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

    // Types
    types: {
      normal: 'Normal',
      fire: 'Fire',
      water: 'Water',
      electric: 'Electric',
      grass: 'Grass',
      ice: 'Ice',
      fighting: 'Fighting',
      poison: 'Poison',
      ground: 'Ground',
      flying: 'Flying',
      psychic: 'Psychic',
      bug: 'Bug',
      rock: 'Rock',
      ghost: 'Ghost',
      dragon: 'Dragon',
      dark: 'Dark',
      steel: 'Steel',
      fairy: 'Fairy',
    },

    // Abilities
    abilities: {
      overgrow: 'Overgrow',
      blaze: 'Blaze',
      torrent: 'Torrent',
      'shield-dust': 'Shield Dust',
      'compound-eyes': 'Compound Eyes',
      swarm: 'Swarm',
      'keen-eye': 'Keen Eye',
      guts: 'Guts',
      'shed-skin': 'Shed Skin',
      'sand-veil': 'Sand Veil',
      static: 'Static',
      lightning_rod: 'Lightning Rod',
      'sand-rush': 'Sand Rush',
      'poison-point': 'Poison Point',
      rivalry: 'Rivalry',
      sheer_force: 'Sheer Force',
      hustle: 'Hustle',
      'inner-focus': 'Inner Focus',
      infiltrator: 'Infiltrator',
      chlorophyll: 'Chlorophyll',
      synchronize: 'Synchronize',
      'clear-body': 'Clear Body',
      'liquid-ooze': 'Liquid Ooze',
      'rock-head': 'Rock Head',
      sturdy: 'Sturdy',
      magnet_pull: 'Magnet Pull',
      'water-absorb': 'Water Absorb',
      'volt-absorb': 'Volt Absorb',
      'flash-fire': 'Flash Fire',
      levitate: 'Levitate',
      'effect-spore': 'Effect Spore',
      dry_skin: 'Dry Skin',
      damp: 'Damp',
      wonder_guard: 'Wonder Guard',
      arena_trap: 'Arena Trap',
      'hyper-cutter': 'Hyper Cutter',
      'sand-stream': 'Sand Stream',
      intimidate: 'Intimidate',
      'rock-slide': 'Rock Slide',
      'air-lock': 'Air Lock',
      'huge-power': 'Huge Power',
      'pure-power': 'Pure Power',
      'shell-armor': 'Shell Armor',
      'battle-armor': 'Battle Armor',
      'thick-fat': 'Thick Fat',
      rough_skin: 'Rough Skin',
      'wonder-skin': 'Wonder Skin',
      'water-veil': 'Water Veil',
      'magma-armor': 'Magma Armor',
      'storm-drain': 'Storm Drain',
      'sap-sipper': 'Sap Sipper',
      'motor-drive': 'Motor Drive',
      'flame-body': 'Flame Body',
      swiftness: 'Speed Boost',
      'early-bird': 'Early Bird',
      drought: 'Drought',
      'trace': 'Trace',
      'download': 'Download',
      'forecast': 'Forecast',
    },
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