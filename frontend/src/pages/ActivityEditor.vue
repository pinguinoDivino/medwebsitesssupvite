<template>
  <div class="container-fluid">
    <div class="firstFormPage" v-if="!actType.isSetUp">
      <form @submit.prevent="selectActType">
        <h1>Aggiungi una attività</h1>
        <h2>Cominciamo</h2>
        <label v-if="actType.isValid" for="actType"
        >Seleziona il tipo di attività</label
        >
        <label v-else for="actType" class="invalid-message">{{
            actType.error
          }}</label>
        <select class="select-css" v-model="actType.val" id="actType">
          <option v-if="(userIsAuth1 && !userIsAuth3) || userIsStaff" value="experiences">Esperienza</option>
          <option v-if="userIsAuth2" value="unipi-internships">Tirocinio curriculare</option>
          <option v-if="userIsAuth3" value="opportunities">Opportunità</option>
        </select>
        <base-button type="submit" mode="success">Avanti</base-button>
      </form>
    </div>
    <div v-else>
      <base-dialog
          :show="!!submitError"
          title="Errore nel salvare i dati"
          @close="handleError"
      >
        <p>{{ submitError }}</p>
      </base-dialog>
      <component :is="form" :asModel="asModel" :pAct="previousAct" @back="undoActType" @submit-form="submitData"/>
    </div>
  </div>
</template>

<script>
import {reactive, computed, ref, provide} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {axiosService, catchAxiosError} from "../common/api.service.js";
import ExperienceForm from "../components/experiences/ExperienceForm.vue";
import InternshipForm from "../components/experiences/InternshipForm.vue";
import OpportunityForm from "../components/experiences/OpportunityForm.vue";
import useAuth from "../hooks/auth.js";

export default {
  components: {
    ExperienceForm,
    InternshipForm,
    OpportunityForm
  },
  props: {
    slug: {
      type: String,
      required: false
    },
    typology: {
      type: String,
      required: false,
      default: null
    },
    previousAct: {
      type: Object,
      required: false,
      default: null
    },
    asModel: {
      type: Boolean,
      required: false,
      default: false
    },
    group: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const submitError = ref(null);
    const {userIsAuth1, userIsAuth2, userIsAuth3, userIsStaff, userEmail} = useAuth();
    provide('userEmail', userEmail)
    const actType = reactive({
      val:
          props.typology !== null && props.typology !== undefined ? props.typology : "",
      isValid: true,
      error: "",
      isSetUp: props.typology !== null && props.typology !== undefined
    });
    const form = computed(function () {
      switch (actType.val) {
        case "experiences":
          return "experience-form";
        case "unipi-internships":
          return "internship-form";
        case "opportunities":
          return "opportunity-form";
      }
    })

    function selectActType() {
      if (actType.val === "") {
        actType.error = "Seleziona il campo per proseguire!";
        actType.isValid = false;
        actType.isSetUp = false;
      } else {
        actType.error = "";
        actType.isValid = true;
        actType.isSetUp = true;
      }
    }

    function undoActType() {
      if (props.slug) {
        router.push({name: "personal-page"});
      }
      actType.val = "";
      actType.error = "";
      actType.isValid = true;
      actType.isSetUp = false;
    }

    async function submitData(data) {
      submitError.value = null;
      let slug = null;
      if (props.previousAct !== null && !props.asModel) {
        slug = props.slug;
      }
      if (actType.val === 'experiences') {
        try {
          data['group'] = props.group;
          await store.dispatch("experiences/putExperience", {
            ...data,
            slug: slug
          });
          await router.push({name: "personal-page"});
        } catch (e) {
          submitError.value = e;
        }
      }
      else if(actType.val === 'unipi-internships'){
        try {
          await store.dispatch("experiences/putInternship", {
            data,
            slug: slug
          });
          await router.push({name: "personal-page"});
        } catch (e) {
          submitError.value = e;
        }
      }
      else if(actType.val === 'opportunities'){
        try {
          await store.dispatch("experiences/putOpportunity", {
            data,
            slug: slug
          });
          await router.push({name: "personal-page"});
        } catch (e) {
          submitError.value = e;
        }
      }
    }

    function handleError() {
      submitError.value = null;
    }

    document.title = props.slug ? props.asModel ? "Aggiungi attività" : "Mmodifica attività" : "Aggiungi attività" ;
    return {
      userIsAuth1,
      userIsAuth2,
      userIsAuth3,
      userIsStaff,
      actType,
      form,
      selectActType,
      undoActType,
      submitData,
      submitError,
      handleError,
    };
  },
  async beforeRouteEnter(to, _, next) {
    if (
        to.params.slug !== undefined &&
        to.params.slug !== null &&
        to.params.slug !== "" &&
        to.params.type !== undefined &&
        to.params.type !== null &&
        to.params.type !== ""
    ) {
      try {
        const response = await axiosService(`/api/${to.params.type}/${to.params.slug}/`);
        to.params.previousAct = {...response.data};
        if (to.params.type === "experiences") {
          const responseAttrs = await axiosService(
              `/api/experience/${to.params.slug}/attrs/`
          );
          to.params.previousAct["attrs"] = responseAttrs.data;
        }
      } catch (e) {
        catchAxiosError(e, "Errore nel caricamento della precedente esperienza")
      }
      to.params.asModel = to.params.scope === "asModel";
      to.params.typology = to.params.type;
    }
    return next();
  }
};
</script>

<style lang="css" scoped>
.container-fluid {
  min-height: 80vh;
}

.firstFormPage {
  width: 90%;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.5rem;
  text-align: center;
}

.firstFormPage select {
  margin: 0.5rem auto;
  width: 50%;
  font-size: 1.3rem;
  padding: 0.2rem;
  text-align: center;
}

option {
  color: var(--fontColor);
}

@media screen and (min-width: 576px) {
  .firstFormPage {
    width: 50%;
  }
}

@media screen and (min-width: 768px) {
  .firstFormPage {
    width: 40%;
  }

  .firstFormPage select {
    font-size: 0.9rem;
  }
}
</style>