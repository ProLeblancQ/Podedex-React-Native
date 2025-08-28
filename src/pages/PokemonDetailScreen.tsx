import { RootStackParamList } from "@/app/_layout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../pages/styles/PokemonDetailScreen";
import { useLanguage } from "../contexts/LanguageContext";
import { getPokemon } from "../service/pokeapi";
import type { Pokemon } from "../type/pokemon";
import typeColors from "../utils/typeColor";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

const SWIPE_TRIGGER = 80;
const SWIPE_VELOCITY = 0.3;

export default function PokemonDetailScreen({ route, navigation }: Props) {
  const { t, language } = useLanguage();
  const { id } = route.params;
  const numericId = Number(id);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);

  const imageScale = useRef(new Animated.Value(0.9)).current;
  const imageTranslateY = useRef(new Animated.Value(10)).current;
  const panX = useRef(new Animated.Value(0)).current;

  // 🔊 Lecture du cri
  async function playCry(pokemonId: string | number) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`,
        },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.error("Erreur lecture cri Pokémon :", err);
    }
  }

  useEffect(() => {
    panX.setValue(0);
    Animated.parallel([
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(imageTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, imageScale, imageTranslateY, panX]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const p = await getPokemon(id, language);
        if (active) {
          setPokemon(p);
          if (p) playCry(p.id);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, language]);

  const goToSibling = (delta: 1 | -1) => {
    const nextId = Math.max(1, numericId + delta);
    const slideTo = delta === 1 ? -400 : 400;
    Animated.timing(panX, {
      toValue: slideTo,
      duration: 160,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start(() => {
      navigation.replace("Detail", { id: String(nextId), name: "" });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => {
        const { dx, dy } = gesture;
        return Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2;
      },
      onPanResponderGrant: () => {
        setSwiping(true);
      },
      onPanResponderMove: (_evt, gesture) => {
        const x = Math.max(-120, Math.min(120, gesture.dx));
        panX.setValue(x);
      },
      onPanResponderRelease: (_evt, gesture) => {
        setSwiping(false);
        const { dx, vx } = gesture;

        if (dx <= -SWIPE_TRIGGER || vx <= -SWIPE_VELOCITY) {
          goToSibling(1);
          return;
        }
        if (dx >= SWIPE_TRIGGER || vx >= SWIPE_VELOCITY) {
          goToSibling(-1);
          return;
        }

        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
        }).start();
      },
      onPanResponderTerminate: () => {
        setSwiping(false);
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
        }).start();
      },
    })
  ).current;

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!pokemon)
    return (
      <View style={styles.center}>
        <Text>{t.loadError}</Text>
      </View>
    );

  const primaryType = pokemon.types[0]?.toLowerCase() || "normal";
  const backgroundColor = typeColors[primaryType] || "#78C850";

  return (
    <View style={[styles.screenFill, { backgroundColor }]}>
      <Animated.View
        style={[styles.animatedFill, { transform: [{ translateX: panX }] }]}
        {...panResponder.panHandlers}
      >
        {/* HEADER */}
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{capitalize(pokemon.name)}</Text>
            <Text style={styles.pokemonNumber}>
              #{pokemon.id.toString().padStart(3, "0")}
            </Text>
          </View>

          {/* IMAGE clickable → cri */}
          <View style={styles.pokemonImageOverlap}>
            {/* IMAGE DE FOND POKEBALL */}
            <Image
              source={require("../../assets/images/pokeballBG.png")}
              style={styles.pokemonBackgroundImage}
              resizeMode="contain"
            />
            
            <TouchableOpacity
              onPress={() => playCry(pokemon.id)}
              activeOpacity={0.8}
            >
              <Animated.Image
                source={{ uri: pokemon.sprites.artwork }}
                style={[
                  styles.pokemonImage,
                  {
                    transform: [
                      { scale: imageScale },
                      { translateY: imageTranslateY },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* BOUTONS NAVIGATION AU NIVEAU DE L'IMAGE */}
            <View style={styles.imageNavigation}>
              <TouchableOpacity
                disabled={numericId <= 1}
                onPress={() => goToSibling(-1)}
                style={[
                  styles.navCircleBtn,
                  styles.navLeftBtn,
                  numericId <= 1 && styles.navBtnDisabled,
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.navArrowIcon}>‹</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => goToSibling(1)}
                style={[styles.navCircleBtn, styles.navRightBtn]}
                activeOpacity={0.8}
              >
                <Text style={styles.navArrowIcon}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View pointerEvents="none" style={styles.whiteCap} />
        </SafeAreaView>

        {/* CONTENU */}
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!swiping}
        >
          <View style={styles.contentInner}>
            {/* Types */}
            <View style={styles.typeRow}>
              {pokemon.types.map((type) => (
                <View
                  key={type}
                  style={[
                    styles.typePill,
                    { backgroundColor: typeColors[type.toLowerCase()] || "#AAA" },
                  ]}
                >
                  <Text style={styles.typeText}>
                    {t.types[type.toLowerCase() as keyof typeof t.types] || capitalize(type)}
                  </Text>
                </View>
              ))}
            </View>

            {/* About */}
            <Text style={styles.sectionTitle}>{t.about}</Text>
            <View style={styles.aboutCard}>
              <View style={styles.aboutContainer}>
                <View style={styles.aboutItem}>
                  <Text style={styles.aboutValue}>{pokemon.weight} kg</Text>
                  <Text style={styles.aboutLabel}>{t.weight}</Text>
                </View>
                <View style={styles.aboutSeparator} />
                <View style={styles.aboutItem}>
                  <Text style={styles.aboutValue}>{pokemon.height} m</Text>
                  <Text style={styles.aboutLabel}>{t.height}</Text>
                </View>
                <View style={styles.aboutSeparator} />
                <View style={styles.aboutItem}>
                  <Text style={styles.aboutValue}>
                    {pokemon.abilities
                      .map((a) => {
                        const abilityKey = a.name.toLowerCase().replace('_', '-') as keyof typeof t.abilities;
                        return t.abilities[abilityKey] || capitalize(labelize(a.name));
                      })
                      .join("\n")}
                  </Text>
                  <Text style={styles.aboutLabel}>{t.moves}</Text>
                </View>
              </View>
              <Text style={styles.pokemonDescription}>
                {pokemon.description}
              </Text>
            </View>

            {/* Stats */}
            <Text style={styles.sectionTitle}>{t.baseStats}</Text>
            <View style={styles.statsContainer}>
              {pokemon.stats.map((stat, index) => {
                const abbr = getStatAbbreviation(stat.name, t);
                const isLast = index === pokemon.stats.length - 1;
                return (
                  <View key={stat.name}>
                    <StatRow
                      label={abbr}
                      value={stat.base}
                      color={backgroundColor}
                    />
                    {!isLast && <View style={styles.statDivider} />}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

      </Animated.View>
    </View>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: Math.min(value, 255),
      duration: 1800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const width = anim.interpolate({
    inputRange: [0, 255],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.statRow}>
      <Text style={[styles.statName, { color }]}>{label}</Text>
      <View style={styles.statSeparator} />
      <Text style={styles.statValue}>{value.toString().padStart(3, "0")}</Text>
      <View style={styles.statBarContainer}>
        <Animated.View
          style={[
            styles.statBar,
            { width, backgroundColor: color, opacity: 0.3 },
          ]}
        />
      </View>
    </View>
  );
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function labelize(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function getStatAbbreviation(statName: string, t: any): string {
  const map: Record<string, string> = {
    hp: t.hp,
    attack: t.attack,
    defense: t.defense,
    "special-attack": t.specialAttack,
    "special-defense": t.specialDefense,
    speed: t.speed,
  };
  return map[statName.toLowerCase()] || statName.toUpperCase();
}
