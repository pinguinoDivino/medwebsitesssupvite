import store from "../store/index.js";

import { computed } from "vue";

export default function useChoices() {
  const expTagGroups = computed(function() {
    return store.getters["choices/expTagGroups"];
  });
  const oppTagGroups = computed(function() {
    return store.getters["choices/oppTagGroups"];
  });
  const experienceTypes = computed(function() {
    return store.getters["choices/experienceTypes"];
  });
  const internshipWards = computed(function() {
    return store.getters["choices/internshipWards"];
  });
  const internshipAttendances = computed(function() {
    return store.getters["choices/internshipAttendances"];
  });
  const internshipPlaces = computed(function() {
    return store.getters["choices/internshipPlaces"];
  });
  const internshipYears = computed(function() {
    return store.getters["choices/internshipYears"];
  });
  const tutors = computed(function() {
    return store.getters["choices/tutors"];
  });
  async function loadChoices(options) {
    await store.dispatch("choices/loadChoices", options);
  }
  return {
    expTagGroups,
    oppTagGroups,
    experienceTypes,
    internshipWards,
    internshipAttendances,
    internshipPlaces,
    internshipYears,
    tutors,
    loadChoices
  };
}
