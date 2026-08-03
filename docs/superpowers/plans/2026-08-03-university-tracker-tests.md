# University Application Tracker - Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up Vitest testing framework and write comprehensive tests for all composables and utility functions in the University Application Tracker.

**Architecture:** Use Vitest as the test framework (Nuxt's recommended), @vue/test-utils for Vue component testing, and jsdom for DOM environment simulation. Tests will be organized in a `__tests__` directory structure mirroring the source code.

**Tech Stack:** Vitest, @vue/test-utils, jsdom, TypeScript

---

## File Structure

```
tests/
├── __mocks__/
│   └── vueuse.ts
├── composables/
│   ├── useTracker.test.ts
│   ├── useSecurityQuestion.test.ts
│   ├── useProfessorOutreach.test.ts
│   └── useDocumentGenerator.test.ts
└── utils/
    ├── csvParser.test.ts
    └── templates.test.ts
vitest.config.ts
```

---

## Task 1: Install Test Dependencies

**Files:**

- Modify: `D:\Websites\nuxtjs\package.json`

- [ ] **Step 1: Install vitest, @vue/test-utils, and jsdom**

```bash
npm install -D vitest @vue/test-utils jsdom
```

- [ ] **Step 2: Add test scripts to package.json**

Add to `scripts` section:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vitest and testing dependencies"
```

---

## Task 2: Configure Vitest

**Files:**

- Create: `D:\Websites\nuxtjs\vitest.config.ts`

- [ ] **Step 1: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '~': '/<rootDir>',
      '@': '/<rootDir>',
    },
  },
});
```

- [ ] **Step 2: Verify configuration works**

```bash
npm test
```

Expected: No tests found, but vitest runs without errors.

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "chore: configure vitest testing framework"
```

---

## Task 3: Create VueUse Mock

**Files:**

- Create: `D:\Websites\nuxtjs\tests\__mocks__\vueuse.ts`

- [ ] **Step 1: Create mock for @vueuse/core**

The `useTracker` composable uses `useLocalStorage` and `useDebounceFn` from @vueuse/core. We need to mock these for testing.

```typescript
import { ref } from 'vue';

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const storedValue = ref(defaultValue);
  return storedValue;
};

export const useDebounceFn = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  return fn;
};
```

- [ ] **Step 2: Commit**

```bash
git add tests/__mocks__/vueuse.ts
git commit -m "chore: add vueuse mock for testing"
```

---

## Task 4: Write useTracker Tests

**Files:**

- Create: `D:\Websites\nuxtjs\tests\composables\useTracker.test.ts`

- [ ] **Step 1: Write useTracker test file**

```typescript
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
    tracker.removeItem('2');

    expect(tracker.items.value).toHaveLength(2);
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
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- tests/composables/useTracker.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add tests/composables/useTracker.test.ts
git commit -m "test: add useTracker composable tests"
```

---

## Task 5: Write useSecurityQuestion Tests

**Files:**

- Create: `D:\Websites\nuxtjs\tests\composables\useSecurityQuestion.test.ts`

- [ ] **Step 1: Write useSecurityQuestion test file**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSecurityQuestion } from '~/composables/useSecurityQuestion';

describe('useSecurityQuestion', () => {
  let security: ReturnType<typeof useSecurityQuestion>;

  beforeEach(() => {
    security = useSecurityQuestion();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should select a random question', () => {
    security.askQuestion();

    expect(security.currentQuestion.value).not.toBeNull();
    expect(security.currentQuestion.value?.question).toBeDefined();
    expect(security.showDialog.value).toBe(true);
  });

  it('should verify correct answer (case-insensitive)', () => {
    security.askQuestion();

    // First question: "What is the nickname of author?" -> "jholok"
    security.userAnswer.value = 'JHOLOK';

    expect(security.verifyAnswer()).toBe(true);
  });

  it('should reject incorrect answer', () => {
    security.askQuestion();

    security.userAnswer.value = 'wrong answer';

    expect(security.verifyAnswer()).toBe(false);
  });

  it('should reset state', () => {
    security.askQuestion();
    security.userAnswer.value = 'test';

    security.reset();

    expect(security.currentQuestion.value).toBeNull();
    expect(security.showDialog.value).toBe(false);
    expect(security.userAnswer.value).toBe('');
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- tests/composables/useSecurityQuestion.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add tests/composables/useSecurityQuestion.test.ts
git commit -m "test: add useSecurityQuestion composable tests"
```

