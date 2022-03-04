<template>
  <div class="form-group">
    <h3>Città</h3>
    <p>
      Indicare la città dove si è svolta prevalentemente l'attività
    </p>
    <div class="row form-row">
      <div class="col-md-3">
        <label>Seleziona lo Stato</label>
        <vue-select
            v-model="selectedCountry"
            :options="countriesList"
            searchable
            :clear-on-close="true"
            :hide-selected="true"
            :close-on-select="true"
            placeholder="Cerca"
            search-placeholder="Cerca"
        />
      </div>
      <div class="col-md-3" v-if="selectedCountry">
        <label>Seleziona la Regione</label>
        <vue-select
            v-model="selectedRegion"
            :key="selectionRegionKey"
            :options="regionsList"
            searchable
            :clear-on-close="true"
            :hide-selected="true"
            :close-on-select="true"
            placeholder="Cerca"
            search-placeholder="Cerca"
        />
      </div>
      <div class="col-md-3" v-if="selectedCountry">
        <label>Seleziona la città</label>
        <vue-select
            v-model="selectedCity"
            :options="filteredCities"
            :key="selectionCityKey"
            searchable
            label-by="city"
            :clear-on-close="true"
            :hide-selected="true"
            :close-on-select="true"
            placeholder="Cerca"
            search-placeholder="Cerca"
        />
      </div>
      <div class="col-md-3 ct-btn">
        <label>Non trovi la città che cerchi?</label>
        <base-button
            mode="info"
            type="button"
            @click="toggleCityCreationModal"
        >Aggiungila!
        </base-button
        >
      </div>
    </div>
    <div v-if="selectedCity !== null && !less">
      <label>
        <span class="lighbold">Città selezionata: </span> <span class="not-found">{{ selectedCity.city }}</span> presso
        {{ selectedCity.country }}.
      </label>
    </div>
    <city-creation-form
        :show="isCityCreationShown"
        @new-city="addNewCity"
        :cities="cities"
        :countries="countriesList"
        @close="toggleCityCreationModal"
    ></city-creation-form>
  </div>
</template>

<script>
import {ref, computed, toRefs, watch} from "vue";
import CityCreationForm from "./CityCreationForm.vue";
import {removeDuplicatesFromNestedArray} from "../../../hooks/baseFunctions.js";

export default {
  components: {CityCreationForm},
  props: ["cities", "oldCity", "less"],
  emits: ["update-city"],
  setup(props, context) {
    const {cities} = toRefs(props);
    const selectedCountry = ref(
        props.oldCity !== null ? props.oldCity.country : ""
    );
    const selectedRegion = ref(
        props.oldCity !== null ? props.oldCity.region : ""
    );
    const selectedCity = ref(props.oldCity !== null ? props.oldCity : null);
    const isCityCreationShown = ref(false);
    const countriesList = computed(function () {
      let list = [];
      for (const city of cities.value) {
        list.push(city.country);
      }
      return removeDuplicatesFromNestedArray(list);
    });
    const regionsList = computed(function () {
      let list = [];
      for (const city of cities.value.filter(
          city => city.country === selectedCountry.value
      )) {
        list.push(city.region);
      }
      return removeDuplicatesFromNestedArray(list);
    });
    const filteredCities = computed(function () {
      const cts = cities.value
          .filter(city => city.country === selectedCountry.value)
          .sort();
      if (selectedRegion.value === null || selectedRegion.value === "") {
        return cts;
      } else {
        return cts.filter(city => city.region === selectedRegion.value).sort();
      }
    });

    function toggleCityCreationModal() {
      isCityCreationShown.value = !isCityCreationShown.value;
    }

    function addNewCity(payload) {
      selectedCity.value = payload;
      selectedCountry.value = payload.country;
      selectedRegion.value = payload.region;
    }

    const selectionRegionKey = ref(0);
    const selectionCityKey = ref(0);
    watch(selectedCountry, function () {
      selectedRegion.value = "";
      selectionRegionKey.value += 1;
    });
    watch(selectedRegion, function () {
      selectedCity.value = null;
      selectionCityKey.value += 1;
    });
    watch(selectedCity, function (value) {
      context.emit("update-city", value);
    });

    return {
      selectedCity,
      selectedRegion,
      countriesList,
      regionsList,
      selectedCountry,
      filteredCities,
      isCityCreationShown,
      toggleCityCreationModal,
      addNewCity,
      selectionRegionKey,
      selectionCityKey
    };
  }
};
</script>

<style lang="css" scoped>
.ct-btn {
  margin-top: 0.6rem;
  height: 100%;
}

.ct-btn label {
  margin-right: 1rem;
}

.ct-btn button {
  float: right;
}

@media screen and (min-width: 768px) {
  .ct-btn {
    position: absolute;
    right: 10px;
    margin: 0;
  }

  .ct-btn label {
    margin-right: 0;
  }
}
</style>
