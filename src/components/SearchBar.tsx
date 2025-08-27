import React from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import {styles} from "../components/styles/SearchBar";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
};

export default function SearchBar({ value, onChangeText, placeholder, onClear }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        returnKeyType="search"
      />
      {value?.length ? (
        <Pressable
          onPress={onClear}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
        >
          <Text style={styles.clear}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
