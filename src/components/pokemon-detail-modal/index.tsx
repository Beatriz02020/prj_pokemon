import { useEffect, useState } from 'react';
import { Modal, View, Text, Image, ImageBackground, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import type { Pokemon } from '@/src/types/pokemon';
import { getPokemonTheme } from '@/src/theme/pokemon-theme';

import { styles } from './styles';

type Props = {
  visible: boolean;
  pokemon: Pokemon | null;
  onClose: () => void;
};

const DESCRIPTION_OPTIONS = ['Pokedex 1', 'Pokedex 2'] as const;
type DescriptionIndex = 0 | 1 | null;

export default function PokemonDetailModal({ visible, pokemon, onClose }: Props) {
  const [descriptionIndex, setDescriptionIndex] = useState<DescriptionIndex>(null);
  const [showDescriptionOptions, setShowDescriptionOptions] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const theme = getPokemonTheme(pokemon?.type);
  const isSylveon = pokemon?.id === '700';
  const cardStyle = { borderColor: theme.border, backgroundColor: theme.surface };
  const borderStyle = { borderColor: theme.border };
  const panelStyle = { backgroundColor: theme.panel };
  const headerTextStyle = { color: theme.headerText };
  const decorPrimaryStyle = { backgroundColor: theme.decorPrimary };
  const decorSecondaryStyle = { backgroundColor: theme.decorSecondary };
  const arrowIconStyle = { color: theme.border };
  const iconSizeStyle = theme.iconSize
    ? { width: theme.iconSize, height: theme.iconSize }
    : undefined;
  const imageStyle = [
    styles.detailImageStyle,
    isSylveon ? styles.detailImageCover : styles.detailImageContain,
    isSylveon && styles.detailImageZoom,
  ];

  useEffect(() => {
    if (pokemon) {
      setDescriptionIndex(null);
      setImageIndex(0);
      setShowDescriptionOptions(false);
    }
  }, [pokemon]);

  const handleToggleDescriptionOptions = () => {
    setShowDescriptionOptions((prev) => !prev);
  };

  const handleSelectDescription = (index: Exclude<DescriptionIndex, null>) => {
    setDescriptionIndex(index);
    setShowDescriptionOptions(false);
  };

  const handleNextImage = () => {
    if (!pokemon || pokemon.images.length === 0) {
      return;
    }

    setImageIndex((prev) => (prev + 1) % pokemon.images.length);
  };

  const descriptionTexts = pokemon
    ? [pokemon.description, pokemon.descriptionAlt]
    : [];
  const activeDescription =
    descriptionIndex === null
      ? ''
      : descriptionTexts[descriptionIndex] ?? '';
  const activeDescriptionLabel =
    descriptionIndex === null ? 'Versão Pokedex' : DESCRIPTION_OPTIONS[descriptionIndex];
  const activeImage = pokemon?.images?.[imageIndex] ?? pokemon?.images?.[0];
  const hasMultipleImages = (pokemon?.images?.length ?? 0) > 1;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        {pokemon ? (
          <View style={styles.modalContent}>
            <View style={[styles.detailCard, cardStyle]}>
              <View style={[styles.detailDecorPrimary, decorPrimaryStyle]} />
              <View style={[styles.detailDecorSecondary, decorSecondaryStyle]} />
              <LinearGradient
                colors={theme.headerGradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.detailHeader, borderStyle]}
              >
                <Text style={[styles.detailHeaderText, headerTextStyle]}>
                  {pokemon.name}
                </Text>
              </LinearGradient>
              <View style={[styles.detailImageFrame, borderStyle]}>
                {activeImage ? (
                  <ImageBackground
                    source={activeImage}
                    style={styles.detailImageBackground}
                    imageStyle={imageStyle}
                  />
                ) : null}
                {hasMultipleImages ? (
                  <Pressable
                    style={styles.detailArrowBadge}
                    onPress={handleNextImage}
                    hitSlop={10}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={32}
                      style={[styles.detailArrowIcon, arrowIconStyle]}
                    />
                  </Pressable>
                ) : null}
              </View>
              <View style={styles.detailBody}>
                <View style={styles.detailTypeRow}>
                  <Text style={styles.detailType}>Tipo: {pokemon.type}</Text>
                  {theme.icon ? (
                    <Image
                      source={theme.icon}
                      style={[styles.detailTypeIcon, iconSizeStyle]}
                    />
                  ) : null}
                </View>
                <View style={styles.detailPokedexBlock}>
                  <Text style={styles.detailPokedexLabel}>Pokedex:</Text>
                  <View style={[styles.detailPokedexBox, panelStyle]}>
                    <Text style={styles.detailPokedexText}>{activeDescription}</Text>
                  </View>
                  <View style={styles.detailSelectBlock}>
                    <Text style={styles.detailSelectLabel}>Descricao:</Text>
                    <Pressable
                      style={[styles.detailSelect, panelStyle]}
                      onPress={handleToggleDescriptionOptions}
                    >
                      <Text style={styles.detailSelectText}>{activeDescriptionLabel}</Text>
                      <Ionicons
                        name={showDescriptionOptions ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        style={styles.detailSelectIcon}
                      />
                    </Pressable>
                    {showDescriptionOptions ? (
                      <View style={styles.detailSelectOptions}>
                        <Pressable
                          style={[
                            styles.detailSelectOption,
                            panelStyle,
                            descriptionIndex === 0 && styles.detailSelectOptionActive,
                          ]}
                          onPress={() => handleSelectDescription(0)}
                        >
                          <Text style={styles.detailSelectOptionText}>Pokedex 1</Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.detailSelectOption,
                            panelStyle,
                            descriptionIndex === 1 && styles.detailSelectOptionActive,
                          ]}
                          onPress={() => handleSelectDescription(1)}
                        >
                          <Text style={styles.detailSelectOptionText}>Pokedex 2</Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
