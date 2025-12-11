import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_APP_KEY || 'default-fallback-secret-key-please-change';
const ENCRYPTION_PREFIX = 'soifw23w';

export const SecureStorage = {
  setItem: (key: string, value: string) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      // Add a prefix to clearly identify encrypted values
      localStorage.setItem(key, ENCRYPTION_PREFIX + encrypted);
    } catch (e) {
      console.error('SecureStorage: Encryption failed', e);
      // Fallback to storing raw value if encryption fails
      localStorage.setItem(key, value);
    }
  },

  getItem: (key: string): string | null => {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;

    // Check for our specific prefix
    if (storedValue.startsWith(ENCRYPTION_PREFIX)) {
      try {
        const ciphertext = storedValue.substring(ENCRYPTION_PREFIX.length);

        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (!originalText) {
          console.warn('SecureStorage: Decryption resulted in empty string.');
          // If decryption fails to produce logical text, it might mean the key changed or data is corrupt.
          // In this case, returning null (logged out) is safer than returning garbage.
          return null;
        }

        return originalText;
      } catch (e) {
        console.error('SecureStorage: Decryption error', e);
        return null;
      }
    }

    // FALLBACK: If valid value DOES NOT start with prefix, it's a legacy (raw) token.
    // Return it as-is to maintain backward compatibility.
    return storedValue;
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },
};