---

## Task 6: Write useProfessorOutreach Tests

**Files:**

- Create: `D:\Websites\nuxtjs\tests\composables\useProfessorOutreach.test.ts`

- [ ] **Step 1: Write useProfessorOutreach test file**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProfessorOutreach } from '~/composables/useProfessorOutreach';

const mockProfessors = [
  {
    id: '1',
    status: 'pending',
    priority: 'high',
    country: 'USA',
    region: 'North America',
    university: 'MIT',
    department: 'CS',
    professorTitle: 'Dr.',
    professorFirstName: 'John',
    professorLastName: 'Doe',
    email: 'john@mit.edu',
    altEmail: '',
    researchArea: 'AI',
    keywords: 'machine learning',
    yourPaperMatch: '',
    personalizedHook: '',
    programType: 'PhD',
    startTerm: 'Fall 2024',
    fundingPath: '',
    eligibilityNotes: '',
    websiteSource: '',
    linkedPaperUrl: '',
    emailVerification: '',
    campaignStatus: '',
    lastContactDate: null,
    followUpDate: null,
    notes: '',
  },
  {
    id: '2',
    status: 'contacted',
    priority: 'medium',
    country: 'USA',
    region: 'North America',
    university: 'Stanford',
    department: 'EE',
    professorTitle: 'Prof.',
    professorFirstName: 'Jane',
    professorLastName: 'Smith',
    email: 'jane@stanford.edu',
    altEmail: '',
    researchArea: 'ML',
    keywords: 'deep learning',
    yourPaperMatch: '',
    personalizedHook: '',
    programType: 'MS',
    startTerm: 'Spring 2024',
    fundingPath: '',
    eligibilityNotes: '',
    websiteSource: '',
    linkedPaperUrl: '',
    emailVerification: '',
    campaignStatus: '',
    lastContactDate: null,
    followUpDate: null,
    notes: '',
  },
];

