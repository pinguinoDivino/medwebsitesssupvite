<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 text-center text-lg-left">
        <h1>Tirocini curriculari</h1>
      </div>
    </div>
    <div class="row py-1">
      <div class="col-12 text-left">
        <div class="row">
          <div class="col-12">
            <h2>Filtra e cerca</h2>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-8 col-md-6 col-lg-8">
            <input
                type="text"
                v-model="searchingVal"
                class="searching-input"
                placeholder="Cerca fra i tirocini per"
            />
          </div>
          <div class="col-4 col-md-3 col-lg-2 searching-attr">
            <select v-model="searchingAttr">
              <option value="__all__">Tutti</option>
              <option value="author__user__first_name">Nome autore</option>
              <option value="author__user__last_name">Cognome autore</option>
              <option value="review">Descrizione</option>
              <option class="not-found" value="">Disattiva</option>
            </select>
          </div>
          <div class="col-5 col-md-3 col-lg-2 searching-attr my-sm-1">
            <select v-model="orderingAttr">
              <option disabled>Ordina</option>
              <option value="academic_year">Anno svolto</option>
              <option value="-academic_year">Anno svolto (-)</option>
              <option value="recommended_year">Anno consigliato</option>
              <option value="-recommended_year">Anno consigliato (-)</option>
              <option value="created_at">Data creazione</option>
              <option value="-created_at">Data creazione (-)</option>
            </select>
          </div>
        </div>
        <div class="row form-group my-1 header-search">
          <div class="col-12 header-search">
            <base-button
                type="button"
                mode="outline"
                class="filter-button"
                @click.prevent="toggleNav"
            >
                  <span class="filter-icon">
                    <span class="line line1"></span>
                    <span class="line line2"></span>
                    <span class="line line3"></span>
                  </span>
              Filtra
            </base-button>
            <base-button
                type="button"
                mode="primary"
                class="add-filter-button"
                @click.prevent="openFilterDialog"
            >
              Gestisci filtri
            </base-button>
            <div v-if="next">
              <base-button
                  mode="primary"
                  type="button"
                  @click.prevent="loadInternships('load')"
              >Carica ancora
              </base-button>
            </div>
          </div>
        </div>
        <div class="row" v-if="isLoading">
          <div class="col-12">
            <base-spinner></base-spinner>
          </div>
        </div>
        <div class="row form-group" v-if="areInternshipsLoaded">
          <div class="col-12">
            <div class="display-md sidebar" id="mySidenav">
              <base-toggledown-element>
                <template v-slot:header><h3>Luogo</h3></template>
                <template v-slot:default>
                  <div
                      class="option checkbox"
                      v-for="place of internshipPlaces"
                      :key="place[0]"
                  >
                    <input
                        type="checkbox"
                        :id="place[0]+ '-place'"
                        :value="place[0]"
                        v-model="filteringDict.places"
                    />
                    <label :for="place[0]+ '-place'">{{ place[1] }}</label>
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element>
                <template v-slot:header><h3>Presenze</h3></template>
                <template v-slot:default>
                  <div
                      class="option checkbox"
                      v-for="attendance of internshipAttendances"
                      :key="attendance[0]"
                  >
                    <input
                        type="checkbox"
                        :id="attendance[0]+ '-attendance'"
                        :value="attendance[0]"
                        v-model.number="filteringDict.attendances"
                    />
                    <label :for="attendance[0]+ '-attendance'">{{ attendance[1] }}</label>
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element>
                <template v-slot:header><h3>Anno consigliato</h3></template>
                <template v-slot:default>
                  <div
                      class="option checkbox"
                      v-for="year of internshipYears"
                      :key="year[0]"
                  >
                    <input
                        type="checkbox"
                        :id="year[0]+ '-year'"
                        :value="year[0]"
                        v-model.number="filteringDict.recommendedYears"
                    />
                    <label :for="year[0]+ '-year'">{{ year[1] }}</label>
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element>
                <template v-slot:header><h3>Valutazione</h3></template>
                <template v-slot:default>
                  <div class="option">
                    <label for="rating_min">A partire da </label>
                    <input
                        type="number"
                        id="rating_min"
                        min="0"
                        max="10"
                        v-model.number="filteringDict.ratingMin"
                    />
                  </div>
                </template>
              </base-toggledown-element>
            </div>
            <div class="content-container" id="main">
              <div class="wards-container" v-if="hasInternships">
                <transition-group name="list">
                  <ward-item v-for="ward of wards" :key="ward" :ward="getWardName(ward)"
                             :internships="internshipsGroupedByWard[ward]"
                             :func1="getPlaceName" :func2="getYearFull"/>
                </transition-group>
              </div>
              <div v-else-if="isLoading">
                <base-spinner></base-spinner>
              </div>
              <div v-else>
                <h3 class="not-found">Non sono stati trovati dei tirocini</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <base-dialog
      :show="!!error"
      title="Errore nel caricamento"
      @close="handleError('error')"
  >
    <p>{{ error }}</p>
  </base-dialog>
  <base-dialog
      :show="!!isFilterDialogOpen"
      color="var(--secondary)"
      title="I tuoi filtri"
      @close="closeFilterDialog">
    <div class="filter-dialog">
      <base-toggledown-element>
        <template v-slot:header><h3>Luogo</h3></template>
        <template v-slot:default>
          <div
              class="option checkbox"
              v-for="place of internshipPlaces"
              :key="place[0]"
          >
            <input
                type="checkbox"
                :id="place[0]+ '-place'"
                :value="place[0]"
                v-model="filteringDict.places"
            />
            <label :for="place[0]+ '-place'">{{ place[1] }}</label>
          </div>
        </template>
      </base-toggledown-element>
      <base-toggledown-element>
        <template v-slot:header><h3>Presenze</h3></template>
        <template v-slot:default>
          <div
              class="option checkbox"
              v-for="attendance of internshipAttendances"
              :key="attendance[0]"
          >
            <input
                type="checkbox"
                :id="attendance[0]+ '-attendance'"
                :value="attendance[0]"
                v-model.number="filteringDict.attendances"
            />
            <label :for="attendance[0]+ '-attendance'">{{ attendance[1] }}</label>
          </div>
        </template>
      </base-toggledown-element>
      <base-toggledown-element>
        <template v-slot:header><h3>Anno consigliato</h3></template>
        <template v-slot:default>
          <div
              class="option checkbox"
              v-for="year of internshipYears"
              :key="year[0]"
          >
            <input
                type="checkbox"
                :id="year[0]+ '-year'"
                :value="year[0]"
                v-model.number="filteringDict.recommendedYears"
            />
            <label :for="year[0]+ '-year'">{{ year[1] }}</label>
          </div>
        </template>
      </base-toggledown-element>
      <base-toggledown-element>
        <template v-slot:header><h3>Valutazione</h3></template>
        <template v-slot:default>
          <div class="option">
            <label for="rating_minD">A partire da </label>
            <input
                type="number"
                id="rating_minD"
                min="0"
                max="10"
                v-model.number="filteringDict.ratingMin"
            />
          </div>
        </template>
      </base-toggledown-element>
    </div>
  </base-dialog>
