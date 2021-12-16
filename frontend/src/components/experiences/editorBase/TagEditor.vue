<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h2>Tags</h2>
      </div>
    </div>
    <div class="form-row row">
      <div class="form-group-sm col-6 col-md-4">
        <input
          type="text"
          v-model="searchTag"
          class="form-control"
          placeholder="Cerca i tags per nome"
        />
      </div>
      <div class="form-group-sm col-4" style="float: right;">
        <base-button
          type="button"
          mode="success"
          @click="showTagCreationDialog"
        >
          Crea nuovo tag
        </base-button>
      </div>
    </div>
    <h4>Tags disponibili</h4>
    <label>Sposta i tags per selezionarli</label>
    <div
      class="drop-zone"
      @drop="onDrop($event, 1)"
      @dragover.prevent
      @dragenter.prevent
    >
      <div v-if="hasFilteredSearchTagsList">
        <base-badge
          v-for="tag of filteredSearchTagsList.slice(0, tagMaximumNumber)"
          :key="tag.name"
          class="tag"
          :class="addTagBadgeClass(tag)"
          :name="tag.name"
          :count="from === 'exp' ? tag.using_count : tag.using_opp_count"
          draggable="true"
          @dragstart="startDrag($event, tag)"
          @click="setTag(2, tag)"
        >
        </base-badge>
        <div v-if="filteredSearchTagsList.length > tagMaximumNumber" class="my-1 small">
          <base-button mode="info" @click.prevent="showMoreTags">Mostra ancora</base-button>
        </div>
      </div>
      <div v-else>
        <p class="not-found">Tag non trovato.</p>
      </div>
    </div>
    <div>
      <h4>Tags selezionati</h4>
      <div
        class="drop-zone"
        @drop="onDrop($event, 2)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div v-if="hasSelectedTags">
          <base-badge
            v-for="tag in tagListTwo"
            :key="tag.name"
            class="tag"
            :class="addTagBadgeClass(tag)"
            :name="tag.name"
            :count="from === 'exp' ? tag.using_count : tag.using_opp_count"
            draggable="true"
            @dragstart="startDrag($event, tag)"
            @click="setTag(1, tag)"
          >
          </base-badge>
        </div>
        <p v-else>Non hai ancora selezionato alcun tag</p>
      </div>
    </div>
    <teleport to="#app">
      <tag-creation
        :show="isTagCreationShown"
        :tags="tags"
        :from="from"
        @new-tag="addNewTagToSelectedTags"
        @close="showTagCreationDialog"
      >
      </tag-creation>
    </teleport>
  </div>
</template>

<script>
import TagCreation from "./TagCreation.vue";
import { ref, computed } from "vue";

export default {
  components: {
    TagCreation
  },
  emits: ["selected-tags"],
  props: {
    from: {type: String, required: false, default: 'exp'},
    tags: { type: Array, required: true },
    pTags: { type: Array, required: false, default: null },
    addTagBadgeClass: {type: Function, required: true}
  },
  setup(props, context) {
    const tagList = ref([]);

    const tagListOne = computed(function() {
      return tagList.value.filter(tag => tag.list === 1);
    });

    const tagListTwo = computed(function() {
      const selectedTags = tagList.value.filter(tag => tag.list === 2);
      context.emit("selected-tags", selectedTags);
      return selectedTags;
    });

    const hasSelectedTags = computed(function() {
      return tagListTwo.value.length > 0;
    });

    function setTagList() {
      for (const tag of props.tags) {
        const tagItem = {
          ...tag,
          list: 1
        };
        tagList.value.push(tagItem);
      }
      if (props.pTags) {
        for (const index in tagList.value) {
          for (const tagS of props.pTags) {
            if (tagList.value[index].name === tagS.name) {
              tagList.value[index]["list"] = 2;
            }
          }
        }
      }
    }
    function addNewTagToSelectedTags(newTag) {
      tagList.value.push(newTag);
    }

    function startDrag(evt, tag) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("tagName", tag.name);
    }

    function onDrop(evt, list) {
      const tagName = evt.dataTransfer.getData("tagName");
      const tag = tagList.value.find(tag => tag.name === tagName);
      tag.list = list;
    }

    setTagList();

    const searchTag = ref("");

    const filteredSearchTagsList = computed(function() {
      return tagListOne.value.filter(tag => {
        return tag.name.includes(searchTag.value.toLowerCase());
      });
    });

    const hasFilteredSearchTagsList = computed(function() {
      return filteredSearchTagsList.value.length > 0;
    });

    const isTagCreationShown = ref(false);

    function showTagCreationDialog() {
      isTagCreationShown.value = !isTagCreationShown.value;
    }
    function setTag(list, tag) {
      tag.list = list;
    }
    const tagMaximumNumber = ref(20);
    const incrementTagNumber = 20;
    function showMoreTags(){
      tagMaximumNumber.value = tagMaximumNumber.value + incrementTagNumber;
    }

    return {
      tagList,
      tagListOne,
      tagListTwo,
      hasSelectedTags,
      addNewTagToSelectedTags,
      startDrag,
      onDrop,
      setTag,
      searchTag,
      filteredSearchTagsList,
      hasFilteredSearchTagsList,
      isTagCreationShown,
      showTagCreationDialog,
      tagMaximumNumber,
      showMoreTags
    };
  }
};
</script>

<style lang="css" scoped>
.drop-zone {
  background-color: #efefef;
  margin-bottom: 10px;
  padding: 10px;
}
[data-theme="dark"] .drop-zone {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #303339;
}
.tag {
  margin-right: 0.2rem;
  margin-top: 0.2rem;
}
input {
  padding: 5px 10px;
  font-size: .91rem;
}
</style>
