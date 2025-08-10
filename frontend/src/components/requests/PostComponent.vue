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
      <div v-for="(field, fieldName) in formFields" :key="fieldName">
        <v-text-field
          v-if="field.description === 'Text'"
          v-model="formData[fieldName]"
          :label="fieldName"
          variant="outlined"
          :rules="mandatoryRule"
          color="purple-lighten-3"
        ></v-text-field>
        <v-textarea
          v-else-if="field.description === 'Textarea'"
          v-model="formData[fieldName]"
          :label="fieldName"
          variant="outlined"
          :rules="mandatoryRule"
          color="purple-lighten-3"
        ></v-textarea>
        <v-text-field
          v-else-if="field.description === 'Password'"
          type="password"
          v-model="formData[fieldName]"
          :label="fieldName"
          variant="outlined"
          :rules="mandatoryRule"
          color="purple-lighten-3"
        ></v-text-field>
        <template v-else-if="field.description === 'TextareaEX'">
          <v-textarea
            v-model="formData[fieldName]"
            :label="fieldName"
            variant="outlined"
            :rules="mandatoryRule"
            color="purple-lighten-3"
            class="mb-5"
          ></v-textarea>
          <v-btn-toggle
            v-model="requestEncode"
            class="mb-5"
            rounded="2"
            color="purple-lighten-1"
            group
            density="compact"
          >
            <v-btn value="raw">Raw</v-btn>
            <v-btn value="escape"> Escape </v-btn>
            <v-btn value="base64"> Base64 </v-btn>
          </v-btn-toggle>
        </template>
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
    const requestEncode = ref("raw");
    const tags = computed(() => props.requestConfig.post.tags);
    const description = computed(() => props.requestConfig.post.description);
    const sendRequest = computed(() => store.state.sendRequest);
    const formFields = computed(
      () =>
        props.requestConfig.post.requestBody.content["application/json"].schema
          .properties
    );
    const formData = reactive(
      Object.fromEntries(
        Object.keys(formFields.value).map((fieldName) => [
          fieldName,
          formFields.value[fieldName].example || "",
        ])
      )
    );

    const mandatoryRule = [(v) => !!v || "You cannot leave this empty"];

    const submit = async () => {
      if (formData.value) {
        return;
      }
      errorMessage.value = "";
      try {
        const response = await fetch(
          props.requestConfig.url,
          getRequestParams()
        );
        if (!response.ok) {
          // if the response is not ok, throw an error
          const errorData = response.headers
            .get("content-type")
            .includes("application/json")
            ? JSON.stringify(await response.json())
            : "";
          throw new Error(
            `HTTP error! Status: ${response.status}\n${
              errorData?.error || errorData || await response.text()
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

    const getRequestParams = () => {
      return {
        method: "POST",
        body: JSON.stringify(formatRequestData(formData)),
        headers: {
          "Content-Type": "application/json",
        },
      };
    };

    const formatRequestData = (data) => {
      let result = {};
      if (requestEncode.value === "escape") {
        Object.entries(data).forEach(([key, value]) => {
          result[key] = parseEscapedChars(value);
        });
      } else if (requestEncode.value === "base64") {
        try {
          Object.entries(data).forEach(([key, value]) => {
            result[key] = atob(value);
          });
        } catch (error) {
          console.error(error);
          throw new Error(`Invalid Base64 string: ${Object.values(data)}`);
        }
      } else {
        result = { ...data };
      }
      return result;
    };

    const parseEscapedChars = (str) => {
      const escapeMap = {
        "\\": "\\",
        0: "\0",
        1: "\x01",
        2: "\x02",
        3: "\x03",
        4: "\x04",
        5: "\x05",
        6: "\x06",
        7: "\x07",
        a: "\x07",
        b: "\b",
        t: "\t",
        n: "\n",
        v: "\v",
        f: "\f",
        r: "\r",
        '"': '"',
        "'": "'",
        x: (a) => String.fromCharCode(parseInt(a.substr(1), 16)),
        u: (a) => {
          if (a[1] === "{") {
            return String.fromCodePoint(parseInt(a.slice(2, -1), 16));
          } else {
            return String.fromCharCode(parseInt(a.substr(1), 16));
          }
        },
      };

      return str.replace(
        /\\([abfnrtv'"]|[0-3][0-7]{2}|[0-7]{1,2}|x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]{1,6}\}|\\)/g,
        function (m, a) {
          const handler = escapeMap[a[0]];
          return typeof handler === "function" ? handler(a) : handler;
        }
      );
    };

    /// watch the sendRequest state and submit the request - used for comparing attacks
    watch(sendRequest, () => {
      console.log("send request");
      submit();
    });

    return {
      submit,
      mandatoryRule,
      formFields,
      formData,
      description,
      errorMessage,
      requestEncode,
      tags,
    };
  },
});
</script>

