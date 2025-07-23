<template>
  <div class="md:container lg:m-6 sm:m-12 sm:pt-10">
    <h2
      class="text-center sm:pt-10 text-4xl font-bold no-underline text-purple-600 dark:text-cyan-300"
    >
      About Me
    </h2>
    <p class="lg:py-8 sm:pt-5 text-lg">
      Hello and welcome to my personal portfolio website! My name is Mohammed
      Ashikur Rahman, and I am a dedicated
      <strong>Senior Software Engineer</strong> with over five years of
      professional experience specializing in backend development, full-stack
      applications, and cloud infrastructure. My passion lies in building
      scalable, secure software solutions using modern technologies and best
      practices.
    </p>

    <h2 class="text-xl underline decoration-emerald-500">Education:</h2>
    <p class="py-3 sm:py-3 text-lg">
      I earned my BSc in Computer Science, specializing in Artificial
      Intelligence, from BRAC University in late 2018. This comprehensive
      program provided me with strong foundational knowledge in computer science
      principles, algorithms, and AI technologies. During my studies, I
      completed an industrial placement that bridged the gap between academic
      theory and real-world software development practices.
    </p>

    <h2 class="text-xl underline decoration-emerald-500">
      Professional Experience:
    </h2>
    <p class="py-3 sm:py-3 text-lg">
      My career began in 2019 as a Laravel Internship at Mazegeek Incorporation
      in Banani, Dhaka, Bangladesh where I gained valuable experience learning
      PHP and Laravel, in enterprise IT environments and learned to apply
      technical solutions in corporate settings.
    </p>
    <p class="py-3 sm:py-3 text-lg">
      I then progressed to a Lead Php Developer role at MNB Technology, Dhaka,
      Bangladesh (May 2019 - November 2022), where I developed expertise in data
      analysis, reporting systems, and business intelligence tools that enhanced
      my analytical and problem-solving capabilities.
    </p>
    <p class="py-3 sm:py-3 text-lg">
      From there, I advanced to a Junior Software Consultant position at
      Commerce Connection LTD in Chobham, UK(September 2023 - January 2024),
      where I honed my software development skills and gained experience in
      client-facing technical consulting.
    </p>
    <p class="py-3 sm:py-3 text-lg">
      Currently, I serve as a
      <strong
        >Senior Backend Engineer at WeGro Global Ltd (August 2024 -
        Present)</strong
      >, where I lead backend architecture and development initiatives. In this
      role, I design and implement scalable backend systems using
      <strong>NestJS (Node.js)</strong>, <strong>TypeScript</strong>, and
      <strong>PostgreSQL</strong>, deploy production applications on
      <strong>AWS EC2</strong> with automated
      <strong>CI/CD pipelines using GitHub Actions</strong>, and manage
      containerized services with <strong>Docker</strong> and infrastructure
      including Nginx, Certbot, and monitoring systems.
    </p>

    <h2 class="text-xl underline decoration-emerald-500">
      Technical Expertise:
    </h2>
    <div class="py-3 sm:py-3 text-lg">
      <p class="mb-3">My technical stack includes:</p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>
          <strong>Backend:</strong> Node.js, NestJS, TypeScript, PHP, Laravel
        </li>
        <li><strong>Frontend:</strong> React, Vue.js, HTML, CSS, JavaScript</li>
        <li><strong>Databases:</strong> PostgreSQL, MySQL, SQL optimization</li>
        <li>
          <strong>Cloud & DevOps:</strong> AWS (EC2, S3, Lambda), Docker, CI/CD,
          GitHub Actions
        </li>
        <li>
          <strong>Testing & Quality:</strong> Jest, automated testing, code
          quality practices
        </li>
        <li><strong>Payment Integration:</strong> Stripe API, PayPal API</li>
        <li>
          <strong>Other:</strong> REST APIs, JWT authentication, Nginx, system
          monitoring
        </li>
      </ul>
    </div>

    <h2 class="text-xl underline decoration-emerald-500">What Drives Me:</h2>
    <p class="py-3 sm:py-3 text-lg">
      I am passionate about creating efficient, maintainable code and staying
      current with emerging technologies. Whether working on backend
      architecture, full-stack development, or cloud deployment, I approach each
      project with attention to detail and a commitment to delivering
      high-quality solutions.
    </p>
    <p class="py-3 sm:py-3 text-lg">
      As you explore my portfolio, you'll discover projects that showcase my
      expertise in modern web development, from complex backend systems to
      user-friendly frontend interfaces. I'm always eager to tackle new
      challenges and contribute to innovative software solutions.
    </p>
    <p class="py-3 sm:py-3 text-lg">
      Thank you for visiting my website. Please feel free to reach out if you'd
      like to discuss potential collaborations or learn more about my work!
    </p>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
useHead({
  title: "About Me - Senior Software Engineer",
  meta: [
    {
      name: "description",
      content:
        "Senior Software Engineer with 5+ years experience in backend development, full-stack applications, and cloud infrastructure using Node.js, TypeScript, AWS, and modern web technologies.",
    },
    {
      property: "og:description",
      content:
        "Senior Software Engineer specializing in backend development, cloud infrastructure, and full-stack applications with expertise in Node.js, TypeScript, and AWS.",
    },
    { property: "og:image", content: `summary_large_image` },
    { name: "twitter:card", content: `summary_large_image` },
  ],
});
</script>
