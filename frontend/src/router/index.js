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
    component: ActivityEditor
  },
  {
    path: "/esperienze/elenco/:optionsOn?",
    name: "experiences-list",
    props: true,
    component: ExperiencesList,
  },
  {
    path: "/opportunita/elenco",
    name: "opportunities-list",
    props: true,
    component: OpportunitiesList,
  },
  {
    path: "/tirocini-unipi/elenco",
    name: "internships-list",
    component: InternshipsList,
    meta: {
      requiresAuth1: true
    }
  },
  {
    path: "/esperienza/dettagli/:slug",
    name: "experience-detail",
    props: true,
    component: ExperienceDetail
  },
  {
    path: "/profilo",
    name: "personal-page",
    component: PersonalPage
  },
  {
    path: "/:pageNotFound(.*)",
    name: "page-not-found",
    component: NotFound
  }
];
// TODO change production url
const router = createRouter({
  routes,
  base: import.meta.env.PROD ? "https://med.santannapisa.it/" : "http://127.0.0.1:8000/",
  history: createWebHistory(),
  scrollBehavior() {
    return { left: 0, top: 0 };
  }
});

router.beforeEach(function(to, from, next) {
  if (to.meta.requiresAuth1 && !store.getters.userIsAuth1) {
    next({ name: "home" });
  } else {
    next();
  }
});
export default router;
