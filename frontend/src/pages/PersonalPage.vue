<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 firstDiv">
        <h1>Area personale di {{ userFullName }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-12 tabs" :class="{small: userIsAuth2}">
        <div v-if="userIsAuth1" :class="{active: component === 'user-experiences'}">
          <h2 @click="setComponent('exp')">Esperienze</h2>
        </div>
        <div v-if="userIsAuth2" :class="{active: component === 'user-internships'}">
          <h2 @click="setComponent('int')">Tirocini</h2>
        </div>
        <div v-if="userIsAuth3" :class="{active: component === 'user-opportunities'}">
          <h2 @click="setComponent('opp')">Opportunità</h2>
        </div>
      </div>
      <component :is="component"></component>
    </div>
  </div>
</template>

<script>
import {ref} from "vue"
import useAuth from "../hooks/auth.js";
import UserExperiences from "../components/experiences/UserExperiences.vue";
import UserInternships from "../components/experiences/UserInternships.vue";
import UserOpportunities from "../components/experiences/UserOpportunities.vue";

export default {
  components: {
    UserExperiences,
    UserInternships,
    UserOpportunities,
  },
  setup() {
    const {userFullName, userIsAuth1, userIsAuth2, userIsAuth3,  userIsStaff} = useAuth();

    const component = ref();

    function setComponent(name) {
      if (name === "exp") {
        component.value = "user-experiences";
      } else if (name === "int") {
        component.value = "user-internships";
      } else if (name === "opp") {
        component.value = "user-opportunities";
      }
    }

    document.title = "Area personale";

    return {
      userFullName,
      userIsAuth1,
      userIsAuth2,
      userIsAuth3,
      userIsStaff,
      component,
      setComponent
    }
  }
};
</script>

<style scoped>
.tabs {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}

.tabs > div {
  text-align: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.tabs h2 {
  cursor: pointer;
  display: inline-block;
  padding: 0.4rem 1rem 0;
  color: var(--orange);
}

.tabs h2:hover {
  transform: scale(1.1);
}

.active {
  font-weight: 800;
  background-color: var(--itembackgroundColorList);
  order: -1;
}

.active h2 {
  color: var(--fontColor);
}

.container-fluid {
  min-height: 75vh;
}

.small h2 {
  font-size: 1rem;
}

.small .active h2 {
  font-size: calc(1.1rem + 0.8vw);
}

@media (min-width: 500px) {
  .small h2 {
    font-size: calc(1.325rem + 0.9vw) !important;
  }
}
</style>