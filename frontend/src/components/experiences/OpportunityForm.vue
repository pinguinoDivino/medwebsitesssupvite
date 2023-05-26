<template>
  <div class="text-left">
    <h1>Opportunità</h1>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <div v-else>
      <form @submit.prevent="submitForm" novalidate>
        <div class="form-group" ref="firstDiv">
          <h2>Informazioni generali</h2>
          <div ref="universitiesDiv" v-if="hasUniversities">
            <university-editor :class="{invalid: !univ_id.isValid}"
                @selected-universities="updateUniv"
                :universities="universities"
                :isSingle="true"
                @click="clearValidity('univ_id')"
                :pUnivs="pAct !== null ? [pAct.university, ] : null"
            ></university-editor>
            <div class="invalid-message" v-if="!univ_id.isValid">
                {{ univ_id.errorText }}
             </div>
          </div>
          <div class="form-row row first-div">
            <div class="form-group col-md-6" :class="{ invalid: !istitution.isValid }">
              <label>Istituto</label>
              <input type="text" v-model.trim="istitution.val"
                     class="form-control" @click="clearValidity('istitution')"
              />
              <div class="invalid-message" v-if="!istitution.isValid">
                {{ istitution.errorText }}
              </div>
            </div>
            <div class="form-group col-md-6" :class="{ invalid: !refName.isValid }">
              <label>Referente esterno</label>
              <input type="text" v-model="refName.val" class="form-control" @blur="clearValidity('refName')"/>
              <div class="invalid-message" v-if="!refName.isValid">
                {{ refName.errorText }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <h2>Dettagli</h2>
          <div class="form-row row">
            <div class="col-lg-6" :class="{ invalid: !description.isValid }">
              <label for="revF">Descrivi</label>
              <textarea
                  id="revF"
                  class="form-control"
                  rows="10"
                  v-model.trim="description.val"
                  @blur="clearValidity('description')"
                  placeholder="Descrivi brevemente l'opportunità"
              >
            </textarea>
              <p v-if="description.isValid">{{ getLeftTextChars(description) }}</p>
              <div class="invalid-message" v-else>
                {{ description.errorText }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group" v-if="hasTags" ref="tagsDiv">
          <tag-editor
              from="opp"
              :tags="tags"
              :pTags="pAct !== null ? pAct.tags : null"
              :addTagBadgeClass="addTagBadgeClass"
              @selected-tags="setSelectedTags"
          >
          </tag-editor>
        </div>
        <div class="form-group form-footer">
          <base-button mode="danger" type="button" @click.prevent="back"
          >Indietro
          </base-button>
          <base-button v-if="!!pAct && !asModel" type="submit" mode="success">
            Salva modifiche
          </base-button>
          <base-button v-else type="submit" mode="success">
            Aggiungi opportunità
          </base-button>
          <base-button
              mode="danger"
              @click="goToTop"
              v-if="!formIsValid"
          >Correggi gli errori
          </base-button>
        </div>
      </form>
    </div>
    <base-dialog
        :show="!!loadingError"
        title="Errore nel caricamento"
        @close="handleError">
    </base-dialog>
  </div>
</template>

<script>
import {ref, reactive, computed, provide} from "vue";
import useUniversities from "../../hooks/universities.js";
import {useOppTags, useTagColors} from "../../hooks/tags.js";
import useChoices from "../../hooks/choices";
import getCountryName from "../../hooks/countries";
import {removeDuplicatesFromNestedArray} from "../../hooks/baseFunctions";
import TagEditor from "./editorBase/TagEditor.vue";
import UniversityEditor from "./editorBase/UniversityEditor.vue";

export default {
  components: {
    TagEditor,
    UniversityEditor
  },
  props: {
    pAct: {
      type: Object,
      required: false,
      default: null
    },
    asModel: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  emits: ['back', 'submit-form'],
  setup(props, context) {

    const isLoading = ref(false);
    const loadingError = ref(null);
    const {universities, hasUniversities, loadUniversities} = useUniversities();
    const {tags, hasTags, loadTags} = useOppTags();
    const {addTagBadgeClass} = useTagColors();
    const {oppTagGroups, loadChoices} = useChoices();

    loadUniversities(isLoading, loadingError);
    loadTags(isLoading, loadingError);
    loadChoices(['oppTagGroups',]);

    const universityCountries = computed(function () {
      const countries = [];
      for (const item of universities.value) {
        countries.push({
          country: item.country,
          name: getCountryName(item.country)
        });
      }
      return removeDuplicatesFromNestedArray(countries);
    });
    provide("universityCountries", universityCountries);
    provide("tagGroups", oppTagGroups);


    const maxTextChars = 2000;

    function getLeftTextChars(text) {
      return maxTextChars - text.val.length >= 0
          ? "Ti restano " +
          (maxTextChars - text.val.length) +
          " caratteri"
          : "Hai usato troppi caratteri";
    }

    const emptyFieldError = "Questo campo non può essere lasciato vuoto";


    const formIsValid = ref(true);
    const description = reactive({
      val: props.pAct !== null ? props.pAct.description : "",
      isValid: true,
      errorText: ""
    });
    const institution = reactive({
      val: props.pAct !== null ? props.pAct.institution : "",
      isValid: true,
      errorText: ""
    });
    const refName = reactive({
      val: props.pAct !== null ? props.pAct.ref : "",
      isValid: true,
      errorText: ""
    });

    const univ_id = reactive({
      val : props.pAct !== null && props.pAct.university !== null && props.pAct.university !== undefined ?
          props.pAct.university.id : null,
      isValid: true,
      errorText: ""
    });

    function updateUniv(payload) {
      if (payload.length > 0){
         univ_id.val = payload[0].id;
      } else {
        univ_id.val = null;
      }
    }

    const selectedTags = ref(props.pAct !== null ? props.pAct.tags : null);

    function setSelectedTags(newSelectedtags) {
      const newSelectedTags = [];
      for (const selectedTag of newSelectedtags) {
        const newSelectedTag = tags.value.filter(
            tag => tag.name === selectedTag.name
        )[0];
        newSelectedTags.push(newSelectedTag);
      }
      selectedTags.value = newSelectedTags;
    }

    function validateForm() {
      formIsValid.value = true;
      if (univ_id.val === null) {
        formIsValid.value = false;
        univ_id.isValid = false;
        univ_id.errorText = emptyFieldError;
      }
      if (istitution.val === "") {
        formIsValid.value = false;
        istitution.isValid = false;
        istitution.errorText = emptyFieldError;
      }
      if (istitution.val !== "" && istitution.val !== undefined && istitution.val.length > 300) {
        formIsValid.value = false;
        istitution.isValid = false;
        istitution.errorText = "Al massimo puoi usare 300 caratteri. Ne hai usati " + istitution.val.length;
      }
      if (refName.val === "") {
        formIsValid.value = false;
        refName.isValid = false;
        refName.errorText = emptyFieldError;
      }
      if (refName.val !== "" && refName.val !== undefined && refName.val.length > 150) {
        formIsValid.value = false;
        refName.isValid = false;
        refName.errorText = "Al massimo puoi usare 150 caratteri. Ne hai usati " + refName.val.length;
      }
      if (description.val === "") {
        formIsValid.value = false;
        description.isValid = false;
        description.errorText = emptyFieldError;
      }
      if (description.val !== "" && description.val !== undefined && description.val.length > maxTextChars) {
        formIsValid.value = false;
        description.isValid = false;
        description.errorText = "Al massimo puoi usare " + maxTextChars + " caratteri. Ne hai usati " + description.val.length;
      }
    }

    function submitForm() {
      formIsValid.value = true;
      validateForm();
      if (!formIsValid) {
        return;
      }
      context.emit("submit-form", {
        univ_id: univ_id.val,
        institution: institution.val,
        ref: refName.val,
        tags: selectedTags.value,
        description: description.val
      });
    }

    function back() {
      context.emit("back");
    }

    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = "";
    }

    function handleError() {
      loadingError.value = null;
    }

    function goToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    document.title = props.pAct !== null && !props.asModel ? "Modifica opportunità" : "Aggiungi opportunità";


    return {
      isLoading,
      loadingError,
      tags,
      hasTags,
      addTagBadgeClass,
      universities,
      hasUniversities,
      getLeftTextChars,
      formIsValid,
      description,
      institution,
      refName,
      univ_id,
      updateUniv,
      selectedTags,
      setSelectedTags,
      submitForm,
      back,
      clearValidity,
      handleError,
      goToTop
    }
  }
};
</script>

<style scoped>

</style>