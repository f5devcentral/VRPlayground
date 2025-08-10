<template>
  <v-sheet
    class="wrapper-sheet"
    color="#2d2f35"
    border="md"
  >
    <div class="ga-3 mb-4">
      <div>
        <h4 class="text-h5 font-weight-bold mb-2">{{ description }}</h4>
      </div>
      <div class="d-flex justify-end">
        <v-chip
          v-for="tag in tags"
          :key="tag"
          class="ma-1"
          color="purple-lighten-3"
          variant="outlined"
        >
          {{ tag }}
        </v-chip>
      </div>
    </div>
    <v-form @submit.prevent>
      <div v-for="field in formFields" :key="field">
        <v-text-field
          v-model="formData[field.name]"
          :label="field.name"
          variant="outlined"
          :rules="mandatoryRule"
          color="purple-lighten-3"
        ></v-text-field>
      </div>
      <v-btn @click="submit" type="submit" block class="mt-2">Send</v-btn>
    </v-form>
    <v-alert
      class="mt-4"
      v-if="errorMessage"
      type="error"
      title="Request Failed"
      :text="errorMessage"
    >
    </v-alert>
  </v-sheet>
</template>
<script>
import { ref, computed, reactive, defineComponent, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    requestConfig: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const errorMessage = ref("");
    const tags = computed(() => props.requestConfig.get.tags);
    const description = computed(() => props.requestConfig.get.description);
    const formFields = computed(() => props.requestConfig.get.parameters);
    const sendRequest = computed(() => store.state.sendRequest);

    // the content of the example might reside in the schema or in the field itself
    const formData = reactive(
      Object.fromEntries(
        formFields.value.map((field) =>
          field?.example
            ? [[field.name], field?.example || ""]
            : [[field.name], field.schema.example || ""]
        )
      )
    );
    /// rule for mandatory fields
    const mandatoryRule = ref([(v) => !!v || "Field is required"]);

    /// submit the request to the server
    const submit = async () => {
      if (formData.value) {
        return;
      }
      errorMessage.value = "";
      try {
        const response = await fetch(getURL(), getRequestParams());
        if (!response.ok) {
          // if the response is not ok, throw an error
          const errorData = response.headers
            .get("content-type")
            .includes("application/json")
            ? JSON.stringify(await response.json())
            : "";
          throw new Error(
            `HTTP error! Status: ${response.status}\n ${
              errorData?.error || errorData
            }`
          );
        }
        /// if the response is an image or a binary file, emit the response data

        if (response) {
          emit("response-data", response);
        } else {
          throw new Error(`Error from server: \n${response?.error}`);
        }
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error);
        emit("response-data", "");
      }
    };

    /// get the request parameters headers etc
    const getRequestParams = () => {
      return {
        method: "GET",
      };
    };
    /// get the url from the requestConfig. It might contain path parameters and query parameters
    const getURL = () => {
      return `${
        props.requestConfig.url
      }${getPathParams()}?${new URLSearchParams(getQueryParams()).toString()}`;
    };

    /// get the path parameters from the form data
    const getPathParams = () => {
      let pathParam = Object.keys(formData)
        .filter((key) =>
          formFields.value.some(
            (field) => field.in === "path" && field.name === key
          )
        )
        .map((key) => formData[key])
        .join("/");
      return pathParam ? `/${pathParam}` : "";
    };

    /// get the query parameters from the form data
    const getQueryParams = () => {
      return Object.keys(formData)
        .filter((key) =>
          formFields.value.some(
            (field) => field.in === "query" && field.name === key
          )
        )
        .map((key) => [key, formData[key]]);
    };

    /// watch the sendRequest state and submit the request - used for comparing attacks
    watch(sendRequest, () => {
      console.log("send request");
      submit();
    });

    return {
      errorMessage,
      formFields,
      formData,
      mandatoryRule,
      submit,
      description,
      tags,
    };
  },
});
</script>
