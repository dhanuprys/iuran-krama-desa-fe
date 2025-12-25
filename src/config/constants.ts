export const Constants = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  ROLES: {
    ADMIN: 'admin',
    KRAMA: 'krama',
    OPERATOR: 'operator',
  },
  DEFAULT_THEME: 'light',
  LS_KEYS: {
    THEME: '7450f6e3ecc3e245414b',
    AUTH_TOKEN: 'cce789bbff71c422b922',
    RESIDENT_CONTEXT: '5f2fc1ec282f4addc828',
  },
  //           major.minor.patch
  APP_VERSION: '0.2.2-beta',
};
