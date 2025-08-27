// src/hooks/usePokemonList.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { listPokemons, PokemonListItem } from "../service/pokeapi";

type UsePokemonListReturn = {
  data: PokemonListItem[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
};

export function usePokemonList(pageSize: number = 24): UsePokemonListReturn {
  const [data, setData] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const mounted = useRef(true);

  // évite les setState après unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadInitial = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await listPokemons(pageSize, 0);
      if (!mounted.current) return;
      setData(res.items);
      setOffset(res.nextOffset);
      setHasMore(res.hasMore);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [pageSize, loading]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await listPokemons(pageSize, offset);
      if (!mounted.current) return;
      setData(prev => [...prev, ...res.items]);
      setOffset(res.nextOffset);
      setHasMore(res.hasMore);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [pageSize, loading, hasMore, offset]);

  const refresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await loadInitial();
    } finally {
      if (mounted.current) setRefreshing(false);
    }
  }, [refreshing, loadInitial]);

  const reset = useCallback(() => {
    setData([]);
    setOffset(0);
    setHasMore(true);
  }, []);

  // chargement initial au montage
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return { data, loading, refreshing, hasMore, loadMore, refresh, reset };
}
