<template>
  <div class="page container-fluid">
    <div class="row">
        <div class="col-12">
          <h1>Diari</h1>
          <p>Una raccolta dell'operato dei Rappset in base ai vari anni.</p>
        </div>
      </div>
    <div v-if="isLoading">
      <base-spinner/>
    </div>
    <div v-else-if="hasDiaries" class="row">
        <div class="diaries-list col-12">
          <DiaryItem v-for="diary of diaries" :key="diary.id" :diary="diary"/>
        </div>
    </div>
    <div v-else>
      <p class="not-found">Non è ancora disponibile un diario!</p>
    </div>
    <base-dialog
        :show="!!error"
        title="Errore nel caricamento"
        @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
  </div>
</template>

<script>

import {ref, computed} from "vue";
import {axiosService, catchAxiosError} from "../common/api.service";
import DiaryItem from "../components/diaries/DiaryItem.vue";

export default {
  components: {DiaryItem},
  setup() {
    const diaries = ref([]);
    const next = ref(null);
    const isLoading = ref(false);
    const error = ref("");

    const hasDiaries = computed(() => {
      return diaries.value.length > 0;
    });

    const loadDiaries = async () => {
      isLoading.value = true;
      let endpoint = "/api/diaries/";
      if (next.value) {
        endpoint = next.value;
      }
      try {
        const response = await axiosService(endpoint);
        const responseData = await response.data;
        diaries.value.push(...responseData.results);
        if (responseData.next) {
          next.value = responseData.next;
        } else {
          next.value = null;
        }
      } catch (e) {
        error.value = catchAxiosError(
            e,
            "Errore nei caricamento dei diari"
        ).detail;
      }
      isLoading.value = false;
    }

    loadDiaries();

    function handleError() {
      error.value = null;
    }

    return {
      diaries,
      isLoading,
      error,
      hasDiaries,
      handleError
    }

  }
};
</script>

<style lang="css" scoped>
.page {
  min-height: 70vh;
}
</style>