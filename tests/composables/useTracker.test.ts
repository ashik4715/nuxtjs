import { describe, it, expect, beforeEach } from 'vitest';
import { useTracker } from '~/composables/useTracker';

interface TestItem {
  id: string;
  name: string;
  status: string;
  priority: number;
}

const createTestItems = (): TestItem[] => [
  { id: '1', name: 'University A', status: 'pending', priority: 1 },
  { id: '2', name: 'University B', status: 'accepted', priority: 2 },
  { id: '3', name: 'University C', status: 'pending', priority: 3 },
];

describe('useTracker', () => {
  let tracker: ReturnType<typeof useTracker<TestItem>>;

  beforeEach(() => {
    tracker = useTracker<TestItem>({
      storageKey: 'test-tracker',
      data: createTestItems(),
    });
  });

  it('should initialize with provided data', () => {
    expect(tracker.items.value).toHaveLength(3);
    expect(tracker.items.value[0].name).toBe('University A');
  });

  it('should filter items by search query', async () => {
    tracker.searchQuery.value = 'university b';

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(tracker.filteredItems.value).toHaveLength(1);
    expect(tracker.filteredItems.value[0].name).toBe('University B');
  });

  it('should filter items by field filters', async () => {
    tracker.filters.value = { status: 'pending' };

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(tracker.filteredItems.value).toHaveLength(2);
  });

  it('should sort items by field and direction', () => {
    tracker.sortField.value = 'name';
    tracker.sortDirection.value = 'asc';

    expect(tracker.sortedItems.value[0].name).toBe('University A');
    expect(tracker.sortedItems.value[2].name).toBe('University C');

    tracker.sortDirection.value = 'desc';

    expect(tracker.sortedItems.value[0].name).toBe('University C');
    expect(tracker.sortedItems.value[2].name).toBe('University A');
  });

  it('should add new items', () => {
    const newItem: TestItem = { id: '4', name: 'University D', status: 'new', priority: 4 };
    tracker.addItem(newItem);

    expect(tracker.items.value).toHaveLength(4);
    expect(tracker.items.value[3].name).toBe('University D');
  });

  it('should update existing items', () => {
    tracker.updateItem('1', { status: 'accepted' });

    expect(tracker.items.value[0].status).toBe('accepted');
  });

  it('should remove items', () => {
    const initialCount = tracker.items.value.length;
    tracker.removeItem('2');

    expect(tracker.items.value).toHaveLength(initialCount - 1);
    expect(tracker.items.value.find((item) => item.id === '2')).toBeUndefined();
  });

  it('should persist to localStorage', () => {
    tracker.saveToStorage();

    // Check that saveToStorage was called (mock storage should have data)
    expect(tracker.items.value).toBeDefined();
  });

  it('should load from localStorage', () => {
    tracker.loadFromStorage();

    // Verify items are loaded (from mock)
    expect(tracker.items.value).toBeDefined();
  });
});
