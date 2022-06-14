<template>
  <div>
    <div v-if="isLoading">
      <base-spinner/>
    </div>
    <div v-else-if="hasDiary" class="container-fluid page">
      <div class="row">
        <div class="col-12">
          <h1>Diario di {{ diary.authors }}</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div v-if="diary.pages.length > 0">
            <PageItem v-for="page of diary.pages" :key="page.id" :userIsAuth="userIsAuth" :page="page"
                      @updatePage="updatePage" @deletePage="updateDiary"/>
          </div>
          <div v-else>
            <p class="not-found">Non sono ancora state aggiunte delle pagine</p>
          </div>
        </div>
      </div>
      <hr />
      <div class="row mt-1">
        <div class="col-12">
          <base-button v-if="!isEditorOpen && userIsAuth" mode="success" @click="openPageEditor">Aggiungi pagina
          </base-button>
        </div>
      </div>
      <div class="row" v-if="isEditorOpen && userIsAuth">
        <div class="col-12 col-lg-6">
          <PageEditor :diaryId="diary.id" :oldPage="oldPage"
                      :key="!!oldPage ? oldPage.id : diary.id"
                      @submitData="updateDiary"
                      @close="closePageEditor"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from "../hooks/auth";
import {computed, reactive, ref} from "vue";
import {axiosService, catchAxiosError} from "../common/api.service";
import PageItem from "../components/diaries/PageItem.vue";
import PageEditor from "../components/diaries/PageEditor.vue";

export default {
  components: {PageEditor, PageItem},
  props: ["id"],
  setup(props) {

    const {userFullName} = useAuth();

    const isEditorOpen = ref(false);
    const diary = reactive({});
    const isLoading = ref(false);
    const error = ref(null);

    const hasDiary = computed(function () {
      return Object.keys(diary).length > 0 && diary.constructor === Object;
    });

    const userIsAuth = computed(() => {
      if (hasDiary) {
        return diary.authors.includes(userFullName.value);
      } else {
        return false
      }
    });

    async function setDiary() {
      isLoading.value = true;
      try {
        const response = await axiosService(`/api/diaries/${props.id}/`);
        for (const key in response.data) {
          diary[key] = response.data[key];
        }
      } catch (e) {
        error.value = catchAxiosError(
            e,
            "Errore nel caricamento del diario"
        ).detail;
      }
      isLoading.value = false;
    }

    setDiary();

    const oldPage = ref(null)

    const updatePage = (data) => {
      oldPage.value = diary.pages.find((item) => item.id === data.id);

      isEditorOpen.value = true;
    };


    const updateDiary = () => {
      oldPage.value = null;
      setDiary();
      isEditorOpen.value = false;
    }

    const openPageEditor = () => {
      oldPage.value = null;
      isEditorOpen.value = true;
    }

    const closePageEditor = () => {
      oldPage.value = null;
      isEditorOpen.value = false;
    }

    function handleError() {
      error.value = null;
    }

    return {
      isEditorOpen,
      userIsAuth,
      hasDiary,
      diary,
      isLoading,
      error,
      updatePage,
      oldPage,
      openPageEditor,
      closePageEditor,
      updateDiary,
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