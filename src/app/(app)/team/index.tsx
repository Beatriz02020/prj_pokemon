import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Text } from 'react-native';
import { Redirect, router } from 'expo-router';

import Button from '@/src/components/button';
import PokemonCard from '@/src/components/pokemon-card';
import { useAuth } from '@/src/contexts/auth';
import type { Pokemon } from '@/src/types/pokemon';
import { styles } from './styles';

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 25;
const TEAM_LIMIT = 5;

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

type PokemonListResponse = {
  results?: PokemonListItem[];
};

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

export default function Team() {
  const { isAuthenticated } = useAuth();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [limitError, setLimitError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const details = await mapWithConcurrency(results, 8, async (item) => {
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
      } catch {
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

  const selectedTeam = useMemo(
    () => pokemons.filter((pokemon) => selectedIds.includes(pokemon.id)),
    [pokemons, selectedIds],
  );

  const handleTogglePokemon = (pokemon: Pokemon) => {
    setSelectedIds((prev) => {
      if (prev.includes(pokemon.id)) {
        setLimitError('');
        return prev.filter((id) => id !== pokemon.id);
      }

      if (prev.length >= TEAM_LIMIT) {
        setLimitError('Voce ja selecionou 5 pokemons.');
        return prev;
      }

      setLimitError('');
      return [...prev, pokemon.id];
    });
  };

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Time</Text>
        <Text style={styles.subtitle}>Escolha ate 5 pokemons para sua equipe</Text>
      </View>

      <View style={styles.teamCard}>
        <View style={styles.teamHeader}>
          <Text style={styles.teamTitle}>Equipe ({selectedTeam.length}/{TEAM_LIMIT})</Text>
          {limitError ? <Text style={styles.errorText}>{limitError}</Text> : null}
        </View>
        {selectedTeam.length === 0 ? (
          <Text style={styles.teamEmpty}>Selecione pokemons abaixo.</Text>
        ) : (
          <View style={styles.teamList}>
            {selectedTeam.map((pokemon) => (
              <View key={pokemon.id} style={styles.teamChip}>
                <Text style={styles.teamChipText}>{pokemon.name}</Text>
              </View>
            ))}
          </View>
        )}
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
        ? pokemons.map((pokemon) => {
            const isSelected = selectedIds.includes(pokemon.id);

            return (
              <View key={pokemon.id} style={styles.cardWrapper}>
                <PokemonCard
                  pokemon={pokemon}
                  onPress={() => handleTogglePokemon(pokemon)}
                />
                {isSelected ? (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>Selecionado</Text>
                  </View>
                ) : null}
              </View>
            );
          })
        : null}

      <View style={styles.navRow}>
        <Button
          title="Ver dashboard"
          onPress={() => router.push('/dashboard')}
          style={styles.navButton}
        />
        <Button
          title="Ver perfil"
          onPress={() => router.push('/profile/index')}
          style={styles.navButton}
        />
      </View>
    </ScrollView>
  );
}
