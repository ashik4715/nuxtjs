<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="column.sortable && emit('sort', column.key)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <span v-if="column.sortable" class="text-gray-400">
                <ChevronUpIcon
                  v-if="sortField === column.key && sortDirection === 'asc'"
                  class="h-4 w-4"
                />
                <ChevronDownIcon
                  v-else-if="sortField === column.key && sortDirection === 'desc'"
                  class="h-4 w-4"
                />
                <ChevronUpDownIcon v-else class="h-4 w-4 opacity-50" />
              </span>
            </div>
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="row in data" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
          >
            <!-- Checkbox type -->
            <template v-if="column.type === 'checkbox'">
              <input
                type="checkbox"
                :checked="row[column.key]"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                @change="emit('toggle-applied', row.id)"
              />
            </template>

            <!-- Badge type -->
            <template v-else-if="column.type === 'badge'">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getBadgeClass(row[column.key]),
                ]"
              >
                {{ row[column.key] || 'N/A' }}
              </span>
            </template>

            <!-- Link type -->
            <template v-else-if="column.type === 'link'">
              <a
                v-if="row[column.key]"
                :href="row[column.key]"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                {{ truncateUrl(row[column.key]) }}
              </a>
              <span v-else class="text-gray-400">N/A</span>
            </template>

            <!-- Date type -->
            <template v-else-if="column.type === 'date'">
              <span v-if="row[column.key]">
                {{ formatDate(row[column.key]) }}
              </span>
              <span v-else class="text-gray-400">N/A</span>
            </template>

            <!-- Currency type -->
            <template v-else-if="column.type === 'currency'">
              <span v-if="row[column.key]">
                {{ formatCurrency(row[column.key]) }}
              </span>
              <span v-else class="text-gray-400">N/A</span>
            </template>

            <!-- Default text type -->
            <template v-else>
              {{ row[column.key] || 'N/A' }}
            </template>
          </td>

          <td class="px-4 py-3 text-sm whitespace-nowrap">
            <div class="flex items-center space-x-2">
              <button
                class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                title="Ask AI about this"
                @click="emit('ask-ai', row)"
              >
                <ChatBubbleLeftIcon class="h-4 w-4" />
              </button>
              <button
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                @click="emit('edit', row)"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                @click="emit('delete', row)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="data.length === 0">
          <td
            :colspan="columns.length + 1"
            class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            No records found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'checkbox' | 'link' | 'date' | 'currency';
}

interface TrackerRow {
  [key: string]: string | number | boolean | null | undefined;
  id: string;
}

interface Props {
  columns: Column[];
  data: TrackerRow[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

withDefaults(defineProps<Props>(), {
  sortField: '',
  sortDirection: 'asc',
});

const emit = defineEmits<{
  sort: [field: string];
  edit: [row: TrackerRow];
  delete: [row: TrackerRow];
  'toggle-applied': [id: string];
  'ask-ai': [row: TrackerRow];
}>();

const getBadgeClass = (value: string): string => {
  const classes: Record<string, string> = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Applied: 'bg-green-100 text-green-800',
    Accepted: 'bg-emerald-100 text-emerald-800',
    Rejected: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
  };
  return classes[value] || 'bg-gray-100 text-gray-800';
};

const truncateUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
  } catch {
    return url.length > 40 ? url.substring(0, 40) + '...' : url;
  }
};

const formatDate = (date: string): string => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return date;
  }
};

const formatCurrency = (value: string | number): string => {
  if (!value) return 'N/A';
  const num = typeof value === 'string' ? Number.parseFloat(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(num);
};
</script>
