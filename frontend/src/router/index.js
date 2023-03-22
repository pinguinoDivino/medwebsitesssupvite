import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const Home = () =>
  import("../pages/Home.vue");

const ActivityEditor = () =>
  import("../pages/ActivityEditor.vue");

const ExperiencesList = () =>
  import("../pages/ExperiencesList.vue");

const OpportunitiesList = () =>
  import("../pages/OpportunitiesList.vue");

const InternshipsList = () =>
  import("../pages/InternshipsList.vue");

const ExperienceDetail = () =>
  import("../pages/ExperienceDetail.vue");

const PersonalPage = () =>
  import("../pages/PersonalPage.vue");

const NotFound = () =>
  import("../pages/NotFound.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/aggiungi/:type?/:slug?/:scope?/:group?",
    name: "activity-editor",
    props: true,
    component: ActivityEditor,
    meta: {
      requiresDpc: true
    }
  },
  {
    path: "/esperienze/elenco/:optionsOn?",
    name: "experiences-list",
    props: true,
    component: ExperiencesList,
    meta: {
      requiresDpc: true
    }
  },
  {
    path: "/opportunita/elenco",
    name: "opportunities-list",
    props: true,
    component: OpportunitiesList,
    meta: {
      requiresDpc: true
    }
  },
  {
    path: "/tirocini-unipi/elenco",
    name: "internships-list",
    component: InternshipsList,
    meta: {
      requiresDpc: true,
      requiresAuth2: true
    }
  },
  {
    path: "/esperienza/dettagli/:slug",
    name: "experience-detail",
    props: true,
    component: ExperienceDetail,
    meta: {
      requiresDpc: true
    }
  },
  {
    path: "/profilo",
    name: "personal-page",
    component: PersonalPage,
    meta: {
      requiresDpc: true
    }
  },
  {
    path: "/:pageNotFound(.*)",
    name: "page-not-found",
    component: NotFound
  }
];
const router = createRouter({
  routes,
  base: import.meta.env.PROD ? "https://medexperiences.santannapisa.it/" : "http://127.0.0.1:8000/",
  history: createWebHistory(),
  scrollBehavior() {
    return { left: 0, top: 0 };
  }
});

router.beforeEach(function(to, from, next) {
  if(to.meta.requiresDpc && !store.getters.userDpc) {
    next({ name: "home", params: { dpcError: true }});
  }else if (to.meta.requiresAuth1 && !store.getters.userIsAuth1) {
    next({ name: "home" });
  } else if(to.meta.requiresAuth2 && !store.getters.userIsAuth2 ){
    next({ name: "home" });
  } else if(to.meta.requiresAuth3 && !store.getters.userIsAuth3 ){
    next({ name: "home" });
  } else {
    next();
  }
});
export default router;
