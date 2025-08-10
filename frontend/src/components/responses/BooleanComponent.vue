<template>
  <v-sheet class="wrapper-sheet" v-if="content!==''" color="#2d2f35" border="md">
    <template v-if="!errorMessage">
      <v-alert
        v-if="evaluateBoolean(content)"
        type="success"
        :title="content"
        density="compact"
      ></v-alert>
      <v-alert v-else type="error" :title="content" density="compact"></v-alert>
    </template>
    <v-alert class="mt-4" v-else type="error" :text="errorMessage">
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
      default: "result",
    },
  },
  setup(props) {
    const content = ref("");
    const errorMessage = ref("");
    const evaluateBoolean = (value) => {
      const trueValues = new Set(["true", "1"]);
      return trueValues.has(String(value).toLowerCase());
    };

    watch(
      [() => props.responseData, () => props.responseConfig],
      async ([responseData, responseConfig]) => {
        errorMessage.value = "";
        content.value = "";
        if (responseData) {
          try {
            content.value = (
              await getContent(
                responseData,
                responseConfig,
                props.responseDataPropertyName
              )
            ).toString();
          } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
          }
        }
      },
      { immediate: true }
    ); // Trigger watcher immediately when component is mounted

    return { evaluateBoolean, content, errorMessage };
  },
});
</script>
