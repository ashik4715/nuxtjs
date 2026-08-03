<template>
  <div>
    <!-- Hero Section -->
    <section
      class="pt-4 sm:pt-10 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"
    >
      <div class="container max-w-screen-xl mx-auto pt-5 px-3">
        <div class="text-center">
          <div class="flex justify-center sm:mt-24">
            <img
              class="h-40 w-auto rounded-full shadow-2xl border-4 border-white dark:border-gray-700"
              src="/img/me.jfif"
              alt="MD Ashikur Rahman - Senior Software Engineer"
            />
          </div>

          <h6 class="font-medium text-gray-600 dark:text-gray-300 text-lg md:text-2xl mb-3 mt-6">
            MD ASHIKUR RAHMAN
          </h6>

          <h1
            class="font-bold text-gray-900 dark:text-gray-100 text-3xl md:text-6xl leading-tight mb-6"
          >
            Senior Software Engineer
            <br />
            <span class="text-blue-600 dark:text-blue-400">{{ typeValue }}</span>
            <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
          </h1>

          <p
            class="font-normal text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Results-driven Senior Software Engineer with 5+ years of experience in backend and
            full-stack development. Proven expertise in designing scalable, secure systems and
            deploying production-grade applications on cloud infrastructure.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <NuxtLink
              href="https://www.linkedin.com/in/ashikur-rahman-0a272ba1/"
              target="_blank"
              rel="no-referrer"
              class="px-8 py-3 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Connect on LinkedIn
            </NuxtLink>
            <NuxtLink
              to="/projects"
              class="px-8 py-3 font-semibold border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
            >
              View My Work
            </NuxtLink>
          </div>

          <!-- Current Role Highlight -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Currently Working At</p>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              WeGro Global Ltd
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Leading backend architecture using NestJS, TypeScript, and PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Professional Experience -->
    <section class="py-16 md:py-20 bg-white dark:bg-gray-900">
      <div class="container max-w-screen-xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-4xl md:text-5xl mb-6">
            Professional Experience
          </h2>
          <p
            class="font-normal text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            5+ years of experience building scalable systems and leading development teams
          </p>
        </div>

        <div class="space-y-12">
          <!-- WeGro Global -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-gray-100 text-2xl mb-2">
                  Senior Backend Engineer
                </h3>
                <h4 class="font-semibold text-blue-600 dark:text-blue-400 text-xl mb-2">
                  WeGro Global Ltd
                </h4>
                <p class="text-gray-600 dark:text-gray-300">Dhaka, Bangladesh</p>
              </div>
              <div class="mt-4 md:mt-0">
                <span
                  class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium"
                >
                  Aug 2024 – Present
                </span>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="text-blue-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Lead backend architecture using NestJS (Node.js), TypeScript, and
                  PostgreSQL</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-blue-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Deploy production systems on AWS EC2 with Docker, Nginx, and GitHub Actions
                  CI/CD</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-blue-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Optimize database queries and implement system monitoring for performance and
                  reliability</span
                >
              </li>
            </ul>
          </div>

          <!-- Commerce Connection -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-gray-100 text-2xl mb-2">
                  Junior Software Consultant
                </h3>
                <h4 class="font-semibold text-green-800 dark:text-green-400 text-xl mb-2">
                  Commerce Connection Ltd (UK)
                </h4>
                <p class="text-gray-600 dark:text-gray-300">Onsite / Chobham, United Kingdom</p>
              </div>
              <div class="mt-4 md:mt-0">
                <span
                  class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium"
                >
                  Sep 2023 – Jan 2024
                </span>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="text-green-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Developed and enhanced full-stack features for enterprise clients</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Supported client-facing consulting on software integration and deployment</span
                >
              </li>
            </ul>
          </div>

          <!-- MNB Technology -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-gray-100 text-2xl mb-2">
                  Lead PHP Developer
                </h3>
                <h4 class="font-semibold text-purple-600 dark:text-purple-400 text-xl mb-2">
                  MNB Technology
                </h4>
                <p class="text-gray-600 dark:text-gray-300">Dhaka, Bangladesh</p>
              </div>
              <div class="mt-4 md:mt-0">
                <span
                  class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium"
                >
                  May 2019 – Nov 2022
                </span>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="text-purple-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Led backend and data-driven application development using Laravel and MySQL</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-purple-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Designed reporting systems and BI dashboards to improve client
                  decision-making</span
                >
              </li>
            </ul>
          </div>

          <!-- Mazegeek -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-gray-100 text-2xl mb-2">
                  Laravel Intern
                </h3>
                <h4 class="font-semibold text-orange-600 dark:text-orange-400 text-xl mb-2">
                  Mazegeek Incorporation
                </h4>
                <p class="text-gray-600 dark:text-gray-300">Dhaka, Bangladesh</p>
              </div>
              <div class="mt-4 md:mt-0">
                <span
                  class="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full text-sm font-medium"
                >
                  Jan 2019 – Apr 2019
                </span>
              </div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="text-orange-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Built and tested enterprise web applications using Laravel and PHP</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-orange-500 mr-3 mt-1">▸</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >Collaborated with development team to deliver production-ready modules</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Skills -->
    <section
      class="py-16 md:py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div class="container max-w-screen-xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-4xl md:text-5xl mb-6">
            Technical Skills
          </h2>
          <p
            class="font-normal text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Expertise in modern technologies and development practices
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Backend -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300"
          >
            <div class="text-center mb-4">
              <div
                class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl text-green-800 dark:text-green-400">🚀</span>
              </div>
              <h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-2">Backend</h3>
            </div>
            <div class="space-y-2">
              <span
                class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium"
                >Node.js</span
              >
              <span
                class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium"
                >NestJS</span
              >
              <span
                class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium"
                >PHP Laravel</span
              >
            </div>
          </div>

          <!-- Frontend -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300"
          >
            <div class="text-center mb-4">
              <div
                class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl text-blue-600 dark:text-blue-400">💻</span>
              </div>
              <h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-2">Frontend</h3>
            </div>
            <div class="space-y-2">
              <span
                class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                >NextJS</span
              >
              <span
                class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                >Vue.js</span
              >
              <span
                class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                >React</span
              >
              <span
                class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                >TypeScript</span
              >
            </div>
          </div>

          <!-- Databases -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300"
          >
            <div class="text-center mb-4">
              <div
                class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl text-purple-600 dark:text-purple-400">🗃️</span>
              </div>
              <h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-2">Databases</h3>
            </div>
            <div class="space-y-2">
              <span
                class="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium"
                >PostgreSQL</span
              >
              <span
                class="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium"
                >MySQL</span
              >
              <span
                class="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium"
                >MongoDB</span
              >
            </div>
          </div>

          <!-- Cloud & DevOps -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300"
          >
            <div class="text-center mb-4">
              <div
                class="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl text-orange-600 dark:text-orange-400">☁️</span>
              </div>
              <h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-2">
                Cloud & DevOps
              </h3>
            </div>
            <div class="space-y-2">
              <span
                class="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium"
                >AWS</span
              >
              <span
                class="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium"
                >Docker</span
              >
              <span
                class="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium"
                >CI/CD</span
              >
              <span
                class="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium"
                >Nginx</span
              >
            </div>
          </div>
        </div>

        <!-- Additional Skills -->
        <div class="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h3 class="font-bold text-gray-900 dark:text-gray-100 text-2xl mb-6 text-center">
            Additional Expertise
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Testing</h4>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Jest, Playwright, Automated Testing
              </p>
            </div>
            <div class="p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">APIs</h4>
              <p class="text-gray-600 dark:text-gray-300 text-sm">REST APIs, JWT Authentication</p>
            </div>
            <div class="p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Payment</h4>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Stripe & PayPal APIs</p>
            </div>
            <div class="p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Specialization</h4>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                Image Processing, Data Visualization
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section class="py-16 md:py-20 bg-white dark:bg-gray-900">
      <div class="container max-w-screen-xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-4xl md:text-5xl mb-6">
            Education
          </h2>
          <p
            class="font-normal text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Academic foundation in computer science and engineering
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 class="font-bold text-gray-900 dark:text-gray-100 text-2xl mb-2">
                  Bachelor of Science in Computer Science
                </h3>
                <h4 class="font-semibold text-blue-600 dark:text-blue-400 text-xl mb-2">
                  BRAC University
                </h4>
                <p class="text-gray-600 dark:text-gray-300">Dhaka, Bangladesh</p>
              </div>
              <div class="mt-4 md:mt-0">
                <span
                  class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium"
                >
                  2018
                </span>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Specialization</h5>
                <ul class="space-y-2">
                  <li class="flex items-start">
                    <span class="text-blue-500 mr-3 mt-1">▸</span>
                    <span class="text-gray-700 dark:text-gray-300">Image Processing</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-blue-500 mr-3 mt-1">▸</span>
                    <span class="text-gray-700 dark:text-gray-300">Data Visualization</span>
                  </li>
                </ul>
              </div>
              <div class="text-center md:text-right">
                <NuxtLink
                  href="https://www.bracu.ac.bd"
                  target="_blank"
                  class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Visit University
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section
      class="py-16 md:py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div class="container max-w-screen-xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-4xl md:text-5xl mb-6">
            Featured Projects
          </h2>
          <p
            class="font-normal text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Showcase of impactful projects and applications I've built and contributed to
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- WeGro Global -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <div class="relative h-64 overflow-hidden">
              <iframe
                src="https://wegro.global"
                class="w-full h-full border-none"
                loading="lazy"
                title="WeGro Global Preview"
              ></iframe>
            </div>
            <div class="p-8">
              <h4 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4">
                Agricultural Fintech Platform
              </h4>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Innovative financing solutions for smallholder farmers with NestJS backend, dynamic
                project management, and investment platform featuring crowdfunding capabilities.
              </p>
              <div class="flex flex-wrap gap-2 mb-6">
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
              <NuxtLink
                href="https://wegro.global"
                target="_blank"
                class="px-6 py-3 border-2 border-green-800 text-green-800 rounded-lg hover:bg-green-800 hover:text-white transition duration-300 font-semibold"
              >
                Visit Platform
              </NuxtLink>
            </div>
          </div>

          <!-- Commerce Connections -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <div class="relative h-64 overflow-hidden">
              <iframe
                src="https://commerce-connections.com"
                class="w-full h-full border-none"
                loading="lazy"
                title="Commerce Connections Preview"
              ></iframe>
            </div>
            <div class="p-8">
              <h4 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4">
                Enterprise B2B/EDI Platform
              </h4>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Full-stack development for enterprise clients with
                <a
                  class="font-medium text-cyan-600 underline dark:text-cyan-500 hover:no-underline"
                  href="https://editest.cc-ltd.com/bic-gui/login.html?first=true"
                  target="_blank"
                  >EDI</a
                >
                solutions, API integrations, and business process automation to improve B2B supply
                chain collaboration and electronic data interchange (EDI).
              </p>
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >Full-Stack</span
                >
                <span
                  class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                  >EDI/B2B</span
                >
                <span
                  class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                  >API Integration</span
                >
              </div>
              <NuxtLink
                href="https://commerce-connections.com"
                target="_blank"
                class="px-6 py-3 border-2 border-cyan-600 text-cyan-700 rounded-lg hover:bg-cyan-600 hover:text-white transition duration-300 font-semibold"
              >
                Visit Platform
              </NuxtLink>
            </div>
          </div>

          <!-- Ori Food & Beverage -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <div class="relative h-64 overflow-hidden">
              <iframe
                src="https://www.orifnb.com/"
                class="w-full h-full border-none"
                loading="lazy"
                title="Ori Food & Beverage Preview"
              ></iframe>
            </div>
            <div class="p-8">
              <h4 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4">
                Ori Food & Beverage
              </h4>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                ORI FOOD & BEVERAGE LTD. specializes in producing and supplying high-quality food
                and beverage products.
              </p>
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm"
                  >Food & Beverage</span
                >
                <span
                  class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >Supply Chain</span
                >
                <span
                  class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                  >Production</span
                >
              </div>
              <NuxtLink
                href="https://www.orifnb.com/"
                target="_blank"
                class="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition duration-300 font-semibold"
              >
                Visit Website
              </NuxtLink>
            </div>
          </div>

          <!-- Azerbaijan Medical Journal -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <div class="relative h-64 overflow-hidden">
              <iframe
                src="https://www.azerbaijanmedicaljournal.net"
                class="w-full h-full border-none"
                loading="lazy"
                title="Azerbaijan Medical Journal Preview"
              ></iframe>
            </div>
            <div class="p-8">
              <h4 class="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4">
                Azerbaijan Medical Journal
              </h4>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Comprehensive medical journal platform covering anatomy, physiology, pharmacology,
                and pathology with advanced content management and academic publishing features.
              </p>
              <div class="flex flex-wrap gap-2 mb-6">
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
              <NuxtLink
                href="https://www.azerbaijanmedicaljournal.net"
                target="_blank"
                class="px-6 py-3 border-2 border-red-700 text-red-700 rounded-lg hover:bg-red-900 hover:text-white transition duration-300 font-semibold"
              >
                Visit Journal
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Strengths -->
    <section class="py-16 md:py-20 bg-white dark:bg-gray-900">
      <div class="container max-w-screen-xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-4xl md:text-5xl mb-6">
            Key Strengths
          </h2>
          <p
            class="font-normal text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Core competencies that drive successful project delivery and team collaboration
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            class="text-center p-6 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
          >
            <div
              class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl text-blue-600 dark:text-blue-400">🔧</span>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-gray-100 text-lg mb-3">
              Clean, Efficient Code
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Writing maintainable, scalable code following best practices and industry standards
            </p>
          </div>

          <div
            class="text-center p-6 bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
          >
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl text-green-800 dark:text-green-400">🧠</span>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-gray-100 text-lg mb-3">Problem Solving</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Strong analytical ability to identify, analyze, and solve complex technical challenges
            </p>
          </div>

          <div
            class="text-center p-6 bg-gradient-to-b from-purple-50 to-violet-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
          >
            <div
              class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl text-purple-600 dark:text-purple-400">🏗️</span>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-gray-100 text-lg mb-3">
              Scalable Architecture
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Designing robust, scalable system architectures for high-performance applications
            </p>
          </div>

          <div
            class="text-center p-6 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
          >
            <div
              class="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl text-orange-600 dark:text-orange-400">🌐</span>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-gray-100 text-lg mb-3">
              Global Communication
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Effective communication and collaboration with international clients and teams
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Inspirational Quote -->
    <section class="py-16 md:py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div class="container max-w-screen-xl mx-auto px-4">
        <div class="text-center">
          <h2 class="font-bold text-white text-3xl md:text-5xl lg:text-6xl mb-8">
            "Clean code always looks like it was written by someone who cares."
          </h2>
          <p class="text-indigo-100 text-lg md:text-xl">— Robert C. Martin</p>
        </div>
      </div>
    </section>

    <!-- end templating new UI -->
  </div>