</template>

<script>
import WardItem from "../components/experiences/WardItem.vue";
import {computed, reactive, ref, watch} from "vue";
import useChoices from "../hooks/choices.js";
import {capitalize} from "../hooks/baseFunctions";
import {axiosService, catchAxiosError} from "../common/api.service.js";

export default {
  components: {
    WardItem,
  },
  setup() {
    const {internshipAttendances, internshipWards, internshipPlaces, internshipYears, loadChoices} = useChoices();

    loadChoices(['internshipAttendances', 'internshipWards', 'internshipPlaces', 'internshipYears']);

    const internships = ref([]);
    const next = ref(null);
    const hasInternships = computed(function () {
      return internships.value.length > 0;
    });
    const areInternshipsLoaded = ref(false);
    const error = ref(null);
    const isLoading = ref(false);

    //searching
    const searchingAttr = ref("");
    const searchingVal = ref("");
    //ordering
    const orderingAttr = ref("-created_at");
    //filtering
    const filteringDict = reactive({
      recommendedYears: [],
      attendances: [],
      places: [],
      ratingMin: 0,
    });
    const prevEndpointOptions = ref({});

    async function loadInternships(option = "load") {
      isLoading.value = true;
      let endpoint = "/api/unipi-internships/";
      let options = prevEndpointOptions.value;
      if (option === "load") {
        if (next.value) {
          endpoint = next.value;
        }
        try {
          const response = await axiosService(endpoint);
          const responseData = await response.data;
          internships.value.push(...responseData.results);
          if (responseData.next) {
            next.value = responseData.next;
          } else {
            next.value = null;
          }
        } catch (e) {
          error.value = catchAxiosError(
              e,
              "Errore nei caricamento dei tirocini"
          ).detail;
        }
        isLoading.value = false;
        areInternshipsLoaded.value = true;
        return;
      }
      if (option === "ordering") {
        options["ordering"] = orderingAttr.value;
      }
      if (option === "searching") {
        options["searching"] = {[searchingAttr.value]: searchingVal.value};
      }
      if (endpoint.includes("/?") && options["ordering"]) {
        endpoint += `&ordering=${options["ordering"]}`;
      } else if (!endpoint.includes("/?") && options["ordering"]) {
        endpoint += `?ordering=${options["ordering"]}`;
      }
      if (endpoint.includes("/?") && options["searching"]) {
        endpoint += `&search=${
            Object.values(options["searching"])[0]
        }&search_fields=${Object.keys(options["searching"])[0]}`;
      } else if (!endpoint.includes("/?") && options["searching"]) {
        endpoint += `?search=${
            Object.values(options["searching"])[0]
        }&search_fields=${Object.keys(options["searching"])[0]}`;
      }
      try {
        const response = await axiosService(endpoint, "GET", undefined, {
          recommendedYears: filteringDict.recommendedYears,
          places: filteringDict.places,
          attendances: filteringDict.attendances,
          ratingMin: filteringDict.ratingMin
        });
        const responseData = await response.data;
        internships.value = responseData.results;
        if (responseData.next) {
          next.value = responseData.next;
        } else {
          next.value = null;
        }
      } catch (e) {
        error.value = catchAxiosError(
            e,
            "Errore nei caricamento dei tirocini"
        ).detail;
      }

      isLoading.value = false;
      prevEndpointOptions.value = options;
    }

    watch([searchingAttr, searchingVal], function (values) {
      if (values[0]) {
        loadInternships("searching");
      } else {
        searchingVal.value = "";
        prevEndpointOptions.value["searching"] = null;
        loadInternships("searching");
      }
    });
    watch([orderingAttr], function (value) {
      if (value) {
        loadInternships("ordering");
      }
    });
    watch([filteringDict], function () {
      loadInternships("filter");
    });

    loadInternships();

    function getWardName(ward) {
      for (const x of internshipWards.value) {
        if (x[0] === ward) {
          return x[1]
        }
      }
      return ward
    }

    function getPlaceName(place) {
      for (const x of internshipPlaces.value) {
        if (x[0] === place) {
          return x[1]
        }
      }
      return place
    }

    function getYearFull(year) {
      for (const x of internshipYears.value) {
        if (x[0] === year) {
          return x[1]
        }
      }
      return year
    }

    const internshipsGroupedByWard = computed(function () {
      const igw = {};
      for (const int of internships.value) {
        if(!Object.keys(igw).includes(int.ward )){
          igw[int.ward] = []
        }
        igw[int.ward].push(int);
      }
      for (let key of Object.keys(igw)) {
        if (igw[key].length === 0) {
          delete igw[key]
        }
      }
      return igw;
    });

    const wards = computed(function () {
      return Object.keys(internshipsGroupedByWard.value).sort();
    });


    function handleError(input) {
      eval(input).value = null;
    }

    //sidenav md width > 768px
    const sideWidth = "350px";
    const sideNavWidth = ref("0");

    function toggleNav() {
      if (sideNavWidth.value === "0") {
        document.getElementById("mySidenav").style.width = sideWidth;
        document.getElementById("mySidenav").style.paddingLeft = "1rem";
        document.getElementById("main").style.marginLeft = sideWidth;
        sideNavWidth.value = sideWidth;
      } else {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("mySidenav").style.paddingLeft = "0";
        document.getElementById("main").style.marginLeft = "0";
        sideNavWidth.value = "0";
      }
    }

    // filter list sm width < 768px
    const isFilterDialogOpen = ref(false);

    function openFilterDialog() {
      isFilterDialogOpen.value = true;
    }

    function closeFilterDialog() {
      isFilterDialogOpen.value = false;
    }

    document.title = "Lista dei tirocini";

    return {
      internshipAttendances,
      internshipWards,
      internshipPlaces,
      internshipYears,
      internships,
      next,
      hasInternships,
      areInternshipsLoaded,
      isLoading,
      error,
      searchingAttr,
      searchingVal,
      orderingAttr,
      filteringDict,
      internshipsGroupedByWard,
      wards,
      getWardName,
      loadInternships,
      getPlaceName,
      getYearFull,
      capitalize,
      toggleNav,
      isFilterDialogOpen,
      openFilterDialog,
      closeFilterDialog,
      handleError,
    };
  }
};
</script>

