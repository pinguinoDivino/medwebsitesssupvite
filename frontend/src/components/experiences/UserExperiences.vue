<template>
  <div class="col-12 content ">
    <div v-if="isLoading"><base-spinner></base-spinner></div>
    <div v-else-if="hasUserExperiences" class="my-1">
      <div class="row">
        <div class="col-md-4 col-lg-3">
          <div class="side-container">
            <div class="side-inner text-center text-md-left">
              <div class="side-header">
                <h4><strong>Contributi</strong></h4>
                <p>{{ userExperienceCount }}</p>
              </div>
              <div>
                <h4>Tipologia</h4>
                <pie-chart :data="typeGraphData" legend="bottom"
                           :colors="['#449c9f', '#8c6292', '#f56300', '#d04f4f', '#50AC49', '#FF9E7A']"
                ></pie-chart>
              </div>
              <div>
                <h4>Tags più usati</h4>
                <pie-chart :data="tagsGraphData" legend="bottom" :colors="['#000000', '#D52732',
                  '#4D8725', '#04ffd9', '#EE8E01', '#522D6D',
                  '#017488', '#908F8D', '#005696'
                ]"
                ></pie-chart>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-8">
          <div class="item-container" v-for="exp of userExperiences.slice(0, showNumber)" :key="exp.id">
            <div class="item-inner">
              <div class="item-header">
                <star-rating
                    :read-only="true"
                    :rating="exp.rating.average"
                    :max-rating="10"
                    :star-size="20"
                    :inline="true"
                    :show-rating="false"
                    active-color="#f56300"
                    :border-width="0"
                />
                <p><strong><router-link :to="{name: 'experience-detail', params: {slug: exp.slug}}">{{ exp.description }}
                </router-link></strong></p>
              </div>
              <div class="item-body">
                <p><strong>Data di inizio</strong>: {{ getGoodDatePeriodFormat(exp.started_at) }}</p>
                <p v-if="exp.review.length<maxTextDisplay">{{ getReview(exp.review) }}</p>
                <p v-else>{{ getReview(exp.review.substring(0, maxTextDisplay) + "..") }}</p>
                <p v-if="exp.created_at === exp.updated_at">
                  <strong>Data di aggiunta</strong>: {{ getGoodDatePeriodFormat(exp.created_at) }}
                </p>
                <p v-else><strong>Data di modifica</strong>: {{ getGoodDatePeriodFormat(exp.updated_at) }}</p>
              </div>
              <div class="item-footer">
                <base-button mode="primary" :link="true" :to="{name: 'activity-editor',
                params: {type: 'experiences', slug: exp.slug, }}">Modifica
                </base-button>
                <base-button mode="danger" @click="openDialog(exp.slug)">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash"
                      viewBox="0 0 16 16"
                  >
                    <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                    />
                    <path
                        fill-rule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
                </base-button>
              </div>
            </div>
          </div>
          <div v-if="userExperiences.length > showNumber" class="mt-1 text-center">
            <base-button mode="success" @click="showMore">Mostra altri</base-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-1">
      <p class="not-found">Non hai ancora caricato delle esperienze</p>
    </div>
    <base-dialog
        :show="!!loadingError"
        title="Errore nel caricamento"
        @close="handleError">
      <p>{{ loadingError }}</p>
    </base-dialog>
    <base-dialog
        :show="isShown"
        title="Vuoi eliminare l'esperienza?"
        @close="closeDialog">
      <template v-slot:actions>
        <base-button mode="danger" @click="deleteExperience">Continua</base-button>
        <base-button mode="primary" @click="closeDialog">Annulla</base-button>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import useChoices from "../../hooks/choices";
