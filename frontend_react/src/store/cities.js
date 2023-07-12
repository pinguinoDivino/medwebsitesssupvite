import { initStore } from "_store/store";

const configureStore = () => {
  const actions = {
    ADD_CITY: (curState, newCity) => {
      return { cities: [...curState.cities, newCity] };
    },
  };
  initStore(actions, { cities: [] });
};

export default configureStore;