<style scoped>
.container-fluid {
  min-height: 100vh;
}

.searching-attr,
.filter-button,
.add-filter-button {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  color: var(--fontColor);
}

.my-sm-1 {
  margin-top: 1rem;
}

.filter-button {
  font-weight: 900;
  font-size: 1.1rem;
  background-color: var(--inputColor);
  display: none !important;
}

.add-filter-button {
  font-weight: 900;
  font-size: 1.1rem;
  background-color: var(--inputColor);
}

.searching-attr select {
  margin-left: auto;
}

.searching-input {
  background-image: url("/static/img/frontend/experiences/searchicon.png");
  background-position: 5px 6px;
  background-repeat: no-repeat;
  width: 100%;
  font-size: 16px; /* Increase font-size */
  padding: 4px 2px 4px 30px; /* Add some padding */
}

[data-theme="dark"] .searching-input {
  background-image: url("/static/img/frontend/experiences/searchicondark.png");
}

.filter-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line {
  height: 2px;
  margin: 0.2rem;
}

[data-theme="light"] .line {
  background-color: black !important;
}

[data-theme="dark"] .line {
  background-color: #a6a9b4 !important;
}

.line1 {
  width: 30px;
}

.line2 {
  width: 18px;
}

.line3 {
  width: 10px;
}

