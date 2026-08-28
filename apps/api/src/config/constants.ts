export const ACCESS_TOKEN_COOKIE = 'whoisockyo_access';
export const REFRESH_TOKEN_COOKIE = 'whoisockyo_refresh';
export const PRIMARY_RECORD_KEY = 'primary';

export const ERROR_CODES = {
  conflict: 'RESOURCE_CONFLICT',
  contactDisabled: 'CONTACT_FORM_DISABLED',
  internal: 'INTERNAL_SERVER_ERROR',
  invalidCredentials: 'INVALID_CREDENTIALS',
  notFound: 'RESOURCE_NOT_FOUND',
  rateLimit: 'RATE_LIMIT_EXCEEDED',
  tokenExpired: 'TOKEN_EXPIRED',
  unauthorized: 'UNAUTHORIZED',
  validation: 'VALIDATION_ERROR',
} as const;
