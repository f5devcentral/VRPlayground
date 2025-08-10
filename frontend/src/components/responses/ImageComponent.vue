<template>
  <v-sheet class="wrapper-sheet" v-if="imageUrl!==''" color="#2d2f35" border="md">
    <img :src="imageUrl" alt="Image response" class="response-image" />
    <v-alert class="mt-4" v-if="errorMessage" type="error" :text="errorMessage">
    </v-alert>
  </v-sheet>
</template>

<script>
import { ref, watch, defineComponent, onUnmounted } from "vue";
import { getContent } from "@/utils/contentExtractor";
export default defineComponent({
  props: {
    responseData: {
      type: Object,
      required: true,
    },
    responseConfig: {
      type: Object,
      required: true,
    },
    responseDataPropertyName: {
      type: String,
      default: "result",
    },
  },
  setup(props) {
    const imageUrl = ref(null);
    const errorMessage = ref("");
    watch(
      [() => props.responseData, () => props.responseConfig],
      async ([responseData, responseConfig]) => {
        errorMessage.value = "";
        imageUrl.value = "";
        if (responseData) {
          try {
            let content = await getContent(
              responseData,
              responseConfig,
              props.responseDataPropertyName
            );
            imageUrl.value = URL.createObjectURL(content);
          } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
          }
        }
      },
      { immediate: true }
    ); // Trigger watcher immediately when component is mounted
    onUnmounted(() => {
      // Revoke the URL when the component is unmounted to release memory
      if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
      }
    });
    return { imageUrl, errorMessage };
  },
});
</script>

<style scoped>
.response-image {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}
</style>