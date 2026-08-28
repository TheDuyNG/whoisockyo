import type { ApiFailure, ApiSuccess } from '@whoisockyo/shared';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '/api';

export class ApiClientError extends Error {
  public constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function parseError(response: Response): Promise<ApiClientError> {
  try {
    const payload = (await response.json()) as ApiFailure;

    if (!payload.success) {
      return new ApiClientError(
        response.status,
        payload.error.code,
        payload.error.message,
        payload.error.details,
      );
    }
  } catch {
    // The fallback below handles proxy and infrastructure responses that are not JSON.
  }

  return new ApiClientError(
    response.status,
    'REQUEST_FAILED',
    'The request could not be completed.',
  );
}

async function executeRequest<T>(
  path: string,
  options: RequestInit,
  canRefreshSession: boolean,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (
    response.status === 401 &&
    canRefreshSession &&
    path !== '/auth/login' &&
    path !== '/auth/refresh'
  ) {
    const refreshResponse = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      return executeRequest<T>(path, options, false);
    }
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as ApiSuccess<T>;
  return payload.data;
}

export function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  return executeRequest<T>(path, options, true);
}

export function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}
