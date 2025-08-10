<template>
  <div>
    <v-navigation-drawer floating :width="400" class="pa-5">
      <v-text-field
        v-model="searchField"
        label="Search"
        outlinedb
        dense
        clearable
        placeholder="What are we exploing today?"
      ></v-text-field>
      <TagsSelectorComponent
        :tags="groupedTags"
        :tagsRelations="allTags"
        @filter="updateFilterTags"
      />
    </v-navigation-drawer>
    <v-container>
      <h1 align="center" class="text-h2 mb-3" style="letter-spacing: 25px !important;">VR Playground</h1>
      <h2 align="center" class="text-h6 mb-2">Explore The Playground</h2>
      <h3 align="center" class="text-body-1 mb-9">{{ description }}</h3>

      <v-row v-if="Object.keys(filteredContent).length > 0">
        <v-col
          lg="4"
          xs="12"
          cols="12"
          v-for="(vulns, language) in filteredContent"
          :key="language"
        >
          <v-card variant="tonal" color="purple-lighten-3">
            <v-card-title class="text-h6">{{ language }}</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="path in vulns"
                  :key="path.path"
                  @click="navigateToVulnerability(path.path)"
                >
                  <v-list-item-title>
                    {{ path.post?.description }} {{ path.get?.description }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row align="center" v-else>
        <v-col cols="4" offset="2">
          <v-alert
            class="mt-4"
            type="info"
            color="purple"
            variant="outlined"
            title="No vulnerabilities found"
            :text="`No vulnerabilities found for the search query: ${searchField}`"
          ></v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getUniqueGroupedData } from "@/utils/dataGrouping";
import jsonpath from "jsonpath";
import TagsSelectorComponent from "@/components/TagsSelectorComponent.vue";

export default {
  name: "explorer-view",
  components: {
    TagsSelectorComponent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const searchField = ref("");
    const filterTags = ref([]);
    const filteredContent = ref({});
    const swagger = computed(() => store.state.swaggerData);
    const description = computed(() => swagger.value?.info.description || "");

    const groupByTags = (swagger, tagIndex) => {
      let groupedSw = Object.groupBy(swagger.paths, (path) => {
        let tags = jsonpath.query(path, "$..tags")[0][tagIndex] || "no tag";
        return tags;
      });
      return groupedSw;
    };

    const groupedTags = computed(() => {
      if (!swagger.value) {
        return [];
      }
      let allTags = jsonpath.query(swagger.value, "$..tags");
      return getUniqueGroupedData(allTags);
    });

    const allTags = computed(() => {
      if (!swagger.value) {
        return [];
      }
      return jsonpath.query(swagger.value, "$..tags");
    });

    // filter the swaggers based on the search field
    const filteredContentBySearchField = (swagger, searchField) => {
      let searchPhrase = searchField.toLowerCase();
      let filteredPaths = swagger.paths.filter((path) => {
        // check if the search phrase is in the description or in the tags
        let searchProperties = [
          jsonpath.query(path, "$..description").join(" "),
          jsonpath.query(path, "$..tags").join(" "),
        ];

        return filterSentence(
          searchProperties.join(" ").toLowerCase(),
          searchPhrase
        );
      });
      // if there are any paths that match the search phrase, add the swagger to the filtered swaggers
      let tmpSwagger = { ...swagger };
      tmpSwagger.paths = filteredPaths;
      return tmpSwagger;
    };

    const filterSentence = (sentence, wordList) => {
      if (!sentence) {
        return false;
      }
      if (!wordList) {
        return false;
      }
      // Split the sentence into words
      const wordsToSearch = wordList.toLowerCase().split(/\s+/);
      // Check if any word in the sentence is in the wordList
      return wordsToSearch.every((word) =>
        sentence.toLowerCase().includes(word)
      );
    };

    // navigate to the vulnerability view
    const navigateToVulnerability = (vuln) => {
      router.push({
        name: "check-vulnerability-view",
        params: { vulnerability: vuln },
      });
    };

    const filterContentByTag = (swagger, tags) => {
      tags = tags.filter((tag) => tag).map((tag) => tag.toLowerCase());
      if (tags.length === 0) {
        return swagger;
      }
      let filteredPaths = swagger.paths.filter((path) => {
        // check if the search phrase is in the description or in the tags
        let searchProperties = jsonpath.query(path, "$..tags");
        return tags.every((tag) =>
          filterSentence(searchProperties.join(" "), tag)
        );
      });
      // if there are any paths that match the search phrase, add the swagger to the filtered swaggers
      let tmpSwagger = { ...swagger };
      tmpSwagger.paths = filteredPaths;
      return tmpSwagger;
    };

    const updateFilteredContent = () => {
      if (filterTags.value) {
        filteredContent.value = filterContentByTag(
          swagger.value,
          filterTags.value
        );
      }
      if (searchField.value) {
        filteredContent.value = filteredContentBySearchField(
          filteredContent.value,
          searchField.value
        );
      }
      filteredContent.value = groupByTags(filteredContent.value, 1);
    };

    // update the filter tags
    const updateFilterTags = (tags) => {
      filterTags.value = tags;
    };
    // watch the filter tags
    watch(filterTags, (newFilterTags) => {
      if (newFilterTags) {
        updateFilteredContent();
      }
    });
    // watch the search field
    watch(searchField, () => {
      updateFilteredContent();
    });

    watch(
      swagger,
      (newSwagger) => {
        if (newSwagger) {
          updateFilteredContent();
        }
      },
      { immediate: true }
    );

    return {
      navigateToVulnerability,
      filteredContent,
      description,
      searchField,
      updateFilterTags,
      groupedTags,
      allTags,
      filterTags,
    };
  },
};
</script>

<style scoped>
.max-width-col {
  flex: 1 0 0;
  max-width: 600px; /* Set your desired maximum width here */
}
</style>