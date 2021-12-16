<template>
  <div class="form-group">
    <h3>Università coinvolt<span v-if="isSingle">a</span><span v-else>e</span></h3>
    <div class="row form-row" v-if="!(isSingle && selectedUnivs.length >= 1)">
      <div class="col-md-6" :class="{ invalid: !inputCountry.isValid }">
        <label>Seleziona lo Stato</label>
        <vue-select
            v-model="inputCountry.val"
            :options="universityCountries"
            :empty-model-value="''"
            searchable
            label-by="name"
            value-by="country"
            :clear-on-close="true"
            :hide-selected="true"
            :close-on-select="true"
            placeholder="Cerca"
            search-placeholder="Cerca"
        />
        <div class="invalid-message" v-if="!inputCountry.isValid">
          {{ inputCountry.errorText }}
        </div>
      </div>
      <div class="col-md-6" v-if="!!filteredUniversities">
        <label>Seleziona l' università</label>
        <vue-multiselect
            :clear-on-select="true"
            v-model="selectedUnivs"
            :options="filteredUniversities"
            :multiple="true"
            :close-on-select="true"
            :hide-selected="true"
            :taggable="false"
            placeholder="Cerca"
            label="name"
            track-by="name"
            :max-height="150"
        >
          <template v-slot:noResult>Nessuna università trovata</template>
        </vue-multiselect>
      </div>
      <div class="col-md-6" v-else>
        <label>Seleziona lo stato prima di procedere</label>
      </div>
    </div>
    <div class="row" v-if="selectedUnivs.length > 0">
      <div class="col-12 lighbold">
        <label>Università selezionat<span v-if="isSingle">a</span><span v-else>e</span></label>
      </div>
      <div class="col-md-6" v-for="uni of selectedUnivs" :key="uni.id">
        <span>{{ uni.name }} presso {{ uni.country }}</span>
        <span class="remove-file" @click.prevent="removeUniversity(uni)"
        >Rimuovi</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import {ref, reactive, computed, inject, watch} from "vue";
import {removeItemAll} from "../../../hooks/baseFunctions.js";

export default {
  props: {
    universities: {
      type: Array,
      required: true
    },
    pUnivs: {
      type: Array,
      required: false,
      default: null
    },
    isSingle: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["selected-universities"],
  setup(props, context) {
    const selectedUnivs = ref(props.pUnivs !== null ? props.pUnivs : []);
    const inputCountry = reactive({
      val: "",
      isValid: true,
      errorText: null
    });
    const universityCountries = inject("universityCountries");

    const filteredUniversities = computed(function () {
      const univs = props.universities;
      if (inputCountry.val !== "") {
        return univs.filter(item => {
          return (
              item.country === inputCountry.val &&
              !selectedUnivs.value.includes(item)
          );
        });
      }
      return null;
    });

    function removeUniversity(univ) {
      inputCountry.val = "";
      removeItemAll(selectedUnivs.value, univ);
      context.emit("selected-universities", selectedUnivs.value);
    }
    watch(selectedUnivs, function (value) {
      context.emit("selected-universities", value);
    });

    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = "";
    }

    function undoSelection() {
      inputCountry.val = "";
    }

    return {
      inputCountry,
      universityCountries,
      filteredUniversities,
      removeUniversity,
      selectedUnivs,
      clearValidity,
      undoSelection,
    };
  }
};
</script>