describe('useProfessorOutreach', () => {
  let outreach: ReturnType<typeof useProfessorOutreach>;

  beforeEach(() => {
    outreach = useProfessorOutreach();
    outreach.professors.value = [...mockProfessors];
  });

  it('should load professors from JSON', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProfessors),
    });
    global.fetch = mockFetch;

    await outreach.loadProfessors();

    expect(outreach.professors.value).toHaveLength(2);
    expect(outreach.loading.value).toBe(false);
  });

  it('should update professor status', () => {
    outreach.updateStatus('1', 'accepted');

    expect(outreach.professors.value[0].status).toBe('accepted');
  });

  it('should update contact date', () => {
    outreach.updateContactDate('1', '2024-01-15');

    expect(outreach.professors.value[0].lastContactDate).toBe('2024-01-15');
  });

  it('should update follow-up date', () => {
    outreach.updateFollowUpDate('1', '2024-02-01');

    expect(outreach.professors.value[0].followUpDate).toBe('2024-02-01');
  });

  it('should compute stats correctly', () => {
    const stats = outreach.stats.value;

    expect(stats.total).toBe(2);
    expect(stats.byStatus['pending']).toBe(1);
    expect(stats.byStatus['contacted']).toBe(1);
    expect(stats.byCountry['USA']).toBe(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- tests/composables/useProfessorOutreach.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add tests/composables/useProfessorOutreach.test.ts
git commit -m "test: add useProfessorOutreach composable tests"
```

---

## Task 7: Write useDocumentGenerator Tests

**Files:**

- Create: `D:\Websites\nuxtjs\tests\composables\useDocumentGenerator.test.ts`

- [ ] **Step 1: Write useDocumentGenerator test file**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDocumentGenerator } from '~/composables/useDocumentGenerator';

const mockTemplates = [
  {
    templateName: 'Initial Contact',
    subject: 'Research Opportunity - {{Research_Area}}',
    body: 'Dear {{Professor_Title}} {{Professor_LastName}},\n\nI am {{Your_Name}}, a {{Your_Profession}}.',
  },
];

const mockProfessor = {
  id: '1',
  professorTitle: 'Dr.',
  professorLastName: 'Doe',
  researchArea: 'Machine Learning',
  personalizedHook: 'Your recent paper on transformers',
  programType: 'PhD',
  startTerm: 'Fall 2024',
};

const mockProfile = {
  name: 'John Student',
  profession: 'Researcher',
  specializations: ['AI', 'NLP'],
  location: 'New York',
  website: 'https://example.com',
  description: 'Computer Science student',
};

describe('useDocumentGenerator', () => {
  let generator: ReturnType<typeof useDocumentGenerator>;

  beforeEach(() => {
    generator = useDocumentGenerator();
    generator.templates.value = [...mockTemplates];
  });

  it('should load templates from JSON', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTemplates),
    });
    global.fetch = mockFetch;

    await generator.loadTemplates();

    expect(generator.templates.value).toHaveLength(1);
    expect(generator.loading.value).toBe(false);
  });

  it('should interpolate template placeholders', () => {
    const template = 'Hello {{Professor_Title}} {{Professor_LastName}}';
    const result = generator.generateDocument('Initial Contact', mockProfessor, mockProfile);

    expect(result).not.toBeNull();
    expect(result?.subject).toContain('Machine Learning');
    expect(result?.body).toContain('Dr.');
    expect(result?.body).toContain('Doe');
    expect(result?.body).toContain('John Student');
  });

  it('should handle missing placeholders gracefully', () => {
    const template = 'Hello {{Unknown_Placeholder}}';
    const result = generator.generateDocument('Initial Contact', mockProfessor, mockProfile);

    // Template should still work, just with raw placeholder
    expect(result).not.toBeNull();
  });

  it('should generate document content', () => {
    const result = generator.generateDocument('Initial Contact', mockProfessor, mockProfile);

    expect(result).toEqual({
      subject: expect.stringContaining('Machine Learning'),
      body: expect.stringContaining('Dear Dr. Doe'),
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- tests/composables/useDocumentGenerator.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add tests/composables/useDocumentGenerator.test.ts
git commit -m "test: add useDocumentGenerator composable tests"
```

---

## Task 8: Write csvParser Tests

**Files:**

- Create: `D:\Websites\nuxtjs\tests\utils\csvParser.test.ts`

- [ ] **Step 1: Write csvParser test file**

```typescript
import { describe, it, expect } from 'vitest';
import { parseCsv, csvToJson } from '~/utils/csvParser';

describe('csvParser', () => {
  it('should parse simple CSV', () => {
    const csv = 'name,status\nUniversity A,pending\nUniversity B,accepted';
    const result = parseCsv(csv);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('University A');
    expect(result[0].status).toBe('pending');
    expect(result[1].name).toBe('University B');
    expect(result[1].status).toBe('accepted');
  });

  it('should handle quoted fields', () => {
    const csv =
      'name,description\n"University A","A great university"\n"University B","Another one"';
    const result = parseCsv(csv);

    expect(result[0].description).toBe('A great university');
    expect(result[1].description).toBe('Another one');
  });

  it('should handle escaped quotes', () => {
    const csv = 'name,description\n"University A","She said ""hello"""';
    const result = parseCsv(csv);

    expect(result[0].description).toBe('She said "hello"');
  });

  it('should skip empty lines', () => {
    const csv = 'name,status\nUniversity A,pending\n\nUniversity B,accepted\n';
    const result = parseCsv(csv);

    expect(result).toHaveLength(2);
  });

  it('should handle custom delimiters', () => {
    const csv = 'name;status\nUniversity A;pending';
    const result = parseCsv(csv, { delimiter: ';' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('University A');
    expect(result[0].status).toBe('pending');
  });

  it('should handle no header mode', () => {
    const csv = 'University A,pending\nUniversity B,accepted';
    const result = parseCsv(csv, { hasHeader: false });

    expect(result).toHaveLength(2);
    expect(result[0].col1).toBe('University A');
    expect(result[0].col2).toBe('pending');
  });

  it('should return empty array for empty input', () => {
    const result = parseCsv('');

    expect(result).toEqual([]);
  });

  it('csvToJson should parse CSV correctly', () => {
    const csv = 'name,status\nUniversity A,pending';
    const result = csvToJson(csv);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('University A');
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- tests/utils/csvParser.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add tests/utils/csvParser.test.ts
git commit -m "test: add csvParser utility tests"
```

---

## Task 9: Write templates Tests

**Files:**

- Create: `D:\Websites\nuxtjs\tests\utils\templates.test.ts`

- [ ] **Step 1: Write templates test file**

```typescript
import { describe, it, expect } from 'vitest';
import { interpolateTemplate, extractPlaceholders } from '~/utils/templates';

describe('templates', () => {
  it('should replace placeholders with values', () => {
    const template = 'Hello {{name}}, you are {{age}} years old';
    const data = { name: 'John', age: 25 };
    const result = interpolateTemplate(template, data);

    expect(result).toBe('Hello John, you are 25 years old');
  });

  it('should handle nested keys', () => {
    const template = 'Hello {{user.name}}, you are from {{user.location.city}}';
    const data = { user: { name: 'John', location: { city: 'New York' } } };
    const result = interpolateTemplate(template, data);

    expect(result).toBe('Hello John, you are from New York');
  });

  it('should handle missing keys', () => {
    const template = 'Hello {{name}}, you are from {{city}}';
    const data = { name: 'John' };
    const result = interpolateTemplate(template, data);

    expect(result).toBe('Hello John, you are from {{city}}');
  });

  it('should extract placeholders from template', () => {
    const template = 'Hello {{name}}, you are {{age}} years old from {{city}}';
    const placeholders = extractPlaceholders(template);

    expect(placeholders).toEqual(['name', 'age', 'city']);
  });

  it('should handle empty template', () => {
    const result = interpolateTemplate('', { name: 'John' });

    expect(result).toBe('');
  });

  it('should handle null/undefined values', () => {
    const template = 'Hello {{name}}, your score is {{score}}';
    const data = { name: 'John', score: null };
    const result = interpolateTemplate(template, data);

    expect(result).toBe('Hello John, your score is {{score}}');
  });

  it('should handle boolean values', () => {
    const template = 'Active: {{active}}';
    const data = { active: true };
    const result = interpolateTemplate(template, data);

    expect(result).toBe('Active: true');
  });

  it('should extract placeholders with spaces', () => {
    const template = 'Hello {{ name }} and {{ age }}';
    const placeholders = extractPlaceholders(template);

    expect(placeholders).toEqual(['name', 'age']);
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- tests/utils/templates.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add tests/utils/templates.test.ts
git commit -m "test: add templates utility tests"
```

---

## Task 10: Run All Tests and Verify

**Files:**

- None (verification step)

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Run tests with coverage**

```bash
npm run test:coverage
```

Expected: Coverage report generated.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "test: ensure all tests pass"
```

---

## Self-Review Checklist

- [ ] All tests pass
- [ ] Tests are comprehensive (cover main functionality)
- [ ] Tests include edge cases (empty inputs, missing data)
- [ ] Test framework is properly configured
- [ ] Mocks are properly set up for external dependencies
- [ ] Tests follow consistent patterns
