<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 text-left">
        <h1>Esperienze</h1>
      </div>
    </div>
    <div class="row py-1">
      <div class="col-12 text-left">
        <div class="row">
          <div class="col-12">
            <h2>Lista</h2>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-8 col-md-6 col-lg-8">
            <input
                type="text"
                v-model="searchingVal"
                class="searching-input"
                placeholder="Cerca fra le attività per"
            />
          </div>
          <div class="col-4 col-md-3 col-lg-2 searching-attr">
            <select v-model="searchingAttr">
              <option value="__all__">Tutti</option>
              <option value="author__user__first_name">Nome autore</option>
              <option value="author__user__last_name">Cognome autore</option>
              <option value="description">Descrizione</option>
              <option value="review">Recensione</option>
              <option value="indications">Indicazioni</option>
              <option value="tags__name">Parole chiave</option>
              <option class="not-found" value="">Disattiva</option>
            </select>
          </div>
          <div class="col-5 col-md-3 col-lg-2 searching-attr my-sm-1">
            <select v-model="orderingAttr">
              <option disabled>Ordina</option>
              <option value="started_at">Data inizio</option>
              <option value="-started_at">Data inizio (-)</option>
              <option value="ended_at">Data fine</option>
              <option value="-ended_at">Data fine (-)</option>
              <option value="created_at">Data creazione</option>
              <option value="-created_at">Data creazione (-)</option>
            </select>
          </div>
        </div>
        <div class="row form-group my-1 header-search">
          <div class="col-12">
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
          </div>
        </div>
        <div class="row form-group" v-if="areExperiencesLoaded">
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
                    <label for="active">In corso</label>
                  </div>
                  <div class="option checkbox">
                    <input
                        type="radio"
                        id="disactive"
                        value="off"
                        v-model="filteringDict.status"
                    />
                    <label for="disactive">Conclusa</label>
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
              <base-toggledown-element v-if="hasExperienceTypes">
                <template v-slot:header><h3>Tipologia</h3></template>
                <template v-slot:default>
                  <div
                      class="option checkbox"
                      v-for="et of experienceTypes"
                      :key="et[0]"
                  >
                    <input
                        type="checkbox"
                        :id="et[0]"
                        :value="et[0]"
                        v-model="filteringDict.typologies"
                    />
                    <label :for="et[0]">{{ et[1] }}</label>
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element>
                <template v-slot:header><h3>Data inizio</h3></template>
                <template v-slot:default>
                  <div class="option">
                    <label for="start_date_min">Da</label>
                    <input
                        type="date"
                        id="start_date_min"
                        v-model="filteringDict.start_date_min"
                    />
                  </div>
                  <div class="option">
                    <label for="start_date_max">A</label>
                    <input
                        type="date"
                        id="start_date_max"
                        v-model="filteringDict.start_date_max"
                    />
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element>
                <template v-slot:header><h3>Valutazioni</h3></template>
                <template v-slot:default>
                  <div class="option">
                    <label for="global_r_min">V.globale da</label>
                    <input
                        type="number"
                        id="global_r_min"
                        min="0"
                        max="10"
                        v-model.number="filteringDict.rating_min[0]"
                    />
                  </div>
                  <div class="option">
                    <label for="stay_r_min">V. istituzione da</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        id="stay_r_min"
                        v-model.number="filteringDict.rating_min[1]"
                    />
                  </div>
                  <div class="option">
                    <label for="aquired_knowledge_r">V. conoscenza da</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        id="aquired_knowledge_r"
                        v-model.number="filteringDict.rating_min[2]"
                    />
                  </div>
                  <div class="option">
                    <label for="involvement_r_min">V. coinvolgimento da</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        id="involvement_r_min"
                        v-model.number="filteringDict.rating_min[3]"
                    />
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element v-if="hasCities">
                <template v-slot:header><h3>Stato</h3></template>
                <template v-slot:default>
                  <input placeholder="Cerca..." v-model.trim="inputCountry"/>
                  <div v-if="filteredCountries.length > 0">
                    <div
                        class="option checkbox"
                        v-for="country of filteredCountries"
                        :key="country"
                    >
                      <input
                          type="checkbox"
                          :id="country"
                          :value="country"
                          v-model="filteringDict.countries"
                      />
                      <label :for="country">{{ country }}</label>
                    </div>
                  </div>
                  <div v-else>
                    <div class="option">
                      <label class="not-found">Nessuno stato trovato</label>
                    </div>
                  </div>
                </template>
              </base-toggledown-element>
              <base-toggledown-element v-if="hasCities">
                <template v-slot:header><h3>Regione</h3></template>
                <template v-slot:default>
                  <input placeholder="Cerca..." v-model.trim="inputRegion"/>
                  <div v-if="filteredRegions.length > 0">
                    <div
                        class="option checkbox"
                        v-for="region of filteredRegions"
                        :key="region"
                    >
                      <input
                          type="checkbox"
                          :id="region"
                          :value="region"
                          v-model="filteringDict.regions"
                      />
                      <label :for="region">{{ region }}</label>
                    </div>
                  </div>
                  <div v-else>
                    <div class="option">
                      <label class="not-found">Nessuna regione trovata</label>
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
            <div class="table-container" id="main">
              <div class="table-container" v-if="hasExperiences">
                <table id="experiences">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Descrizione</th>
                    <th v-for="fieldH of fields" :key="fieldH">
                      {{ fieldH[0] }}
                    </th>
                    <th>Hai fatto anche te questa esperienza?</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(exp, idx) of experiences" :key="exp.id">
                    <td>{{ idx + 1 }}</td>
                    <td>
                      <router-link
                          :to="{
                            name: 'experience-detail',
                            params: { slug: exp.slug }
                          }"
                      >{{ exp.description }}
                      </router-link>
                    </td>
                    <td v-for="fieldB of fields" :key="fieldB">
                      {{ getGoodField(exp[fieldB[1]], fieldB[1]) }}
                    </td>
                    <td>
                      <router-link v-if="userFullName !== exp.author && userIsAuth1"
                          :to="{
                            name: 'activity-editor',
                            params: {type: 'experiences',slug: exp.slug, scope: 'asModel', group: exp.group }
                          }"
                      >Cosa aspetti? Raccontala!</router-link>
                      <p v-else>
                        Azione non disponibile
                      </p>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <base-button
                    v-if="next"
                    mode="primary"
                    type="button"
                    @click.prevent="loadExperiences('load')"
                >Carica ancora
                </base-button>
              </div>
              <div v-else-if="isLoading">
                <base-spinner></base-spinner>
              </div>
              <div v-else>
                <h3 class="not-found">Non sono state trovate delle esperienze</h3>
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
    <div class="row py-1">
      <div class="col-12" v-if="graphLoading">
        <base-spinner></base-spinner>
      </div>
      <div class="col-12" v-if="graphError">
        <p class="display-6 not-found">{{graphError}}</p>
      </div>
      <div class="col-12" v-else>
        <div class="row">
          <div class="col-12">
            <h2>Statistiche generali</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <h3>Tipologie</h3>
            <pie-chart :data="expTypeGraphData" legend="bottom"
                           :colors="['#449c9f', '#8c6292', '#f56300', '#d04f4f', '#50AC49', '#FF9E7A']"
                ></pie-chart>
          </div>
          <div class="col-12">
            <h3>I 10 Tags più usati</h3>
            <column-chart :data="expTagGraphData" legend="bottom" :colors="['#000000', '#D52732',
                  '#4D8725', '#04ffd9', '#EE8E01', '#522D6D',
                  '#017488', '#908F8D', '#005696'
                ]"
                ></column-chart>
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
          <template v-slot:header><h3>Status</h3></template>
          <template v-slot:default>
            <div class="option checkbox">
              <input
                  type="radio"
                  id="activeD"
                  value="on"
                  v-model="filteringDict.status"
              />
              <label for="activeD">In corso</label>
            </div>
            <div class="option checkbox">
              <input
                  type="radio"
                  id="disactiveD"
                  value="off"
                  v-model="filteringDict.status"
              />
              <label for="disactiveD">Conclusa</label>
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
        <base-toggledown-element>
          <template v-slot:header><h3>Tipologia</h3></template>
          <template v-slot:default>
            <div
                class="option checkbox"
                v-for="tp of experienceTypes"
                :key="tp[0]"
            >
              <input
                  type="checkbox"
                  :id="tp[0]"
                  :value="tp[0]"
                  v-model="filteringDict.typologies"
              />
              <label :for="tp[0]">{{ tp[1] }}</label>
            </div>
          </template>
        </base-toggledown-element>
        <base-toggledown-element>
          <template v-slot:header><h3>Data inizio</h3></template>
          <template v-slot:default>
            <div class="option">
              <label for="start_date_minD">Da</label>
              <input
                  type="date"
                  id="start_date_minD"
                  v-model="filteringDict.start_date_min"
              />
            </div>
            <div class="option">
              <label for="start_date_maxD">A</label>
              <input
                  type="date"
                  id="start_date_maxD"
                  v-model="filteringDict.start_date_max"
              />
            </div>
          </template>
        </base-toggledown-element>
        <base-toggledown-element>
          <template v-slot:header><h3>Valutazioni</h3></template>
          <template v-slot:default>
            <div class="option">
              <label for="global_r_minD">V.globale da</label>
              <input
                  type="number"
                  id="global_r_minD"
                  min="0"
                  max="10"
                  v-model="filteringDict.rating_min[0]"
              />
            </div>
            <div class="option">
              <label for="stay_r_minD">V. istituzione da</label>
              <input
                  type="number"
                  min="0"
                  max="10"
                  id="stay_r_minD"
                  v-model="filteringDict.rating_min[1]"
              />
            </div>
            <div class="option">
              <label for="aquired_knowledge_rD">V. conoscenza da</label>
              <input
                  type="number"
                  min="0"
                  max="10"
                  id="aquired_knowledge_rD"
                  v-model="filteringDict.rating_min[2]"
              />
            </div>
            <div class="option">
              <label for="involvement_r_minD">V. coinvolgimento da</label>
              <input
                  type="number"
                  min="0"
                  max="10"
                  id="involvement_r_minD"
                  v-model="filteringDict.rating_min[3]"
              />
            </div>
          </template>
        </base-toggledown-element>
        <base-toggledown-element v-if="hasCities">
          <template v-slot:header><h3>Stato</h3></template>
          <template v-slot:default>
            <input placeholder="Cerca..." v-model.trim="inputCountry"/>
            <div v-if="filteredCountries.length > 0">
              <div
                  class="option checkbox"
                  v-for="country of filteredCountries"
                  :key="country"
              >
                <input
                    type="checkbox"
                    :id="country"
                    :value="country"
                    v-model="filteringDict.countries"
                />
                <label :for="country">{{ country }}</label>
              </div>
            </div>
            <div v-else>
              <div class="option">
                <label class="not-found">Nessuno stato trovato</label>
              </div>
            </div>
          </template>
        </base-toggledown-element>
        <base-toggledown-element v-if="hasCities">
          <template v-slot:header><h3>Regione</h3></template>
          <template v-slot:default>
            <input placeholder="Cerca..." v-model.trim="inputRegion"/>
            <div v-if="filteredRegions.length > 0">
              <div
                  class="option checkbox"
                  v-for="region of filteredRegions"
                  :key="region"
              >
                <input
                    type="checkbox"
                    :id="region"
                    :value="region"
                    v-model="filteringDict.regions"
                />
                <label :for="region">{{ region }}</label>
              </div>
            </div>
            <div v-else>
              <div class="option">
                <label class="not-found">Nessuna regione trovata</label>
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
import {ref, reactive, computed, watch} from "vue";
import {
  removeDuplicatesFromNestedArray,
} from "../hooks/baseFunctions";
import useAuth from "../hooks/auth.js";
import {useExpTags} from "../hooks/tags.js";
import useChoices from "../hooks/choices.js";
import useCities from "../hooks/cities";
import {useGoodDateFormat} from "../hooks/dates.js";
import {axiosService, catchAxiosError} from "../common/api.service";

