<template>
  <v-app dark>
    <v-layout class="rounded rounded-md">
      <v-app-bar>
        <v-app-bar-title style="cursor: pointer; letter-spacing: 8px;" @click="$router.push('/')"
          >VR Playground</v-app-bar-title
        >
      </v-app-bar>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();
    store.dispatch("loadSwaggerData");
  },
});
</script>
