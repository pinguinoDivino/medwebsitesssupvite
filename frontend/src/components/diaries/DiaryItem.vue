<template>
  <div class="item-container">
    <div class="item-inner">
      <div class="item-header">
        <p><strong>Aggiunto il {{ goodDate }}</strong></p>
      </div>
      <div class="item-content">
        <h2>
          <router-link :to="{name: 'diary-detail', params: { id: diary.id }}">Diario di {{ diary.authors }}
          </router-link>
        </h2>
      </div>
      <div class="item-footer">
        <span>Pagine: <strong>{{ diary.pages_number }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script>

import {useGoodDateFormat} from "../../hooks/dates";
import {computed} from "vue";

export default {
  props: ['diary'],
  setup(props) {
    const {getGoodDateFormat} = useGoodDateFormat();

    const goodDate = computed(()=> {
      return getGoodDateFormat(props.diary.created_at);
    });

    return {goodDate}
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
}

.item-header p {
  margin-top: 0.3rem;
}

.item-inner h2 {
  font-size: 1.5rem;
}

.item-footer {
  display: flex;
  flex-direction: row;
}
@media screen and (min-width: 992px) {
  .item-container {
    width: 80%;
  }
}
</style>