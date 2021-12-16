<template>
  <div class="col-12 content">
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <div v-else-if="hasUserInternships" class="my-1">
      <div class="row">
        <div class="col-md-4 col-lg-3">
          <div class="side-container">
            <div class="side-inner text-center text-md-left">
              <div class="side-header">
                <h4><strong>Contributi</strong></h4>
                <p>{{ userInternshipCount }}</p>
              </div>
              <div>
                <h4>Reparti</h4>
                <pie-chart :data="wardGraphData" legend="bottom"></pie-chart>
              </div>
              <div>
                <h4>Anni</h4>
                <column-chart
                    :discrete="true"
                    :data="yearGraphData"
                    :colors="['#449c9f', '#8c6292', '#f56300', '#d04f4f']">
                </column-chart>
              </div>
            </div>
          </div>
        </div>
        <div class="col-11 col-md-8">
          <div class="item-container" v-for="int of userInternships.slice(0, showNumber)" :key="int.id">
            <div class="item-inner">
              <div class="item-header">
                <star-rating
                    :read-only="true"
                    :rating="int.rating"
                    :max-rating="10"
                    :star-size="20"
                    :inline="true"
                    :show-rating="false"
                    active-color="#f56300"
                    :border-width="0"
                />
                <p><strong>Reparto:</strong> {{ getWardName(int.ward) }}</p>
              </div>
              <div class="item-body">
                <p v-if="int.review.length<maxTextDisplay">{{ int.review }}</p>
                <p v-else>{{ int.review.substring(0, maxTextDisplay) + ".." }}</p>
                <p v-if="int.created_at === int.updated_at">
                  <strong>Data di aggiunta</strong>: {{ getGoodDatePeriodFormat(int.created_at) }}
                </p>
                <p v-else><strong>Data di modifica</strong>: {{ getGoodDatePeriodFormat(int.updated_at) }}</p>
              </div>
              <div class="item-footer">
                <base-button mode="primary" :link="true" :to="{name: 'activity-editor',
                params: {type: 'unipi-internships', slug: int.slug}}">Modifica
                </base-button>
                <base-button mode="danger" @click="openDialog(int.slug)">
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
          <div v-if="userInternships.length > showNumber" class="mt-1 text-center">
            <base-button mode="success" @click="showMore">Mostra altri</base-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-1">
      <p class="not-found">Non hai ancora caricato dei tirocini curriculari</p>
    </div>
    <base-dialog
        :show="!!loadingError"
        title="Errore nel caricamento"
        @close="handleError('loadingError')">
      <p>{{ loadingError }}</p>
    </base-dialog>
    <base-dialog
        :show="isShown"
        title="Vuoi eliminare il tirocinio?"
        @close="closeDialog">
      <template v-slot:actions>
        <base-button mode="danger" @click="deleteInternship">Continua</base-button>
        <base-button mode="primary" @click="closeDialog">Annulla</base-button>
      </template>
    </base-dialog>
  </div>
</template>


<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {useGoodDatePeriodFormat} from "../../hooks/dates.js"
import useChoices from "../../hooks/choices.js";

export default {
  setup() {
    const {internshipYears, internshipWards, loadChoices} = useChoices();
    const {getGoodDatePeriodFormat} = useGoodDatePeriodFormat();
    loadChoices(['internshipYears', 'internshipWards'])

    const store = useStore();
    const isLoading = ref(false);
    const loadingError = ref(null);
    const userInternships = computed(function () {
      return store.getters["experiences/userInternships"];
    });
    const hasUserInternships = computed(function () {
      return store.getters["experiences/hasUserInternships"];
    });
    const userInternshipCount = computed(function () {
      return userInternships.value.length;
    });

    async function loadUserInternships() {
      isLoading.value = true;
      try {
        await store.dispatch("experiences/loadUserInternships");
      } catch (error) {
        loadingError.value = error;
      }
      isLoading.value = false;
    }

    loadUserInternships();

    const slug = ref(null);

    const isShown = ref(false);

    function openDialog(s){
      slug.value = s;
      isShown.value = true;
    }
    function closeDialog(){
      isShown.value = false;
    }

    async function deleteInternship() {
      isLoading.value = true;
      try {
        await store.dispatch("experiences/deleteInternship", {slug: slug.value});
      } catch (error) {
        loadingError.value = error;
      }
      isLoading.value = false;
      slug.value = null;
      isShown.value = false;
      await loadUserInternships();
    }

    const maxTextDisplay = 280;

    const showNumber = ref(3);

    function getWardName(ward) {
      for (const item of internshipWards.value) {
        if (item[0] === ward) {
          return item[1]
        }
      }
    }

    function getYear(year) {
      for (const item of internshipYears.value) {
        if (item[0] === year) {
          return item[1]
        }
      }
    }

    function showMore(){
      showNumber.value += 5;
    }

    function handleError(input) {
      eval(input).value = null;
    }

    const wardGraphData = computed(function () {
      const data = {}
      for (const int of userInternships.value) {
        if (Object.keys(data).includes(getWardName(int.ward))) {
          data[getWardName(int.ward)] += 1;
        } else {
          data[getWardName(int.ward)] = 1;
        }
      }
      return Object.entries(data);
    })

    const yearGraphData = computed(function () {
      const data = {}
      for (const int of userInternships.value) {
        if (Object.keys(data).includes(getYear(int.academic_year))) {
          data[getYear(int.academic_year)] += 1;
        } else {
          data[getYear(int.academic_year)] = 1;
        }
      }
      return Object.entries(data).sort(function sortFunction(a, b) {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return (a[0] < b[0]) ? -1 : 1;
        }
      });
    })

    return {
      isLoading,
      loadingError,
      userInternships,
      hasUserInternships,
      userInternshipCount,
      deleteInternship,
      getWardName,
      maxTextDisplay,
      getGoodDatePeriodFormat,
      handleError,
      showNumber,
      showMore,
      wardGraphData,
      yearGraphData,
      isShown,
      openDialog,
      closeDialog
    }
  }
};
</script>

<style scoped>
.content {
  background-color: var(--itembackgroundColorList);
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