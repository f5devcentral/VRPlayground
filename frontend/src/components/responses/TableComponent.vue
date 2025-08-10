<template>
  <v-sheet class="wrapper-sheet" v-if="content!==''" color="#2d2f35" border="md">
    <v-table :items="content" :items-per-page="responseData.length">
      <tbody>
        <tr v-for="rowItem in content" :key="rowItem">
          <td v-for="item in rowItem" :key="item">{{ item }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-alert class="mt-4" v-if="errorMessage" type="error" :text="errorMessage">
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
    watch(
      [() => props.responseData, () => props.responseConfig],
      async ([responseData, responseConfig]) => {
        errorMessage.value = "";
        content.value = "";
        if (responseData) {
          try {
            content.value = await getContent(
              responseData,
              responseConfig,
              props.responseDataPropertyName
            );
          } catch (error) {
            console.error(error);
            errorMessage.value = error.message;
          }
        }
      },
      { immediate: true }
    ); // Trigger watcher immediately when component is mounted
    return { content, errorMessage };
  },
});
</script>
