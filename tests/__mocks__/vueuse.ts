import { ref } from 'vue';

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const storedValue = ref(defaultValue);
  return storedValue;
};

export const useDebounceFn = <T extends (...args: unknown[]) => unknown>(fn: T, _delay: number) => {
  return fn;
};
