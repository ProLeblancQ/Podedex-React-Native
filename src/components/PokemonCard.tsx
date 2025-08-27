import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../components/styles/PokemonCard";
import { PokemonListItem } from "../service/pokeapi";
import typeColors from "../service/typeColor";


type Props = { item: PokemonListItem; onPress: () => void };


export default function PokemonCard({ item, onPress }: Props) {
  const bgColor = typeColors[item.types?.[0]?.toLowerCase() || "normal"];

  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.types?.[0]?.toUpperCase()}</Text>
      </View>

      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.meta}>
        <Text style={styles.id}>#{item.id}</Text>
        <Text style={styles.name}>{capitalize(item.name)}</Text>
      </View>
    </Pressable>
  );
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}


