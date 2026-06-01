import { useState } from 'react';
import { Alert, Image, ScrollView, View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import Button from '@/src/components/button';
import { useAuth } from '@/src/contexts/auth';
import { styles } from './styles';

export default function Profile() {
  const { isAuthenticated, signOut, user } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const profileFields = [
    { label: 'Nome', value: user?.name ?? 'Nao informado' },
    { label: 'Email', value: user?.email ?? 'Nao informado' },
    { label: 'Regiao', value: 'Kanto' },
    { label: 'Tipo favorito', value: 'Fada' },
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <Text style={styles.name}>Treinador Pokemon</Text>
        <Text style={styles.tagline}>Nivel iniciante</Text>
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

      <Button title="Sair" onPress={signOut} style={styles.logoutButton} />
    </ScrollView>
  );
}
