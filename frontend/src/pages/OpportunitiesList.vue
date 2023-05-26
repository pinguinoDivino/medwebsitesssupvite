<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>Lista delle Opportunità</h1>
      </div>
    </div>
    <div class="row py-1">
      <div class="col-12 text-left">
        <div class="row">
          <div class="col-12">
            <h2>Filtra e scopri</h2>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-8 col-md-6 col-lg-8">
            <input
                type="text"
                v-model="searchingVal"
                class="searching-input"
                placeholder="Cerca fra le opportunità per"
            />
          </div>
          <div class="col-4 col-md-3 col-lg-2 searching-attr">
            <select v-model="searchingAttr">
              <option value="__all__">Tutti</option>
              <option value="author__first_name">Nome autore</option>
              <option value="author__last_name">Cognome autore</option>
              <option value="description">Descrizione</option>
              <option value="university__name">Università</option>
              <option value="institution">Istituzione</option>
              <option value="tags__name">Parole chiave</option>
              <option class="not-found" value="">Disattiva</option>
            </select>
          </div>
          <div class="col-5 col-md-3 col-lg-2 searching-attr my-sm-1">
            <select v-model="orderingAttr">
              <option disabled>Ordina</option>
              <option value="created_at">Data creazione</option>
              <option value="-created_at">Data creazione (-)</option>
            </select>
          </div>
        </div>
        <div class="row form-group my-1">
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
                  @click.prevent="loadOpportunities('load')"
              >Carica ancora
              </base-button>
            </div>
          </div>
        </div>
        <div class="row form-group" v-if="areOpportunitiesLoaded">
          <div class="col-12">
            <div class="display-md sidebar" id="mySidenav">
              <base-toggledown-element>
                <template v-slot:header>
                  <h3>Status</h3>
                </template>
                <template v-slot:default>
                  <div class="option checkbox">
                    <input
                        type="radio"
                        id="active"
                        value="on"
                        v-model="filteringDict.status"
                    />
                    <label for="active">Attiva</label>
                  </div>
                  <div class="option checkbox">
                    <input
                        type="radio"
                        id="disactive"
                        value="off"
                        v-model="filteringDict.status"
                    />
                    <label for="disactive">Non attiva</label>
                  </div>
                  <div class="option checkbox">
                    <input
                        type="radio"
                        id="reset"
                        :value="null"
                        v-model="filteringDict.status"
                    />
                    <label for="reset">Rimuovi</label>
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element v-if="hasTutors">
                <template v-slot:header><h3>Tutors</h3></template>
                <template v-slot:default>
                  <div
                      class="option checkbox"
                      v-for="et of tutors"
                      :key="et[0]"
                  >
                    <input
                        type="checkbox"
                        :id="et[0]"
                        :value="et[0]"
                        v-model="filteringDict.tutors"
                    />
                    <label :for="et[0]">{{ et[1] }}</label>
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element>
                <template v-slot:header><h3>Data creazione</h3></template>
                <template v-slot:default>
                  <div class="option">
                    <label for="created_date_min">Da</label>
                    <input
                        type="date"
                        id="created_date_min"
                        v-model="filteringDict.created_date_min"
                    />
                  </div>
                  <div class="option">
                    <label for="created_date_max">A</label>
                    <input
                        type="date"
                        id="created_date_max"
                        v-model="filteringDict.created_date_max"
                    />
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element v-if="hasUniversities">
                <template v-slot:header><h3>Stato</h3></template>
                <template v-slot:default>
                  <input placeholder="Cerca..." v-model.trim="inputCountry"/>
                  <div v-if="filteredCountries.length > 0">
                    <div
                        class="option checkbox"
                        v-for="country of filteredCountries"
                        :key="country[0]"
                    >
                      <input
                          type="checkbox"
                          :id="country[0]"
                          :value="country[0]"
                          v-model="filteringDict.countries"
                      />
                      <label :for="country[0]">{{ country[1] }}</label>
                    </div>
                  </div>
                  <div v-else>
                    <div class="option">
                      <label class="not-found">Nessuno stato trovato</label>
                    </div>
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element v-if="hasTags">
                <template v-slot:header><h3>Tags</h3></template>
                <template v-slot:default>
                  <input placeholder="Cerca..." v-model.trim="inputTag"/>
                  <div v-if="filteredTags.length > 0">
                    <div
                        class="option checkbox"
                        v-for="tag of filteredTags"
                        :key="tag.name"
                    >
                      <input
                          type="checkbox"
                          :id="tag.name"
                          :value="tag.name"
                          v-model="filteringDict.tags"
                      />
                      <label :for="tag">{{ tag.name }}</label>
                    </div>
                  </div>
                  <div v-else>
                    <div class="option">
                      <label class="not-found">Nessun tag trovato</label>
                    </div>
                  </div>
                </template>
              </base-toggledown-element>
            </div>
            <div class="row" id="main">
              <div class="col-12 text-center" v-if="hasOpportunities">
                <swiper :effect="'coverflow'" :grabCursor="true" :centeredSlides="true" :slidesPerView="'auto'"
                        :keyboard='{
                  "enabled": true
                }'
                        :navigation="true"
                        :coverflowEffect='{
                    "rotate": 50,
                    "stretch": 0,
                    "depth": 100,
                    "modifier": 1,
                    "slideShadows": true
                  }'
                        :pagination="true" class="mySwiper">
                  <swiper-slide class="shadow" v-for="(opp, idx) of opportunities" :class="{
           'swiper-slide-1': idx % 5 === 0,
           'swiper-slide-2': idx % 5 === 1,
           'swiper-slide-3': idx % 5 === 2,
           'swiper-slide-4': idx % 5 === 3,
           'swiper-slide-5': idx % 5 === 4,
          }">
                    <div class="slide-inner">
                      <opportunity-item :opp="opp"></opportunity-item>
                    </div>
                  </swiper-slide>
                </swiper>
              </div>
              <div class="col-12" v-else-if="isLoading">
                <base-spinner></base-spinner>
              </div>
              <div class="col-12" v-else>
                <h3 class="not-found">Non sono state trovate delle opportunità</h3>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-else-if="isLoading">
          <div class="col-12">
            <base-spinner></base-spinner>
          </div>
        </div>
      </div>
    </div>
    <base-dialog
        :show="!!error"
        title="Errore nel caricamento"
        @close="handleError"
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
          <template v-slot:header>
            <h3>Status</h3>
          </template>
          <template v-slot:default>
            <div class="option checkbox">
              <input
                  type="radio"
                  id="activeD"
                  value="on"
                  v-model="filteringDict.status"
              />
              <label for="activeD">Attiva</label>
            </div>
            <div class="option checkbox">
              <input
                  type="radio"
                  id="disactiveD"
                  value="off"
                  v-model="filteringDict.status"
              />
              <label for="disactiveD">Non attiva</label>
            </div>
            <div class="option checkbox">
              <input
                  type="radio"
                  id="resetD"
                  :value="null"
                  v-model="filteringDict.status"
              />
              <label for="resetD">Rimuovi</label>
            </div>
          </template>
        </base-toggledown-element>
        <base-toggledown-element v-if="hasTutors">
          <template v-slot:header><h3>Tutors</h3></template>
          <template v-slot:default>
            <div
                class="option checkbox"
                v-for="et of tutors"
                :key="et[0]"
            >
              <input
                  type="checkbox"
                  :id="et[0]"
                  :value="et[0]"
                  v-model="filteringDict.tutors"
              />
              <label :for="et[0]">{{ et[1] }}</label>
            </div>
          </template>
        </base-toggledown-element>
        <base-toggledown-element>
          <template v-slot:header><h3>Data creazione</h3></template>
          <template v-slot:default>
            <div class="option">
              <label for="created_date_minD">Da</label>
              <input
                  type="date"
                  id="created_date_minD"
                  v-model="filteringDict.created_date_min"
              />
            </div>
            <div class="option">
              <label for="created_date_maxD">A</label>
              <input
                  type="date"
                  id="created_date_maxD"
                  v-model="filteringDict.created_date_max"
              />
            </div>
          </template>
        </base-toggledown-element>
        <base-toggledown-element v-if="hasUniversities">
          <template v-slot:header><h3>Stato</h3></template>
          <template v-slot:default>
            <input placeholder="Cerca..." v-model.trim="inputCountry"/>
            <div v-if="filteredCountries.length > 0">
              <div
                  class="option checkbox"
                  v-for="country of filteredCountries"
                  :key="country[0]"
              >
                <input
                    type="checkbox"
                    :id="country[0]"
                    :value="country[0]"
                    v-model="filteringDict.countries"
                />
                <label :for="country[0]">{{ country[1] }}</label>
              </div>
            </div>
            <div v-else>
              <div class="option">
                <label class="not-found">Nessuno stato trovato</label>
              </div>
            </div>
          </template>
        </base-toggledown-element>
        <base-toggledown-element v-if="hasTags">
          <template v-slot:header><h3>Tags</h3></template>
          <template v-slot:default>
            <input placeholder="Cerca..." v-model.trim="inputTag"/>
            <div v-if="filteredTags.length > 0">
              <div
                  class="option checkbox"
                  v-for="tag of filteredTags"
                  :key="tag.name"
              >
                <input
                    type="checkbox"
                    :id="tag.name"
                    :value="tag.name"
                    v-model="filteringDict.tags"
                />
                <label :for="tag">{{ tag.name }}</label>
              </div>
            </div>
            <div v-else>
              <div class="option">
                <label class="not-found">Nessun tag trovato</label>
              </div>
            </div>
          </template>
        </base-toggledown-element>
      </div>
    </base-dialog>
  </div>
