import { computed } from "vue";
import store from "../store/index.js";

export default function useQuery(module, query) {
  const qs = computed(function() {
    return store.getters[`${module}/${query}`];
  });

  const hasQs = computed(function() {
    return store
      .getters[`${module}/has${query.charAt(0).toUpperCase() + query.slice(1)}`];
  });

  async function loadQs(isLoading, loadingError, func=null) {
    isLoading.value = true;
    try {
      await store.dispatch(
        `${module}/load${query.charAt(0).toUpperCase() + query.slice(1)}`
      );
      if(func){
        await func();
      }
    } catch (error) {
      loadingError.value = error;
    }
    isLoading.value = false;
  }
  return { qs, hasQs, loadQs };
}
