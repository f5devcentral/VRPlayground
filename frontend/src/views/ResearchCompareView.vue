<template>
  <div class="pa-10">
    <div class="text-center">
      <v-btn
        @click="sendAll()"
        color="purple-lighten-1"
        class="ma-5"
        size="x-large"
        >compare all</v-btn
      >
    </div>
    <div class="d-flex justify-center flex-wrap gap-3">
      <check-vulnerability-component
        v-for="vulnerability in vulnerabilities"
        :key="vulnerability"
        :vulnerability="vulnerability"
      ></check-vulnerability-component>
    </div>
  </div>
</template>

<script>
import jsonpath from "jsonpath";

import { ref, computed, onMounted, defineComponent } from "vue";
import { useStore } from "vuex";
import CheckVulnerabilityComponent from "@/components/CheckVulnerabilityComponent.vue";

export default defineComponent({
  name: "research-compare-view",
  components: {
    CheckVulnerabilityComponent,
  },
  props: {
    researchGroup: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const vulnerabilities = ref([]);

    onMounted(async () => {
      await store.dispatch("loadSwaggerData");
      const swagger = computed(() => store.state.swaggerData);
      vulnerabilities.value = getVulnerabiliriesByReaserchGroup(
        swagger,
        props.researchGroup
      );
    });
    const getVulnerabiliriesByReaserchGroup = (swagger, researchGroup) => {
      const vulnerabilities = swagger.value.paths
        .filter((x) => jsonpath.query(x, "$..summary")[0] === researchGroup)
        .map((x) => x.path);
      console.log(vulnerabilities);
      return vulnerabilities;
    };

    const sendAll = () => {
      store.dispatch("sendAllRequests");
    };

    return {
      sendAll,
      vulnerabilities,
    };
  },
});
</script>

<style scoped>
.gap-3 {
  gap: 3em;
}
</style>