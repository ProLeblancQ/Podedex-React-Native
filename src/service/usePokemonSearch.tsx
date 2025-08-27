import { useState, useEffect } from "react";
import { Pokemon, PokemonListItem, getPokemon } from "./pokeapi";

type IndexItem = { id: string; name: string; url: string };

export function usePokemonSearch(indexList: IndexItem[]) {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Pokemon | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const doSearch = async () => {
      const term = query.trim().toLowerCase();
      if (!term) {
        setSearchResult(null);
        setNotFound(false);
        return;
      }

      setSearching(true);
      setNotFound(false);

      try {
        // Recherche par ID
        if (/^\d+$/.test(term)) {
          const byId = await getPokemon(term);
          if (!active) return;
          if (byId) { setSearchResult(byId); return; }
        }

        // Recherche exacte par nom
        const exact = await getPokemon(term);
        if (!active) return;
        if (exact) { setSearchResult(exact); return; }

        // Recherche partielle
        const match = indexList.find(p => p.name.toLowerCase().includes(term));
        if (match) {
          const full = await getPokemon(match.id);
          if (!active) return;
          setSearchResult(full || null);
        } else {
          if (!active) return;
          setSearchResult(null);
          setNotFound(true);
        }
      } finally {
        if (active) setSearching(false);
      }
    };

    const t = setTimeout(doSearch, 250);
    return () => { active = false; clearTimeout(t); };
  }, [query, indexList]);

  return { query, setQuery, searchResult, searching, notFound };
}
