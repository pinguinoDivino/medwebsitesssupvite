<template>
  <div class="text-left">
    <h1>Tirocinio curriculare</h1>
    <div>
      <form @submit.prevent="submitForm" novalidate>
        <div class="form-group" ref="firstDiv">
          <h2>Informazioni generali</h2>
          <div class="form-row row first-div">
            <div class="form-group col-md-6" :class="{ invalid: !authorContact.isValid }">
              <label>Contatto</label>
              <input type="text" v-model.trim="authorContact.val"
                     placeholder="Lascia un tuo contatto per essere ricontattato"
                     class="form-control" @click="clearValidity('authorContact')"
              />
              <div class="invalid-message" v-if="!authorContact.isValid">
                {{ authorContact.errorText }}
              </div>
            </div>
            <div class="form-group col-md-6" :class="{ invalid: !ward.isValid }">
              <label>Reparto</label>
              <select
                  class="form-control"
                  v-model="ward.val"
                  @click="clearValidity('ward')"
              >
                <option v-for="tp of internshipWards" :key="tp[0]" :value="tp[0]">{{
                    tp[1]
                  }}
                </option>
              </select>
              <div class="invalid-message" v-if="!ward.isValid">
                {{ ward.errorText }}
              </div>
            </div>
            <div class="form-group col-md-3" :class="{ invalid: !academicYear.isValid }">
              <label>Anno svolto</label>
              <select
                  class="form-control"
                  v-model="academicYear.val"
                  @click="clearValidity('academicYear')"
              >
                <option v-for="tp of internshipYears" :key="tp[0]" :value="tp[0]">{{
                    tp[1]
                  }}
                </option>
              </select>
              <div class="invalid-message" v-if="!academicYear.isValid">
                {{ academicYear.errorText }}
              </div>
            </div>
            <div class="form-group col-md-3" :class="{ invalid: !recommendedYear.isValid }">
              <label>Anno consigliato</label>
              <select
                  class="form-control"
                  v-model="recommendedYear.val"
                  @click="clearValidity('recommendedYear')"
              >
                <option v-for="tp of internshipYears" :key="tp[0]" :value="tp[0]">{{
                    tp[1]
                  }}
                </option>
              </select>
              <div class="invalid-message" v-if="!recommendedYear.isValid">
                {{ recommendedYear.errorText }}
              </div>
            </div>
            <div class="form-group col-md-3" :class="{ invalid: !place.isValid }">
              <label>Luogo</label>
              <select
                  class="form-control"
                  v-model="place.val"
                  @click="clearValidity('place')"
              >
                <option v-for="tp of internshipPlaces" :key="tp[0]" :value="tp[0]">{{
                    tp[1]
                  }}
                </option>
              </select>
              <div class="invalid-message" v-if="!place.isValid">
                {{ place.errorText }}
              </div>
            </div>
            <div class="form-group col-md-3" :class="{ invalid: !attendance.isValid }">
              <label>Presenza</label>
              <select
                  class="form-control"
                  v-model="attendance.val"
                  @click="clearValidity('attendance')"
              >
                <option v-for="tp of internshipAttendances" :key="tp[0]" :value="tp[0]">{{
                    tp[1]
                  }}
                </option>
              </select>
              <div class="invalid-message" v-if="!attendance.isValid">
                {{ attendance.errorText }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <h2>Recensione e Valutazione</h2>
          <div class="form-row row">
            <div class="col-md-8" :class="{ invalid: !review.isValid }">
              <label for="review">Lascia un tuo parere sul tirocinio</label>
              <textarea
                  id="review"
                  class="form-control"
                  rows="10"
                  v-model.trim="review.val"
                  @blur="clearValidity('review')"
                  placeholder="Cosa hai fatto? Racconta le attività che hai svolto e come ti sei trovato."
              >
            </textarea>
              <p v-if="review.isValid">{{ getLeftTextChars(review) }}</p>
              <div class="invalid-message" v-else>
                {{ review.errorText }}
              </div>
            </div>
            <div class="col-md-4 col-xl-3" :class="{ invalid: !rating.isValid }">
              <label>Globale</label>
              <base-counter-input class="form-control"
                                  :mdCounter="true"
                                  @click="clearValidity('rating')"
                                  :oldVal="rating.val"
                                  @update-value="rating.val = $event"
              ></base-counter-input>
              <div class="invalid-message" v-if="!rating.isValid">
                {{ rating.errorText }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group form-footer">
          <base-button mode="danger" type="button" @click.prevent="back"
          >Indietro
          </base-button>
          <base-button v-if="!!pAct" type="submit" mode="success">
            Salva modifiche
          </base-button>
          <base-button v-else type="submit" mode="success">
            Aggiungi tirocinio
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
  </div>
</template>

<script>
import {ref, reactive, inject} from "vue";
import useChoices from "../../hooks/choices.js";
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
  emits: ['back', 'submit-form'],
  setup(props, context) {
    const userEmail = inject('userEmail');
    const {internshipWards ,internshipAttendances, internshipPlaces, internshipYears, loadChoices} = useChoices();
    loadChoices(['internshipWards', 'internshipAttendances', 'internshipPlaces', 'internshipYears']);

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
    const ward = reactive({
      val: props.pAct !== null ? props.pAct.ward : "",
      isValid: true,
      errorText: ""
    });
    const academicYear = reactive({
      val: props.pAct !== null ? props.pAct.academic_year : null,
      isValid: true,
      errorText: ""
    });
    const recommendedYear = reactive({
      val: props.pAct !== null ? props.pAct.recommended_year : null,
      isValid: true,
      errorText: ""
    });
    const authorContact = reactive({
      val: props.pAct !== null ? props.pAct.author_contact : userEmail,
      isValid: true,
      errorText: ""
    });
    const review = reactive({
      val: props.pAct !== null ? props.pAct.review : "",
      isValid: true,
      errorText: ""
    });
    const rating = reactive({
      val: props.pAct !== null ? props.pAct.rating : 1,
      isValid: true,
      errorText: ""
    });
    const place = reactive({
      val: props.pAct !== null ? props.pAct.place : "",
      isValid: true,
      errorText: ""
    });
    const attendance = reactive({
      val: props.pAct !== null ? props.pAct.attendance : 1,
      isValid: true,
      errorText: ""
    });

    function validateForm(){
      if (ward.val === "") {
        formIsValid.value = false;
        ward.isValid = false;
        ward.errorText = emptyFieldError;
      }
      if (academicYear.val === null) {
        formIsValid.value = false;
        academicYear.isValid = false;
        academicYear.errorText = emptyFieldError;
      }
      if (recommendedYear.val === null) {
        formIsValid.value = false;
        recommendedYear.isValid = false;
        recommendedYear.errorText = emptyFieldError;
      }
      if (authorContact.val === "") {
        formIsValid.value = false;
        authorContact.isValid = false;
        authorContact.errorText = emptyFieldError;
      }
      if (authorContact.val !== "" && authorContact.val !== undefined && authorContact.val.length > 100) {
        formIsValid.value = false;
        authorContact.isValid = false;
        authorContact.errorText = "Al massimo puoi usare 100 caratteri. Ne hai usati " + authorContact.val.length;
      }
      if (review.val === "") {
        formIsValid.value = false;
        review.isValid = false;
        review.errorText = emptyFieldError;
      }
      if (review.val !== "" && review.val !== undefined && review.val.length > maxTextChars) {
        formIsValid.value = false;
        review.isValid = false;
        review.errorText = "Al massimo puoi usare " + maxTextChars + " caratteri. Ne hai usati " + review.val.length;
      }
      if (rating.val > 10 || rating.val < 0) {
        formIsValid.value = false;
        rating.isValid = false;
        rating.errorText = "Deve essere compreso fra 0 e 10";
      }
      if (place.val === "") {
        formIsValid.value = false;
        place.isValid = false;
        place.errorText = emptyFieldError;
      }
      if (attendance.val === null) {
        formIsValid.value = false;
        attendance.isValid = false;
        attendance.errorText = emptyFieldError;
      }

    }
    function submitForm(){
      formIsValid.value = true;
      validateForm();
      if (!formIsValid.value) {
        return;
      }
      context.emit("submit-form", {
        ward: ward.val,
        academic_year: academicYear.val,
        recommended_year: recommendedYear.val,
        rating: rating.val,
        review: review.val,
        place: place.val,
        attendance: attendance.val,
        author_contact: authorContact.val
      });
    }

    function back() {
      context.emit("back");
    }

    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = "";
    }

    function goToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    document.title = props.pAct !== null && !props.asModel ? "Modifica tirocinio" : "Aggiungi tirocinio";

    return {
      internshipWards,
      internshipAttendances,
      internshipPlaces,
      internshipYears,
      getLeftTextChars,
      formIsValid,
      ward,
      academicYear,
      recommendedYear,
      authorContact,
      review,
      rating,
      place,
      attendance,
      submitForm,
      back,
      clearValidity,
      goToTop
    }
  }
};
</script>

<style scoped>

</style>