<template>
  <div class="bg-emarald-400">
    <header class="absolute inset-x-0 top-0 z-50 w-full">
      <nav :class="{ scrolled: !view.atTopOfPage }"
        class="fixed flex w-full items-center bg-teal-800 dark:bg-gray-800 justify-between flex-wrap m-auto top-0 animated shadow-2xl shadow-cyan-400/20 p-6 md:px-8"
        aria-label="Global">
        <div class="flex md:flex-1">
          <a href="/" class="logo -m-1.5 p-1.5">
            <img class="h-12 w-auto" src="@/static/logo/navbar-logo.png" alt="logo" />
          </a>
        </div>
        <!-- <div class="flex lg:hidden">
          <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-800 dark:text-white hover:text-emerald-400"
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div> -->
        <div class="sm:flex sm:gap-x-8">
          <NuxtLink class="text-lg font-semibold leading-7 text-white hover:text-emerald-500 dark:hover:text-rose-500"
            to="/">Home</NuxtLink>
          <NuxtLink class="text-lg font-semibold leading-7 text-white hover:text-emerald-500 dark:hover:text-rose-500"
            to="/about">About</NuxtLink>
          <NuxtLink class="text-lg font-semibold leading-7 text-white hover:text-emerald-500 dark:hover:text-rose-500"
            to="/contact">Contact</NuxtLink>
          <NuxtLink class="text-lg font-semibold leading-7 text-white hover:text-emerald-500 dark:hover:text-rose-500"
            to="/projects">Projects</NuxtLink>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:justify-end">
          <div class="toggle-button flex space-x-5">
            <label for="darkModeToggle" @click="toggleDark()" class="relative inline-flex items-center cursor-pointer">
              <span class="ml-2 text-md font-medium text-cyan-300 dark:text-gray-200 cursor-pointer">
                <div v-if="isDark">
                  <SunIcon class="h-6 w-6" aria-hidden="true" />
                </div>
                <div v-else>
                  <MoonIcon class="h-6 w-6" aria-hidden="true" />
                </div>
              </span>
            </label>

            <!-- <a
              href="/"
              class="text-sm font-semibold leading-6 text-yellow-300 dark:text-white"
              >Log in <span aria-hidden="true">&rarr;</span></a
            > -->
          </div>
        </div>
      </nav>
      <!-- <Suspense>
        <Dialog
          as="div"
          class="lg:hidden"
          @close="mobileMenuOpen = false"
          :open="mobileMenuOpen"
        >
          <div class="fixed inset-0 z-50" />
          <DialogPanel
            class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
          >
            <div class="flex items-center justify-between">
              <a href="/" class="-m-1.5 p-1.5">
                <img class="h-8 w-auto" src="#" alt="logo" /> 
              </a>
              <button
                type="button"
                class="-m-2.5 rounded-md p-2.5 text-red-600 hover:text-emerald-500"
                @click="mobileMenuOpen = false"
              >
                <span class="sr-only">Close menu</span>
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-6 flow-root">
              <div class="-my-6 divide-y divide-gray-500/10">
                <div class="space-y-2 py-6">
                  <NuxtLink
                    class="-mx-3 block rounded-lg py-2 px-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white hover:bg-slate-400"
                    to="/"
                    >Home</NuxtLink
                  >
                  <NuxtLink
                    class="-mx-3 block rounded-lg py-2 px-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white hover:bg-slate-400"
                    to="/about"
                    >About</NuxtLink
                  >
                  <NuxtLink
                    class="-mx-3 block rounded-lg py-2 px-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white hover:bg-slate-400"
                    to="/contact"
                    >Contact</NuxtLink
                  >
                  <NuxtLink
                    class="-mx-3 block rounded-lg py-2 px-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white hover:bg-slate-400"
                    to="/projects"
                    >Projects</NuxtLink
                  >
                  <NuxtLink
                    class="-mx-3 block rounded-lg py-2 px-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white hover:bg-slate-400"
                    to="/privacy-policy"
                    >Privacy-policy</NuxtLink
                  >
                  <NuxtLink
                    to="/terms-conditions"
                    class="-mx-3 block rounded-lg py-2 px-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white hover:bg-slate-400"
                    >Terms &amp; Conditions Agreement</NuxtLink
                  >
                </div>
                <div class="py-6">
                  <a
                    href="/"
                    class="-mx-3 block rounded-lg py-2.5 px-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white hover:bg-slate-400"
                    >Log in</a
                  >
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </Suspense> -->
    </header>
  </div>

  <div class="md:container-lg md:mx-auto bg-no-repeat">
    <div class="mt-auto py-1 bg-white dark:bg-gray-800 dark:text-white">
      <NuxtPage />
    </div>
  </div>
  <!-- footer -->
  <footer class="py-6 flex justify-between bg-teal-800 dark:bg-gray-800">
    <div class="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">

      <nav class="flex flex-wrap justify-center -mx-5 -my-2">
        <div class="px-5 py-2">
          <NuxtLink to="/about" class="text-lg leading-6 text-white hover:text-cyan-300 dark:hover:text-pink-500">
            About
          </NuxtLink>
        </div>
        <div class="px-5 py-2">
          <NuxtLink to="/contact" class="text-lg leading-6 text-white hover:text-cyan-300 dark:hover:text-pink-500">
            Contact</NuxtLink>
        </div>
        <div class="px-5 py-2">
          <NuxtLink to="/projects" class="text-lg leading-6 text-white hover:text-cyan-300 dark:hover:text-pink-500">
            Projects</NuxtLink>
        </div>
        <div class="px-5 py-2">
          <NuxtLink to="/privacy-policy"
            class="text-lg leading-6 text-white hover:text-cyan-300 dark:hover:text-pink-500">Privacy Policy
          </NuxtLink>
        </div>
        <div class="px-5 py-2">
          <NuxtLink to="/terms-conditions"
            class="text-lg leading-6 text-white hover:text-cyan-300 dark:hover:text-pink-500">Terms and Conditions
          </NuxtLink>
        </div>
      </nav>

      <div class="text-center">
        <div class="flex items-center justify-center space-x-8">
          <a href="https://dribbble.com/amitbwas007" target="_blank" rel="noopener noreferrer"
            class="invisible-text w-16 h-16 flex items-center justify-center rounded-full hover:bg-gray-200 transition ease-in-out duration-500">
            <i class="text-gray-500 hover:text-gray-700 transition ease-in-out duration-500">
              <span class="sr-only">Dribbble</span>
              <svg class="w-16 h-16" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                  clip-rule="evenodd"></path>
              </svg>
            </i>Follow me on Dribbble
          </a>

          <a href="https://www.facebook.com/ajholok" target="_blank" rel="noopener noreferrer"
            class="invisible-text w-16 h-16 flex items-center justify-center rounded-full hover:bg-gray-200 transition ease-in-out duration-500">
            <i class="text-gray-500 hover:text-gray-700 transition ease-in-out duration-500">
              <span class="sr-only">Facebook</span>
              <svg class="w-16 h-16" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd"></path>
              </svg>
            </i>
            Follow me on Facebook
          </a>

          <a href="https://github.com/ashik4715" target="_blank" rel="noopener noreferrer"
            class="invisible-text w-16 h-16 flex items-center justify-center rounded-full hover:bg-gray-200 transition ease-in-out duration-500">
            <i class="text-gray-500 hover:text-gray-700 transition ease-in-out duration-500">
              <span class="sr-only">Github</span>
              <svg class="w-16 h-16" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"></path>
              </svg>
            </i>Follow me on Github
          </a>

          <a href="mailto:ashikurjhalak@gmail.com" rel="noopener noreferrer"
            class="invisible-text w-16 h-16 flex items-center justify-center rounded-full hover:bg-gray-200 transition ease-in-out duration-500">
            <i class="text-gray-500 hover:text-gray-700 transition ease-in-out duration-500">
              <svg class="w-16 h-16" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12.042 23.648c-7.813 0-12.042-4.876-12.042-11.171 0-6.727 4.762-12.125 13.276-12.125 6.214 0 10.724 4.038 10.724 9.601 0 8.712-10.33 11.012-9.812 6.042-.71 1.108-1.854 2.354-4.053 2.354-2.516 0-4.08-1.842-4.08-4.807 0-4.444 2.921-8.199 6.379-8.199 1.659 0 2.8.876 3.277 2.221l.464-1.632h2.338c-.244.832-2.321 8.527-2.321 8.527-.648 2.666 1.35 2.713 3.122 1.297 3.329-2.58 3.501-9.327-.998-12.141-4.821-2.891-15.795-1.102-15.795 8.693 0 5.611 3.95 9.381 9.829 9.381 3.436 0 5.542-.93 7.295-1.948l1.177 1.698c-1.711.966-4.461 2.209-8.78 2.209zm-2.344-14.305c-.715 1.34-1.177 3.076-1.177 4.424 0 3.61 3.522 3.633 5.252.239.712-1.394 1.171-3.171 1.171-4.529 0-2.917-3.495-3.434-5.246-.134z" />
              </svg>
            </i>Contact us by email
          </a>

          <a href="https://www.instagram.com/ashikur4715/" target="_blank" rel="noopener noreferrer"
            class="invisible-text w-16 h-16 flex items-center justify-center rounded-full hover:bg-gray-200 transition ease-in-out duration-500">
            <i class="text-gray-500 hover:text-gray-700 transition ease-in-out duration-500">
              <svg class="w-16 h-16" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z" />
              </svg>
            </i>Follow me on Instagram
          </a>
        </div>
      </div>

      <p class="mt-8 text-lg leading-6 text-center text-white"> © 2023 <NuxtLink to="/"
          class="text-yellow-400 hover:text-green-500">jholok.vercel.app</NuxtLink>. All rights reserved.
      </p>
    </div>
  </footer>
  <!-- end footer -->
</template>

<script>
import { ref } from "vue";
// import { Dialog, DialogPanel } from "@headlessui/vue";
// import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import { useDark, useToggle } from "@vueuse/core";
export default {
  components: {
    // Dialog,
    // DialogPanel,
  },
  ssr: false,
  data() {
    return {
      view: {
        atTopOfPage: true,
        mobileMenuOpen: false,
      },
    };
  },
  // a beforeMount call to add a listener to the window
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },

  methods: {
    // the function to call when the user scrolls, added as a method
    handleScroll() {
      // when the user scrolls, check the pageYOffset
      if (window.pageYOffset > 0) {
        // user is scrolled
        if (this.view.atTopOfPage) this.view.atTopOfPage = false;
      } else {
        // user is at top of page
        if (!this.view.atTopOfPage) this.view.atTopOfPage = true;
      }
    },
  },
};
</script>
<script setup>
const isDark = useDark();
const toggleDark = useToggle(isDark);
// const mobileMenuOpen = ref(false);
</script>
<style scoped>
nav {
  z-index: 10;
}

nav.scrolled {
  border-bottom: 0px;
}

.invisible-text {
  display: none;
}
</style>
