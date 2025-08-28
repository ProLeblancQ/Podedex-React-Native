// Pokémon pour la liste
export type PokemonListItem = {
  id: string;
  name: string;
  image: string;
  url: string;
  types?: string[];
};

// Pokémon complet pour détails
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

// Espèce pour récupérer la description
export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: FlavorTextEntry[];
}

// Entrée de description
export interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string; url: string };
  version: { name: string; url: string };
}

// Index complet pour la recherche
export type IndexItem = {
  id: string;
  name: string;
  url: string;
};
