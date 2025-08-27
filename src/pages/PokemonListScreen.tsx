import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, ActivityIndicator, RefreshControl, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/_layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listPokemons, PokemonListItem } from "../service/pokeapi";
import { usePokemonSearch } from "../service/usePokemonSearch";

type Props = NativeStackScreenProps<RootStackParamList, "List">;
type IndexItem = { id: string; name: string; url: string };

const PAGE_SIZE = 24;
const INDEX_URL = "https://pokeapi.co/api/v2/pokemon?limit=20000&offset=0";

async function fetchIndex(): Promise<IndexItem[]> {
  const res = await fetch(INDEX_URL);
  const data = await res.json();
  return data.results.map((item: { name: string; url: string }) => {
    const parts = item.url.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    return { id, name: item.name, url: item.url };
  });
}

export default function PokemonListScreen({ navigation }: Props) {
  const [indexList, setIndexList] = useState<IndexItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"id" | "name">("id");

  // --- Récupération index ---
  useEffect(() => {
    let active = true;
    fetchIndex().then(idx => { if (active) setIndexList(idx); });
    return () => { active = false; };
  }, []);

  // --- InfiniteQuery ---
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["pokemons"],
    queryFn: async ({ pageParam = 0 }) => await listPokemons(PAGE_SIZE, pageParam),
    getNextPageParam: lastPage => lastPage.hasMore ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
  });

  // --- Hook de recherche ---
  const { query, setQuery, searchResult, searching, notFound } = usePokemonSearch(indexList);

  // --- Données plates ---
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
    return data?.pages.flatMap(page => page.items) ?? [];
  }, [data, searchResult]);

  // --- Tri ---
  const displayedData = useMemo(() => {
    return [...flatData].sort((a, b) => sortOrder === "id" ? parseInt(a.id) - parseInt(b.id) : a.name.localeCompare(b.name));
  }, [flatData, sortOrder]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={displayedData}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "center" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <PokemonCard
            item={item}
            onPress={() => navigation.nav
