import mutations from "../experiences/mutations.js";
import actions from "../experiences/actions.js";
import getters from "../experiences/getters.js";

export default {
  namespaced: true,
  state: {
    universities: [],
    cities: [],
    expTags: [],
    oppTags: [],
    userExperiences: [],
    userInternships: [],
    userOpportunities: [],
  },
  mutations,
  actions,
  getters
};