import {useGoodDatePeriodFormat} from "../../hooks/dates";
export default {
  setup() {
    const {experienceTypes, loadChoices} = useChoices();
    const {getGoodDatePeriodFormat} = useGoodDatePeriodFormat();
    loadChoices(['experienceTypes', ])

    const store = useStore();
    const isLoading = ref(false);
    const loadingError = ref(null);
    const userExperiences = computed(function () {
      return store.getters["experiences/userExperiences"];
    });
    const hasUserExperiences = computed(function () {
      return store.getters["experiences/hasUserExperiences"];
    });
    const userExperienceCount = computed(function () {
      return userExperiences.value.length;
    });

    async function loadUserExperiences() {
      isLoading.value = true;
      try {
        await store.dispatch("experiences/loadUserExperiences");
      } catch (error) {
        loadingError.value = error;
      }
      isLoading.value = false;
    }

    loadUserExperiences();

    const slug = ref(null);

    const isShown = ref(false);

    function openDialog(s){
      slug.value = s;
      isShown.value = true;
    }
    function closeDialog(){
      isShown.value = false;
    }

    async function deleteExperience() {
      isLoading.value = true;
      try {
        await store.dispatch("experiences/deleteExperience", {slug: slug.value});
      } catch (error) {
        loadingError.value = error;
      }
      isLoading.value = false;
      slug.value = null;
      isShown.value = false;
      await loadUserExperiences();
    }

    const maxTextDisplay = 280;

    const showNumber = ref(3);

    function showMore(){
      showNumber.value += 5;
    }

    function getTypeName(el) {
      for (const item of experienceTypes.value) {
        if (item[0] === el) {
          return item[1]
        }
      }
    }

    const typeGraphData = computed(function () {
      const data = {}
      for (const el of userExperiences.value) {
        if (Object.keys(data).includes(getTypeName(el.type))) {
          data[getTypeName(el.type)] += 1;
        } else {
          data[getTypeName(el.type)] = 1;
        }
      }
      return Object.entries(data);
    })

    const tagsGraphData = computed(function () {
      const data = {}
      for (const el of userExperiences.value) {
        for (const tag of el.tags) {
          if (Object.keys(data).includes(tag.name)) {
            data[tag.name] += 1;
          } else {
            data[tag.name] = 1;
          }
        }
      }
      return Object.entries(data).sort((a, b) => b[1] - a[7]).slice(0, 3);
    })

    function getReview(string){
      return string.replaceAll('&r)', '');
    }

    function handleError() {
      loadingError.value = null;
    }

    return {
      experienceTypes,
      getGoodDatePeriodFormat,
      isLoading,
      loadingError,
      userExperiences,
      hasUserExperiences,
      userExperienceCount,
      deleteExperience,
      maxTextDisplay,
      showNumber,
      showMore,
      isShown,
      openDialog,
      closeDialog,
      handleError,
      typeGraphData,
      tagsGraphData,
      getReview
    }
  }
};
</script>

<style scoped>
.content {
  background-color: var(--itembackgroundColorList);
  min-height: 60vh;
}

.side-container {
  background-color: var(--backgroundColor);
  border: 1px solid var(--backgroundColor);
  padding: 1rem 0 0.8rem;
  margin-top: 0.6rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.side-header p {
  font-weight: 800;
  font-size: 1.8rem;
}

.item-container {
  background-color: var(--backgroundColor);
  border: 1px solid var(--backgroundColor);
  padding: 1rem 0 0.8rem;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  border-radius: 10px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.item-inner {
  padding: 0 0.6rem;
  display: flex;
  flex-direction: column;
}
.item-header {
  font-size: 1.2rem;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
}

.item-header p {
  margin-top: 0.3rem;
}

.item-footer {
  display: flex;
  flex-direction: row;
  width: 50%;
  align-items: center;
  justify-content: space-around;
}
.side-inner {
  padding: 0 0.6rem;
  display: flex;
  flex-direction: column;
}
@media screen and (min-width: 450px) {
  .side-inner {
    margin: auto;
    width: 80%;
  }
}
@media screen and (min-width: 650px) {
  .side-inner {
    padding: 0 0.6rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  .item-footer {
    width: 30%;
  }
}
@media screen and (min-width: 768px) {
  .side-inner {
    padding: 0 0.6rem;
    display: flex;
    flex-direction: column;
  }
}
@media screen and (min-width: 992px) {
  .item-footer {
    width: 20%;
  }
}
</style>