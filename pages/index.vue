<template>
  <!-- templating new UI -->
  <section class="py-2 md:py-4">
    <div class="container max-w-screen-xl mx-auto px-3">
      <div class="text-center">
        <div class="flex justify-center mt-24 mb-5">
          <img
            class="h-40 w-auto rounded-full"
            src="@/static/img/me.jfif"
            alt="Image"
          />
        </div>

        <h6
          class="font-medium text-gray-500 dark:text-gray-300 text-lg md:text-2xl mb-5"
        >
          MD ASHIKUR RAHMAN
        </h6>

        <h1
          class="font-normal text-gray-900 dark:text-gray-300 text-4xl md:text-7xl leading-none mb-5"
        >
          I'm a
          <span class="text-purple-500">{{ typeValue }}</span>
          <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
        </h1>

        <p
          class="font-normal text-gray-600 dark:text-gray-300 text-md md:text-xl mb-10"
        >
          I make Interactive and Interesting Web Applications.
        </p>

        <NuxtLink
          href="https://www.linkedin.com/in/ashikur-rahman-0a272ba1/"
          target="_blank"
          rel="no-referrer"
          class="px-7 py-2 md:px-9 md:py-4 font-medium md:font-semibold bg-gray-700 text-gray-200 text-sm rounded-md hover:bg-gray-200 hover:text-black transition ease-linear duration-500 shadow-lg shadow-emerald-500/50"
          >Follow me on LinkedIn</NuxtLink
        >
      </div>
    </div>
  </section>

  <section class="py-10 md:py-10">
    <div class="container max-w-screen-xl mx-auto px-4">
      <h1
        class="font-medium text-black dark:text-gray-200 text-3xl md:text-4xl mb-5"
      >
        Experience
      </h1>

      <p
        class="font-normal text-gray-500 dark:text-gray-300 text-xs md:text-base mb-5"
      >
        Below is a summary of the places I worked as professional
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <div
            class="w-20 py-6 flex justify-center bg-gray-900 dark:bg-gray-700 rounded-md mb-4"
          >
            <i data-feather="briefcase"></i>
          </div>

          <h4 class="font-medium text-black text-lg mb-4">
            Commerce Connections LTD, UK
          </h4>
          <h5 class="font-semibold text-black text-md mb-2">
            Junior Software Consultant
          </h5>

          <ul class="list-disc list-outside">
            <li class="font-normal text-gray-500 text-md text-balance">
              Developed Sales Based website for B2B business model.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Process and Manipulate Edbic API to Ionic Website using
              TypeScript.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Adhered to the best practices of MongoDB and Angular.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Git Pull request to await review from others and merge a branch
              once approved.
            </li>
          </ul>
        </div>

        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <div
            class="w-20 py-6 flex justify-center bg-gray-900 dark:bg-gray-700 rounded-md mb-4"
          >
            <i data-feather="briefcase"></i>
          </div>

          <h4 class="font-medium text-black text-lg mb-4">
            MNB Technologies BD LTD, Bangladesh
          </h4>
          <h5 class="font-semibold text-black text-md mb-2">
            Full Stack Developer
          </h5>

          <ul class="list-disc list-outside">
            <li class="font-normal text-gray-500 text-md text-justify">
              Developed three projects from scratch to deployment.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Adhered to the best practices to avoid SQL injections.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Implemented custom bulk email sender for marketing purposes.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Applied Payment API with Stripe, Paypal SDK.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Optimized website performance with SQL indexing and in-memory
              caching.
            </li>
          </ul>
        </div>

        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <div
            class="w-20 py-6 flex justify-center bg-gray-900 dark:bg-gray-700 rounded-md mb-4"
          >
            <i data-feather="book-open"></i>
          </div>

          <h4 class="font-medium text-black text-lg mb-4">Mazegeek Inc.</h4>
          <h5 class="font-semibold text-black text-md mb-2">
            Junior PHP Developer
          </h5>

          <ul class="list-disc list-outside">
            <li class="font-normal text-gray-500 text-md text-justify">
              Started an Internship as a PHP developer and later promoted to
              Junior PHP Developer.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Implemented Laravel API for Android and IOS platforms.
            </li>
            <li class="font-normal text-gray-500 text-md text-justify">
              Acquired knowledge of SEO friendly approaches.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="py-10 md:py-10">
    <div class="container max-w-screen-xl mx-auto px-4">
      <h1
        class="font-medium text-black dark:text-gray-100 text-3xl md:text-4xl mb-5"
      >
        Education
      </h1>

      <p
        class="font-normal text-gray-500 dark:text-gray-400 text-xs md:text-base mb-10"
      >
        Below is a summary of the places I studied
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <h4 class="font-medium text-black text-lg mb-4">2020 – 2022</h4>

          <p class="font-normal text-gray-600 text-md mb-4">
            University of Applied Sciences Wedel, Hamburg, Germany.
          </p>
          <p class="font-medium text-gray-600 text-md mb-4">
            Master in Information & Technology.
          </p>

          <div class="relative">
            <h6 class="font-semibold text-gray-500 text-md relative z-10">
              <NuxtLink href="https://www.fh-wedel.de" target="_blank"
                >See the place here</NuxtLink
              >
            </h6>
            <span
              class="w-32 h-1 bg-blue-200 absolute bottom-1 left-0 z-0"
            ></span>
          </div>
        </div>

        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <h4 class="font-medium text-black text-lg mb-4">2013 – 2018</h4>

          <p class="font-normal text-gray-500 text-md mb-4">
            BRAC University, Dhaka, Bangladesh
          </p>
          <p class="font-medium text-gray-500 text-md mb-4">
            Bachelor of Science in <br />
            Computer Science & Engineering.
          </p>

          <div class="relative">
            <h6 class="font-semibold text-gray-500 text-md relative z-10">
              <NuxtLink href="https://www.bracu.ac.bd" target="_blank"
                >See the place here</NuxtLink
              >
            </h6>
            <span
              class="w-32 h-1 bg-blue-200 absolute bottom-1 left-0 z-0"
            ></span>
          </div>
        </div>

        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <h4 class="font-medium text-black text-lg mb-4">2010 – 2012</h4>

          <p class="font-normal text-gray-500 text-md mb-4">
            Bangladesh Navy College, Dhaka, Bangladesh
          </p>
          <p class="font-medium text-gray-500 text-md mb-4">
            Higher Secondary School
          </p>

          <div class="relative">
            <h6 class="font-semibold text-gray-500 text-md relative z-10">
              <NuxtLink href="https://bncd.edu.bd" target="_blank"
                >See the place here</NuxtLink
              >
            </h6>
            <span
              class="w-32 h-1 bg-blue-200 absolute bottom-1 left-0 z-0"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-10 md:py-10">
    <div class="container max-w-screen-xl mx-auto px-4">
      <div class="flex flex-col lg:flex-row justify-between">
        <div class="mb-10 lg:mb-0">
          <h1
            class="font-medium text-black dark:text-gray-100 text-3xl md:text-4xl mb-5"
          >
            Portfolio
          </h1>

          <p class="font-normal text-gray-400 text-xs md:text-base">
            I have brought here my biggest and favorite works <br />
            as a professional.
          </p>
          <div
            class="col-span-3 text-center pt-5 relative h-full w-full overflow-hidden rounded-lg hover:opacity-75"
          >
            <img
              class="h-50 w-50 object-cover object-center rounded-xl"
              src="@/static/img/hamburg.avif"
              alt="portfolio-pic2"
            />
          </div>
        </div>

        <div class="space-y-24">
          <div class="flex space-x-6">
            <h1
              class="font-normal text-black dark:text-gray-400 text-3xl md:text-4xl"
            >
              01
            </h1>

            <span class="w-28 h-0.5 bg-gray-300 mt-5"></span>

            <div>
              <h1
                class="font-normal text-black dark:text-gray-400 text-3xl md:text-4xl mb-5"
              >
                Demo API Generator
              </h1>

              <p class="font-normal text-gray-500 text-sm md:text-base">
                A dummy data free and documented API generator to facilitate
                <br />
                the process of testing the front-end portion of projects.
              </p>
            </div>
          </div>

          <div class="flex space-x-6">
            <h1
              class="font-normal text-black dark:text-gray-400 text-3xl md:text-4xl"
            >
              02
            </h1>

            <span class="w-28 h-0.5 bg-gray-300 mt-5"></span>

            <div>
              <h1
                class="font-normal text-black dark:text-gray-400 text-3xl md:text-4xl mb-5"
              >
                Demo API Generator
              </h1>

              <p class="font-normal text-gray-500 text-sm md:text-base">
                A dummy data free and documented API generator to facilitate
                <br />
                the process of testing the front-end portion of projects.
              </p>
            </div>
          </div>

          <div class="flex space-x-6">
            <h1
              class="font-normal text-black dark:text-gray-400 text-3xl md:text-4xl"
            >
              03
            </h1>

            <span class="w-28 h-0.5 bg-gray-300 mt-5"></span>

            <div>
              <h1
                class="font-normal text-black dark:text-gray-400 text-3xl md:text-4xl mb-5"
              >
                Demo API Generator
              </h1>

              <p class="font-normal text-gray-500 text-sm md:text-base">
                A dummy data free and documented API generator to facilitate
                <br />
                the process of testing the front-end portion of projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-10 md:py-10">
    <div class="container max-w-screen-xl mx-auto px-4">
      <div class="text-center">
        <h1
          class="font-normal text-black dark:text-gray-200 text-3xl md:text-5xl lg:text-5xl mb-10 md:mb-10 lg:mb-10"
        >
          "If it doesn't set your soul on fire, it's not worth the burn."
        </h1>
      </div>
    </div>
  </section>

  <section class="py-10 md:py-10">
    <div class="container max-w-screen-xl mx-auto px-4">
      <h1
        class="font-medium text-black dark:text-gray-400 text-3xl md:text-4xl mb-5"
      >
        Experience
      </h1>

      <p class="font-normal text-gray-500 text-xs md:text-base mb-20">
        Below is a summary of the places I worked as professional
      </p>

      <div class="flex flex-col lg:flex-row justify-between">
        <div class="space-y-8 md:space-y-16 mb-16 md:mb-0">
          <h6 class="font-medium text-gray-400 text-base uppercase">Company</h6>

          <p class="font-semibold text-black dark:text-gray-300 text-base">
            Massa Fames
            <span class="font-normal text-gray-400 dark:text-gray-300"
              >/ New York</span
            >
          </p>

          <p class="font-semibold text-black dark:text-gray-300 text-base">
            Massa Fames
            <span class="font-normal text-gray-400 dark:text-gray-300"
              >/ New York</span
            >
          </p>
        </div>

        <div class="space-y-8 md:space-y-16 mb-16 md:mb-0">
          <h6 class="font-medium text-gray-400 text-base uppercase">
            Position
          </h6>

          <p class="font-normal text-gray-400 text-base">
            Junior Front-End Developer
          </p>

          <p class="font-normal text-gray-400 text-base">
            Junior Front-End Developer
          </p>
        </div>

        <div class="space-y-8 md:space-y-16">
          <h6 class="font-medium text-gray-400 text-base uppercase">Year</h6>

          <p class="font-normal text-gray-400 text-base">2016</p>

          <p class="font-normal text-gray-400 text-base">2016</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-10 md:py-16">
    <div class="container max-w-screen-xl mx-auto px-4">
      <h1
        class="font-medium text-black dark:text-white text-3xl md:text-4xl mb-5"
      >
        Testimonial
      </h1>

      <p
        class="font-normal text-black dark:text-white text-xs md:text-base mb-10 md:mb-20"
      >
        Below is a summary of the places I studied
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <p class="font-normal text-black text-md mb-4">
            Lorem ipsum dolor sit amet, consectetur <br />
            adipiscing elit, sed do eiusmod tempor <br />
            incididunt ut labore et dolore magna aliqua.
          </p>

          <h6 class="font-semibold text-black text-md">
            Stephan Clark
            <span class="font-medium text-gray-400 text-sm"
              >- CEO at EarlyBird</span
            >
          </h6>
        </div>

        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <p class="font-normal text-black text-md mb-4">
            Lorem ipsum dolor sit amet, consectetur <br />
            adipiscing elit, sed do eiusmod tempor <br />
            incididunt ut labore et dolore magna aliqua.
          </p>

          <h6 class="font-semibold text-black text-md">
            Stephan Clark
            <span class="font-medium text-gray-400 text-sm"
              >- CEO at EarlyBird</span
            >
          </h6>
        </div>

        <div class="bg-gray-300 dark:bg-gray-100 px-8 py-10 rounded-md">
          <p class="font-normal text-black text-md mb-4">
            Lorem ipsum dolor sit amet, consectetur <br />
            adipiscing elit, sed do eiusmod tempor <br />
            incididunt ut labore et dolore magna aliqua.
          </p>

          <h6 class="font-semibold text-black text-md">
            Stephan Clark
            <span class="font-medium text-gray-400 text-sm"
              >- CEO at EarlyBird</span
            >
          </h6>
        </div>
      </div>
    </div>
  </section>

  <!-- end templating new UI -->
