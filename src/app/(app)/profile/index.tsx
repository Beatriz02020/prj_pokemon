import { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Image, ScrollView, View, Text, Platform } from 'react-native';
import { Redirect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import Button from '@/src/components/button';
import { useAuth } from '@/src/contexts/auth';
import {
  loadCapturedPokemons,
  MAX_CAPTURED_POKEMON,
} from '@/src/services/capturedPokemon';
import { loadUserStats, type UserStats } from '@/src/services/currentUser';
import { styles } from './styles';

export default function Profile() {
  const { isAuthenticated, signOut, user, userId } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [capturedCount, setCapturedCount] = useState(0);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setStats(null);
      setCapturedCount(0);
      setIsStatsLoading(false);
      return;
    }

    let isActive = true;

    const loadProfileData = async () => {
      try {
        setIsStatsLoading(true);

        const [statsData, capturedPokemons] = await Promise.all([
          loadUserStats(userId),
          loadCapturedPokemons(userId),
        ]);

        if (!isActive) {
          return;
        }

        setStats(statsData);
        setCapturedCount(capturedPokemons.length);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        if (isActive) {
          setStats(null);
        }
      } finally {
        if (isActive) {
          setIsStatsLoading(false);
        }
      }
    };

    void loadProfileData();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, userId]);

  const profileFields = [
    { label: 'Nome', value: user?.name ?? 'Nao informado' },
    { label: 'Usuario', value: user?.email ?? 'Nao informado' },
    {
      label: 'Nivel',
      value: isStatsLoading ? 'Carregando...' : String(stats?.level ?? 0),
    },
    {
      label: 'Vitorias',
      value: isStatsLoading ? 'Carregando...' : String(stats?.vitorias ?? 0),
    },
    {
      label: 'Derrotas',
      value: isStatsLoading ? 'Carregando...' : String(stats?.derrotas ?? 0),
    },
    {
      label: 'Capturados',
      value: isStatsLoading
        ? 'Carregando...'
        : `${capturedCount}/${MAX_CAPTURED_POKEMON}`,
    },
  ];

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissao necessaria',
        'Habilite o acesso a galeria para escolher uma foto.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSignOut = () => {
    void signOut();
  };

  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView contentContainerStyle={[styles.container, isWeb && styles.containerWeb]}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Dados do treinador</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>PK</Text>
          )}
        </View>
        <Text style={styles.name}>
          {stats?.username || user?.name || 'Treinador Pokemon'}
        </Text>
        <Text style={styles.tagline}>
          {isStatsLoading ? 'Carregando nivel...' : `Nivel ${stats?.level ?? 0}`}
        </Text>
        {isStatsLoading ? (
          <ActivityIndicator size="small" color="#2563EB" style={styles.statsLoader} />
        ) : null}
        <Button title="Escolher foto" onPress={handlePickAvatar} style={styles.photoButton} />
      </View>

      <View style={styles.infoCard}>
        {profileFields.map((field) => (
          <View key={field.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{field.label}</Text>
            <Text style={styles.infoValue}>{field.value}</Text>
          </View>
        ))}
      </View>

      <Button title="Sair" onPress={handleSignOut} style={styles.logoutButton} />
    </ScrollView>
  );
}
