<template>
  <v-sheet class="wrapper-sheet" v-if="content!==''" color="#2d2f35" border="md">
    <pre>{{ objectData }}</pre>
    <v-alert
      class="mt-4"
      v-if="errorMessage"
      type="error"
      :text="errorMessage"
    >
    </v-alert>
  </v-sheet>
</template>

<script>
import { ref, watch, defineComponent } from "vue";
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
      default: "result"
    },
  },
  setup(props) {
    const content = ref("");
    const errorMessage = ref("");
    const objectData = ref({});
    watch(
      [() => props.responseData, () => props.responseConfig],
      async ([responseData, responseConfig]) => {
        errorMessage.value = "";
        content.value = "";
        if (responseData) {
          try {
            content.value = await getContent(responseData, responseConfig, props.responseDataPropertyName);
            objectData.value = content.value;
          } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
          }
        }
      },
      { immediate: true }
    ); // Trigger watcher immediately when component is mounted
    return { content, objectData, errorMessage };
  },
});
</script>
