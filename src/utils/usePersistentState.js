import { useState, useEffect, useRef } from 'react';

/**
 * Persistent state hook that keeps UI state across route navigation.
 *
 * - Uses sessionStorage by default (per-browser-tab, cleared on full close).
 * - Falls back to in-memory state if storage is unavailable.
 * - Avoids JSON parse errors breaking the app.
 */
export function usePersistentState(key, defaultValue, options = {}) {
  const storageType = options.storage || 'session'; // 'session' | 'local'
  const storageRef = useRef(null);

  if (storageRef.current === null) {
    try {
      storageRef.current =
        storageType === 'local' && typeof window !== 'undefined'
          ? window.localStorage
          : typeof window !== 'undefined'
          ? window.sessionStorage
          : null;
    } catch {
      storageRef.current = null;
    }
  }

  const getInitialValue = () => {
    const storage = storageRef.current;
    if (!storage) return typeof defaultValue === 'function' ? defaultValue() : defaultValue;

    try {
      const stored = storage.getItem(key);
      if (stored == null) {
        return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      }
      return JSON.parse(stored);
    } catch {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  };

  const [value, setValue] = useState(getInitialValue);

  useEffect(() => {
    const storage = storageRef.current;
    if (!storage) return;

    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write errors (quota, privacy, etc.)
    }
  }, [key, value]);

  return [value, setValue];
}



