<template>
  <div v-if="tags">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h2 class="text-subtitle-1">Filter By Tag</h2>
      </div>
      <div>
        <v-btn @click="clearFilters" variant="plain">Clear filter</v-btn>
      </div>
    </div>
    <div v-for="(tagGroup, index) in tags" :key="index">
      <v-chip-group
        selected-class="text-purple-lighten-3"
        column
        v-model="selectedTags[index]"
      >
        <v-chip
          v-for="(tag, tagIndex) in tagGroup"
          :key="tagIndex"
          variant="outlined"
        >
          {{ tag }}
        </v-chip>
      </v-chip-group>
      <v-divider :thickness="2" class="mt-3 mb-3"></v-divider>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "TagsSelectorComponent",
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectedTags = reactive([]);
    const router = useRouter();

    const clearFilters = () => {
      selectedTags.splice(0, selectedTags.length);
    };

    // update the query string with the selected tags
    const updateQueryString = (selectedFilter) => {
      const queryParams = {};
      if (selectedFilter) {
        selectedFilter.forEach((item, index) => {
          queryParams[`f${index}`] = encodeURIComponent(item);
        });
      }
      router.replace({ query: queryParams });
    };

    // watch the selected tags and update the query string and emit the filter event
    watch(selectedTags, (newTags) => {
      let result = [];
      props.tags.forEach((tag, index) => {
        result.push(tag[newTags[index]]);
      });
      updateQueryString(result);
      emit("filter", result);
    });

    watch(
      () => props.tags,
      (newTags) => {
        if (Object.keys(router.currentRoute.value.query).length === 0) {
          return;
        }
        // get the selected tags from the query string and update the selectedTags
        newTags.forEach((tagGroup, index) => {
          let tag = router.currentRoute.value.query[`f${index}`];
          if (tag) {
            let tagIndex = tagGroup.indexOf(decodeURIComponent(tag));
            if (tagIndex !== -1) {
              selectedTags[index] = tagIndex;
            }
          }
        });
      },
      { immediate: true }
    );

    return {
      selectedTags,
      clearFilters,
    };
  },
};
</script>

