<template>
  <!-- Hero Section -->
  <section
    class="pt-4 sm:pt-10 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"
  >
    <div class="container max-w-screen-xl mx-auto pt-5 px-3">
      <div class="text-center">
        <h1
          class="font-bold text-gray-900 dark:text-gray-100 text-2xl md:text-6xl leading-tight my-6"
        >
          My Projects
        </h1>
        <p
          class="font-normal text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          A showcase of impactful projects and applications I've built and
          contributed to across different industries and technologies.
        </p>
      </div>
    </div>
  </section>

  <!-- Featured Projects -->
  <section
    class="py-16 md:py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"
  >
    <div class="container max-w-screen-xl mx-auto px-4">
      <div class="grid grid-cols-1 gap-12">
        <!-- WeGro Global -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300 group"
        >
          <!-- Larger Screenshot -->
          <div class="relative h-80 overflow-hidden">
            <!-- Spinner -->
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            >
              <svg
                class="animate-spin h-10 w-10 text-green-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>

            <!-- Website Preview -->
            <iframe
              src="https://wegro.global"
              class="w-full h-full absolute top-0 left-0 border-none"
              loading="lazy"
              title="WeGro Global Preview"
              @load="loading = false"
            ></iframe>
          </div>

          <!-- Content Section -->
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 p-8"
          >
            <!-- Card Body -->
            <div class="flex-1 space-y-6">
              <div>
                <h4
                  class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4"
                >
                  Agricultural Fintech Platform
                </h4>
                <p
                  class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                >
                  Innovative financing solutions for smallholder farmers with
                  NestJS backend, dynamic project management, and investment
                  platform featuring crowdfunding capabilities.
                </p>
              </div>

              <div>
                <h5 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Key Features:
                </h5>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>
                    • Real-time project tracking and investment management
                  </li>
                  <li>• Secure payment processing with multiple gateways</li>
                  <li>• Advanced analytics and reporting dashboard</li>
                  <li>• Mobile-responsive crowdfunding platform</li>
                </ul>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                  >NestJS</span
                >
                <span
                  class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >TypeScript</span
                >
                <span
                  class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                  >PostgreSQL</span
                >
                <span
                  class="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm"
                  >AWS</span
                >
              </div>

              <div class="flex gap-3">
                <NuxtLink
                  href="https://wegro.global"
                  target="_blank"
                  class="px-6 py-3 border-2 border-green-800 text-green-800 rounded-lg hover:bg-green-800 hover:text-white transition duration-300 font-semibold"
                >
                  Visit Platform
                </NuxtLink>
              </div>
            </div>

            <!-- Mini Name + Tagline Card -->
            <div
              class="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center p-6 self-center"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
              >
                WeGro Global
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-lg">
                Agriculture Simplified
              </p>
            </div>
          </div>
        </div>

        <!-- Commerce Connections -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300 group"
        >
          <!-- Larger Screenshot -->
          <div class="relative h-80 overflow-hidden">
            <!-- Spinner -->
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            >
              <svg
                class="animate-spin h-10 w-10 text-green-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>

            <!-- Website Preview -->
            <iframe
              src="https://commerce-connections.com"
              class="w-full h-full absolute top-0 left-0 border-none"
              loading="lazy"
              title="Commerce Connections Preview"
              @load="loading = false"
            ></iframe>
          </div>

          <!-- Content Section -->
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 p-8"
          >
            <!-- Card Body -->
            <div class="flex-1 space-y-6">
              <div>
                <h4
                  class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4"
                >
                  Enterprise B2B/EDI Platform
                </h4>
                <p
                  class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                >
                  Full-stack development using Angular and MongoDB for
                  enterprise clients with
                  <a
                    class="font-medium text-cyan-600 underline dark:text-cyan-500 hover:no-underline"
                    href="https://editest.cc-ltd.com/bic-gui/login.html?first=true"
                    target="_blank"
                    >EDI</a
                  >
                  solutions, API integrations, and business process automation
                  for global trading partners & improve improve B2B supply chain
                  collaboration, smart enterprise communication and electronic
                  data interchange (EDI). They have been in business for over 20
                  years and this experience in B2B and EDI, as well as our
                  comprehensive range of integration solutions, enable our
                  clients to embark safely on electronic trading journeys.
                </p>
              </div>

              <div>
                <h5 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Key Features:
                </h5>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• EDI/B2B integration with major trading partners</li>
                  <li>• API gateway for seamless data exchange</li>
                  <li>• Business process automation workflows</li>
                  <li>• Enterprise-grade security and compliance</li>
                </ul>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                  >NestJS</span
                >
                <span
                  class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >TypeScript</span
                >
                <span
                  class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                  >PostgreSQL</span
                >
                <span
                  class="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm"
                  >AWS</span
                >
              </div>

              <div class="flex gap-3">
                <NuxtLink
                  href="https://commerce-connections.com"
                  target="_blank"
                  class="px-6 py-3 border-2 border-cyan-600 text-cyan-700 rounded-lg hover:bg-cyan-600 hover:text-white transition duration-300 font-semibold"
                >
                  Visit Platform
                </NuxtLink>
              </div>
            </div>

            <!-- Mini Name + Tagline Card -->
            <div
              class="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center p-6 self-center"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
              >
                Commerce Connections
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-lg">
                B2B Integration Solutions
              </p>
            </div>
          </div>
        </div>

        <!-- AshMart BD -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300 group"
        >
          <!-- Larger Screenshot -->
          <div class="relative h-80 overflow-hidden">
            <!-- Spinner -->
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            >
              <svg
                class="animate-spin h-10 w-10 text-orange-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>

            <!-- Website Preview -->
            <iframe
              src="https://www.ashmartbd.com"
              class="w-full h-full absolute top-0 left-0 border-none"
              loading="lazy"
              title="AshMart BD Preview"
              @load="loading = false"
            ></iframe>
          </div>

          <!-- Content Section -->
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 p-8"
          >
            <!-- Card Body -->
            <div class="flex-1 space-y-6">
              <div>
                <h4
                  class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4"
                >
                  Multi-Category E-commerce
                </h4>
                <p
                  class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                >
                  Complete e-commerce solution with categories ranging from
                  electronics to fashion, featuring advanced product management,
                  payment integration, and user experience optimization.
                </p>
              </div>

              <div>
                <h5 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Key Features:
                </h5>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Multi-category product catalog system</li>
                  <li>• Integrated payment processing (Stripe/PayPal)</li>
                  <li>• Advanced search and filtering capabilities</li>
                  <li>• Customer management and order tracking</li>
                </ul>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm"
                  >Laravel</span
                >
                <span
                  class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >E-commerce</span
                >
                <span
                  class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                  >Payment APIs</span
                >
              </div>

              <div class="flex gap-3">
                <NuxtLink
                  href="https://www.ashmartbd.com"
                  target="_blank"
                  class="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition duration-300 font-semibold"
                >
                  Visit Store
                </NuxtLink>
              </div>
            </div>

            <!-- Mini Name + Tagline Card -->
            <div
              class="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center p-6 self-center"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
              >
                AshMart BD
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-lg">
                E-commerce Platform
              </p>
            </div>
          </div>
        </div>

        <!-- Azerbaijan Medical Journal -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300 group"
        >
          <!-- Larger Screenshot -->
          <div class="relative h-80 overflow-hidden">
            <!-- Spinner -->
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            >
              <svg
                class="animate-spin h-10 w-10 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>

            <!-- Website Preview -->
            <iframe
              src="https://www.azerbaijanmedicaljournal.net"
              class="w-full h-full absolute top-0 left-0 border-none"
              loading="lazy"
              title="Azerbaijan Medical Journal Preview"
              @load="loading = false"
            ></iframe>
          </div>

          <!-- Content Section -->
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 p-8"
          >
            <!-- Card Body -->
            <div class="flex-1 space-y-6">
              <div>
                <h4
                  class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4"
                >
                  Azerbaijan Medical Journal
                </h4>
                <p
                  class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                >
                  Comprehensive medical journal platform covering anatomy,
                  physiology, pharmacology, and pathology with advanced content
                  management and academic publishing features.
                </p>
              </div>

              <div>
                <h5 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Key Features:
                </h5>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Academic paper submission and review system</li>
                  <li>• Advanced content management capabilities</li>
                  <li>• Multi-disciplinary medical coverage</li>
                  <li>• Responsive design for all devices</li>
                </ul>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  class="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm"
                  >Academic</span
                >
                <span
                  class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >CMS</span
                >
                <span
                  class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                  >Publishing</span
                >
              </div>

              <div class="flex gap-3">
                <NuxtLink
                  href="https://www.azerbaijanmedicaljournal.net"
                  target="_blank"
                  class="px-6 py-3 border-2 border-red-700 text-red-700 rounded-lg hover:bg-red-900 hover:text-white transition duration-300 font-semibold"
                >
                  Visit Journal
                </NuxtLink>
              </div>
            </div>

            <!-- Mini Name + Tagline Card -->
            <div
              class="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center p-6 self-center"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
              >
                Azerbaijan Medical Journal
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-lg">
                Academic Publishing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Additional Projects Section -->
  <section class="py-16 md:py-20 bg-white dark:bg-gray-900">
    <div class="container max-w-screen-xl mx-auto px-4">
      <div class="text-center mb-16">
        <h2
          class="font-bold text-gray-900 dark:text-gray-100 text-4xl md:text-5xl mb-6"
        >
          Other Notable Projects
        </h2>
        <p
          class="font-normal text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Additional projects and contributions across various technologies and
          domains
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- API Development Projects -->
        <div
          class="bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 hover:shadow-lg transition duration-300"
        >
          <div
            class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4"
          >
            <span class="text-2xl">🔌</span>
          </div>
          <h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-3">
            API Development
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            RESTful APIs and microservices architecture for various client
            projects
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs"
              >REST API</span
            >
            <span
              class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
              >Microservices</span
            >
          </div>
        </div>

        <!-- Database Optimization -->
        <div
          class="bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 hover:shadow-lg transition duration-300"
        >
          <div
            class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4"
          >
            <span class="text-2xl">📊</span>
          </div>
          <h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-3">
            Database Optimization
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Performance optimization and query tuning for high-traffic
            applications
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs"
              >PostgreSQL</span
            >
            <span
              class="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs"
              >Optimization</span
            >
          </div>
        </div>

        <!-- Cloud Architecture -->
        <div
          class="bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 hover:shadow-lg transition duration-300"
        >
          <div
            class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4"
          >
            <span class="text-2xl">☁️</span>
          </div>
          <h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-3">
            Cloud Architecture
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            AWS-based cloud solutions with Docker and CI/CD pipelines
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              class="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs"
              >AWS</span
            >
            <span
              class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
              >Docker</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from "vue";

