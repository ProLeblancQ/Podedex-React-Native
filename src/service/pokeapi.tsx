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

// Types pour les données d'espèces
interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: FlavorTextEntry[];
}

interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

/**
 * Liste de Pokémon avec pagination
 */
export async function listPokemons(limit = 24, offset = 0) {
  const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch pokemons");
  const data = await res.json();

  // Pour chaque Pokémon, on récupère les détails pour avoir les types
  const items: PokemonListItem[] = await Promise.all(
    data.results.map(async (item: any) => {
      const parts = item.url.split("/").filter(Boolean);
      const id = parts[parts.length - 1];
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
    // Récupérer les données principales du Pokémon
    const pokemonRes = await fetch(`${BASE}/pokemon/${idOrName}`);
    if (!pokemonRes.ok) {
      if (pokemonRes.status === 404) return null;
      throw new Error("Failed to fetch pokemon");
    }
    const pokemonData = await pokemonRes.json();

    // Récupérer les données d'espèce pour la description
    const speciesRes = await fetch(`${BASE}/pokemon-species/${pokemonData.id}`);
    let description: string | undefined;
    
    if (speciesRes.ok) {
      const speciesData: PokemonSpecies = await speciesRes.json();
      description = getDescription(speciesData.flavor_text_entries);
    }

    // Normaliser et ajouter la description
    const pokemon = normalizePokemon(pokemonData);
    return {
      ...pokemon,
      description
    };
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
  // Priorité des langues (français puis anglais)
  const preferredLanguages = ['fr', 'en'];
  
  for (const lang of preferredLanguages) {
    // Chercher d'abord dans les versions récentes
    const modernVersions = ['sword', 'shield', 'scarlet', 'violet', 'legends-arceus', 'sun', 'moon'];
    
    for (const version of modernVersions) {
      const entry = flavorTextEntries.find(entry => 
        entry.language.name === lang && 
        entry.version.name === version
      );
      
      if (entry) {
        return cleanFlavorText(entry.flavor_text);
      }
    }
    
    // Si pas trouvé dans les versions récentes, prendre la première entrée dans cette langue
    const entry = flavorTextEntries.find(entry => entry.language.name === lang);
    if (entry) {
      return cleanFlavorText(entry.flavor_text);
    }
  }
  
  // Fallback : première entrée disponible
  if (flavorTextEntries.length > 0) {
    return cleanFlavorText(flavorTextEntries[0].flavor_text);
  }
  
  return "Aucune description disponible pour ce Pokémon.";
}

/**
 * Nettoyer le texte de description
 */
function cleanFlavorText(text: string): string {
  return text
    // Remplacer les caractères spéciaux de formatage
    .replace(/\f/g, ' ')  // Form feed
    .replace(/\n/g, ' ')  // Retours à la ligne
    .replace(/\u00AD/g, '') // Soft hyphens
    // Remplacer les espaces multiples par un seul
    .replace(/\s+/g, ' ')
    // Nettoyer les espaces en début/fin
    .trim();
}