<template>
  <v-sheet class="wrapper-sheet" color="#2d2f35" border="md">
    <div class="d-flex justify-space-between mb-3">
      <div class="address-column">
        <div v-for="(line, index) in addressLines" :key="index">
          {{ line }}
        </div>
      </div>
      <div class="hexdump-column">
        <div v-for="(line, index) in hexdumpLines" :key="index">
          {{ line }}
        </div>
      </div>
      <div class="textual-column">
        <div v-for="(line, index) in textualLines" :key="index">
          {{ line }}
        </div>
      </div>
    </div>
    <div v-if="contentLength > 0" class="d-flex justify-space-between">
      <div>{{ linesToRender }} / {{ contentLength }}</div>
      <div class="d-flex ga-3" v-if="contentLength !== linesToRender">
        <v-btn @click="loadMore">Load More</v-btn>
        <v-btn @click="loadAll">Load All</v-btn>
      </div>
    </div>
  </v-sheet>
</template>


<script>
import { ref, watch, defineComponent, computed } from "vue";
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
    bytesPerLine: {
      type: Number,
      default: 16,
    },
    loadingStep: {
      type: Number,
      default: 1600,
    },
  },
  setup(props) {
    const hexdumpLines = ref([]);
    const textualLines = ref([]);
    const addressLines = ref([]);
    const linesToRender = ref(props.loadingStep);
    let previousLinesToRender = 0;
    const contentLength = ref(0);
    const bytesPerLine = computed(() => props.bytesPerLine);
    const uint8Array = ref(null);

    watch(
      [
        () => props.responseData,
        () => props.responseConfig,
        () => linesToRender.value,
      ],
      async (
        [responseData, responseConfig, _linesToRender],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [oldResponseData, oldResponseConfig, _oldLinesToRender]
      ) => {
        // Reset hexdumpLines, textualLines, and addressLines when responseData or responseConfig changes
        if (_oldLinesToRender === _linesToRender) {
          hexdumpLines.value = [];
          textualLines.value = [];
          addressLines.value = [];
          previousLinesToRender = 0;
          contentLength.value = 0;
          uint8Array.value = null;
          linesToRender.value = props.loadingStep;
        }
        if (responseData) {
          try {
            if (contentLength.value === 0) {
              // Fetch content only once (when uint8Array is null)
              const content = await getContent(
                props.responseData,
                responseConfig
              );
              uint8Array.value = new Uint8Array(await content.arrayBuffer());
            }
            // Update contentLength and linesToRender
            contentLength.value = uint8Array.value.length;
            if (linesToRender.value > contentLength.value) {
              linesToRender.value = contentLength.value;
            }
            for (
              let i = previousLinesToRender;
              i < linesToRender.value;
              i += bytesPerLine.value
            ) {
              const hexdump = [];
              const textual = [];
              for (let j = 0; j < bytesPerLine.value; j++) {
                const byte = uint8Array.value[i + j];
                if (byte === undefined) {
                  hexdump.push("  ");
                  textual.push(" ");
                } else {
                  hexdump.push(byte.toString(16).padStart(2, "0"));
                  textual.push(
                    byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : "."
                  );
                }
              }
              previousLinesToRender = linesToRender.value;
              hexdumpLines.value.push(hexdump.join(" "));
              textualLines.value.push(textual.join(""));
              addressLines.value.push(i.toString(16).padStart(8, "0"));
            }
          } catch (error) {
            console.error(error);
          }
        }
      },
      { immediate: true }
    ); // Trigger watcher immediately when component is mounted

    const loadMore = () => {
      linesToRender.value += props.loadingStep;
      if (linesToRender.value > contentLength.value) {
        linesToRender.value = contentLength.value;
      }
    };

    const loadAll = () => {
      linesToRender.value = contentLength.value;
    };

    return {
      hexdumpLines,
      textualLines,
      addressLines,
      loadMore,
      loadAll,
      linesToRender,
      contentLength,
    };
  },
});
</script>

<style scoped>
.address-column {
  color: #66bb6a;
}
.hexdump-column {
  font-family: monospace;
}
.textual-column {
  font-family: monospace;
  color: #ce93d8;
}

</style>