const loading = ref(true);
useHead({
  title: "Projects - MD Ashikur Rahman | Senior Software Engineer",
  meta: [
    {
      name: "description",
      content:
        "Explore my portfolio of impactful projects: WeGro Global fintech platform, Commerce Connections B2B solutions, AshMart BD e-commerce, and Azerbaijan Medical Journal. Built with NestJS, Laravel, PostgreSQL, and AWS.",
    },
    {
      name: "keywords",
      content:
        "Ashikur Rahman projects, WeGro Global, Commerce Connections, AshMart BD, Azerbaijan Medical Journal, NestJS projects, Laravel projects, PostgreSQL, AWS, fintech, e-commerce, B2B solutions",
    },
    {
      name: "author",
      content: "MD Ashikur Rahman | Senior Software Engineer",
    },
    {
      property: "og:title",
      content: "Projects - MD Ashikur Rahman | Senior Software Engineer",
    },
    {
      property: "og:description",
      content:
        "Explore my portfolio of impactful projects: WeGro Global fintech platform, Commerce Connections B2B solutions, AshMart BD e-commerce, and Azerbaijan Medical Journal.",
    },
    {
      property: "og:type",
      content: "website",
    },
    { property: "og:image", content: `summary_large_image` },
    { name: "twitter:card", content: `summary_large_image` },
    {
      name: "twitter:title",
      content: "Projects - MD Ashikur Rahman | Senior Software Engineer",
    },
    {
      name: "twitter:description",
      content:
        "Explore my portfolio of impactful projects built with modern technologies.",
    },
  ],
});
</script>
