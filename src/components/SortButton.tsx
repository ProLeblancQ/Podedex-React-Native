import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  value: "id" | "name";
  active: boolean;
  onPress: (v: "id" | "name") => void;
};

export default function SortButton({ label, value, active, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      style={{
        flex: 1,
        backgroundColor: active ? "#DC0A2D" : "#ddd",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
      }}
    >
      <Text style={{ color: active ? "#fff" : "#333" }}>{label}</Text>
    </Pressable>
  );
}
