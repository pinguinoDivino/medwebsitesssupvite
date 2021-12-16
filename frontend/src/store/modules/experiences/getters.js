export default {
  universities(state) {
    return state.universities;
  },
  hasUniversities(state) {
    return state.universities && state.universities.length > 0;
  },
  expTags(state) {
    return state.expTags;
  },
  oppTags(state) {
    return state.oppTags;
  },
  hasExpTags(state) {
    return state.expTags && state.expTags.length > 0;
  },
  hasOppTags(state) {
    return state.oppTags && state.oppTags.length > 0;
  },
  cities(state) {
    return state.cities;
  },
  hasCities(state) {
    return state.cities && state.cities.length > 0;
  },
  userExperiences(state) {
    return state.userExperiences;
  },
  hasUserExperiences(state) {
    return state.userExperiences && state.userExperiences.length > 0;
  },
  userInternships(state) {
    return state.userInternships;
  },
  hasUserInternships(state) {
    return state.userInternships && state.userInternships.length > 0;
  },
  userOpportunities(state) {
    return state.userOpportunities;
  },
  hasUserOpportunities(state) {
    return state.userOpportunities && state.userOpportunities.length > 0;
  }
};
