import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Text, Platform, useWindowDimensions } from 'react-native';
import { Redirect } from 'expo-router';

import Button from '@/src/components/button';
import PokemonCard from '@/src/components/pokemon-card';
import { useAuth } from '@/src/contexts/auth';
import { loadCapturedPokemons } from '@/src/services/capturedPokemon';
import type { Pokemon } from '@/src/types/pokemon';
import { styles } from './styles';

const STORAGE_KEY = '@prj_pokemon:team';
const TEAM_LIMIT = 5;

function toPokemonFromCaptured(captured: {
  id: string;
  name: string;
  sprite: string;
  type: string;
}): Pokemon {
  return {
    id: captured.id,
    name: captured.name,
    type: captured.type,
    cardImage: { uri: captured.sprite },
    images: [{ uri: captured.sprite }],
  };
}

export default function Team() {
  const { isAuthenticated, userId } = useAuth();
  const { width: windowWidth } = useWindowDimensions();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [limitError, setLimitError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isWeb = Platform.OS === 'web';
  const getColumnsAndWidth = () => {
    if (!isWeb) return { cardWidth: '100%' };
    if (windowWidth < 768) return { cardWidth: '100%' };
    if (windowWidth < 1024) return { cardWidth: '45%' };
    if (windowWidth < 1280) return { cardWidth: '30%' };
    return { cardWidth: '22%' };
  };
  const { cardWidth } = getColumnsAndWidth();

  useEffect(() => {
    let isActive = true;

    const loadSavedTeam = async () => {
      try {
        const rawTeam = await AsyncStorage.getItem(STORAGE_KEY);

        if (!isActive || !rawTeam) {
          setIsHydrated(true);
          return;
        }

        const parsedTeam = JSON.parse(rawTeam) as string[];

        if (Array.isArray(parsedTeam)) {
          setSelectedIds(parsedTeam.filter((id): id is string => typeof id === 'string'));
        }
      } catch (loadError) {
        console.error(loadError);
      } finally {
        if (isActive) {
          setIsHydrated(true);
        }
      }
    };

    void loadSavedTeam();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds)).catch((saveError) =>
      console.error(saveError),
    );
  }, [selectedIds, isHydrated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadCapturedCatalog = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!userId) {
          if (isActive) {
            setPokemons([]);
          }
          return;
        }

        const capturedPokemons = await loadCapturedPokemons(userId);

        if (!isActive) {
          return;
        }

        setPokemons(capturedPokemons.map(toPokemonFromCaptured));
      } catch {
        if (isActive) {
          setError('Nao foi possivel carregar os pokemons capturados.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCapturedCatalog();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, userId]);

  const selectedTeam = useMemo(
    () => pokemons.filter((pokemon) => selectedIds.includes(pokemon.id)),
    [pokemons, selectedIds],
  );

  const handleTogglePokemon = (pokemon: Pokemon) => {
    setSaveMessage(null);
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

  const handleSaveTeam = () => {
    setSaveMessage('Time salvo no dispositivo.');
    setLimitError('');
  };

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, isWeb && styles.containerWeb]} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Time</Text>
        <Text style={styles.subtitle}>
          Escolha ate 5 pokemons capturados para sua equipe. O time fica salvo no dispositivo.
        </Text>
      </View>

      <View style={[styles.teamCard, isWeb && styles.teamCardWeb]}>
        <View style={styles.teamHeader}>
          <Text style={styles.teamTitle}>Equipe ({selectedTeam.length}/{TEAM_LIMIT})</Text>
          {limitError ? <Text style={styles.errorText}>{limitError}</Text> : null}
          {saveMessage ? <Text style={styles.successText}>{saveMessage}</Text> : null}
        </View>
        {selectedTeam.length === 0 ? (
          <Text style={styles.teamEmpty}>Selecione pokemons capturados abaixo.</Text>
        ) : (
          <View style={styles.teamList}>
            {selectedTeam.map((pokemon) => (
              <View key={pokemon.id} style={styles.teamChip}>
                <Text style={styles.teamChipText}>{pokemon.name}</Text>
              </View>
            ))}
          </View>
        )}
        <Button title="Salvar Time" onPress={handleSaveTeam} style={styles.button} />
      </View>

      {isLoading ? (
        <View style={styles.statusWrapper}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.statusText}>Carregando pokemons capturados...</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.statusWrapper}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {!isLoading && !error && pokemons.length === 0 ? (
        <View style={styles.statusWrapper}>
          <Text style={styles.statusText}>
            Voce ainda nao tem pokemons capturados. Va ao Dashboard para receber alguns.
          </Text>
        </View>
      ) : null}

      {!isLoading && !error ? (
        <View style={[styles.cardsContainer, isWeb && styles.cardsGrid]}>
          {pokemons.map((pokemon) => {
            const isSelected = selectedIds.includes(pokemon.id);

            return (
              <View key={pokemon.id} style={[styles.cardWrapper, isWeb && styles.cardWrapperWeb, isWeb && { width: cardWidth }]}>
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
          })}
        </View>
      ) : null}
    </ScrollView>
  );
}
