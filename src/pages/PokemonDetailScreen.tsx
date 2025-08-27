import { RootStackParamList } from "@/app/_layout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../pages/styles/PokemonDetailScreen";
import { getPokemon, Pokemon } from "../service/pokeapi";
import typeColors from "../service/typeColor";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function PokemonDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const p = await getPokemon(id);
        if (active) setPokemon(p);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (!pokemon) return <View style={styles.center}><Text>Impossible de charger ce Pokémon.</Text></View>;

  const primaryType = pokemon.types[0]?.toLowerCase() || "normal";
  const backgroundColor = typeColors[primaryType] || "#78C850";

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {/* Header avec background coloré */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Text style={[styles.backArrow, { fontSize: 24 }]}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{capitalize(pokemon.name)}</Text>
          
          <Text style={styles.pokemonNumber}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        </View>
        
        {/* Image du Pokémon dans la section colorée */}
        <View style={styles.pokemonImageContainer}>
          <Image
            source={{ uri: pokemon.sprites.artwork }}
            style={styles.pokemonImage}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      {/* Contenu principal avec fond blanc */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.whiteContent}>
          
          {/* Types Pills */}
          <View style={styles.typeRow}>
            {pokemon.types.map((type, index) => (
              <View
                key={type}
                style={[
                  styles.typePill, 
                  { backgroundColor: typeColors[type.toLowerCase()] || "#AAA" }
                ]}
              >
                <Text style={styles.typeText}>{capitalize(type)}</Text>
              </View>
            ))}
          </View>

          {/* Section About */}
          <Text style={styles.sectionTitle}>About</Text>
          
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
                {pokemon.abilities.map(a => capitalize(labelize(a.name))).join("\n")}
              </Text>
              <Text style={styles.aboutLabel}>Moves</Text>
            </View>
          </View>

          {/* Description du Pokémon */}
          <Text style={styles.pokemonDescription}>
            {pokemon.description}
          </Text>

          {/* Section Base Stats */}
          <Text style={styles.sectionTitle}>Base Stats</Text>
          
          <View style={styles.statsContainer}>
            {pokemon.stats.map((stat, index) => {
              const statAbbreviation = getStatAbbreviation(stat.name);
              const isLastStat = index === pokemon.stats.length - 1;
              
              return (
                <View key={stat.name}>
                  <View style={styles.statRow}>
                    <Text style={[styles.statName, { color: backgroundColor }]}>
                      {statAbbreviation}
                    </Text>
                    
                    <View style={styles.statSeparator} />
                    
                    <Text style={styles.statValue}>
                      {stat.base.toString().padStart(3, '0')}
                    </Text>
                    
                    <View style={styles.statBarContainer}>
                      <View 
                        style={[
                          styles.statBar, 
                          { 
                            width: `${Math.min((stat.base / 255) * 100, 100)}%`,
                            backgroundColor: backgroundColor,
                            opacity: 0.3
                          }
                        ]} 
                      />
                    </View>
                  </View>
                  {!isLastStat && <View style={styles.statDivider} />}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function labelize(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function getStatAbbreviation(statName: string): string {
  const abbreviations: { [key: string]: string } = {
    "hp": "HP",
    "attack": "ATK",
    "defense": "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    "speed": "SPD"
  };
  return abbreviations[statName.toLowerCase()] || statName.toUpperCase();
}