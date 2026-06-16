/**
 * Cliente gerado manualmente a partir de Pokemon_API.postman_collection.json
 * Fornece funções para os endpoints descritos na coleção Postman anexada.
 */

const BASE = 'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon';

async function doFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  const txt = await res.text();
  let json: any = null;
  try {
    json = txt ? JSON.parse(txt) : null;
  } catch {}
  if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  return json;
}

export async function postRegister(username: string, password: string) {
  return doFetch('/auth/v1/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function postLogin(username: string, password: string) {
  return doFetch('/auth/v1/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function getStats(userId: string) {
  return doFetch(`/auth/v1/stats/${encodeURIComponent(userId)}`);
}

export async function putStats(userId: string, payload: any) {
  return doFetch(`/auth/v1/stats/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getTeam(userId: string) {
  return doFetch(`/pokemon/v1/team?user-id=${encodeURIComponent(userId)}`);
}

export async function putTeam(userId: string, removedPokemon?: string, newPokemon?: string) {
  const params = new URLSearchParams();
  params.set('user-id', userId);
  if (removedPokemon) params.set('removed-pokemon', removedPokemon);
  if (newPokemon) params.set('new-pokemon', newPokemon);
  return doFetch(`/pokemon/v1/team?${params.toString()}`, { method: 'PUT' });
}

export async function putCaptured(userId: string, pokemonId: string) {
  const params = new URLSearchParams();
  params.set('user-id', userId);
  params.set('pokemon-id', pokemonId);
  return doFetch(`/pokemon/v1/captured?${params.toString()}`, { method: 'PUT' });
}

export async function deleteCaptured(userId: string, pokemonId: string) {
  const params = new URLSearchParams();
  params.set('user-id', userId);
  params.set('pokemon-id', pokemonId);
  return doFetch(`/pokemon/v1/captured?${params.toString()}`, { method: 'DELETE' });
}

export default {
  postRegister,
  postLogin,
  getStats,
  putStats,
  getTeam,
  putTeam,
  putCaptured,
  deleteCaptured,
};
