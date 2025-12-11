export const Constants = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  ROLES: {
    ADMIN: 'admin',
    KRAMA: 'krama',
    OPERATOR: 'operator',
  },
  DEFAULT_THEME: 'light',
  LS_KEYS: {
    THEME: 'ui-theme',
    AUTH_TOKEN: 'token',
    RESIDENT_CONTEXT: 'resident_context',
  },
};