</template>

<script>
import {useOppTags} from "../hooks/tags.js";
import useUniversities from "../hooks/universities.js";
import getCountryName from "../hooks/countries.js";
import useChoices from "../hooks/choices.js";
import {computed, reactive, ref, watch} from "vue";
import OpportunityItem from "../components/experiences/OpportunityItem.vue";
import {axiosService, catchAxiosError} from "../common/api.service.js";
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"


import SwiperCore, {
  Keyboard, EffectCoverflow, Pagination
} from 'swiper';
import {removeDuplicatesFromNestedArray} from "../hooks/baseFunctions";

SwiperCore.use([EffectCoverflow, Pagination, Keyboard]);

export default {
  components: {
    Swiper,
    SwiperSlide,
    OpportunityItem
  },
  setup() {
    const areTagsLoading = ref(false)
    const loadTagError = ref(null);
    const {tags, hasTags, loadTags} = useOppTags();
    const areUniversitiesLoading = ref(false);
    const loadUniversityError = ref(null);
    const {universities, hasUniversities, loadUniversities} = useUniversities();
    const {tutors, loadChoices} = useChoices();
    const hasTutors = computed(function () {
      return tutors.value.length > 0;
    });
    loadTags(areTagsLoading, loadTagError);
    loadUniversities(areUniversitiesLoading, loadUniversityError)
    loadChoices(['tutors']);

    // country filter
    const inputCountry = ref("");
    const countriesList = computed(function () {
      let list = [];
      for (const univ of universities.value) {
        list.push(univ.country);
      }
      return removeDuplicatesFromNestedArray(list);
    });
    const filteredCountries = computed(function () {
      let list = []
      for (const item of countriesList.value) {
        list.push([item, getCountryName(item)])
      }
      if (inputCountry.value !== "") {
        return list.filter(country =>
            country[1].toLowerCase().includes(inputCountry.value.toLowerCase())
        );
      } else {
        return list;
      }
    });
    // tag filter
    const inputTag = ref("");
    const filteredTags = computed(function () {
      if (inputTag.value !== "") {
        return tags.value.filter(tag => tag.using_opp_count > 0 &&
            tag.name.toLowerCase().includes(inputTag.value.toLowerCase())
        )
      } else {
        return tags.value.filter(tag => tag.using_opp_count > 0)
      }
    })
    //opportunities
    const isLoading = ref(false);
    const error = ref(null);
    const opportunities = ref([]);
    const next = ref(null);
    const areOpportunitiesLoaded = ref(false);
    const hasOpportunities = computed(function () {
      return opportunities.value.length > 0;
    });
    //searching
    const searchingAttr = ref("");
    const searchingVal = ref("");
    //ordering
    const orderingAttr = ref("-created_at");
    //filtering
    const filteringDict = reactive({
      status: null,
      created_date_min: null,
      created_date_max: null,
      tags: [],
      countries: [],
      tutors: [],
    });
    const prevEndpointOptions = ref({});

    async function loadOpportunities(option = "load") {
      isLoading.value = true;
      let endpoint = "/api/opportunities/";
      let options = prevEndpointOptions.value;
      if (option === "load") {
        if (next.value) {
          endpoint = next.value;
        }
        try {
          const response = await axiosService(endpoint);
          const responseData = await response.data;
          opportunities.value.push(...responseData.results);
          if (responseData.next) {
            next.value = responseData.next;
          } else {
            next.value = null;
          }
        } catch (e) {
          error.value = catchAxiosError(
              e,
              "Errore nei caricamento delle opportunity"
          ).detail;
        }
        isLoading.value = false;
        areOpportunitiesLoaded.value = true;
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
          created_date_min: filteringDict.created_date_min,
          created_date_max: filteringDict.created_date_max,
          status: filteringDict.status,
          tags: filteringDict.tags,
          countries: filteringDict.countries,
          tutors: filteringDict.tutors,
        });
        const responseData = await response.data;
        opportunities.value = responseData.results;
        if (responseData.next) {
          next.value = responseData.next;
        } else {
          next.value = null;
        }
      } catch (e) {
        error.value = catchAxiosError(
            e,
            "Errore nei caricamento delle opportunità"
        ).detail;
      }

      isLoading.value = false;
      prevEndpointOptions.value = options;
    }

    watch([searchingAttr, searchingVal], function (values) {
      if (values[0]) {
        loadOpportunities("searching");
      } else {
        searchingVal.value = "";
        prevEndpointOptions.value["searching"] = null;
        loadOpportunities("searching");
      }
    });
    watch([orderingAttr], function (value) {
      if (value) {
        loadOpportunities("ordering");
      }
    });
    watch([filteringDict], function () {
      loadOpportunities("filter");
    });

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

    function handleError() {
      error.value = null;
    }

    loadOpportunities();

    document.title = "Lista delle opportunità";
    return {
      tags,
      hasTags,
      hasUniversities,
      filteredCountries,
      inputCountry,
      filteredTags,
      inputTag,
      tutors,
      hasTutors,
      opportunities,
      next,
      areOpportunitiesLoaded,
      hasOpportunities,
      isLoading,
      error,
      loadOpportunities,
      searchingAttr,
      searchingVal,
      filteringDict,
      orderingAttr,
      isFilterDialogOpen,
      toggleNav,
      openFilterDialog,
      closeFilterDialog,
      handleError
    };
  }
};
</script>

<style scoped>
.swiper {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: var(--itembackgroundColorList);
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 280px;
  height: 540px;
  display: block;
  border-radius: 5px;
  color: white;
}

.swiper-slide-1 {
  background-color: var(--info);
}

.swiper-slide-2 {
  background-color: var(--primary);
}

.swiper-slide-3 {
  background-color: var(--danger);
}

.swiper-slide-4 {
  background-color: var(--success);
}

.swiper-slide-5 {
  background-color: var(--secondary);
}

.slide-inner {
  padding: 0.3rem;
  text-align: center;
  position: relative;
  height: 100%;

}

@media only screen and (min-width: 700px) {
  .swiper-slide {
    width: 400px;
    height: 500px;
  }
}

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
  transition: 0.3s;
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
</style>