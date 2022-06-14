<template>
  <div class="item-container">
    <div class="item-inner">
      <div class="item-header">
        <span v-if="page.created_at === page.updated_at">Aggiunta il {{ aDate }}</span>
        <span v-else> Modificata il {{ uDate }}</span>
      </div>
      <div class="item-content">
        <p>{{ page.text }}</p>
      </div>
      <div class="item-footer" v-if="userIsAuth">
        <base-button @click="openEditor" mode="primary" type="button">Modifica</base-button>
        <base-button @click="deletePage" mode="danger">Cancella</base-button>
      </div>
    </div>
  </div>
  <base-dialog :show="deliting" title="Eliminazione pagina diario">
    <div>
      <h4>Confermi di voler cancellare la pagina?</h4>

      <p v-if="error" class="not-found">{{ error }}</p>

      <p class="small">
        {{ page.text }}
      </p>

      <base-button type="button" mode="info" @click="removeDb">Confermo</base-button>

    </div>
  </base-dialog>
</template>

<script>

import {useGoodDateFormat} from "../../hooks/dates.js";
import {computed, ref} from "vue";
import {axiosService, catchAxiosError} from "../../common/api.service";

export default {
  props: ['page', 'userIsAuth'],
  emits: ['updatePage', 'deletePage'],
  setup(props, context) {

    const deliting = ref(false);

    const error = ref(null);

    const {getGoodDateFormat} = useGoodDateFormat();

    const aDate = computed(function () {
      return getGoodDateFormat(props.page.created_at);
    });

    const uDate = computed(function () {
      return getGoodDateFormat(props.page.updated_at);
    });

    const openEditor = () => {
      context.emit('updatePage', {id: props.page.id})
    }

    const deletePage = () => {
      deliting.value = true;
    }

    const removeDb = async () => {
      try {
        await axiosService(`/api/pages/${props.page.id}/`, "DELETE");
        deliting.value = false;
        context.emit("deletePage");
      } catch (e) {
        error.value = catchAxiosError(
            e,
            "Errore nei caricamento dei diari"
        ).detail;
      }
    }

    return {
      aDate,
      error,
      uDate,
      deliting,
      openEditor,
      deletePage,
      removeDb
    }
  }
};
</script>

<style lang="css" scoped>
.item-container {
  width: 100%;
  background-color: var(--backgroundColor);
  border: 1px solid var(--backgroundColor);
  padding: 1rem 0 0.8rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.item-inner {
  padding: 0 0.6rem;
  display: flex;
  flex-direction: column;
}

.item-header {
  line-height: 1.2;
  display: flex;
  font-weight: 800;
  margin: 5px 0;
}

.item-header p {
  margin-top: 0.3rem;
}

.item-content p {
  font-size: 1.1rem;
}

.item-footer {
  display: flex;
  flex-direction: row;
  font-size: 0.7rem;
  align-content: space-around;
}

@media screen and (min-width: 992px) {
  .item-container {
    width: 80%;
  }
}
</style>