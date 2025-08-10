<template>
  <div>
    <v-list>
      <v-list-item
        :to="{ name: 'home' }"
        :class="{ active: $route.name === 'home' }"
      >
        Home
      </v-list-item>
      <v-list-item
        :to="{ name: 'explore' }"
        :class="{ active: $route.name === 'explore' }"
      >
        Explore
      </v-list-item>

    </v-list>
  </div>
</template>

<script>
export default {
  name: "navigation-list",
};
</script>

<style scoped>

</style>

