const CAPTURED_BASE_URL =
  'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/pokemon/v1/captured';
const TEAM_BASE_URL =
  'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/pokemon/v1/team';

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

type ApiCapturedPokemon = {
  id?: number | string;
  index?: number | string;
  name?: string;
  image?: string;
  sprite?: string;
  types?: unknown;
  type?: unknown;
  capturedAt?: number | string;
};

type ApiCapturedResponse = {
  capture?: unknown;
  team?: unknown;
  captured?: unknown;
  data?: unknown;
  pokemons?: unknown;
};

export type CapturedPokemon = {
  id: string;
  name: string;
  sprite: string;
  type: string;
  capturedAt: number;
};

export type CapturedPokemonInput = Omit<CapturedPokemon, 'capturedAt'>;

export const MAX_CAPTURED_POKEMON = 25;

const capturedPokemonCache = new Map<string, CapturedPokemon[]>();

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

function toPokemonId(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return null;
}

function extractTypeName(entry: ApiCapturedPokemon) {
  if (Array.isArray(entry.types) && entry.types.length > 0) {
    const first = entry.types[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && 'type' in first) {
      const nested = (first as { type?: { name?: string } }).type?.name;
      if (nested) return nested;
    }
  }

  if (typeof entry.type === 'string') {
    return entry.type;
  }

  return 'normal';
}

function extractCapturedEntries(payload: unknown): ApiCapturedPokemon[] {
  if (Array.isArray(payload)) {
    return payload as ApiCapturedPokemon[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const typedPayload = payload as ApiCapturedResponse;
  const possibleCollections = [
    typedPayload.capture,
    typedPayload.team,
    typedPayload.captured,
    typedPayload.data,
    typedPayload.pokemons,
  ];

  for (const collection of possibleCollections) {
    if (Array.isArray(collection)) {
      return collection as ApiCapturedPokemon[];
    }
  }

  return [];
}

function normalizeCapturedPokemon(entry: ApiCapturedPokemon): CapturedPokemon | null {
  const id = toPokemonId(entry.id ?? entry.index);
  const rawName = typeof entry.name === 'string' ? entry.name : null;
  const sprite =
    typeof entry.sprite === 'string'
      ? entry.sprite
      : typeof entry.image === 'string'
        ? entry.image
        : null;

  if (!id || !rawName || !sprite) {
    return null;
  }

  return {
    id,
    name: formatPokemonName(rawName),
    sprite,
    type: formatPokemonType(extractTypeName(entry)),
    capturedAt: typeof entry.capturedAt === 'number' ? entry.capturedAt : Date.now(),
  };
}

function normalizeCapturedResponse(payload: unknown) {
  return extractCapturedEntries(payload)
    .map(normalizeCapturedPokemon)
    .filter((pokemon): pokemon is CapturedPokemon => Boolean(pokemon));
}

async function parseResponse(response: Response) {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

async function requestCapture(method: 'PUT' | 'DELETE', userId: string, pokemonId: string) {
  const response = await fetch(
    `${CAPTURED_BASE_URL}?user-id=${encodeURIComponent(userId)}&pokemon-id=${encodeURIComponent(pokemonId)}`,
    {
      method,
      headers: {
        Accept: 'application/json',
      },
    },
  );

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message?: unknown }).message)
        : `Falha na requisicao (${response.status})`;

    throw new Error(message);
  }

  return payload;
}

async function requestCapturedPokemons(userId: string) {
  const response = await fetch(`${TEAM_BASE_URL}?user-id=${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 404) {
      return capturedPokemonCache.get(userId) ?? [];
    }

    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message?: unknown }).message)
        : `Falha na requisicao (${response.status})`;

    throw new Error(message);
  }

  return normalizeCapturedResponse(payload);
}

export async function loadCapturedPokemons(userId: string) {
  const capturedPokemons = await requestCapturedPokemons(userId);

  capturedPokemonCache.set(userId, capturedPokemons);

  return capturedPokemons;
}

export async function isPokemonCaptured(userId: string, pokemonId: string) {
  const capturedPokemons = await loadCapturedPokemons(userId);
  return capturedPokemons.some((pokemon) => pokemon.id === pokemonId);
}

export async function capturePokemon(userId: string, pokemon: CapturedPokemonInput) {
  const currentCapturedPokemons = await loadCapturedPokemons(userId);

  if (currentCapturedPokemons.length >= MAX_CAPTURED_POKEMON) {
    throw new Error(`Voce ja atingiu o limite de ${MAX_CAPTURED_POKEMON} pokemon capturados.`);
  }

  const payload = await requestCapture('PUT', userId, pokemon.id);
  const capturedPokemons = normalizeCapturedResponse(payload);

  capturedPokemonCache.set(userId, capturedPokemons);

  return capturedPokemons;
}

export async function removeCapturedPokemon(userId: string, pokemonId: string) {
  const payload = await requestCapture('DELETE', userId, pokemonId);
  const capturedPokemons = normalizeCapturedResponse(payload);

  capturedPokemonCache.set(userId, capturedPokemons);

  return capturedPokemons;
}
