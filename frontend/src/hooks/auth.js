import store from "../store/index.js";
import { computed } from "vue";

export default function useAuth() {
  const userName = computed(function() {
    return store.getters.userName;
  });
  const userFullName = computed(function() {
    return store.getters.userFullName;
  });
  const userEmail = computed(function() {
    return store.getters.userEmail;
  });
  const userIsAuth1 = computed(function() {
    return store.getters.userIsAuth1;
  });
  const userIsAuth2 = computed(function() {
    return store.getters.userIsAuth2;
  });
  const userIsStaff = computed(function() {
    return store.getters.userIsStaff;
  });
  const theme = computed(function() {
    return store.getters.theme;
  });
  return {
    userName,
    userFullName,
    userEmail,
    userIsAuth1,
    userIsAuth2,
    userIsStaff,
    theme
  };
}
