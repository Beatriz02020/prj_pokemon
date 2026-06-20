import type { CapturedPokemonInput } from '@/src/services/capturedPokemon';
import { capturePokemon, loadCapturedPokemons } from '@/src/services/capturedPokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

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

type PokemonCatalogItem = CapturedPokemonInput;

function formatPokemonName(value: string) {
  return value
    .split('-')
    .map((part) => (part.length > 0 ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function formatPokemonType(value?: string) {
  const key = value?.trim().toLowerCase();
  if (!key) return 'Normal';
  return TYPE_LABELS[key] ?? formatPokemonName(key);
}

function shufflePokemonCards<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

async function loadInitialPokemonCatalog(): Promise<PokemonCatalogItem[]> {
  const listResponse = await fetch(`${API_BASE_URL}/pokemon?limit=150`);
  if (!listResponse.ok) {
    throw new Error('Nao foi possivel carregar o catalogo inicial.');
  }

  const listData = await listResponse.json();
  const results: { name: string; url: string }[] = listData?.results ?? [];

  const details = await Promise.all(
    results.map(async (item) => {
      const response = await fetch(item.url);
      if (!response.ok) return null;

      const data = await response.json();
      const id = String(data?.id ?? '');
      const name = formatPokemonName(data?.name ?? '');
      const typeName = data?.types?.[0]?.type?.name as string | undefined;
      const sprite =
        data?.sprites?.other?.['official-artwork']?.front_default ??
        data?.sprites?.front_default ??
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

      if (!id || !name) return null;

      return {
        id,
        name,
        sprite,
        type: formatPokemonType(typeName),
      };
    }),
  );

  return details.filter((item): item is PokemonCatalogItem => Boolean(item));
}

export async function bootstrapInitialCaptures(userId: string, count = 5) {
  const [catalog, capturedBeforeBootstrap] = await Promise.all([
    loadInitialPokemonCatalog(),
    loadCapturedPokemons(userId),
  ]);

  const capturedIds = new Set(capturedBeforeBootstrap.map((pokemon) => pokemon.id));
  const availablePokemons = shufflePokemonCards(catalog).filter((pokemon) => !capturedIds.has(pokemon.id));

  for (const pokemon of availablePokemons.slice(0, count)) {
    await capturePokemon(userId, pokemon);
  }
}
