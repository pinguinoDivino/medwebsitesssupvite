import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state: {
    expTagGroups: [],
    oppTagGroups: [],
    experienceTypes: [],
    internshipWards: [],
    internshipAttendances: [],
    internshipPlaces: [],
    internshipYears: [],
    tutors: []
  },
  mutations,
  actions,
  getters
};
