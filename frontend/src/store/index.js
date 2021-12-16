import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import authModule from "./modules/auth/index.js";
import experiencesModule from "./modules/experiences/index.js";
import choicesModule from "./modules/choices/index.js";
const store = createStore({
  modules: {
    auth: authModule,
    experiences: experiencesModule,
    choices: choicesModule
  },
  plugins: [createPersistedState({
    paths: ['auth.theme']
  })]
});

export default store;
