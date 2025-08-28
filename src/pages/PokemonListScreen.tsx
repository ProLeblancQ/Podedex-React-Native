import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RootStackParamList } from "@/app/_layout";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import SortButton from "../components/SortButton";
import {
  listPokemons,
  fetchPokemonIndex,
  getPokemonArtworkUrl,
} from "../service/pokeapi";
import { usePokemonSearch } from "../service/usePokemonSearch";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

type SortOrder = "id" | "name";
type PokemonItem = {
  id: string;
  name: string;
  image: string;
  types?: string[];
  url: string;
};

const PAGE_SIZE = 24;

const formatName = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1) : name;

export default function PokemonListScreen({ navigation }: Props) {
  const [indexList, setIndexList] = useState<
    { id: string; name: string; url: string }[]
  >([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("id");

  // Charger l'index complet des Pokémon
  useEffect(() => {
    let active = true;
    fetchPokemonIndex().then((idx) => active && setIndexList(idx));
    return () => {
      active = false;
    };
  }, []);

  // Index trié par nom pour la pagination
  const sortedIndexByName = useMemo(() => {
    return [...indexList].sort((a, b) =>
      a.name
        .toLowerCase()
        .localeCompare(b.name.toLowerCase(), "fr", { sensitivity: "base" })
    );
  }, [indexList]);

  // Query unifiée pour la pagination
  const pokemonQuery = useInfiniteQuery({
    queryKey: ["pokemons", sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      if (sortOrder === "id") {
        // Pagination classique par offset
        return listPokemons(PAGE_SIZE, pageParam as number);
      } else {
        // Pagination par index trié
        const start = pageParam as number;
        const end = start + PAGE_SIZE;
        const slice = sortedIndexByName.slice(start, end);

        const items: PokemonItem[] = slice.map((it) => ({
          id: it.id,
          name: it.name,
          image: getPokemonArtworkUrl(it.id),
          url: it.url,
          types: undefined,
        }));

        return {
          items,
          nextOffset: end,
          hasMore: end < sortedIndexByName.length,
        };
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
    enabled:
      sortOrder === "id" ||
      (sortOrder === "name" && sortedIndexByName.length > 0),
  });

  // Recherche
  const { query, setQuery, searchResult, searching, notFound } =
    usePokemonSearch(indexList);

  // Données à afficher (recherche ou liste paginée)
  const displayData = useMemo(() => {
    // Si une recherche est en cours, afficher le résultat
    if (searchResult) {
      return [
        {
          id: searchResult.id,
          name: formatName(searchResult.name),
          image: searchResult.sprites.artwork,
          types: searchResult.types,
          url: "",
        },
      ];
    }
    // Sinon, afficher la liste paginée
    const pokemonList =
      pokemonQuery.data?.pages.flatMap((page) => page.items) ?? [];

    return pokemonList.map((item) => ({
      ...item,
      name: formatName(item.name),
    }));
  }, [searchResult, pokemonQuery.data]);

  // Gestion du tri si on change l'ordre
  const handleSortChange = (newSortOrder: SortOrder) => {
    if (newSortOrder !== sortOrder) {
      setSortOrder(newSortOrder);
      // Reset la recherche lors du changement de tri
      setQuery("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "center" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <PokemonCard
            item={item}
            onPress={() =>
              navigation.navigate("Detail", { id: item.id, name: item.name })
            }
          />
        )}
        onEndReached={() => {
          // Charger plus seulement si pas de recherche active
          if (
            !searchResult &&
            pokemonQuery.hasNextPage &&
            !pokemonQuery.isFetchingNextPage
          ) {
            pokemonQuery.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={pokemonQuery.isRefetching}
            onRefresh={pokemonQuery.refetch}
          />
        }
        ListHeaderComponent={
          <View style={{ width: "100%", paddingTop: 12, paddingBottom: 8 }}>
            {/* Barre de recherche */}
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher un Pokémon..."
              onClear={() => setQuery("")}
            />

            {/* Indicateur de recherche */}
            {searching && <ActivityIndicator style={{ paddingTop: 12 }} />}

            {/* Message si aucun résultat */}
            {notFound && !searching && (
              <Text>{`Aucun Pokémon trouvé pour "${query}"`}</Text>
            )}

            {/* Boutons de tri (cachés pendant la recherche) */}
            {!searchResult && (
              <View style={{ flexDirection: "row", marginVertical: 8, gap: 8 }}>
                <SortButton
                  label="Trier par ID"
                  value="id"
                  active={sortOrder === "id"}
                  onPress={() => handleSortChange("id")}
                />
                <SortButton
                  label="Trier par Nom"
                  value="name"
                  active={sortOrder === "name"}
                  onPress={() => handleSortChange("name")}
                />
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          pokemonQuery.isFetchingNextPage && !searchResult ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
