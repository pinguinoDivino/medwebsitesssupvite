import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  state: {
    userName: null,
    userFullName: null,
    userEmail: null,
    userIsAuth1: false,
    userIsAuth2: false,
    userIsStaff: false,
    theme: "light",
    animated: false
  },
  mutations,
  actions,
  getters
};
