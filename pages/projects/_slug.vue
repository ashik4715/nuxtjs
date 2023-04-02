<template>
  <dir>
    {{ project.slug }}
  </dir>
</template>

<script lang="js">
export default {
  async asyncData({ $content, params }) {
    // fetch our article here
    const project = await $content("data", params.slug).fetch();

    return { project };
  },
};
</script>

<style></style>
