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
  const userIsAuth3 = computed(function() {
    return store.getters.userIsAuth3;
  });
  const userIsAuth4 = computed(function() {
    return store.getters.userIsAuth4;
  });
  const userIsAuth5 = computed(function() {
    return store.getters.userIsAuth5;
  });
  const userDpc = computed(function() {
    return store.getters.userDpc;
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
    userIsAuth3,
    userIsAuth4,
    userIsAuth5,
    userIsStaff,
    userDpc,
    theme
  };
}
