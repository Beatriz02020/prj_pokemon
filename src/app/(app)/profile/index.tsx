import { ScrollView, View, Text } from 'react-native';
import { Redirect } from 'expo-router';

import Button from '@/src/components/button';
import { useAuth } from '@/src/contexts/auth';
import { styles } from './styles';

type ProfileField = {
  label: string;
  value: string;
};

const PROFILE_FIELDS: ProfileField[] = [
  { label: 'Nome', value: 'Nao informado' },
  { label: 'Email', value: 'Nao informado' },
  { label: 'Regiao', value: 'Kanto' },
  { label: 'Tipo favorito', value: 'Fada' },
];

export default function Profile() {
  const { isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Dados do treinador</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>PK</Text>
        </View>
        <Text style={styles.name}>Treinador Pokemon</Text>
        <Text style={styles.tagline}>Nivel iniciante</Text>
      </View>

      <View style={styles.infoCard}>
        {PROFILE_FIELDS.map((field) => (
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
