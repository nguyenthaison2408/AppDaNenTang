import AsyncStorageNative from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage-compatible persistence service powered by @react-native-async-storage/async-storage
 * with web localStorage graceful fallback.
 */
export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

export const AsyncStorage: StorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (AsyncStorageNative && typeof AsyncStorageNative.getItem === 'function') {
        return await AsyncStorageNative.getItem(key);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (AsyncStorageNative && typeof AsyncStorageNative.setItem === 'function') {
        await AsyncStorageNative.setItem(key, value);
        return;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (AsyncStorageNative && typeof AsyncStorageNative.removeItem === 'function') {
        await AsyncStorageNative.removeItem(key);
        return;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    }
  },
};
