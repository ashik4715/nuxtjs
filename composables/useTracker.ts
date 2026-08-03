import { ref, computed, watch, type Ref } from 'vue';
import { useLocalStorage, useDebounceFn } from '@vueuse/core';

interface TrackerOptions<T> {
  storageKey: string;
  data: T[];
  defaultSort?: keyof T & string;
  defaultDirection?: 'asc' | 'desc';
}

export function useTracker<T extends { id: string }>(options: TrackerOptions<T>) {
  const storage = useLocalStorage<T[]>(options.storageKey, options.data);
  const items = ref<T[]>(storage.value) as Ref<T[]>;
  const searchQuery = ref('');
  const sortField = ref<keyof T & string>(options.defaultSort || ('' as keyof T & string));
  const sortDirection = ref<'asc' | 'desc'>(options.defaultDirection || 'asc');
  const filters = ref<Record<string, string>>({});

  const debouncedSearchQuery = ref('');
  const debouncedFilters = ref<Record<string, string>>({});

  const updateSearch = useDebounceFn((value: string) => {
    debouncedSearchQuery.value = value;
  }, 300);

  const updateFilter = useDebounceFn((key: string, value: string) => {
    debouncedFilters.value = { ...debouncedFilters.value, [key]: value };
  }, 300);

  watch(searchQuery, (val) => updateSearch(val));
  watch(
    filters,
    (val) => {
      Object.entries(val).forEach(([key, value]) => updateFilter(key, value));
    },
    { deep: true }
  );

  const filteredItems = computed(() => {
    let result = items.value;

    if (debouncedSearchQuery.value) {
      const query = debouncedSearchQuery.value.toLowerCase();
      result = result.filter((item) => {
        return Object.values(item).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          return false;
        });
      });
    }

    Object.entries(debouncedFilters.value).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => {
          const itemValue = item[key as keyof T];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          return false;
        });
      }
    });

    return result;
  });

  const sortedItems = computed(() => {
    if (!sortField.value) return filteredItems.value;

    return [...filteredItems.value].sort((a, b) => {
      const aVal = a[sortField.value];
      const bVal = b[sortField.value];

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }

      return sortDirection.value === 'asc' ? comparison : -comparison;
    });
  });

  const addItem = (item: T) => {
    items.value.push(item);
  };

  const updateItem = (id: string, updates: Partial<T>) => {
    const index = items.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates };
    }
  };

  const removeItem = (id: string) => {
    items.value = items.value.filter((item) => item.id !== id);
  };

  const loadFromStorage = () => {
    items.value = storage.value;
  };

  const saveToStorage = () => {
    storage.value = items.value;
  };

  watch(
    items,
    () => {
      saveToStorage();
    },
    { deep: true }
  );

  return {
    items,
    searchQuery,
    sortField,
    sortDirection,
    filters,
    filteredItems,
    sortedItems,
    addItem,
    updateItem,
    removeItem,
    loadFromStorage,
    saveToStorage,
  };
}
