<template>
  <div class="md:container lg:m-6 sm:m-12 sm:pt-2">
    <h2
      class="sm:pt-10 text-4xl font-bold text-center no-underline text-purple-600 dark:text-cyan-300"
    >
      About Me
    </h2>
    <p class="lg:py-8 sm:pt-5 text-lg">
      Hello and welcome to my personal portfolio website! My name is Mohammed
      Ashikur Rahman, and I am a dedicated and highly skilled professional with
      a passion for computer science, artificial intelligence, and cyber
      security. My unique educational background and diverse work experience
      have given me the knowledge and tools necessary to excel in the world of
      technology.
    </p>
    <h2 class="text-xl underline decoration-emerald-500">Education:</h2>
    <p class="py-3 sm:py-3 text-lg">
      I earned my BSc in Computer Science, specializing in Artificial
      Intelligence, from the BRAC University. This prestigious program equipped
      me with the foundational knowledge and skills needed to succeed in the
      rapidly evolving field of AI. During my time at university, I had the
      opportunity to undertake an industrial placement, further enhancing my
      understanding of real-world applications of computer science.
    </p>
    <h2 class="text-xl underline decoration-emerald-500">Career:</h2>
    <p class="py-3 sm:py-3 text-lg">
      My professional journey began in 2019 as an IT Intern at Parker Hannifin
      Corporation in Hemel Hempstead, where I gained hands-on experience in
      information technology and learned to apply my academic knowledge in a
      corporate environment. This experience prepared me for my next role as a
      Business Intelligence Support Analyst at Graphnet Health, UK, where I
      worked from September 2021 to December 2021. In this position, I honed my
      skills in data analysis and reporting, providing critical support to the
      company's business intelligence initiatives.
    </p>
    <p class="py-3 sm:py-3 text-lg">
      Since September 2023, I have been working as a Junior Software Consultant
      at Commerce Connection LTD in Chobham, UK. During my time with the
      company, I have tackled various projects and challenges, demonstrating my
      adaptability and strong problem-solving skills. Here, I continue to
      contribute my expertise and grow professionally.
    </p>
    <p class="py-3 sm:py-3 text-lg">
      As you browse through my portfolio, you will discover the wide range of
      projects I have been involved in, showcasing my passion for technology and
      my commitment to excellence. I am always eager to learn and take on new
      challenges, and I look forward to the opportunities that lie ahead.
    </p>
    <p class="py-3 sm:py-3 text-lg">
      Thank you for visiting my website, and please feel free to reach out if
      you have any questions or would like to discuss potential collaborations.
    </p>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
useHead({
  title: "About Me Page",
  meta: [
    {
      name: "description",
      content: "A short summary about myself.",
    },
    {
      property: "og:description",
      content: "A short summary about myself.",
    },
    { property: "og:image", content: `summary_large_image` },
    { name: "twitter:card", content: `summary_large_image` },
  ],
});
</script>
