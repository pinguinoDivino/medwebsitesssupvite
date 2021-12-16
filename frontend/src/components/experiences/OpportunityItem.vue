<template>
  <div class="item">
    <div class="inner-item">
      <div class="item-header">
        <h2><a :href="opp.university.link" target="_blank">{{ opp.university.name }}</a></h2>
        <p>Istituto: {{ opp.istitution }}</p>
        <p>Contatto esterno: {{ opp.ref }}</p>
      </div>
      <div class="item-body">
        <p>Proposta da: {{ opp.author_full_name }}</p>
        <p>Contattabile all'indirizzo <a :href = "'mailto: ' + opp.author_email">{{ opp.author_email }}</a></p>
      </div>
      <div class="item-footer">
        <h4>Aggiunta il {{ added }}</h4>
        <p v-if="opp.active">Ancora disponibile!</p>
        <p v-else class="not-found">Non più disponibile</p>
        <base-button @click="toggleDialog" mode="light">Mostra maggiori dettagli</base-button>
      </div>
    </div>
    <base-dialog @close="toggleDialog" :show="isShown"
                 title="Descrizione">
      <template v-slot:default>
        <div class="text-center">
          <p>{{ opp.description }}</p>
        </div>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import {useGoodDateFormat} from "../../hooks/dates.js";

export default {
  props: ["opp"],
  setup(props) {
    const isShown = ref(false);

    const {getGoodDateFormat} = useGoodDateFormat();

    function toggleDialog() {
      isShown.value = !isShown.value;
    }

    const added = computed(function () {
      return getGoodDateFormat(props.opp.created_at);
    });

    return {
      isShown,
      added,
      toggleDialog
    };
  }
};
</script>

<style scoped>

.item {
  width: 100%;
  height: 100%;
  margin: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.inner-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
}
.item-footer {
  z-index: 1;
  justify-self: flex-end;
}
a {
  color: white;
  font-weight: 800;
}
a:hover {
  transform: scale(1.2);
}
</style>