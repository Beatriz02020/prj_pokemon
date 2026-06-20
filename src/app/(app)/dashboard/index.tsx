import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  View,
  Text,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Redirect } from 'expo-router';

import Button from '@/src/components/button';
import PokemonCard from '@/src/components/pokemon-card';
import PokemonDetailModal from '@/src/components/pokemon-detail-modal';
import { useAuth } from '@/src/contexts/auth';
import {
  type CapturedPokemon,
  MAX_CAPTURED_POKEMON,
  capturePokemon,
  loadCapturedPokemons,
  removeCapturedPokemon,
} from '@/src/services/capturedPokemon';
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
  const { isAuthenticated, userId } = useAuth();
  const { width: windowWidth } = useWindowDimensions();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [capturedPokemons, setCapturedPokemons] = useState<CapturedPokemon[]>([]);
  const [isMutatingPokemonId, setIsMutatingPokemonId] = useState<string | null>(null);
  const [isRemovePickerVisible, setIsRemovePickerVisible] = useState(false);
  const pendingDescriptions = useRef(new Set<string>());

  const isWeb = Platform.OS === 'web';
  const getColumnsAndWidth = () => {
    if (!isWeb) return { cardWidth: '100%' };
    if (windowWidth < 768) return { cardWidth: '100%' };
    if (windowWidth < 1024) return { cardWidth: '45%' };
    if (windowWidth < 1280) return { cardWidth: '30%' };
    return { cardWidth: '22%' };
  };
  const { cardWidth } = getColumnsAndWidth();

  const capturedPokemonSet = useMemo(
    () => new Set(capturedPokemons.map((capturedPokemon) => capturedPokemon.id)),
    [capturedPokemons],
  );

  const sortedCapturedPokemons = useMemo(
    () => [...capturedPokemons].sort((left, right) => right.capturedAt - left.capturedAt),
    [capturedPokemons],
  );

  const randomCaptureCandidates = useMemo(
    () => pokemons.filter((item) => !capturedPokemonSet.has(item.id)),
    [capturedPokemonSet, pokemons],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadCaptured = async () => {
      if (!userId) {
        setCapturedPokemons([]);
        return;
      }

      try {
        const capturedPokemonsData = await loadCapturedPokemons(userId);

        if (!isActive) {
          return;
        }

        setCapturedPokemons(capturedPokemonsData);
      } catch (loadError) {
        console.error(loadError);
      }
    };

    void loadCaptured();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, userId]);

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

  const handleCaptureRandomPokemon = async () => {
    if (!userId) {
      Alert.alert('Sessao invalida', 'Faca login novamente para receber um pokemon.');
      return;
    }

    if (isLoading) {
      Alert.alert('Aguarde', 'Os pokemons ainda estao sendo carregados.');
      return;
    }

    if (randomCaptureCandidates.length === 0) {
      Alert.alert(
        'Catalogo completo',
        'Voce ja capturou todos os pokemons carregados nesta pagina.',
      );
      return;
    }

    const randomPokemon =
      randomCaptureCandidates[Math.floor(Math.random() * randomCaptureCandidates.length)];

    try {
      setIsMutatingPokemonId(randomPokemon.id);

      const nextCapturedPokemons = await capturePokemon(userId, {
        id: randomPokemon.id,
        name: randomPokemon.name,
        sprite:
          typeof randomPokemon.cardImage === 'object' && randomPokemon.cardImage && 'uri' in randomPokemon.cardImage
            ? String(randomPokemon.cardImage.uri)
            : '',
        type: randomPokemon.type,
      });

      setCapturedPokemons(nextCapturedPokemons);
      Alert.alert('Pokemon recebido', `${randomPokemon.name} foi adicionado aos capturados.`);
    } catch (captureError) {
      Alert.alert(
        'Erro',
        captureError instanceof Error ? captureError.message : 'Nao foi possivel atualizar a captura.',
      );
    } finally {
      setIsMutatingPokemonId(null);
    }
  };

  const handleOpenRemovePicker = () => {
    if (!userId) {
      Alert.alert('Sessao invalida', 'Faca login novamente para gerenciar seus capturados.');
      return;
    }

    if (capturedPokemons.length === 0) {
      Alert.alert('Sem capturados', 'Voce ainda nao tem pokemon capturados para remover.');
      return;
    }

    setIsRemovePickerVisible(true);
  };

  const handleRemoveCapturedPokemon = async (pokemonId: string) => {
    if (!userId) {
      setIsRemovePickerVisible(false);
      return;
    }

    const pokemonToRemove = capturedPokemons.find((capturedPokemon) => capturedPokemon.id === pokemonId);

    if (!pokemonToRemove) {
      return;
    }

    try {
      setIsMutatingPokemonId(pokemonId);

      const nextCapturedPokemons = await removeCapturedPokemon(userId, pokemonId);
      setCapturedPokemons(nextCapturedPokemons);
      setIsRemovePickerVisible(false);
      Alert.alert('Pokemon removido', `${pokemonToRemove.name} foi removido dos capturados.`);
    } catch (removeError) {
      Alert.alert(
        'Erro',
        removeError instanceof Error ? removeError.message : 'Nao foi possivel remover o pokemon.',
      );
    } finally {
      setIsMutatingPokemonId(null);
    }
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
      <ScrollView contentContainerStyle={[styles.container, isWeb && styles.containerWeb]} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Capturados: {capturedPokemons.length}/{MAX_CAPTURED_POKEMON}
          </Text>
        </View>

        <View style={[styles.actionsRow, isWeb && styles.actionsRowWeb]}>
          <Button
            title={isMutatingPokemonId ? 'Processando...' : 'Receber aleatorio'}
            onPress={handleCaptureRandomPokemon}
            disabled={Boolean(isMutatingPokemonId)}
            style={styles.primaryActionButton}
          />
          <Button
            title="Escolher para remover"
            onPress={handleOpenRemovePicker}
            style={styles.secondaryActionButton}
          />
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

        {!isLoading && !error ? (
          <View style={[styles.cardsContainer, isWeb && styles.cardsGrid]}>
            {filteredPokemons.map((pokemon) => {
              const isCaptured = capturedPokemonSet.has(pokemon.id);

              return (
                <View key={pokemon.id} style={[styles.cardWrapper, isWeb && styles.cardWrapperWeb, isWeb && { width: cardWidth }]}>
                  <PokemonCard
                    pokemon={pokemon}
                    onPress={() => handleOpenPokemon(pokemon)}
                  />
                  {isCaptured ? (
                    <View style={styles.capturedBadge}>
                      <Text style={styles.capturedBadgeText}>Capturado</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        {!isLoading && !error && filteredPokemons.length === 0 ? (
          <View style={styles.statusWrapper}>
            <Text style={styles.statusText}>Nenhum pokemon encontrado.</Text>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={isRemovePickerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsRemovePickerVisible(false)}
      >
        <View style={[styles.modalOverlay, isWeb && styles.modalOverlayWeb]}>
          <View style={[styles.modalCard, isWeb && styles.modalCardWeb]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Escolher para remover</Text>
                <Text style={styles.modalSubtitle}>
                  Toque em um pokemon capturado para remove-lo da sua lista.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsRemovePickerVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>X</Text>
              </Pressable>
            </View>

            {sortedCapturedPokemons.length === 0 ? (
              <Text style={styles.statusText}>Nenhum capturado encontrado.</Text>
            ) : (
              <FlatList
                data={sortedCapturedPokemons}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.modalList}
                renderItem={({ item }) => (
                  <Pressable
                    accessibilityRole="button"
                    disabled={isMutatingPokemonId === item.id}
                    onPress={() => handleRemoveCapturedPokemon(item.id)}
                    style={styles.modalPokemonRow}
                  >
                    <View style={styles.modalPokemonInfo}>
                      <Text style={styles.modalPokemonName}>{item.name}</Text>
                      <Text style={styles.modalPokemonMeta}>N {item.id}</Text>
                    </View>
                    <Text style={styles.modalRemoveText}>
                      {isMutatingPokemonId === item.id ? 'Removendo...' : 'Remover'}
                    </Text>
                  </Pressable>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      <PokemonDetailModal
        visible={Boolean(selectedPokemon)}
        pokemon={selectedPokemon}
        onClose={handleClosePokemon}
      />
    </>
  );
}
