import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Redirect } from 'expo-router';

import Button from '@/src/components/button';
import PokemonCard from '@/src/components/pokemon-card';
import PokemonDetailModal from '@/src/components/pokemon-detail-modal';
import { useAuth } from '@/src/contexts/auth';
import type { Pokemon } from '@/src/types/pokemon';
import { dashboardStyles as styles } from './styles';

const POKEMONS: Pokemon[] = [
  {
    id: '700',
    name: 'Sylveon',
    type: 'Fada',
    cardImage: require('../../assets/images/sylveon3.png'),
    images: [
      require('../../assets/images/sylveon1.jpg.jpeg'),
      require('../../assets/images/sylveon2.jpg.jpeg'),
    ],
    description:
      'This Pokemon uses its ribbonlike feelers to send a soothing aura into its opponents, erasing their hostility.',
    descriptionAlt:
      'Sylveon cuts an elegant figure as it dances lightly around, feelers fluttering, but its piercing moves aim straight for its opponents\' weak spots.',
  },
  {
    id: '470',
    name: 'Leafeon',
    type: 'Planta',
    cardImage: require('../../assets/images/leafeon1.png'),
    images: [
      require('../../assets/images/leafeon1.png'),
      require('../../assets/images/leafeon2.gif'),
    ],
    description:
      'Leafeon blends with forests, using sharp leaves and calm focus to defend itself.',
    descriptionAlt:
      'It moves silently among trees, gathering sunlight before a swift strike.',
  },
  {
    id: '133',
    name: 'Eevee',
    type: 'Normal',
    cardImage: require('../../assets/images/evee1.png'),
    images: [
      require('../../assets/images/evee1.png'),
    ],
    description:
      'Eevee adapts quickly, ready to evolve in many different ways.',
    descriptionAlt:
      'Curious and friendly, it uses its fluffy tail to balance while it runs.',
  },
];

export default function Dashboard() {
  const { isAuthenticated, signOut } = useAuth();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const handleOpenPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleClosePokemon = () => {
    setSelectedPokemon(null);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        {POKEMONS.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onPress={() => handleOpenPokemon(pokemon)}
          />
        ))}

        <Button title="Sair" onPress={signOut} style={styles.logoutButton} />
      </ScrollView>

      <PokemonDetailModal
        visible={Boolean(selectedPokemon)}
        pokemon={selectedPokemon}
        onClose={handleClosePokemon}
      />
    </>
  );
}

