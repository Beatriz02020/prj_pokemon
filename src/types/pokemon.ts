import type { ImageSourcePropType } from 'react-native';

export type Pokemon = {
  id: string;
  name: string;
  type: string;
  cardImage: ImageSourcePropType;
  images: ImageSourcePropType[];
  description: string;
  descriptionAlt: string;
};
