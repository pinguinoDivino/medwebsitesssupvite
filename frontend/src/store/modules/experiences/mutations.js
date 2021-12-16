export default {
  setUniversities(state, payload) {
    state.universities = payload.universities;
  },
  setExpTags(state, payload){
    state.expTags = payload.tags;
  },
  setOppTags(state, payload){
    state.oppTags = payload.tags;
  },
  addTag(state, payload){
    if(payload.tp === "exp")
      state.expTags.push(payload.tag);
    else if(payload.tp === "opp"){
      state.oppTags.push(payload.tag);
    }
  },
  setCities(state, payload) {
    state.cities = payload.cities;
  },
  addCity(state, payload) {
    state.cities.push(payload.city);
  },
  setUserExperiences(state, payload) {
    state.userExperiences = payload.userExps;
  },
  addUserExperience(state, payload) {
    if (state.userExperiences.length > 0) {
      state.userExperiences.unshift(payload);
    }
  },
  updateUserExperience(state, payload) {
    for (const idx in state.userExperiences) {
      if (state.userExperiences[idx].slug === payload.slug) {
        state.userExperiences[idx] = payload;
      }
    }
  },
  setUserInternships(state, payload) {
    state.userInternships = payload.userInts;
  },
  addUserInternship(state, payload) {
    if (state.userInternships.length > 0) {
      state.userInternships.unshift(payload);
    }
  },
  updateUserInternship(state, payload) {
    for (const idx in state.userInternships) {
      if (state.userInternships[idx].slug === payload.slug) {
        state.userInternships[idx] = payload;
      }
    }
  },
  setUserOpportunities(state, payload) {
    state.userOpportunities = payload.userOpps;
  },
  addUserOpportunity(state, payload) {
    if (state.userOpportunities.length > 0) {
      state.userOpportunities.unshift(payload);
    }
  },
  updateUserOpportunity(state, payload) {
    for (const idx in state.userOpportunities) {
      if (state.userOpportunities[idx].slug === payload.slug) {
        state.userOpportunities[idx] = payload;
      }
    }
  },
  deleteUserInternship(state, payload){
    for (const idx in state.userInternships) {
      if (state.userInternships[idx].slug === payload.slug) {
        state.userInternships.splice(idx, 1);
      }
    }
  },
  deleteUserExperience(state, payload){
    for (const idx in state.userExperiences) {
      if (state.userExperiences[idx].slug === payload.slug) {
        state.userExperiences.splice(idx, 1);
      }
    }
  },
  deleteUserOpportunity(state, payload){
    for (const idx in state.userOpportunities) {
      if (state.userOpportunities[idx].slug === payload.slug) {
        state.userOpportunities.splice(idx, 1);
      }
    }
  },
};