.sidebar {
  height: 100%;
  min-height: 80vh;
  width: 0;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding-top: 1px;
  border-top: 1px solid #c1b9b9;
}

.sidebar, #main {
  transition: 0.3s;
}

[data-theme="dark"] .sidebar {
  color: #a6a9b4;
}

.sidebar h3,
.filter-dialog h3 {
  padding: 8px 8px 8px 10px;
  font-size: 1.1rem;
  transition: 0.3s;
  display: inline-block;
  margin: 0;
}

.sidebar .option,
.filter-dialog .option {
  padding-left: 4px;
  position: relative;
}

.sidebar .option label,
.sidebar .option input {
  font-size: 0.8rem;
}

.filter-dialog .option label,
.filter-dialog .option input {
  font-size: 0.6rem;
}

.sidebar .option input,
.filter-dialog .option input {
  margin-right: 3px;
}

.sidebar .option.checkbox label,
.filter-dialog .option.checkbox label {
  left: 20px;
  top: 40%;
  position: absolute;
  transform: translateY(-50%);
}

.header-search {
  display: flex;
  flex-direction: row;
  justify-content: stretch;
}

.header-search div:last-of-type {
  margin-left: auto;
}

@media screen and (min-width: 430px) {
  .filter-dialog .option.checkbox label,
  .filter-dialog .option input {
    font-size: 0.8rem;
  }
}

@media screen and (min-width: 768px) {
  .my-sm-1 {
    margin-top: 0;
  }

  .filter-button {
    display: flex !important;
  }

  .add-filter-button {
    display: none !important;
  }
}
.list-enter-active,
.list-leave-active,
.list-move {
  transition: 400ms cubic-bezier(0.64, 0.26, 0.08, 1.03);
  transition-property: opacity, transform;
}
.list-enter {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.5);
}
.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}
.list-leave-active {
  position: absolute;
  opacity: 0;
  transform: scaleY(0);
}
</style>