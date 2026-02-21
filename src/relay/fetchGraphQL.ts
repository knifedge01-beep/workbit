import type { GraphQLResponseWithData } from 'relay-runtime';
import { getAccessToken } from '../pages/auth/supabaseClient';

const GRAPHQL_URL =
  typeof import.meta.env.VITE_GRAPHQL_URL === 'string' && import.meta.env.VITE_GRAPHQL_URL
    ? import.meta.env.VITE_GRAPHQL_URL
    : '/graphql';

export async function fetchGraphQL(
  text: string,
  variables: Record<string, unknown>,
  headers?: HeadersInit
): Promise<GraphQLResponseWithData> {
  const token = await getAccessToken();
  const authHeaders: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: JSON.stringify({ query: text, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: unknown; errors?: Array<{ message?: string }> };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).filter(Boolean).join('; '));
  }
  return {
    data: (json.data ?? {}) as Record<string, unknown>,
    errors: json.errors?.map((e) => ({ message: e.message ?? 'Unknown error' })),
  };
}
