import React from "react";
import { View, Text, Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PokemonListScreen from "../src/pages/PokemonListScreen";
import PokemonDetailScreen from "../src/pages/PokemonDetailScreen";
import { styles } from "./styles/_layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  FiraSans_400Regular,
  FiraSans_600SemiBold,
  FiraSans_700Bold,
} from "@expo-google-fonts/fira-sans";

const queryClient = new QueryClient();

export type RootStackParamList = {
  List: undefined;
  Detail: { id: string; name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    FiraSans_400Regular,
    FiraSans_600SemiBold,
    FiraSans_700Bold,
  });
  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.header,
          headerTitleAlign: "left",
          headerTitle: () => (
            <View style={styles.titleContainer}>
              <Image
                source={require("../assets/images/pokeball.png")}
                style={styles.pokeball}
              />
              <Text style={styles.headerTitle}>Pokédex</Text>
            </View>
          ),
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="List" component={PokemonListScreen} />
        <Stack.Screen
          name="Detail"
          component={PokemonDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </QueryClientProvider>
  );
}
