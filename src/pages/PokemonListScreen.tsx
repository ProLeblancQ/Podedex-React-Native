import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, ActivityIndicator, RefreshControl, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RootStackParamList } from "@/app/_layout";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import SortButton from "../components/SortButton";
import { listPokemons, fetchPokemonIndex, getPokemonArtworkUrl } from "../service/pokeapi";
import { usePokemonSearch } from "../service/usePokemonSearch";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

const PAGE_SIZE = 24;

const formatName = (name: string) => (name ? name.charAt(0).toUpperCase() + name.slice(1) : name);

export default function PokemonListScreen({ navigation }: Props) {
  const [indexList, setIndexList] = useState<{ id: string; name: string; url: string }[]>([]);
  const [sortOrder, setSortOrder] = useState<"id" | "name">("id");

  useEffect(() => {
    let active = true;
    fetchPokemonIndex().then((idx) => active && setIndexList(idx));
    return () => { active = false; };
  }, []);

  // ==== Flux 1 : pagination "par ID"====
  const idQuery = useInfiniteQuery({
    queryKey: ["pokemons", "by-id"],
    queryFn: ({ pageParam = 0 }) => listPokemons(PAGE_SIZE, pageParam),
    getNextPageParam: (last) => (last.hasMore ? last.nextOffset : undefined),
    initialPageParam: 0,
    enabled: sortOrder === "id",
  });

  // ==== Flux 2 : pagination "par NOM"====
  const sortedIndexByName = useMemo(() => {
    return [...indexList].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "fr", { sensitivity: "base" })
    );
  }, [indexList]);

  const nameQuery = useInfiniteQuery({
    queryKey: ["pokemons", "by-name", sortedIndexByName.length],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const end = start + PAGE_SIZE;
      const slice = sortedIndexByName.slice(start, end);
      const items = slice.map((it) => ({
        id: it.id,
        name: it.name,
        image: getPokemonArtworkUrl(it.id),
        url: it.url,
        types: undefined,
      }));
      return {
        items,
        nextIndex: end < sortedIndexByName.length ? end : undefined,
        hasMore: end < sortedIndexByName.length,
      };
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextIndex : undefined,
    initialPageParam: 0,
    enabled: sortOrder === "name" && sortedIndexByName.length > 0,
  });

  // ==== Recherche ====
  const { query, setQuery, searchResult, searching, notFound } = usePokemonSearch(indexList);

  // ==== Données prêtes à afficher ====
  const flatData = useMemo(() => {
    if (searchResult) {
      return [{
        id: searchResult.id,
        name: searchResult.name,
        image: searchResult.sprites.artwork,
        types: searchResult.types,
        url: "",
      }];
    }
    if (sortOrder === "id") {
      return idQuery.data?.pages.flatMap((p) => p.items) ?? [];
    }
    return nameQuery.data?.pages.flatMap((p) => p.items) ?? [];
  }, [searchResult, sortOrder, idQuery.data, nameQuery.data]);

  // Tri final (sécurité) :
  // - par ID : déjà paginé par offset, on garde l’ordre naturel
  // - par NOM : déjà paginé par index trié, on garde l’ordre, mais on met une garde
  const displayedData = useMemo(() => {
    if (sortOrder === "id") {
      return flatData.map((it) => ({ ...it, name: formatName(it.name) }));
    }
    const byName = [...flatData].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "fr", { sensitivity: "base" })
    );
    return byName.map((it) => ({ ...it, name: formatName(it.name) }));
  }, [flatData, sortOrder]);

  const isFetchingNext = sortOrder === "id" ? idQuery.isFetchingNextPage : nameQuery.isFetchingNextPage;
  const hasNext = sortOrder === "id" ? idQuery.hasNextPage : nameQuery.hasNextPage;
  const fetchMore = sortOrder === "id" ? idQuery.fetchNextPage : nameQuery.fetchNextPage;
  const isRefetching = sortOrder === "id" ? idQuery.isRefetching : nameQuery.isRefetching;
  const refetch = sortOrder === "id" ? idQuery.refetch : nameQuery.refetch;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "center" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <PokemonCard
            item={item}
            onPress={() => navigation.navigate("Detail", { id: item.id, name: item.name })}
          />
        )}
        onEndReached={() => !searchResult && hasNext && fetchMore()}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListHeaderComponent={
          <View style={{ width: "100%", paddingTop: 12, paddingBottom: 8 }}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher un Pokémon..."
              onClear={() => setQuery("")}
            />
            {searching && <ActivityIndicator style={{ paddingTop: 12 }} />}
            {notFound && !searching && <Text style={{ paddingTop: 8 }}>Aucun Pokémon trouvé.</Text>}
            {!searchResult && (
              <View style={{ flexDirection: "row", marginVertical: 8 }}>
                <SortButton label="Trier par ID" value="id" active={sortOrder === "id"} onPress={setSortOrder} />
                <SortButton label="Trier par Nom" value="name" active={sortOrder === "name"} onPress={setSortOrder} />
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          isFetchingNext && !searchResult ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