</template>
<script>
export default {
  setup() {
    useHead({
      title: "Home Page",
      meta: [
        {
          name: "description",
          content: "My Homepage of this portfolio website.",
        },
        {
          property: "og:description",
          content: "My Homepage of this portfolio website.",
        },
        { property: "og:image", content: `summary_large_image` },
        { name: "twitter:card", content: `summary_large_image` },
      ],
    });
  },
  data: () => {
    return {
      typeValue: "",
      typeStatus: false,
      typeArray: ["Software Engineer.", "Website Developer.", "Gamer."],
      typingSpeed: 60,
      erasingSpeed: 70,
      newTextDelay: 1500,
      typeArrayIndex: 0,
      charIndex: 0,
    };
  },
  methods: {
    typeText() {
      if (this.charIndex < this.typeArray[this.typeArrayIndex].length) {
        if (!this.typeStatus) this.typeStatus = true;
        this.typeValue += this.typeArray[this.typeArrayIndex].charAt(
          this.charIndex
        );
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
        this.typeValue = this.typeArray[this.typeArrayIndex].substring(
          0,
          this.charIndex - 1
        );
        this.charIndex -= 1;
        setTimeout(this.eraseText, this.erasingSpeed);
      } else {
        this.typeStatus = false;
        this.typeArrayIndex += 1;
        if (this.typeArrayIndex >= this.typeArray.length)
          this.typeArrayIndex = 0;
        setTimeout(this.typeText, this.typingSpeed + 1000);
      }
    },
  },
  created() {
    setTimeout(this.typeText, this.newTextDelay + 200);
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