</template>
<script>
export default {
  setup() {
    useHead({
      script: [
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-TLD3XBPBQH',
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TLD3XBPBQH');
          `,
        },
      ],
      title: 'MD ASHIKUR RAHMAN | Senior Software Engineer - Backend & Cloud Specialist',
      meta: [
        {
          name: 'keywords',
          content:
            'Ashikur Rahman, Senior Software Engineer, NestJS, Laravel, PostgreSQL, AWS, Docker, Backend Developer, Full Stack, TypeScript, Node.js, Cloud Architecture, WeGro Global',
        },
        {
          name: 'author',
          content: 'MD Ashikur Rahman | Senior Software Engineer',
        },
        {
          name: 'description',
          content:
            'Senior Software Engineer with 5+ years experience in backend & full-stack development. Expert in NestJS, Laravel, PostgreSQL, AWS. Currently at WeGro Global Ltd.',
        },
        {
          property: 'og:site_name',
          content: 'MD ASHIKUR RAHMAN | Senior Software Engineer',
        },
        {
          property: 'og:url',
          content: 'jholok.vercel.app',
        },
        {
          property: 'og:title',
          content: 'MD ASHIKUR RAHMAN | Senior Software Engineer - Backend & Cloud Specialist',
        },
        {
          property: 'og:description',
          content:
            'Senior Software Engineer with 5+ years experience in backend & full-stack development. Expert in NestJS, Laravel, PostgreSQL, AWS. Currently at WeGro Global Ltd.',
        },
        { property: 'og:image', content: `summary_large_image` },
        { name: 'twitter:card', content: `summary_large_image` },
      ],
    });
  },
  data: () => {
    return {
      typeValue: '',
      typeStatus: false,
      typeArray: [
        'Backend Specialist.',
        'Full-Stack Developer.',
        'Cloud Architect.',
        'Problem Solver.',
      ],
      typingSpeed: 60,
      erasingSpeed: 70,
      newTextDelay: 1500,
      typeArrayIndex: 0,
      charIndex: 0,
    };
  },
  created() {
    setTimeout(this.typeText, this.newTextDelay + 200);
  },
  methods: {
    typeText() {
      if (this.charIndex < this.typeArray[this.typeArrayIndex].length) {
        if (!this.typeStatus) this.typeStatus = true;
        this.typeValue += this.typeArray[this.typeArrayIndex].charAt(this.charIndex);
        this.charIndex += 1;
        setTimeout(this.typeText, this.typingSpeed);
      } else {
        this.typeStatus = false;
        setTimeout(this.eraseText, this.newTextDelay);
      }
    },
    eraseText() {
      if (this.charIndex > 0) {
        if (!this.typeStatus) this.typeStatus = true;
        this.typeValue = this.typeArray[this.typeArrayIndex].substring(0, this.charIndex - 1);
        this.charIndex -= 1;
        setTimeout(this.eraseText, this.erasingSpeed);
      } else {
        this.typeStatus = false;
        this.typeArrayIndex += 1;
        if (this.typeArrayIndex >= this.typeArray.length) this.typeArrayIndex = 0;
        setTimeout(this.typeText, this.typingSpeed + 1000);
      }
    },
  },
};
</script>

<style scoped>
.cursor {
  display: inline-block;
  margin-left: 3px;
  width: 4px;
  background-color: #fff;
  animation: cursorBlink 1s infinite;
}
.cursor.typing {
  animation: none;
}
@keyframes cursorBlink {
  49% {
    background-color: #fff;
  }
  50% {
    background-color: transparent;
  }
  99% {
    background-color: transparent;
  }
}
</style>
