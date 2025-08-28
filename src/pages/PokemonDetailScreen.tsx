import { RootStackParamList } from "@/app/_layout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../pages/styles/PokemonDetailScreen";
import { getPokemon } from "../service/pokeapi";
import type { Pokemon } from "../type/pokemon";
import typeColors from "../utils/typeColor";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

const SWIPE_TRIGGER = 80;
const SWIPE_VELOCITY = 0.3;

export default function PokemonDetailScreen({ route, navigation }: Props) {
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
  }, [id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const p = await getPokemon(id);
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
  }, [id]);

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
        <Text>Impossible de charger ce Pokémon.</Text>
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
                  <Text style={styles.typeText}>{capitalize(type)}</Text>
                </View>
              ))}
            </View>

            {/* About */}
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.aboutCard}>
              <View style={styles.aboutContainer}>
                <View style={styles.aboutItem}>
                  <Text style={styles.aboutValue}>{pokemon.weight} kg</Text>
                  <Text style={styles.aboutLabel}>Weight</Text>
                </View>
                <View style={styles.aboutSeparator} />
                <View style={styles.aboutItem}>
                  <Text style={styles.aboutValue}>{pokemon.height} m</Text>
                  <Text style={styles.aboutLabel}>Height</Text>
                </View>
                <View style={styles.aboutSeparator} />
                <View style={styles.aboutItem}>
                  <Text style={styles.aboutValue}>
                    {pokemon.abilities
                      .map((a) => capitalize(labelize(a.name)))
                      .join("\n")}
                  </Text>
                  <Text style={styles.aboutLabel}>Moves</Text>
                </View>
              </View>
              <Text style={styles.pokemonDescription}>
                {pokemon.description}
              </Text>
            </View>

            {/* Stats */}
            <Text style={styles.sectionTitle}>Base Stats</Text>
            <View style={styles.statsContainer}>
              {pokemon.stats.map((stat, index) => {
                const abbr = getStatAbbreviation(stat.name);
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

        {/* NAVIGATION */}
        <View pointerEvents="box-none" style={styles.navOverlay}>
          <View style={[styles.navSideZone, styles.navLeftZone]}>
            <TouchableOpacity
              disabled={numericId <= 1}
              onPress={() => goToSibling(-1)}
              style={[
                styles.navCircleBtn,
                numericId <= 1 && styles.navBtnDisabled,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.navArrowIcon}>‹</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.navSideZone, styles.navRightZone]}>
            <TouchableOpacity
              onPress={() => goToSibling(1)}
              style={styles.navCircleBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.navArrowIcon}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
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
function getStatAbbreviation(statName: string): string {
  const map: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };
  return map[statName.toLowerCase()] || statName.toUpperCase();
}
