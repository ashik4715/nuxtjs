<template>
  <div class="md:container-lg md:mx-auto bg-no-repeat">
    <!-- Grid profile section -->
    <div class="grid row-auto hover:row-span-3 grid-cols-6 gap-3 p-6 m-5">
      
      <!-- templating new UI -->
      <!-- end templating new UI -->
      
      <div
        class="col-span-3 text-center pt-8 relative h-full w-full overflow-hidden rounded-lg hover:opacity-75"
      >
        <img
          class="h-full w-full object-cover object-center rounded-xl"
          src="@/static/img/hamburg.avif"
          alt="portfolio-pic2"
        />
      </div>
      <div
        class="col-span-3 text-center pt-1 text-gray-400 relative overflow-hidden rounded-lg"
      >
        <div class="grid h-screen place-items-center mx-auto p-8 text-5xl">
          <h1 class="text-cyan-800 py-5 no-underline">
            I'm a
            <span class="text-fuchsia-800">{{ typeValue }}</span>
            <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
          </h1>
        </div>
      </div>
    </div>
    <!-- end Grid profile section -->
  </div>
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
      typeArray: ["Web Developer", "Computer Engineer", "Gamer"],
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
