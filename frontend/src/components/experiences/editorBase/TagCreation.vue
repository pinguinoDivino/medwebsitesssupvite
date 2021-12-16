<template>
  <base-dialog title="Crea un nuovo Tag" @close="closeTab">
    <form @submit.prevent="submitData">
      <section>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <div v-else>
          <div class="form-group" v-if="!!error">{ error }}</div>
          <div class="form-group" :class="{ invalid: !name.isValid }">
            <label for="name">Nome del tag</label>
            <input
              id="name"
              type="text"
              v-model.trim="name.val"
              class="form-control"
              @blur="clearValidity('name')"
            />
            <div class="invalid-message" v-if="!name.isValid">
              {{ name.errorText }}
            </div>
          </div>
          <div class="form-group" :class="{ invalid: !group.isValid }">
            <label for="name">Gruppo del tag</label>
            <select
              id="group"
              v-model.trim="group.val"
              class="form-control"
              @blur="clearValidity('group')"
            >
              <option v-for="group of tagGroups" :key="group[0]" :value="group[0]">{{group[1]}}</option>
            </select>
            <div class="invalid-message" v-if="!group.isValid">
              {{ group.errorText }}
            </div>
          </div>
        </div>
      </section>
      <footer>
        <base-button type="submit" mode="primary">Aggiungi tag</base-button>
      </footer>
    </form>
  </base-dialog>
</template>

<script>
import { ref, reactive, toRefs, inject } from "vue";
import {useStore} from "vuex";

export default {
  props: ["tags", "from"],
  emits: ["new-tag", "close"],
  setup(props, context) {
    const store = useStore();
    const name = reactive({
      val: "",
      isValid: true,
      errorText: ""
    });
    const group = reactive({
      val: "",
      isValid: true,
      errorText: ""
    });
    const error = ref(null);
    const isLoading = ref(false);

    const { tags } = toRefs(props);
    const tagGroups = inject("tagGroups");
    function validateForm() {
      for (const tag of tags.value) {
        if (tag.name.toLowerCase() === name.val.toLowerCase()) {
          name.isValid = false;
          name.errorText = "Esiste già un tag con questo nome";
        }
      }
      if (name.val === "") {
        name.isValid = false;
        name.errorText = "Inserisci il nome del tag";
      }
      if (group.val === "") {
        name.isValid = false;
        name.errorText = "Inserisci il gruppo del tag";
      }
    }
    async function submitData() {
      validateForm();
      if (!name.isValid) {
        return;
      }
      error.value = null;
      try {
        let newTag;
        await store.dispatch("experiences/addTag", {
          data: { name: name.val, group: group.val}, tp: props.from
        });
        newTag =
          store.getters["experiences/" + props.from + "Tags"][
            store.getters["experiences/" + props.from + "Tags"].length - 1
          ];
        context.emit("new-tag", { ...newTag, list: 2 });
      } catch (error) {
        error.value = error.message;
      }
      closeTab();
    }

    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = null;
    }
    function clearError() {
      error.value = null;
      isLoading.value = false;
      name.isValid = true;
      name.errorText = null;
    }
    function closeTab() {
      clearError();
      context.emit("close");
    }

    return { name, group, tagGroups,  error, isLoading, submitData, clearValidity, closeTab };
  }
};
</script>
