import { Pressable, View, Text, Image } from 'react-native';

import type { Pokemon } from '@/src/types/pokemon';
import { getPokemonTheme } from '@/src/theme/pokemon-theme';

import { styles } from './styles';

type Props = {
  pokemon: Pokemon;
  onPress?: () => void;
};

const adjustedImageIds = new Set(['470', '133']);

export default function PokemonCard({ pokemon, onPress }: Props) {
  const theme = getPokemonTheme(pokemon.type);
  const hasAdjustedImage = adjustedImageIds.has(pokemon.id);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <Image
        source={pokemon.cardImage}
        style={[
          styles.image,
          hasAdjustedImage && styles.imageReduced,
          hasAdjustedImage && styles.imageSpaced,
        ]}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {pokemon.name} #{pokemon.id}
        </Text>
        <View style={styles.cardTypeRow}>
          <Text style={[styles.cardSubtitle, { color: theme.subtitle }]}>
            Tipo: {pokemon.type}
          </Text>
          {theme.icon ? (
            <Image source={theme.icon} style={styles.cardTypeIcon} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
