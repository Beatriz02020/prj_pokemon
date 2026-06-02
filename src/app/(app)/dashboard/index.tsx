import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Text, TextInput } from 'react-native';
import { Redirect, router } from 'expo-router';

import Button from '@/src/components/button';
import PokemonCard from '@/src/components/pokemon-card';
import PokemonDetailModal from '@/src/components/pokemon-detail-modal';
import { useAuth } from '@/src/contexts/auth';
import type { Pokemon } from '@/src/types/pokemon';
import { styles } from './styles';

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 150;

const TYPE_LABELS: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Agua',
  electric: 'Eletrico',
  grass: 'Planta',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Venenoso',
  ground: 'Terra',
  flying: 'Voador',
  psychic: 'Psiquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragao',
  dark: 'Sombrio',
  steel: 'Aco',
  fairy: 'Fada',
};

type PokemonListItem = { name: string; url: string };
type PokemonListResponse = { results?: PokemonListItem[] };
type FlavorEntry = { flavor_text?: string; language?: { name?: string } };

const capitalize = (value: string) =>
  value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value;

const formatPokemonName = (value: string) =>
  value
    .split('-')
    .map((part) => capitalize(part))
    .join(' ');

const formatPokemonType = (value?: string) => {
  const key = value?.trim().toLowerCase();
  if (!key) {
    return 'Normal';
  }

  return TYPE_LABELS[key] ?? formatPokemonName(key);
};

const normalizeFlavorText = (value: string) =>
  value.replace(/[\f\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();

const normalizeSearch = (value: string) => value.trim().toLowerCase();

const buildPokemonImages = (sprites: any, id: string) => {
  const candidates = [
    sprites?.other?.['official-artwork']?.front_default,
    sprites?.other?.home?.front_default,
    sprites?.front_default,
    sprites?.other?.['official-artwork']?.front_shiny,
    sprites?.front_shiny,
  ];
  const uniqueUrls = Array.from(new Set(candidates.filter(Boolean)));
  const urls = uniqueUrls.length
    ? uniqueUrls
    : [`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`];

  return urls.map((uri) => ({ uri }));
};

const mapPokemonFromApi = (data: any): Pokemon => {
  const id = String(data?.id ?? '');
  const name = formatPokemonName(data?.name ?? '');
  const typeName = data?.types?.[0]?.type?.name;
  const images = buildPokemonImages(data?.sprites, id);

  return {
    id,
    name,
    type: formatPokemonType(typeName),
    cardImage: images[0],
    images,
  };
};

const pickFlavorTexts = (entries: FlavorEntry[]) => {
  const portuguese = entries.filter((entry) =>
    ['pt-br', 'pt'].includes(entry.language?.name ?? ''),
  );
  const english = entries.filter((entry) => entry.language?.name === 'en');
  const pool = portuguese.length ? portuguese : english;
  const texts = Array.from(
    new Set(pool.map((entry) => normalizeFlavorText(entry.flavor_text ?? ''))),
  ).filter(Boolean);

  const description = texts[0] ?? 'Descricao indisponivel.';
  const descriptionAlt = texts[1] ?? description;

  return { description, descriptionAlt };
};

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
) {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  const workers = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await mapper(items[current], current);
    }
  });

  await Promise.all(workers);
  return results;
}

const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os pokemons.');
  }

  const data = await response.json();
  return mapPokemonFromApi(data);
};

const fetchPokemonDescriptions = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/pokemon-species/${id}`);
  if (!response.ok) {
    throw new Error('Nao foi possivel carregar a descricao.');
  }

  const data = await response.json();
  return pickFlavorTexts(data?.flavor_text_entries ?? []);
};

export default function Dashboard() {
  const { isAuthenticated, signOut } = useAuth();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pendingDescriptions = useRef(new Set<string>());

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadPokemons = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const listResponse = await fetch(
          `${API_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`,
        );
        if (!listResponse.ok) {
          throw new Error('Nao foi possivel carregar os pokemons.');
        }

        const listData: PokemonListResponse = await listResponse.json();
        const results = listData.results ?? [];
        const details = await mapWithConcurrency(results, 10, async (item) => {
          try {
            return await fetchPokemonDetails(item.url);
          } catch {
            return null;
          }
        });

        const filtered = details.filter((pokemon): pokemon is Pokemon => Boolean(pokemon));

        if (isActive) {
          setPokemons(filtered);
        }
      } catch (err) {
        if (isActive) {
          setError('Nao foi possivel carregar os pokemons.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadPokemons();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  const ensurePokemonDescriptions = async (pokemon: Pokemon) => {
    if (pokemon.description && pokemon.descriptionAlt) {
      return;
    }
    if (pendingDescriptions.current.has(pokemon.id)) {
      return;
    }

    pendingDescriptions.current.add(pokemon.id);

    try {
      const { description, descriptionAlt } = await fetchPokemonDescriptions(pokemon.id);
      const updated = { ...pokemon, description, descriptionAlt };

      setPokemons((prev) =>
        prev.map((item) => (item.id === pokemon.id ? updated : item)),
      );
      setSelectedPokemon((prev) => (prev?.id === pokemon.id ? updated : prev));
    } catch {
      const updated = {
        ...pokemon,
        description: 'Descricao indisponivel.',
        descriptionAlt: 'Descricao indisponivel.',
      };
      setSelectedPokemon((prev) => (prev?.id === pokemon.id ? updated : prev));
    } finally {
      pendingDescriptions.current.delete(pokemon.id);
    }
  };

  const handleOpenPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    void ensurePokemonDescriptions(pokemon);
  };

  const handleClosePokemon = () => {
    setSelectedPokemon(null);
  };

  const filteredPokemons = useMemo(() => {
    const query = normalizeSearch(searchQuery);
    if (!query) {
      return pokemons;
    }

    return pokemons.filter((pokemon) => {
      const name = normalizeSearch(pokemon.name);
      const type = normalizeSearch(pokemon.type);
      return (
        name.includes(query) ||
        type.includes(query) ||
        pokemon.id.includes(query)
      );
    });
  }, [pokemons, searchQuery]);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        <View style={styles.searchBlock}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nome, tipo ou numero"
            placeholderTextColor="#9AA1AA"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {!isLoading && !error ? (
            <Text style={styles.searchInfo}>
              Mostrando {filteredPokemons.length} de {pokemons.length}
            </Text>
          ) : null}
        </View>

        {isLoading ? (
          <View style={styles.statusWrapper}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.statusText}>Carregando pokemons...</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.statusWrapper}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!isLoading && !error
          ? filteredPokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onPress={() => handleOpenPokemon(pokemon)}
              />
            ))
          : null}

        {!isLoading && !error && filteredPokemons.length === 0 ? (
          <View style={styles.statusWrapper}>
            <Text style={styles.statusText}>Nenhum pokemon encontrado.</Text>
          </View>
        ) : null}
      </ScrollView>

      <PokemonDetailModal
        visible={Boolean(selectedPokemon)}
        pokemon={selectedPokemon}
        onClose={handleClosePokemon}
      />
    </>
  );
}
