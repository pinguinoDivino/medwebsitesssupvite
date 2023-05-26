<template>
  <div class="text-left">
    <h1>Esperienza</h1>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <div v-else>
      <form @submit.prevent="submitForm" novalidate>
        <div class="form-group" ref="firstDiv">
          <h2>Informazioni generali</h2>
          <div class="form-row row first-div">
            <div
                class="form-group col-md-6"
                :class="{ invalid: !description.isValid }"
            >
              <label>Breve titolo</label>
              <input type="text" v-model.trim="description.val"
                     placeholder="Intestazione dell'esperienza, massimo 60 caratteri"
                     class="form-control" @click="clearValidity('description')"
              />
              <div class="invalid-message" v-if="!description.isValid">
                {{ description.errorText }}
              </div>
            </div>
            <div
                class="form-group col-md-4"
                :class="{ invalid: !type.isValid }"
            >
              <label>Tipologia</label>
              <select
                  :disabled="pAct !== null"
                  class="form-control"
                  v-model="type.val"
                  @click="clearValidity('type')"
              >
                <option v-for="tp of experienceTypes" :key="tp[0]" :value="tp[0]">{{
                    tp[1]
                  }}
                </option>
              </select>
              <div class="invalid-message" v-if="!type.isValid">
                {{ type.errorText }}
              </div>
            </div>
          </div>
          <component
              ref="attrForm"
              :is="typeComponent"
              :type="typeFullName"
              :attrs="pAct !== null ? pAct.attrs : null"
              @update-attr="updateAttr"
          ></component>
        </div>
        <div class="form-group" ref="descDiv">
          <h2>Descrizione</h2>
          <div class="form-row row">
            <div class="col-lg-4"
                 :class="{ invalid: !authorContact.isValid }">
              <label for="authorContact">Contatto personale</label>
              <input
                  id="authorContact"
                  type="text"
                  class="form-control"
                  v-model.trim="authorContact.val"
                  @blur="clearValidity('authorContact')"
                  placeholder="Lascia un tuo contatto per essere ricontattato"
              />
              <div class="invalid-message" v-if="!authorContact.isValid">
                {{ authorContact.errorText }}
              </div>
            </div>
            <div class="col-lg-4"
                 :class="{ invalid: !startingDate.isValid }"
            >
              <label for="startingDate">Data di inizio dell' esperienza</label>
              <input
                  id="startingDate"
                  type="date"
                  class="form-control"
                  v-model.trim="startingDate.val"
                  @blur="clearValidity('startingDate')"
              />
              <div class="invalid-message" v-if="!startingDate.isValid">
                {{ startingDate.errorText }}
              </div>
            </div>
            <div class="col-lg-4"
                 :class="{ invalid: !endingDate.isValid }"
            >
              <label for="duration">Data di fine</label>
              <input
                  id="duration"
                  type="date"
                  class="form-control"
                  v-model.trim="endingDate.val"
                  placeholder="Se l'esperienza non è conclusa lasciare il campo vuoto"
                  @blur="clearValidity('endingDate')"
              />
              <div class="invalid-message" v-if="!endingDate.isValid">
                {{ endingDate.errorText }}
              </div>
            </div>
          </div>
          <div class="form-row row">
            <div class="col-lg-5"
                 :class="{ invalid: !refName.isValid }">
              <label for="refName">Referente esperienza</label>
              <input
                  id="refName"
                  type="text"
                  class="form-control"
                  v-model.trim="refName.val"
                  @blur="clearValidity('refName')"
                  placeholder="Con chi ti sei interfacciato nell'organizzazione?"
              />
              <div class="invalid-message" v-if="!refName.isValid">
                {{ refName.errorText }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group" ref="reviewDiv">
          <h2>Recensione</h2>
          <div class="form-row row">
            <div class="col-lg-6"
                 :class="{ invalid: !reviewA.isValid }"
            >
              <label for="reviewA">Racconta brevemente l'esperienza</label>
              <textarea
                  id="reviewA"
                  class="form-control"
                  rows="10"
                  v-model.trim="reviewA.val"
                  @blur="clearValidity('reviewA')"
                  placeholder="Cosa hai fatto? Racconta le attività che hai svolto"
              >
            </textarea>
              <p v-if="reviewA.isValid">{{ getLeftTextChars(reviewA) }}</p>
              <div class="invalid-message" v-else>
                {{ reviewA.errorText }}
              </div>
            </div>
            <div class="col-lg-6"
                 :class="{ invalid: !reviewB.isValid }"
            >
              <label for="reviewB">Rapporto con i ricercatori</label>
              <textarea
                  id="reviewB"
                  class="form-control"
                  rows="10"
                  v-model.trim="reviewB.val"
                  @blur="clearValidity('reviewB')"
                  placeholder="Come ti sei trovato con i professori e i ricercatori? Eventuali problemi riscontrati"
              >
            </textarea>
              <p v-if="reviewB.isValid">{{ getLeftTextChars(reviewB) }}</p>
              <div class="invalid-message" v-else>
                {{ reviewB.errorText }}
              </div>
            </div>
            <div class="col-lg-6"
                 :class="{ invalid: !reviewC.isValid }"
            >
              <label for="reviewC">A chi consigli l'esperienza?</label>
              <textarea
                  id="reviewC"
                  class="form-control"
                  rows="10"
                  v-model.trim="reviewC.val"
                  @blur="clearValidity('reviewC')"
                  placeholder="Secondo te chi dovrebbe replicare la tua esperienza e perchè?"
              >
            </textarea>
              <p v-if="reviewC.isValid">{{ getLeftTextChars(reviewC) }}</p>
              <div class="invalid-message" v-else>
                {{ reviewC.errorText }}
              </div>
            </div>
            <div class="col-lg-6"
                 :class="{ invalid: !indications.isValid }"
            >
              <label for="indications">Qualche dritta per ottenere il massimo</label>
              <textarea
                  id="indications"
                  class="form-control"
                  rows="10"
                  v-model.trim="indications.val"
                  @blur="clearValidity('indications')"
                  placeholder="Qualunque consiglio o suggerimento ti venga in mente"
              >
            </textarea>
              <p v-if="indications.isValid">{{ getLeftTextChars(indications) }}</p>
              <div class="invalid-message" v-else>
                {{ indications.errorText }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group" ref="ratingDiv">
          <h2>Valutazioni</h2>
          <h3>(compresa fra 1 e 10)</h3>
          <div class="form-row row">
            <div class="form-group-sm col-sm-6 col-xl-3" :class="{ invalid: !vGlobal.isValid }">
              <label>Globale</label>
              <base-counter-input class="form-control"
                                  :mdCounter="true"
                                  @click="clearValidity('vGlobal')"
                                  :oldVal="vGlobal.val"
                                  @update-value="vGlobal.val = $event"
              ></base-counter-input>
              <div class="invalid-message" v-if="!vGlobal.isValid">
                {{ vGlobal.errorText }}
              </div>
            </div>
            <div class="form-group-sm col-sm-6 col-xl-3" :class="{ invalid: !vStay.isValid }">
              <label>Soggiorno</label>
              <base-counter-input class="form-control"
                                  :mdCounter="true"
                                  @click="clearValidity('vStay')"
                                  :oldVal="vStay.val"
                                  @update-value="vStay.val = $event"
              ></base-counter-input>
              <div class="invalid-message" v-if="!vStay.isValid">
                {{ vStay.errorText }}
              </div>
            </div>
            <div class="form-group-sm col-sm-6 col-xl-3" :class="{ invalid: !vAcquiredKnowledge.isValid }">
              <label>Conoscenza acquisita</label>
              <base-counter-input class="form-control"
                                  :mdCounter="true"
                                  @click="clearValidity('vAcquiredKnowledge')"
                                  :oldVal="vAcquiredKnowledge.val"
                                  @update-value="vAcquiredKnowledge.val = $event"
              ></base-counter-input>
              <div class="invalid-message" v-if="!vAcquiredKnowledge.isValid">
                {{ vAcquiredKnowledge.errorText }}
              </div>
            </div>
            <div class="form-group-sm col-sm-6 col-xl-3" :class="{ invalid: !vInvolvement.isValid }">
              <label>Coinvolgimento</label>
              <base-counter-input class="form-control"
                                  :mdCounter="true"
                                  @click="clearValidity('vInvolvement')"
                                  :oldVal="vInvolvement.val"
                                  @update-value="vInvolvement.val = $event"
              ></base-counter-input>
              <div class="invalid-message" v-if="!vInvolvement.isValid">
                {{ vInvolvement.errorText }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <h2>Luoghi</h2>
          <div ref="universitiesDiv" v-if="hasUniversities">
            <university-editor
                @selected-universities="updateUnivs"
                :universities="universities"
                :pUnivs="pAct !== null ? pAct.universities : null"
            ></university-editor>
          </div>
          <div ref="cityDiv" v-if="hasCities" :class="{invalid: !cityId.isValid}">
            <city-editor
                @mouseover="clearValidity('cityId')"
                :class="{ invalid: !cityId.isValid }"
                @update-city="updateCity"
                :cities="cities"
                :oldCity="pAct !== null ? pAct.city : null"
            ></city-editor>
            <div v-if="!cityId.isValid" class="form-row row">
              <div class="col-12">
                <div class="invalid-message">
                  {{ cityId.errorText }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <h2>Immagine</h2>
          <div class="row form-row">
            <upload-images-form
                :oldImages="pAct !== null && !asModel? pAct.img !== null ? [pAct.img, ] : null : null" class="col-md-4"
                @upload-images="updateImg" ref="imageForm"
            ></upload-images-form>
          </div>
        </div>
        <div class="form-group" v-if="hasTags" ref="tagsDiv">
          <tag-editor
              from="exp"
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
            Aggiungi esperienza
          </base-button>
          <base-button
              mode="danger"
              @click="goToTop"
              v-if="!formIsValid || !attrIsValid"
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
import {ref, computed, reactive, provide, inject, onMounted, onBeforeUnmount, watch} from "vue";
import useCities from "../../hooks/cities.js";
import {useExpTags, useTagColors} from "../../hooks/tags.js";
import useUniversities from "../../hooks/universities.js";
import useChoices from "../../hooks/choices.js";
import getCountryName from "../../hooks/countries.js";
import {removeDuplicatesFromNestedArray} from "../../hooks/baseFunctions.js";
import UniversityEditor from "./editorBase/UniversityEditor.vue";
import CityEditor from "./editorBase/CityEditor.vue";
import UploadImagesForm from "./editorBase/UploadImagesForm.vue";
import TagEditor from "./editorBase/TagEditor.vue";
import SfsLabErasmusEditor from "./editor/SfsLabErasmusEditor.vue";
import CongressConferenceSummerSchoolEditor from "./editor/CongressConferenceSummerSchoolEditor.vue";
import InternshipEditor from "./editor/InternshipEditor.vue";

export default {
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
    }
  },
  components: {
    UploadImagesForm,
    UniversityEditor,
    CityEditor,
    TagEditor,
    SfsLabErasmusEditor,
    CongressConferenceSummerSchoolEditor,
    InternshipEditor
  },
  emits: ['submit-form', 'back'],
  setup(props, context) {
    const userEmail = inject('userEmail');
    const isLoading = ref(false);
    const loadingError = ref(null);
    const {universities, hasUniversities, loadUniversities} = useUniversities();
    const {tags, hasTags, loadTags} = useExpTags();
    const {addTagBadgeClass} = useTagColors();
    const {cities, hasCities, loadCities} = useCities()
    const {experienceTypes, expTagGroups, loadChoices} = useChoices();

    loadUniversities(isLoading, loadingError);
    loadTags(isLoading, loadingError);
    loadCities(isLoading, loadingError);
    loadChoices(['experienceTypes', 'expTagGroups']);

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
    provide("tagGroups", expTagGroups);


    const maxTextChars = 2000;
    const maxDescriptionChar = 100;

    function getLeftTextChars(text) {
      return maxTextChars - text.val.length >= 0
          ? "Ti restano " +
          (maxTextChars - text.val.length) +
          " caratteri"
          : "Hai usato troppi caratteri";
    }

    const emptyFieldError = "Questo campo non può essere lasciato vuoto";
    const tooLongBaseTextFieldError = "Al massimo puoi usare " + maxTextChars + " caratteri. Ne hai usati ";

    const formIsValid = ref(true);
    const attrIsValid = ref(true);
    const type = reactive({
      val: props.pAct !== null ? props.pAct.type : "sfs",
      isValid: true,
      errorText: ""
    });
    const description = reactive({
      val: props.pAct !== null ? props.pAct.description : "",
      isValid: true,
      errorText: ""
    });
    const reviewA = reactive({
      val: props.pAct !== null && !props.asModel ? props.pAct.review.split("&r)")[1] : "",
      isValid: true,
      errorText: ""
    });
    const reviewB = reactive({
      val: props.pAct !== null && !props.asModel ? props.pAct.review.split("&r)")[2] : "",
      isValid: true,
      errorText: ""
    });
    const reviewC = reactive({
      val: props.pAct !== null && !props.asModel ? props.pAct.review.split("&r)")[3] : "",
      isValid: true,
      errorText: ""
    });
    const indications = reactive({
      val: props.pAct !== null && !props.asModel ? props.pAct.indications : "",
      isValid: true,
      errorText: ""
    });
    const refName = reactive({
      val: props.pAct !== null ? props.pAct.ref : "",
      isValid: true,
      errorText: ""
    });
    const startingDate = reactive({
      val: props.pAct !== null && !props.asModel? props.pAct.started_at : "",
      isValid: true,
      errorText: ""
    });
    const endingDate = reactive({
      val: props.pAct !== null && !props.asModel ? props.pAct.ended_at : null,
      isValid: true,
      errorText: ""
    });
    const authorContact = reactive({
      val: props.pAct !== null && !props.asModel ? props.pAct.author_contact : userEmail.value,
      isValid: true,
      errorText: ""
    });
    const vGlobal = reactive({
      val:
          props.pAct !== null && !props.asModel
              ? props.pAct.rating.global_r
              : 1,
      isValid: true,
      errorText: ""
    });
    const vStay = reactive({
      val:
          props.pAct !== null && !props.asModel
              ? props.pAct.rating.stay_r
              : 1,
      isValid: true,
      errorText: ""
    });
    const vAcquiredKnowledge = reactive({
      val:
          props.pAct !== null && !props.asModel
              ? props.pAct.rating.acquired_knowledge_r
              : 1,
      isValid: true,
      errorText: ""
    });
    const vInvolvement = reactive({
      val:
          props.pAct !== null && !props.asModel
              ? props.pAct.rating.involvement_r
              : 1,
      isValid: true,
      errorText: ""
    });

    const univ_ids = ref(
        props.pAct !== null &&
        props.pAct.universities !== null &&
        props.pAct.universities !== undefined
            ? (() => {
              const ids = [];
              for (const uni of props.pAct.universities) {
                ids.push(uni.id);
              }
              return ids;
            })()
            : []
    );

    const cityId = reactive({
      val: props.pAct !== null ? props.pAct.city.id : null,
      isValid: true,
      errorText: ""
    });
    const attr = ref(props.pAct !== null ? props.pAct.attr : null);

    const img = ref(null);

    const selectedTags = ref(props.pAct !== null ? props.pAct.tags : null);

    const typeComponent = ref(
        props.pAct !== null ? props.pAct.attrs.component + "-editor" : "sfs-lab-erasmus-editor"
    );

    function setTypeComponent(payload) {
      if (
          payload === "sfs" ||
          payload === "lab" ||
          payload === "erasmus"
      ) {
        typeComponent.value = "sfs-lab-erasmus-editor";
      } else if (
          payload === "congress" ||
          payload === "summerschool"
      ) {
        typeComponent.value = "congress-conference-summer-school-editor";
      } else if (
          payload === "internship"
      ) {
        typeComponent.value = "internship-editor";
      } else {
        typeComponent.value = null;
      }
    }

    watch([type], function () {
      setTypeComponent(type.val);
    });

    const typeFullName = computed(function () {
      for (const tp of experienceTypes.value) {
        if (tp[0] === type.val) {
          return tp[1];
        }
      }
    })

    function updateImg(payload) {
      if(payload.length > 0) {
        img.value = payload[0];
      } else{
        return null;
      }
    }

    function updateCity(payload) {
      if (payload === null) {
        cityId.val = null;
      } else {
        cityId.val = payload.id;
      }
    }

    function updateAttr(payload) {
      attr.value = payload.data;
      attrIsValid.value = payload.attrIsValid;
    }

    function updateUnivs(payload) {
      univ_ids.value.splice(0, univ_ids.value.length);
      for (const item of payload) {
        univ_ids.value.push(item.id);
      }
    }

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
      if (type.val === "") {
        formIsValid.value = false;
        type.isValid = false;
        type.errorText = emptyFieldError;
      }
      if (description.val === "") {
        formIsValid.value = false;
        description.isValid = false;
        description.errorText = emptyFieldError;
      }
      if (description.val !== "" && description.val !== undefined && description.val.length > maxDescriptionChar) {
        formIsValid.value = false;
        description.isValid = false;
        description.errorText = "Al massimo puoi usare " + maxDescriptionChar + " caratteri. Ne hai usati " + description.val.length;
      }
      if (authorContact.val === "") {
        formIsValid.value = false;
        authorContact.isValid = false;
        authorContact.errorText = emptyFieldError;
      }
      if (authorContact.val !== null  &&  authorContact.val.length > 150) {
        formIsValid.value = false;
        authorContact.isValid = false;
        authorContact.errorText =  "Al massimo puoi usare 150 caratteri. Ne hai usati " + authorContact.val.length;
      }
      if (startingDate.val === "") {
        startingDate.isValid = false;
        startingDate.errorText = emptyFieldError;
        formIsValid.value = false;
      }
      if (
          endingDate.val !== null &&
          new Date(startingDate.val).getTime() > new Date(endingDate.val).getTime()
      ) {
        startingDate.isValid = false;
        startingDate.errorText =
            "La data di inizio non può essere maggiore di quella della fine";
        formIsValid.value = false;
      }
      if (reviewA.val === "") {
        formIsValid.value = false;
        reviewA.isValid = false;
        reviewA.errorText = emptyFieldError;
      }
      if (
          reviewA.val !== "" &&
          reviewA.val !== undefined &&
          reviewA.val.length > maxTextChars
      ) {
        formIsValid.value = false;
        reviewA.isValid = false;
        reviewA.errorText = tooLongBaseTextFieldError + reviewA.val.length;
      }
      if (reviewB.val === "") {
        formIsValid.value = false;
        reviewB.isValid = false;
        reviewB.errorText = emptyFieldError;
      }
      if (
          reviewB.val !== "" &&
          reviewB.val !== undefined &&
          reviewB.val.length > maxTextChars
      ) {
        formIsValid.value = false;
        reviewB.isValid = false;
        reviewB.errorText = tooLongBaseTextFieldError + reviewB.val.length;
      }
      if (reviewC.val === "") {
        formIsValid.value = false;
        reviewC.isValid = false;
        reviewC.errorText = emptyFieldError;
      }
      if (
          reviewC.val !== "" &&
          reviewC.val !== undefined &&
          reviewC.val.length > maxTextChars
      ) {
        formIsValid.value = false;
        reviewC.isValid = false;
        reviewC.errorText = tooLongBaseTextFieldError + reviewC.val.length;
      }
      if (indications.val === "") {
        formIsValid.value = false;
        indications.isValid = false;
        indications.errorText = emptyFieldError;
      }
      if (
          indications.val !== "" &&
          indications.val !== undefined &&
          indications.val.length > maxTextChars
      ) {
        formIsValid.value = false;
        indications.isValid = false;
        indications.errorText = tooLongBaseTextFieldError + indications.val.length;
      }
      if ((vGlobal.val !== null && (vGlobal.val < 0) || vGlobal.val > 10)) {
        formIsValid.value = false;
        vGlobal.isValid = false;
        vGlobal.errorText = "Deve essere compreso fra 0 e 10";
      }
      if ((vStay.val !== null && (vStay.val < 0) || vStay.val > 10)) {
        formIsValid.value = false;
        vStay.isValid = false;
        vStay.errorText = "Deve essere compreso fra 0 e 10";
      }
      if ((vAcquiredKnowledge.val !== null && (vAcquiredKnowledge.val < 0) || vAcquiredKnowledge.val > 10)) {
        formIsValid.value = false;
        vAcquiredKnowledge.isValid = false;
        vAcquiredKnowledge.errorText = "Deve essere compreso fra 0 e 10";
      }
      if ((vInvolvement.val !== null && (vInvolvement.val < 0) || vInvolvement.val > 10)) {
        formIsValid.value = false;
        vInvolvement.isValid = false;
        vInvolvement.errorText = "Deve essere compreso fra 0 e 10";
      }
      if (refName.val === "") {
        formIsValid.value = false;
        refName.isValid = false;
        refName.errorText = emptyFieldError;
      }
      if (
          refName.val !== "" &&
          refName.val !== undefined &&
          refName.val.length > 100
      ) {
        formIsValid.value = false;
        refName.isValid = false;
        refName.errorText = "Al massimo puoi usare 100 caratteri. Ne hai usati " + refName.val.length;
      }
      if (cityId.val === null || cityId.val === 0 || cityId.val === undefined) {
        formIsValid.value = false;
        cityId.isValid = false;
        cityId.errorText = emptyFieldError;
      }
    }

    function submitForm() {
      attrIsValid.value = false;
      attrForm.value.submitData();
      validateForm();
      if (!formIsValid.value || !attrIsValid.value) {
        return;
      }
      const data = {
        description: description.val,
        type: type.val,
        author_contact: authorContact.val,
        started_at: startingDate.val,
        ended_at: endingDate.val,
        ref: refName.val,
        review: "&r)" + reviewA.val + "&r)" + reviewB.val + "&r)" + reviewC.val,
        indications: indications.val,
        rating: {
          global_r: vGlobal.val,
          stay_r: vStay.val,
          acquired_knowledge_r: vAcquiredKnowledge.val,
          involvement_r: vInvolvement.val
        },
        univ_ids: univ_ids.value.toString(),
        city_id: cityId.val,
        tags: selectedTags.value,
      }
      let payload = {data};
      payload["attr"] = attr.value;
      if (img.value) {
        payload["img"] = img.value;
      }
      context.emit("submit-form", payload);
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

    // schort cuts
    const firstDiv = ref(null);
    const descDiv = ref(null);
    const universitiesDiv = ref(null);
    const reviewDiv = ref(null);
    const attrForm = ref(null)
    const cityDiv = ref(null);
    const filesDiv = ref(null);
    const ratingDiv = ref(null);
    const tagsDiv = ref(null);

    function goToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
    document.title = props.pAct !== null && !props.asModel ? "Modifica esperienza" : "Aggiungi esperienza";

    return {
      isLoading,
      loadingError,
      tags,
      hasTags,
      universities,
      hasUniversities,
      cities,
      hasCities,
      experienceTypes,
      formIsValid,
      attrIsValid,
      getLeftTextChars,
      maxDescriptionChar,
      description,
      type,
      authorContact,
      startingDate,
      endingDate,
      reviewA,
      reviewB,
      reviewC,
      indications,
      refName,
      vGlobal,
      vStay,
      vAcquiredKnowledge,
      vInvolvement,
      cityId,
      updateUnivs,
      updateAttr,
      selectedTags,
      typeComponent,
      typeFullName,
      setSelectedTags,
      addTagBadgeClass,
      updateCity,
      updateImg,
      submitForm,
      back,
      clearValidity,
      handleError,
      goToTop,
      firstDiv,
      descDiv,
      reviewDiv,
      ratingDiv,
      universitiesDiv,
      cityDiv,
      filesDiv,
      attrForm,
      tagsDiv
    }
  }
};
</script>

<style scoped>
.first-div input, .first-div select {
  padding: 5px;
}
</style>