export default {
  props: {
    optionsOn: {
      type: String,
      required: false,
      default: null
    },
    optionsDefault: {
      type: Array,
      required: false,
      default: null
    }
  },
  setup(props) {
    const {tags, hasTags, loadTags} = useExpTags();
    const {cities, hasCities, loadCities} = useCities();
    const {userFullName, userIsAuth1} = useAuth();
    const {experienceTypes, loadChoices} = useChoices();
    const {getGoodDateFormat} = useGoodDateFormat();
    const hasExperienceTypes = computed(function () {
      return experienceTypes.value && experienceTypes.value.length > 0;
    });
    loadChoices(['experienceTypes']);
    const areCitiesLoading = ref(false);
    const loadingCitiesError = ref(null);
    loadCities(areCitiesLoading, loadingCitiesError);
    const areTagsLoading = ref(false);
    const loadingTagError = ref(null);
    loadTags(areTagsLoading, loadingTagError)

    //tag filter
    const inputTag = ref("");
    const filteredTags = computed(function () {
      if (inputTag.value !== "") {
        return tags.value.filter(tag => tag.using_count > 0 &&
            tag.name.toLowerCase().includes(inputTag.value.toLowerCase())
        )
      } else {
        return tags.value.filter(tag => tag.using_count > 0)
      }
    })
    //country filter
    const inputCountry = ref("");
    const countriesList = computed(function () {
      let list = [];
      for (const city of cities.value) {
        list.push(city.country);
      }
      return removeDuplicatesFromNestedArray(list);
    });
    const filteredCountries = computed(function () {
      if (inputCountry.value !== "") {
        return countriesList.value.filter(country =>
            country.toLowerCase().includes(inputCountry.value.toLowerCase())
        );
      } else {
        return countriesList.value;
      }
    });
    //region filter
    const inputRegion = ref("");
    const regionsList = computed(function () {
      let list = [];
      for (const city of cities.value) {
        if (city.country === "Italy") {
          list.push(city.region);
        }
      }
      return removeDuplicatesFromNestedArray(list);
    });
    const filteredRegions = computed(function () {
      if (inputRegion.value !== "") {
        return regionsList.value.filter(region =>
            region.toLowerCase().includes(inputRegion.value.toLowerCase())
        );
      } else {
        return regionsList.value;
      }
    });
    const fields = ref([
      ["Autore", "author"],
      ["Tipologia", "type"],
      ["Data di inizio", "started_at"],
      ["Data di fine", "ended_at"],
      ["Città", "city"],
      ["Valutazione media", "rating"]
    ]);

    function getGoodField(input, property = null) {
      if (property === "started_at") {
        return getGoodDateFormat(input);
      }
      if (property === "started_at") {
        return getGoodDateFormat(input);
      }
      if (property === "rating") {
        return input['average'];
      }
      if (property === "type") {
        for (const x of experienceTypes.value) {
          if (x[0] === input) return x[1];
        }
      }
      if (input && property === "ended_at") {
        return getGoodDateFormat(input);
      }
      if (input && property === "city") {
        return input['city'];
      }
      if (input) {
        return input;
      } else {
        return "Non disponibile";
      }
    }

    //experiences
    const isLoading = ref(false);
    const error = ref(null);
    const next = ref(null);
    const experiences = ref([]);
    const hasExperiences = computed(function () {
      return experiences.value.length > 0;
    });
    const areExperiencesLoaded = ref(false);

    //searching
    const searchingAttr = ref("");
    const searchingVal = ref("");
    //ordering
    const orderingAttr = ref("-created_at");
    //filtering
    const filteringDict = reactive({
      status: null,
      typologies: [],
      start_date_min: null,
      start_date_max: null,
      countries: [],
      regions: [],
      tags: [],
      rating_min: [0, 0, 0, 0]
    });
    const prevEndpointOptions = ref({});

    async function loadExperiences(option = "load") {
      isLoading.value = true;
      let endpoint = "/api/experiences/";
      let options = prevEndpointOptions.value;
      if (option === "load") {
        if (next.value) {
          endpoint = next.value;
        }
        try {
          const response = await axiosService(endpoint);
          const responseData = await response.data;
          experiences.value.push(...responseData.results);
          if (responseData.next) {
            next.value = responseData.next;
          } else {
            next.value = null;
          }
        } catch (e) {
          error.value = catchAxiosError(
              e,
              "Errore nei caricamento delle esperienze"
          ).detail;
        }
        isLoading.value = false;
        areExperiencesLoaded.value = true;
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
          start_date_min: filteringDict.start_date_min,
          start_date_max: filteringDict.start_date_max,
          status: filteringDict.status,
          typologies: filteringDict.typologies,
          countries: filteringDict.countries,
          regions: filteringDict.regions,
          tags: filteringDict.tags,
          rating_min: filteringDict.rating_min
        });
        const responseData = await response.data;
        experiences.value = responseData.results;
        if (responseData.next) {
          next.value = responseData.next;
        } else {
          next.value = null;
        }
      } catch (e) {
        error.value = catchAxiosError(
            e,
            "Errore nei caricamento delle esperienze"
        ).detail;
      }

      isLoading.value = false;
      prevEndpointOptions.value = options;
    }

    watch([searchingAttr, searchingVal], function (values) {
      if (values[0]) {
        loadExperiences("searching");
      } else {
        searchingVal.value = "";
        prevEndpointOptions.value["searching"] = null;
        loadExperiences("searching");
      }
    });
    watch([orderingAttr], function (value) {
      if (value) {
        loadExperiences("ordering");
      }
    });
    watch([filteringDict], function () {
      loadExperiences("filter");
    });

    function handleError() {
      error.value = null;
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

    async function setDefaultOptions() {
      await loadExperiences();
      if (props.optionsDefault && props.optionsDefault.length > 0) {
        filteringDict.typologies.push(...props.optionsDefault);
        await loadExperiences('filter');
      }
    }

    setDefaultOptions();

    // graphs

    const expTypeGraphData = ref(null);
    const expCountryGraphData = ref(null);
    const expTagGraphData = ref(null);
    const graphError = ref(null);
    const graphLoading = ref(false);

    async function loadGraphData(){
      graphLoading.value = true;
      try {
        const responseA = await axiosService("/api/data/experiences/types/");
        const responseB = await axiosService("/api/data/experiences/counties/");
        const responseC = await axiosService("/api/data/experiences/tags/");
        expTypeGraphData.value = await responseA.data;
        expCountryGraphData.value = await responseB.data;
        expTagGraphData.value = await responseC.data;
      } catch (e){
        graphError.value = catchAxiosError(e, "Impossibile caricare i dati dei grafici")
      }
      graphLoading.value = false;
    }
    loadGraphData();


    document.title = "Lista delle esperienze";

    return {
      userFullName,
      userIsAuth1,
      tags,
      hasTags,
      cities,
      hasCities,
      filteredCountries,
      filteredRegions,
      filteredTags,
      filteringDict,
      searchingAttr,
      searchingVal,
      fields,
      getGoodField,
      isLoading,
      loadingTagError,
      loadingCitiesError,
      next,
      experiences,
      hasExperiences,
      loadExperiences,
      handleError,
      orderingAttr,
      toggleNav,
      areExperiencesLoaded,
      experienceTypes,
      hasExperienceTypes,
      areCitiesLoading,
      countriesList,
      inputCountry,
      inputRegion,
      inputTag,
      openFilterDialog,
      closeFilterDialog,
      isFilterDialogOpen,
      error,
      graphLoading,
      graphError,
      expTypeGraphData,
      expCountryGraphData,
      expTagGraphData
    };
  },
  beforeRouteEnter(to, _, next) {
    if (
        to.params.optionsOn !== undefined &&
        to.params.optionsOn !== null &&
        to.params.optionsOn !== ""
    ) {
      if (to.params.optionsOn === "SFS") {
        to.params.optionsDefault = ["sfs", "lab"];
      } else if (to.params.optionsOn === "Congresso") {
        to.params.optionsDefault = ["congress"];
      } else if (to.params.optionsOn === "SummerSchool") {
        to.params.optionsDefault = ["summerschool"];
      } else if (to.params.optionsOn === "Erasmus") {
        to.params.optionsDefault = ["erasmus"];
      } else if (to.params.optionsOn === "Tirocinio") {
        to.params.optionsDefault = ["internship"];
      }
    }
    return next();
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
[data-theme="light"] .line{
  background-color: black !important;
}
[data-theme="dark"] .line{
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

.table-container {
  overflow-x: auto;
  transition: margin-left 0.5s;
}

table {
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  border-radius: 0.25em;
}

table caption {
  font-size: 1.5em;
  margin: 0.5em 0 0.75em;
}

table tr {
  border: 2px solid var(--itembackgroundColorList);
  padding: 0.35em;
}

[data-theme="light"] table tbody tr:nth-child(odd) {
  background: #F8F8F8;
}

[data-theme="dark"] table tbody tr:nth-child(odd) {
  background: #2a2727;
}

table th,
table td {
  padding: 0.55rem;
  text-align: center;
}

table th {
  font-size: 0.85em;
  letter-spacing: 0.1em;
  position: relative;
}
.graph {
  background-color: var(--itembackgroundColorList) !important;
}
</style>