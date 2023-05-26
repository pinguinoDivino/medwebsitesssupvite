<template>
  <div id="app">
    <div v-if="hasUserInformation">
      <the-header></the-header>
      <router-view :key="$route.fullPath"></router-view>
      <the-footer></the-footer>
    </div>
    <base-spinner v-else></base-spinner>
  </div>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";
import {useStore} from "vuex";
import {computed, watch} from "vue";
import {useRoute} from "vue-router";
import TheFooter from "./components/layout/TheFooter.vue";

export default {
  components: {
    TheFooter,
    TheHeader
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    async function loadUserInformation() {
      await store.dispatch("loadUserInformation");
    }

    const hasUserInformation = computed(function () {
      return !!store.getters.userFullName;
    });
    loadUserInformation();
    watch(
        () => route,
        () => {
          window.scrollTo(0, 0);
        }
    );
    return {hasUserInformation};
  }
};
</script>

<style lang="scss">
body {
  background-color: var(--backgroundColor);
  color: var(--fontColor);
}

.container-fluid {
  margin: 0;
}

.theme-switch-wrapper {
  display: flex;
  background-color: inherit;
  color: white;
  flex-direction: row;
  justify-content: center;

  em {
    margin-left: 1rem;
    font-size: inherit;
  }

}

em:before {
  content: " ";
  display: inline-block;
  width: 0.5rem;
}

[data-theme="light"] em {
  color: black;
}

.theme-switch {
  display: inline-block;
  height: 34px;
  position: relative;
  width: 60px;
}

.theme-switch input {
  display: none;
}

.slider {
  background-color: black;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: .4s;
}

.slider:before {
  background-color: var(--white);
  bottom: 4px;
  content: "";
  height: 28px;
  left: 4px;
  position: absolute;
  transition: .4s;
  width: 28px;
}

input {
  padding: 3px;
}

input:checked + .slider {
  background-color: var(--orange);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.vue-select {
  width: 100% !important;
}

.vue-select-header {
  background-color: var(--inputColor) !important;
  border: 1px solid var(--inputColor) !important;
}

.vue-select.disabled {
  background-color: var(--inputColor) !important;
}

.vue-input input {
  background-color: var(--inputColor) !important;
  color: var(--fontColor) !important;
}

.vue-input input[disabled] {
  background-color: var(--inputColor) !important;
}

.vue-dropdown {
  max-height: 150px !important;
  background-color: var(--inputColor) !important;
}

.vue-dropdown-item.disabled {
  background-color: var(--inputColor) !important;
  cursor: not-allowed;
}

.vue-dropdown-item.selected {
  background-color: var(--inputColor) !important;
}

.multiselect__tags-wrap {
  display: none !important;
  background-color: var(--inputColor) !important;
}

.multiselect__input {
  width: 90% !important;
  border: none !important;
  background-color: var(--inputColor) !important;
  color: var(--fontColor) !important;
}

.multiselect__tags {
  min-height: 30px !important;
  max-height: 25px !important;
  padding: 4px 40px 0 8px !important;
  background-color: var(--inputColor) !important;
}

.multiselect__content-wrapper {
  background-color: var(--inputColor) !important;
  color: var(--fontColor) !important;
}

/* width */
::-webkit-scrollbar {
  width: 15px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--secondary);
}

span.swiper-pagination-bullet {
  display: none !important;
}
</style>
