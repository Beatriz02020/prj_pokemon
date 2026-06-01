import type { ImageSourcePropType } from 'react-native';

export type GradientColors = readonly [string, string, ...string[]];

export type PokemonTheme = {
  border: string;
  surface: string;
  subtitle: string;
  headerGradient: GradientColors;
  headerText: string;
  panel: string;
  decorPrimary: string;
  decorSecondary: string;
  icon?: ImageSourcePropType;
  iconSize?: number;
};

const THEMES: Record<string, PokemonTheme> = {
  fada: {
    border: '#ec48c3',
    surface: '#fed1f4',
    subtitle: '#c026d3',
    headerGradient: ['#f6a7d6', '#fde8f4'],
    headerText: '#831843',
    panel: '#fff1fb',
    decorPrimary: '#fce7f8',
    decorSecondary: '#fbcff1',
    icon: require('../../assets/images/fairy.png'),
  },
  agua: {
    border: '#38bdf8',
    surface: '#e0f2fe',
    subtitle: '#0284c7',
    headerGradient: ['#7dd3fc', '#e0f2fe'],
    headerText: '#0c4a6e',
    panel: '#eff9ff',
    decorPrimary: '#dbeafe',
    decorSecondary: '#bae6fd',
    icon: require('../../assets/images/water.png'),
  },
  planta: {
    border: '#34d399',
    surface: '#dcfce7',
    subtitle: '#059669',
    headerGradient: ['#86efac', '#dcfce7'],
    headerText: '#065f46',
    panel: '#f0fdf4',
    decorPrimary: '#d1fae5',
    decorSecondary: '#bbf7d0',
    icon: require('../../assets/images/grass.png'),
  },
  fogo: {
    border: '#fb7185',
    surface: '#ffe4e6',
    subtitle: '#e11d48',
    headerGradient: ['#fda4af', '#ffe4e6'],
    headerText: '#9f1239',
    panel: '#fff1f2',
    decorPrimary: '#ffe4e6',
    decorSecondary: '#fecdd3',
    icon: require('../../assets/images/fire.png'),
  },
  inseto: {
    border: '#a3e635',
    surface: '#f7fee7',
    subtitle: '#3f6212',
    headerGradient: ['#bef264', '#f7fee7'],
    headerText: '#365314',
    panel: '#ecfccb',
    decorPrimary: '#d9f99d',
    decorSecondary: '#bef264',
    icon: require('../../assets/images/bug.png'),
  },
  normal: {
    border: '#a8a29e',
    surface: '#e9e9e8',
    subtitle: '#57534e',
    headerGradient: ['#b6b5b4', '#f5f5f4'],
    headerText: '#57534e',
    panel: '#fafaf9',
    decorPrimary: '#f5f4f3',
    decorSecondary: '#d6d3d1',
    icon: require('../../assets/images/normal.png'),
    iconSize: 24,
  },
};

const TYPE_ALIASES: Record<string, keyof typeof THEMES> = {
  fairy: 'fada',
  water: 'agua',
  grass: 'planta',
  fire: 'fogo',
  normal: 'normal',
  bug: 'inseto',
};

export const getPokemonTheme = (type?: string): PokemonTheme => {
  const key = type?.trim().toLowerCase();
  const mappedKey = (key && (TYPE_ALIASES[key] ?? key)) || 'normal';
  return THEMES[mappedKey] || THEMES.normal;
};
