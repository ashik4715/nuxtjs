<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mt-5 pt-5">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          University Application Tracker & Outreach
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Search, filter, sort, personalize programs and track professor outreach
        </p>
        <div class="mt-4 flex items-center space-x-2">
          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              storageAvailable
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            ]"
          >
            <span
              :class="[
                'mr-2 h-2 w-2 rounded-full',
                storageAvailable ? 'bg-green-500' : 'bg-yellow-500',
              ]"
            ></span>
            {{ storageAvailable ? 'Browser Saving Active' : 'Guest Mode (Limited)' }}
          </span>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab 1: German Universities -->
      <div v-if="activeTab === 'german'">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Programs</div>
            <div class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {{ germanStats.total }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Free Tuition</div>
            <div class="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
              {{ germanStats.freeTuition }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Applied</div>
            <div class="mt-1 text-3xl font-semibold text-blue-600 dark:text-blue-400">
              {{ germanStats.applied }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">VPD Required</div>
            <div class="mt-1 text-3xl font-semibold text-orange-600 dark:text-orange-400">
              {{ germanStats.vpdRequired }}
            </div>
          </div>
        </div>

        <!-- Search and Actions -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
        >
          <div class="relative flex-1 max-w-md">
            <input
              v-model="germanSearchQuery"
              type="text"
              placeholder="Search German programs..."
              class="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 pl-10 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <MagnifyingGlassIcon
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            />
          </div>
          <div class="flex gap-2">
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="showAddGermanDialog = true"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Program
            </button>
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="exportGermanCSV"
            >
              <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <!-- German Programs Table -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <TrackerTable
            :columns="germanColumns"
            :data="filteredGermanPrograms"
            :sort-field="germanSortField"
            :sort-direction="germanSortDirection"
            @sort="handleGermanSort"
            @edit="openEditGermanDialog"
            @delete="confirmDeleteGerman"
            @toggle-applied="toggleGermanApplied"
          />
        </div>
      </div>

      <!-- Tab 2: Non-German Programs -->
      <div v-if="activeTab === 'non-german'">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Programs</div>
            <div class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {{ nonGermanStats.total }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Fully Funded</div>
            <div class="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
              {{ nonGermanStats.fullyFunded }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Applied</div>
            <div class="mt-1 text-3xl font-semibold text-blue-600 dark:text-blue-400">
              {{ nonGermanStats.applied }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Countries</div>
            <div class="mt-1 text-3xl font-semibold text-purple-600 dark:text-purple-400">
              {{ nonGermanStats.countries }}
            </div>
          </div>
        </div>

        <!-- Search and Actions -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
        >
          <div class="relative flex-1 max-w-md">
            <input
              v-model="nonGermanSearchQuery"
              type="text"
              placeholder="Search non-German programs..."
              class="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 pl-10 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <MagnifyingGlassIcon
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            />
          </div>
          <div class="flex gap-2">
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="showAddNonGermanDialog = true"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Program
            </button>
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="exportNonGermanCSV"
            >
              <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <!-- Non-German Programs Table -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <TrackerTable
            :columns="nonGermanColumns"
            :data="filteredNonGermanPrograms"
            :sort-field="nonGermanSortField"
            :sort-direction="nonGermanSortDirection"
            @sort="handleNonGermanSort"
            @edit="openEditNonGermanDialog"
            @delete="confirmDeleteNonGerman"
            @toggle-applied="toggleNonGermanApplied"
          />
        </div>
      </div>

      <!-- Tab 3: Professor Outreach -->
      <div v-if="activeTab === 'professors'">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Professors</div>
            <div class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {{ professorStats.total }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Contacted</div>
            <div class="mt-1 text-3xl font-semibold text-blue-600 dark:text-blue-400">
              {{ professorStats.contacted }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Response Rate</div>
            <div class="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
              {{ professorStats.responseRate }}%
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending Follow-ups
            </div>
            <div class="mt-1 text-3xl font-semibold text-orange-600 dark:text-orange-400">
              {{ professorStats.pendingFollowUps }}
            </div>
          </div>
        </div>

        <!-- Search and Actions -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
        >
          <div class="relative flex-1 max-w-md">
            <input
              v-model="professorSearchQuery"
              type="text"
              placeholder="Search professors..."
              class="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 pl-10 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <MagnifyingGlassIcon
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            />
          </div>
          <div class="flex gap-2">
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="showAddProfessorDialog = true"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Professor
            </button>
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="exportProfessorCSV"
            >
              <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <!-- Professors Table -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <TrackerTable
            :columns="professorColumns"
            :data="filteredProfessors"
            :sort-field="professorSortField"
            :sort-direction="professorSortDirection"
            @sort="handleProfessorSort"
            @edit="openEditProfessorDialog"
            @delete="confirmDeleteProfessor"
          />
        </div>
      </div>
    </div>

    <!-- German Program Dialog -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showAddGermanDialog || showEditGermanDialog"
          class="fixed inset-0 z-50 overflow-y-auto"
        >
          <div class="flex min-h-full items-center justify-center p-4">
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              @click="closeGermanDialog"
            />
            <div
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-2xl"
            >
              <div class="px-6 py-5">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {{ showAddGermanDialog ? 'Add German Program' : 'Edit German Program' }}
                </h3>
                <form class="space-y-4" @submit.prevent="saveGermanProgram">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >University *</label
                      >
                      <input
                        v-model="germanForm.universityName"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Course Name *</label
                      >
                      <input
                        v-model="germanForm.courseName"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Intake</label
                      >
                      <select
                        v-model="germanForm.intake"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Select intake</option>
                        <option value="Summer">Summer</option>
                        <option value="Winter">Winter</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Application Start Date</label
                      >
                      <input
                        v-model="germanForm.applicationStartDate"
                        type="date"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Application End Date</label
                      >
                      <input
                        v-model="germanForm.applicationEndDate"
                        type="date"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Portal</label
                      >
                      <input
                        v-model="germanForm.applicationPortal"
                        type="text"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >VPD Required</label
                      >
                      <select
                        v-model="germanForm.vpdRequired"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="-">-</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >MOI Accepted</label
                      >
                      <select
                        v-model="germanForm.moiAccepted"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="Not mentioned">Not mentioned</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Tuition Fee (EUR)</label
                      >
                      <input
                        v-model.number="germanForm.tuitionFee"
                        type="number"
                        min="0"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Application Fee (EUR)</label
                      >
                      <input
                        v-model.number="germanForm.applicationFee"
                        type="number"
                        min="0"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Entrance Exam/Interview</label
                      >
                      <input
                        v-model="germanForm.entranceExamInterview"
                        type="text"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="e.g., yes, online viva"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >GRE/GMAT</label
                      >
                      <input
                        v-model="germanForm.greGmat"
                        type="text"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Required score or -"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Restricted</label
                      >
                      <select
                        v-model="germanForm.restricted"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="No-NC">No-NC (Non-restricted)</option>
                        <option value="NC">NC (Numerus Clausus)</option>
                        <option value="Not mentioned">Not mentioned</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Application Link</label
                    >
                    <input
                      v-model="germanForm.applicationLink"
                      type="url"
                      class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="https://"
                    />
                  </div>
                </form>
              </div>
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex flex-row-reverse gap-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  @click="saveGermanProgram"
                >
                  {{ showAddGermanDialog ? 'Add Program' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md bg-white dark:bg-gray-600 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500"
                  @click="closeGermanDialog"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Non-German Program Dialog -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showAddNonGermanDialog || showEditNonGermanDialog"
          class="fixed inset-0 z-50 overflow-y-auto"
        >
          <div class="flex min-h-full items-center justify-center p-4">
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              @click="closeNonGermanDialog"
            />
            <div
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-2xl"
            >
              <div class="px-6 py-5">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {{
                    showAddNonGermanDialog ? 'Add Non-German Program' : 'Edit Non-German Program'
                  }}
                </h3>
                <form class="space-y-4" @submit.prevent="saveNonGermanProgram">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Program *</label
                      >
                      <input
                        v-model="nonGermanForm.program"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >University *</label
                      >
                      <input
                        v-model="nonGermanForm.university"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Country</label
                      >
                      <input
                        v-model="nonGermanForm.country"
                        type="text"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Degree</label
                      >
                      <input
                        v-model="nonGermanForm.degree"
                        type="text"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Scholarship</label
                      >
                      <input
                        v-model="nonGermanForm.scholarship"
                        type="text"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Application Fee</label
                      >
                      <input
                        v-model="nonGermanForm.appFee"
                        type="text"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Deadline</label
                      >
                      <input
                        v-model="nonGermanForm.deadline"
                        type="date"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Status</label
                      >
                      <select
                        v-model="nonGermanForm.status"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Not Applied">Not Applied</option>
                        <option value="Applied">Applied</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Relevancy Score</label
                    >
                    <input
                      v-model="nonGermanForm.relevancyScore"
                      type="text"
                      class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex flex-row-reverse gap-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  @click="saveNonGermanProgram"
                >
                  {{ showAddNonGermanDialog ? 'Add Program' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md bg-white dark:bg-gray-600 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500"
                  @click="closeNonGermanDialog"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Professor Dialog -->
    <ProfessorDialog
      :show="showAddProfessorDialog || showEditProfessorDialog"
      :professor="editingProfessor"
      :mode="showAddProfessorDialog ? 'add' : 'edit'"
      @save="saveProfessor"
      @cancel="closeProfessorDialog"
    />

    <!-- Security Dialog -->
    <SecurityDialog
      :show="showSecurityDialog"
      :question="securityQuestion"
      @verify="handleSecurityVerify"
      @cancel="closeSecurityDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ArrowDownTrayIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useLocalStorage } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import ProfessorDialog from '~/components/ProfessorDialog.vue';
import SecurityDialog from '~/components/SecurityDialog.vue';
import TrackerTable from '~/components/TrackerTable.vue';
import { useSecurityQuestion } from '~/composables/useSecurityQuestion';

// Types
interface GermanProgram {
  id: string;
  universityName: string;
  courseName: string;
  intake: string;
  applicationStartDate: string | null;
  applicationEndDate: string | null;
  applicationPortal: string;
  vpdRequired: string;
  moiAccepted: string;
  tuitionFee: number;
  entranceExamInterview: string;
  greGmat: string;
  applied: boolean;
  qsRanking: string;
  applicationFee: number | null;
  restricted: string;
  applicationLink: string;
}

interface NonGermanProgram {
  id: string;
  program: string;
  university: string;
  country: string;
  degree: string;
  scholarship: string;
  appFee: string;
  deadline: string;
  relevancyScore: string;
  status: string;
}

interface Professor {
  id: string;
  status: string;
  priority: string;
  country: string;
  region: string;
  university: string;
  department: string;
  professorTitle: string;
  professorFirstName: string;
  professorLastName: string;
  email: string;
  altEmail: string;
  researchArea: string;
  keywords: string;
  yourPaperMatch: string;
  personalizedHook: string;
  programType: string;
  startTerm: string;
  fundingPath: string;
  eligibilityNotes: string;
  websiteSource: string;
  linkedPaperUrl: string;
  emailVerification: string;
  campaignStatus: string;
  lastContactDate: string | null;
  followUpDate: string | null;
  notes: string;
}

// Tab state
const activeTab = ref('german');
const tabs = [
  { id: 'german', name: 'German Universities' },
  { id: 'non-german', name: 'Non-German Programs' },
  { id: 'professors', name: 'Professor Outreach' },
];

// Security question composable
const { askQuestion, verifyAnswer, currentQuestion, userAnswer } = useSecurityQuestion();
const showSecurityDialog = ref(false);
const securityQuestion = ref('');
const pendingDeleteAction = ref<(() => void) | null>(null);

// Storage check
const storageAvailable = ref(true);

// German Programs
const germanPrograms = useLocalStorage<GermanProgram[]>('german-programs', []);
const germanSearchQuery = ref('');
const germanSortField = ref('applicationStartDate');
const germanSortDirection = ref<'asc' | 'desc'>('asc');
const showAddGermanDialog = ref(false);
const showEditGermanDialog = ref(false);
const editingGermanProgram = ref<GermanProgram | null>(null);
const germanForm = ref<Partial<GermanProgram>>({});

// Non-German Programs
const nonGermanPrograms = useLocalStorage<NonGermanProgram[]>('non-german-programs', []);
const nonGermanSearchQuery = ref('');
const nonGermanSortField = ref('deadline');
const nonGermanSortDirection = ref<'asc' | 'desc'>('asc');
const showAddNonGermanDialog = ref(false);
const showEditNonGermanDialog = ref(false);
const editingNonGermanProgram = ref<NonGermanProgram | null>(null);
const nonGermanForm = ref<Partial<NonGermanProgram>>({});

// Professors
const professors = useLocalStorage<Professor[]>('professors', []);
const professorSearchQuery = ref('');
const professorSortField = ref('university');
const professorSortDirection = ref<'asc' | 'desc'>('asc');
const showAddProfessorDialog = ref(false);
const showEditProfessorDialog = ref(false);
const editingProfessor = ref<Professor | null>(null);

// Column definitions
const germanColumns = [
  { key: 'universityName', label: 'University', sortable: true },
  { key: 'courseName', label: 'Course', sortable: true },
  { key: 'intake', label: 'Intake', sortable: true },
  { key: 'applicationStartDate', label: 'Start Date', sortable: true, type: 'date' as const },
  { key: 'applicationEndDate', label: 'End Date', sortable: true, type: 'date' as const },
  { key: 'applicationPortal', label: 'Portal', sortable: true },
  { key: 'vpdRequired', label: 'VPD', sortable: true },
  { key: 'moiAccepted', label: 'MOI', sortable: true },
  { key: 'tuitionFee', label: 'Tuition Fee', sortable: true, type: 'currency' as const },
  { key: 'entranceExamInterview', label: 'Exam/Interview', sortable: true },
  { key: 'applicationFee', label: 'App Fee', sortable: true, type: 'currency' as const },
  { key: 'applied', label: 'Applied', sortable: true, type: 'checkbox' as const },
  { key: 'qsRanking', label: 'QS Ranking', sortable: true },
  { key: 'greGmat', label: 'GRE/GMAT', sortable: true },
  { key: 'restricted', label: 'Restricted', sortable: true },
  { key: 'applicationLink', label: 'Link', sortable: false, type: 'link' as const },
];

const nonGermanColumns = [
  { key: 'program', label: 'Program', sortable: true },
  { key: 'university', label: 'University', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'degree', label: 'Degree', sortable: true },
  { key: 'scholarship', label: 'Scholarship', sortable: true },
  { key: 'appFee', label: 'App Fee', sortable: true },
  { key: 'deadline', label: 'Deadline', sortable: true, type: 'date' as const },
  { key: 'relevancyScore', label: 'Relevancy', sortable: true },
  { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
];

const professorColumns = [
  { key: 'professorFirstName', label: 'Professor', sortable: true },
  { key: 'university', label: 'University', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'researchArea', label: 'Research Area', sortable: true },
  { key: 'websiteSource', label: 'Lab URL', sortable: false, type: 'link' as const },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
  { key: 'lastContactDate', label: 'Last Contact', sortable: true, type: 'date' as const },
  { key: 'followUpDate', label: 'Follow-up', sortable: true, type: 'date' as const },
  { key: 'notes', label: 'Notes', sortable: false },
];

// Seed data for German programs
const germanSeedData: GermanProgram[] = [
  {
    id: 'german-001',
    universityName: 'Bauhaus University Weimar',
    courseName: 'M.Sc. Digital Engineering',
    intake: 'Summer',
    applicationStartDate: '2026-10-01',
    applicationEndDate: '2027-01-15',
    applicationPortal: 'Uni-Assist',
    vpdRequired: '-',
    moiAccepted: 'no',
    tuitionFee: 0,
    entranceExamInterview: 'yes, online viva',
    greGmat: '',
    applied: false,
    qsRanking: '-',
    applicationFee: 30,
    restricted: 'No-NC',
    applicationLink:
      'https://www.uni-weimar.de/en/civil-and-environmental-engineering/studies/master-degree-programmes/digital-engineering/',
  },
  {
    id: 'german-002',
    universityName: 'Bauhaus University Weimar',
    courseName: 'M.Sc. Human-Computer Interaction',
    intake: 'Summer',
    applicationStartDate: '2026-10-01',
    applicationEndDate: '2027-01-15',
    applicationPortal: 'Uni-Assist',
    vpdRequired: '-',
    moiAccepted: 'no',
    tuitionFee: 0,
    entranceExamInterview: '-',
    greGmat: '',
    applied: false,
    qsRanking: '-',
    applicationFee: 30,
    restricted: 'No-NC',
    applicationLink: 'https://www.uni-weimar.de/en/media/studies/human-computer-interaction-msc/',
  },
  {
    id: 'german-003',
    universityName: 'Brandenburg University of Technology',
    courseName: 'M.Sc. Artificial Intelligence',
    intake: 'Summer',
    applicationStartDate: '2026-11-01',
    applicationEndDate: '2027-01-15',
    applicationPortal: 'Uni-Assist',
    vpdRequired: '-',
    moiAccepted: 'no',
    tuitionFee: 0,
    entranceExamInterview: '-',
    greGmat: '',
    applied: false,
    qsRanking: '-',
    applicationFee: 30,
    restricted: 'No-NC',
    applicationLink: 'https://www.b-tu.de/en/artificial-intelligence-ms/page',
  },
  {
    id: 'german-004',
    universityName: 'FAU Erlangen-Nürnberg',
    courseName: 'M.Sc. Data Science',
    intake: 'Summer',
    applicationStartDate: null,
    applicationEndDate: '2026-11-30',
    applicationPortal: 'University Portal',
    vpdRequired: '-',
    moiAccepted: 'yes',
    tuitionFee: 4000,
    entranceExamInterview: 'yes, online viva',
    greGmat: '',
    applied: false,
    qsRanking: '218',
    applicationFee: 100,
    restricted: 'No-NC',
    applicationLink: 'https://www.datascience.nat.fau.eu/study/master-data-science-english/',
  },
  {
    id: 'german-005',
    universityName: 'Fulda University of Applied Sciences',
    courseName: 'M.Sc. Global Software Development',
    intake: 'Summer',
    applicationStartDate: '2026-11-01',
    applicationEndDate: '2026-12-01',
    applicationPortal: 'Uni-Assist',
    vpdRequired: '-',
    moiAccepted: 'Not mentioned',
    tuitionFee: 0,
    entranceExamInterview: 'yes, online test',
    greGmat: '',
    applied: false,
    qsRanking: '-',
    applicationFee: 30,
    restricted: 'No-NC',
    applicationLink: 'https://www.hs-fulda.de/en/studyprogramme/global-software-development-msc',
  },
];

// Seed data for non-German programs
const nonGermanSeedData: NonGermanProgram[] = [
  {
    id: 'non-german-001',
    program: 'EMJM in Imaging',
    university: 'Politecnico di Milano / Tampere / Mid Sweden',
    country: 'Italy / Finland / Sweden',
    degree: 'Joint MSc',
    scholarship: 'Full Erasmus Scholarship (1,400 EUR/mo)',
    appFee: '0 EUR',
    deadline: '2027-01-09',
    relevancyScore: 'High (3D Reconstruction, RGB-D Mapping)',
    status: 'Not Applied',
  },
  {
    id: 'non-german-002',
    program: 'IPCVai (Image Processing, Computer Vision & AI)',
    university: 'Univ. of Bordeaux / UAM Spain / PPKE Hungary',
    country: 'France / Spain / Hungary',
    degree: 'Joint MSc',
    scholarship: 'Full Erasmus Scholarship (1,400 EUR/mo)',
    appFee: '0 EUR',
    deadline: '2027-01-15',
    relevancyScore: 'High (OpenCV, Computer Vision, OCR)',
    status: 'Not Applied',
  },
  {
    id: 'non-german-003',
    program: 'EMAI (Erasmus Mundus in AI)',
    university: 'UPF Spain / Radboud Netherlands / Sapienza Italy',
    country: 'Spain / Netherlands / Italy',
    degree: 'Joint MSc',
    scholarship: 'Full Erasmus Scholarship (1,400 EUR/mo)',
    appFee: '0 EUR',
    deadline: '2026-12-20',
    relevancyScore: 'High (Multimodal AI, LLM Integration)',
    status: 'Not Applied',
  },
  {
    id: 'non-german-004',
    program: 'MSc Computer Science (Thesis)',
    university: 'Memorial University of Newfoundland',
    country: 'Canada',
    degree: 'MSc',
    scholarship: 'Min. 20,000 CAD/year funding',
    appFee: '120 CAD',
    deadline: '2026-12-01',
    relevancyScore: 'High (Computer Vision, 3D Sensor Fusion)',
    status: 'Not Applied',
  },
  {
    id: 'non-german-005',
    program: 'MSc Computing Science (Thesis)',
    university: 'University of Alberta',
    country: 'Canada',
    degree: 'MSc',
    scholarship: 'Min. 24,000-28,000 CAD/year funding',
    appFee: '135 CAD',
    deadline: '2027-01-15',
    relevancyScore: 'High (AI, Computer Vision, Medical Imaging)',
    status: 'Not Applied',
  },
];

// Professor seed data
const professorSeedData: Professor[] = [
  {
    id: 'prof-001',
    status: 'Ready',
    priority: 'A',
    country: 'Germany',
    region: 'Europe',
    university: 'TU Munich',
    department: 'Informatics',
    professorTitle: 'Professor',
    professorFirstName: 'Daniel',
    professorLastName: 'Cremers',
    email: 'cremers@tum.de',
    altEmail: '',
    researchArea: '3D Reconstruction, RGB-D, SLAM',
    keywords: 'Computer Vision;3D;Fusion',
    yourPaperMatch: 'Kinect 3D Reconstruction Fusion Mapping (IEEE 2019)',
    personalizedHook: 'Your work on 3D Reconstruction aligns with my publication.',
    programType: 'PhD',
    startTerm: 'Fall 2026',
    fundingPath: 'RA, DAAD',
    eligibilityNotes: 'GPA is flexible with strong research.',
    websiteSource: '',
    linkedPaperUrl: 'https://ieeexplore.ieee.org/abstract/document/8934596/',
    emailVerification: 'VALID',
    campaignStatus: 'SCHEDULED',
    lastContactDate: null,
    followUpDate: null,
    notes: 'Top choice',
  },
  {
    id: 'prof-002',
    status: 'Ready',
    priority: 'A',
    country: 'Germany',
    region: 'Europe',
    university: 'RWTH Aachen',
    department: 'Computer Science',
    professorTitle: 'Professor',
    professorFirstName: 'Bastian',
    professorLastName: 'Leibe',
    email: 'leibe@vision.rwth-aachen.de',
    altEmail: '',
    researchArea: 'Object Recognition, Computer Vision',
    keywords: 'Computer Vision;Object Recognition',
    yourPaperMatch: 'Kinect 3D Reconstruction Fusion Mapping (IEEE 2019)',
    personalizedHook: 'Your work on Object Recognition aligns with my publication.',
    programType: 'PhD',
    startTerm: 'Fall 2026',
    fundingPath: 'RA, DFG',
    eligibilityNotes: 'Excellent industry connections.',
    websiteSource: '',
    linkedPaperUrl: '',
    emailVerification: 'VALID',
    campaignStatus: 'SCHEDULED',
    lastContactDate: null,
    followUpDate: null,
    notes: '',
  },
  {
    id: 'prof-003',
    status: 'Ready',
    priority: 'A',
    country: 'Canada',
    region: 'North America',
    university: 'University of Waterloo',
    department: 'Comp. Science',
    professorTitle: 'Professor',
    professorFirstName: 'Jesse',
    professorLastName: 'Hoey',
    email: 'jhoey@uwaterloo.ca',
    altEmail: '',
    researchArea: 'Affective Computing, AI',
    keywords: 'Affective Computing;AI',
    yourPaperMatch: 'Classification Rules Comparison into Data Mining Concept (AUJST 2018)',
    personalizedHook: 'Your work on Affective Computing aligns with my publication.',
    programType: 'MSc→PhD',
    startTerm: 'Fall 2026',
    fundingPath: 'NSERC, RA',
    eligibilityNotes: 'Waterloo is excellent for AI.',
    websiteSource: 'https://cs.uwaterloo.ca/~jhoey/',
    linkedPaperUrl: '',
    emailVerification: 'VALID',
    campaignStatus: 'SCHEDULED',
    lastContactDate: null,
    followUpDate: null,
    notes: '',
  },
];

// Initialize data
onMounted(() => {
  // Check storage availability
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    storageAvailable.value = true;
  } catch {
    storageAvailable.value = false;
  }

  // Load seed data if empty
  if (germanPrograms.value.length === 0) {
    germanPrograms.value = germanSeedData;
  }
  if (nonGermanPrograms.value.length === 0) {
    nonGermanPrograms.value = nonGermanSeedData;
  }
  if (professors.value.length === 0) {
    professors.value = professorSeedData;
  }
});

// Computed stats
const germanStats = computed(() => {
  const total = germanPrograms.value.length;
  const freeTuition = germanPrograms.value.filter((p) => p.tuitionFee === 0).length;
  const applied = germanPrograms.value.filter((p) => p.applied).length;
  const vpdRequired = germanPrograms.value.filter(
    (p) => p.vpdRequired.toLowerCase() === 'yes'
  ).length;
  return { total, freeTuition, applied, vpdRequired };
});

const nonGermanStats = computed(() => {
  const total = nonGermanPrograms.value.length;
  const fullyFunded = nonGermanPrograms.value.filter((p) =>
    p.scholarship.toLowerCase().includes('full')
  ).length;
  const applied = nonGermanPrograms.value.filter(
    (p) => p.status.toLowerCase() === 'applied'
  ).length;
  const countries = new Set(
    nonGermanPrograms.value.flatMap((p) => p.country.split('/').map((c) => c.trim()))
  ).size;
  return { total, fullyFunded, applied, countries };
});

const professorStats = computed(() => {
  const total = professors.value.length;
  const contacted = professors.value.filter(
    (p) =>
      p.status.toLowerCase() === 'contacted' ||
      p.status.toLowerCase() === 'responded' ||
      p.status.toLowerCase() === 'meeting scheduled' ||
      p.status.toLowerCase() === 'applied'
  ).length;
  const responded = professors.value.filter(
    (p) =>
      p.status.toLowerCase() === 'responded' ||
      p.status.toLowerCase() === 'meeting scheduled' ||
      p.status.toLowerCase() === 'applied'
  ).length;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
  const pendingFollowUps = professors.value.filter(
    (p) => p.followUpDate && new Date(p.followUpDate) <= new Date()
  ).length;
  return { total, contacted, responseRate, pendingFollowUps };
});

// Filtered data
const filteredGermanPrograms = computed(() => {
  let result = germanPrograms.value;

  if (germanSearchQuery.value) {
    const query = germanSearchQuery.value.toLowerCase();
    result = result.filter((p) =>
      Object.values(p).some((val) => typeof val === 'string' && val.toLowerCase().includes(query))
    );
  }

  // Sort
  if (germanSortField.value) {
    const field = germanSortField.value as keyof GermanProgram;
    const direction = germanSortDirection.value === 'asc' ? 1 : -1;
    result = [...result].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * direction;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return (aVal === bVal ? 0 : aVal ? -1 : 1) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }

  return result;
});

const filteredNonGermanPrograms = computed(() => {
  let result = nonGermanPrograms.value;

  if (nonGermanSearchQuery.value) {
    const query = nonGermanSearchQuery.value.toLowerCase();
    result = result.filter((p) =>
      Object.values(p).some((val) => typeof val === 'string' && val.toLowerCase().includes(query))
    );
  }

  // Sort
  if (nonGermanSortField.value) {
    const field = nonGermanSortField.value as keyof NonGermanProgram;
    const direction = nonGermanSortDirection.value === 'asc' ? 1 : -1;
    result = [...result].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * direction;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }

  return result;
});

const filteredProfessors = computed(() => {
  let result = professors.value;

  if (professorSearchQuery.value) {
    const query = professorSearchQuery.value.toLowerCase();
    result = result.filter((p) =>
      Object.values(p).some((val) => typeof val === 'string' && val.toLowerCase().includes(query))
    );
  }

  // Sort
  if (professorSortField.value) {
    const field = professorSortField.value as keyof Professor;
    const direction = professorSortDirection.value === 'asc' ? 1 : -1;
    result = [...result].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * direction;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }

  return result;
});

// Sort handlers
const handleGermanSort = (field: string) => {
  if (germanSortField.value === field) {
    germanSortDirection.value = germanSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    germanSortField.value = field;
    germanSortDirection.value = 'asc';
  }
};

const handleNonGermanSort = (field: string) => {
  if (nonGermanSortField.value === field) {
    nonGermanSortDirection.value = nonGermanSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    nonGermanSortField.value = field;
    nonGermanSortDirection.value = 'asc';
  }
};

const handleProfessorSort = (field: string) => {
  if (professorSortField.value === field) {
    professorSortDirection.value = professorSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    professorSortField.value = field;
    professorSortDirection.value = 'asc';
  }
};

// German Program CRUD
const saveGermanProgram = () => {
  if (showAddGermanDialog.value) {
    const newProgram: GermanProgram = {
      id: `german-${Date.now()}`,
      universityName: germanForm.value.universityName || '',
      courseName: germanForm.value.courseName || '',
      intake: germanForm.value.intake || '',
      applicationStartDate: germanForm.value.applicationStartDate || null,
      applicationEndDate: germanForm.value.applicationEndDate || null,
      applicationPortal: germanForm.value.applicationPortal || '',
      vpdRequired: germanForm.value.vpdRequired || '-',
      moiAccepted: germanForm.value.moiAccepted || 'no',
      tuitionFee: germanForm.value.tuitionFee || 0,
      entranceExamInterview: germanForm.value.entranceExamInterview || '-',
      greGmat: germanForm.value.greGmat || '',
      applied: germanForm.value.applied || false,
      qsRanking: germanForm.value.qsRanking || '-',
      applicationFee: germanForm.value.applicationFee || null,
      restricted: germanForm.value.restricted || 'No-NC',
      applicationLink: germanForm.value.applicationLink || '',
    };
    germanPrograms.value.push(newProgram);
  } else if (editingGermanProgram.value) {
    const index = germanPrograms.value.findIndex((p) => p.id === editingGermanProgram.value!.id);
    if (index !== -1) {
      germanPrograms.value[index] = {
        ...germanPrograms.value[index],
        ...germanForm.value,
      };
    }
  }
  closeGermanDialog();
};

const openEditGermanDialog = (program: GermanProgram) => {
  editingGermanProgram.value = { ...program };
  germanForm.value = { ...program };
  showEditGermanDialog.value = true;
};

const closeGermanDialog = () => {
  showAddGermanDialog.value = false;
  showEditGermanDialog.value = false;
  editingGermanProgram.value = null;
  germanForm.value = {};
};

const confirmDeleteGerman = (program: GermanProgram) => {
  securityQuestion.value = currentQuestion.value?.question || 'What is the nickname of author?';
  askQuestion();
  showSecurityDialog.value = true;
  pendingDeleteAction.value = () => {
    germanPrograms.value = germanPrograms.value.filter((p) => p.id !== program.id);
  };
};

const toggleGermanApplied = (id: string) => {
  const program = germanPrograms.value.find((p) => p.id === id);
  if (program) {
    program.applied = !program.applied;
  }
};

// Non-German Program CRUD
const saveNonGermanProgram = () => {
  if (showAddNonGermanDialog.value) {
    const newProgram: NonGermanProgram = {
      id: `non-german-${Date.now()}`,
      program: nonGermanForm.value.program || '',
      university: nonGermanForm.value.university || '',
      country: nonGermanForm.value.country || '',
      degree: nonGermanForm.value.degree || '',
      scholarship: nonGermanForm.value.scholarship || '',
      appFee: nonGermanForm.value.appFee || '0 EUR',
      deadline: nonGermanForm.value.deadline || '',
      relevancyScore: nonGermanForm.value.relevancyScore || '',
      status: nonGermanForm.value.status || 'Not Applied',
    };
    nonGermanPrograms.value.push(newProgram);
  } else if (editingNonGermanProgram.value) {
    const index = nonGermanPrograms.value.findIndex(
      (p) => p.id === editingNonGermanProgram.value!.id
    );
    if (index !== -1) {
      nonGermanPrograms.value[index] = {
        ...nonGermanPrograms.value[index],
        ...nonGermanForm.value,
      };
    }
  }
  closeNonGermanDialog();
};

const openEditNonGermanDialog = (program: NonGermanProgram) => {
  editingNonGermanProgram.value = { ...program };
  nonGermanForm.value = { ...program };
  showEditNonGermanDialog.value = true;
};

const closeNonGermanDialog = () => {
  showAddNonGermanDialog.value = false;
  showEditNonGermanDialog.value = false;
  editingNonGermanProgram.value = null;
  nonGermanForm.value = {};
};

const confirmDeleteNonGerman = (program: NonGermanProgram) => {
  securityQuestion.value = currentQuestion.value?.question || 'What is the nickname of author?';
  askQuestion();
  showSecurityDialog.value = true;
  pendingDeleteAction.value = () => {
    nonGermanPrograms.value = nonGermanPrograms.value.filter((p) => p.id !== program.id);
  };
};

const toggleNonGermanApplied = (id: string) => {
  const program = nonGermanPrograms.value.find((p) => p.id === id);
  if (program) {
    program.status = program.status === 'Applied' ? 'Not Applied' : 'Applied';
  }
};

// Professor CRUD
const saveProfessor = (professor: Partial<Professor>) => {
  if (showAddProfessorDialog.value) {
    const newProfessor: Professor = {
      id: `prof-${Date.now()}`,
      status: professor.status || 'Not Started',
      priority: professor.priority || 'Medium',
      country: professor.country || '',
      region: professor.region || '',
      university: professor.university || '',
      department: professor.department || '',
      professorTitle: professor.professorTitle || '',
      professorFirstName: professor.professorFirstName || '',
      professorLastName: professor.professorLastName || '',
      email: professor.email || '',
      altEmail: professor.altEmail || '',
      researchArea: professor.researchArea || '',
      keywords: professor.keywords || '',
      yourPaperMatch: professor.yourPaperMatch || '',
      personalizedHook: professor.personalizedHook || '',
      programType: professor.programType || '',
      startTerm: professor.startTerm || '',
      fundingPath: professor.fundingPath || '',
      eligibilityNotes: professor.eligibilityNotes || '',
      websiteSource: professor.websiteSource || '',
      linkedPaperUrl: professor.linkedPaperUrl || '',
      emailVerification: professor.emailVerification || 'UNKNOWN',
      campaignStatus: professor.campaignStatus || 'NOT_STARTED',
      lastContactDate: professor.lastContactDate || null,
      followUpDate: professor.followUpDate || null,
      notes: professor.notes || '',
    };
    professors.value.push(newProfessor);
  } else if (editingProfessor.value) {
    const index = professors.value.findIndex((p) => p.id === editingProfessor.value!.id);
    if (index !== -1) {
      professors.value[index] = {
        ...professors.value[index],
        ...professor,
      };
    }
  }
  closeProfessorDialog();
};

const openEditProfessorDialog = (professor: Professor) => {
  editingProfessor.value = { ...professor };
  showEditProfessorDialog.value = true;
};

const closeProfessorDialog = () => {
  showAddProfessorDialog.value = false;
  showEditProfessorDialog.value = false;
  editingProfessor.value = null;
};

const confirmDeleteProfessor = (professor: Professor) => {
  securityQuestion.value = currentQuestion.value?.question || 'What is the nickname of author?';
  askQuestion();
  showSecurityDialog.value = true;
  pendingDeleteAction.value = () => {
    professors.value = professors.value.filter((p) => p.id !== professor.id);
  };
};

// Security dialog
const handleSecurityVerify = (answer: string) => {
  userAnswer.value = answer;
  if (verifyAnswer()) {
    pendingDeleteAction.value?.();
    pendingDeleteAction.value = null;
  }
  closeSecurityDialog();
};

const closeSecurityDialog = () => {
  showSecurityDialog.value = false;
  pendingDeleteAction.value = null;
};

// CSV Export
const exportCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const exportGermanCSV = () => {
  exportCSV(filteredGermanPrograms.value, 'german-programs.csv');
};

const exportNonGermanCSV = () => {
  exportCSV(filteredNonGermanPrograms.value, 'non-german-programs.csv');
};

const exportProfessorCSV = () => {
  exportCSV(filteredProfessors.value, 'professors.csv');
};
</script>
