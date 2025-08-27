const BASE = "https://pokeapi.co/api/v2";

export type PokemonListItem = {
  id: string;
  name: string;
  image: string;
  url: string;
  types?: string[];
};

export type Pokemon = {
  id: string;
  name: string;
  height: number;
  weight: number;
  types: string[];
  stats: { name: string; base: number }[];
  abilities: { name: string; isHidden: boolean }[];
  sprites: { front_default: string; artwork: string };
  description?: string;
};

interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: FlavorTextEntry[];
}

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string; url: string };
  version: { name: string; url: string };
}

/**
 * Récupérer l’index global des pokémons (id + name + url)
 */
export async function fetchPokemonIndex(): Promise<{ id: string; name: string; url: string }[]> {
  const INDEX_URL = `${BASE}/pokemon?limit=20000&offset=0`;
  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error("Failed to fetch pokemon index");

  const data = await res.json();
  return data.results.map((item: { name: string; url: string }) => {
    const id = item.url.split("/").filter(Boolean).pop()!;
    return { id, name: item.name, url: item.url };
  });
}

/**
 * Liste de Pokémon avec pagination
 */
export async function listPokemons(limit = 24, offset = 0) {
  const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch pokemons");
  const data = await res.json();

  const items: PokemonListItem[] = await Promise.all(
    data.results.map(async (item: any) => {
      const id = item.url.split("/").filter(Boolean).pop()!;
      const p = await getPokemon(id);
      return {
        id,
        name: item.name,
        image: getPokemonArtworkUrl(id),
        url: item.url,
        types: p?.types || ["normal"],
      };
    })
  );

  return { items, nextOffset: offset + limit, hasMore: Boolean(data.next) };
}

/**
 * Détails d'un Pokémon avec description
 */
export async function getPokemon(idOrName: string | number) {
  try {
    const pokemonRes = await fetch(`${BASE}/pokemon/${idOrName}`);
    if (!pokemonRes.ok) {
      if (pokemonRes.status === 404) return null;
      throw new Error("Failed to fetch pokemon");
    }
    const pokemonData = await pokemonRes.json();

    const speciesRes = await fetch(`${BASE}/pokemon-species/${pokemonData.id}`);
    let description: string | undefined;
    if (speciesRes.ok) {
      const speciesData: PokemonSpecies = await speciesRes.json();
      description = getDescription(speciesData.flavor_text_entries);
    }

    const pokemon = normalizePokemon(pokemonData);
    return { ...pokemon, description };
  } catch (error) {
    console.error("Error fetching pokemon:", error);
    throw error;
  }
}

/**
 * Récupérer seulement la description d'un Pokémon
 */
export async function getPokemonDescription(id: string | number): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/pokemon-species/${id}`);
    if (!res.ok) return null;
    const data: PokemonSpecies = await res.json();
    return getDescription(data.flavor_text_entries);
  } catch (error) {
    console.error("Error fetching pokemon description:", error);
    return null;
  }
}

/**
 * URL officielle de l'image
 */
export function getPokemonArtworkUrl(id: string) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Normalise le Pokémon pour notre app
 */
function normalizePokemon(p: any): Pokemon {
  return {
    id: String(p.id),
    name: p.name,
    height: p.height,
    weight: p.weight,
    types: p.types.map((t: any) => t.type.name),
    stats: p.stats.map((s: any) => ({ name: s.stat.name, base: s.base_stat })),
    abilities: p.abilities.map((a: any) => ({ name: a.ability.name, isHidden: a.is_hidden })),
    sprites: {
      front_default: p.sprites?.front_default,
      artwork: getPokemonArtworkUrl(p.id),
    },
  };
}

/**
 * Extraire la meilleure description disponible
 */
function getDescription(flavorTextEntries: FlavorTextEntry[]): string {
  const preferredLanguages = ['fr', 'en'];
  for (const lang of preferredLanguages) {
    const modernVersions = ['sword', 'shield', 'scarlet', 'violet', 'legends-arceus', 'sun', 'moon'];
    for (const version of modernVersions) {
      const entry = flavorTextEntries.find(e => e.language.name === lang && e.version.name === version);
      if (entry) return cleanFlavorText(entry.flavor_text);
    }
    const entry = flavorTextEntries.find(e => e.language.name === lang);
    if (entry) return cleanFlavorText(entry.flavor_text);
  }
  if (flavorTextEntries.length > 0) return cleanFlavorText(flavorTextEntries[0].flavor_text);
  return "Aucune description disponible pour ce Pokémon.";
}

/**
 * Nettoyer le texte de description
 */
function cleanFlavorText(text: string): string {
  return text.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\u00AD/g, '').replace(/\s+/g, ' ').trim();
}

export function getPokemonCryUrl(id: string | number) {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
}