<template>
  <div>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <div v-else-if="hasExp" class="container-fluid">
      <section class="row text-center">
        <div class="col-12">
          <h1>{{ exp.description }}</h1>
        </div>
      </section>
      <section class="row section1">
        <div class="col-12 text-center text-lg-left">
          <h2>Le mie impressioni</h2>
          <div class="row element">
            <div class="col-lg-4">
              <div class="subtitleA">Recensione</div>
              <div class="subtitleB">Che cosa ho fatto?</div>
              <div class="subtitleC">Riassunto dell'esperienza</div>
            </div>
            <div class="col-lg-8 information">
              <p>{{ reviewInformationA }}</p>
            </div>
          </div>
          <hr/>
          <div class="row element">
            <div class="col-lg-4 order-lg-last">
              <div class="subtitleA">Recensione</div>
              <div class="subtitleB">
                Come erano i professori e ricercatori?
              </div>
              <div class="subtitleC">Esplorando la fauna</div>
            </div>
            <div class="col-lg-7 information">
              <p>{{ reviewInformationB }}</p>
            </div>
            <div class="col-lg-1 display-lg"></div>
          </div>
          <hr/>
          <div class="row element">
            <div class="col-lg-4 subtitle-right">
              <div class="subtitleA">Recensione</div>
              <div class="subtitleB">A chi consiglio l'esperienza?</div>
              <div class="subtitleC">Persone interessate</div>
            </div>
            <div class="col-lg-8 information">
              <p>{{ reviewInformationC }}</p>
            </div>
          </div>
          <hr/>
          <div class="row element">
            <div class="col-lg-4 order-lg-last">
              <div class="subtitleA">Consigli</div>
              <div class="subtitleB">
                Qualche dritta per ottenere il massimo
              </div>
              <div class="subtitleC">Non sprecare questa opportunità</div>
            </div>
            <div class="col-lg-7 information">
              <p>{{ exp.indications }}</p>
            </div>
            <div class="col-lg-1 display-lg"></div>
          </div>
        </div>
      </section>
      <section class="row section2">
        <div class="col-md-8 col-lg-9 text-center text-md-left">
          <hr/>
          <h2>Valutazioni</h2>
          <div class="row">
                <div class="col-lg-6">
                  <h3>Globale</h3>
                  <star-rating
                      :read-only="true"
                      :rating="exp.rating.global_r"
                      :max-rating="10"
                      :star-size="starSize"
                      :inline="true"
                      :border-width="0"
                      :show-rating="false"
                      active-color="#f56300"
                  >
                  </star-rating>
                </div>
                <div class="col-lg-6">
                  <h3>Luogo</h3>
                  <star-rating
                      :read-only="true"
                      :rating="exp.rating.stay_r"
                      :max-rating="10"
                      :star-size="starSize"
                      :inline="true"
                      :border-width="0"
                      :show-rating="false"
                      active-color="#f56300"
                  >
                  </star-rating>
                </div>
                <div class="col-lg-6">
                  <h3>Conoscenze</h3>
                  <star-rating
                      :read-only="true"
                      :rating="exp.rating.aquired_knowledge_r"
                      :max-rating="10"
                      :star-size="starSize"
                      :border-width="0"
                      :inline="true"
                      :show-rating="false"
                      active-color="#f56300"
                  >
                  </star-rating>
                </div>
                <div class="col-lg-6">
                  <h3>Coinvolgimento</h3>
                  <star-rating
                      :read-only="true"
                      :rating="exp.rating.involvement_r"
                      :max-rating="10"
                      :star-size="starSize"
                      :border-width="0"
                      :inline="true"
                      :show-rating="false"
                      active-color="#f56300"
                  >
                  </star-rating>
                </div>
              </div>
          <h2>Altre informazioni</h2>
          <component :is="component" :attrs="exp.attrs" class="row"/>
        </div>
        <div class="col-md-4 col-lg-3 text-center text-md-left grey shadow">
              <div>
                <h2>Quando?</h2>
                <p>L'esperienza è iniziata il <strong>{{ sDate }}</strong></p>
                <p v-if="exp.ended_at">E' conclusa il <strong>{{ eDate }}</strong> con una durata complessiva di
                  <i>{{ duration }}</i></p>
                <p v-else>L'esperienza <i class="not-found">non si è ancora conclusa</i></p>
              </div>
              <div>
                <h2>Dove?</h2>
                <p>Principalemente presso la città di <span class="city">{{ exp.city.city }}
                  </span>, {{ exp.city.country }}</p>
              </div>
              <div v-if="exp.universities.length > 0">
                <h2>Collaborazioni con</h2>
                <p v-for="university of exp.universities">
                  <a :href="university.link" target="_blank">{{ university.name }}</a>
                </p>
              </div>
            </div>
      </section>
      <section class="row contacts-box text-center text-md-left">
        <div class="col-lg-7">
          <div v-if="exp.img" class="img-container">
            <img :src="exp.img" class="img-responsive fit-img img-thumbnail" alt="Immagine esperienza"/>
          </div>
          <img v-else-if="!exp.img && theme === 'dark'"
               :src="baseUrl + '/static/img/frontend/experiences/expsList4.jpg'"
               class="img-responsive fit-img img-thumbnail"
               alt="Immagine esperienza"
          />
          <img v-else
               :src="baseUrl + '/static/img/frontend/experiences/expsList1.jpg'"
               class="img-responsive fit-img img-thumbnail"
               alt="Immagine esperienza"
          />
        </div>
        <div class="col-lg-5 contacts">
          <h3>Chi sono?</h3>
          <p class="author-information">
            Sono <span class="author">{{ exp.author }}</span>
          </p>
          <h3>A che anno sono?</h3>
          <p v-if="exp.author_year === 'ex-allievo'">Sono un ex-allievo</p>
          <p v-else>Sono al {{ exp.author_year }} anno</p>
          <h3>Come puoi contattarmi?</h3>
          <p>
            Scrivendomi alla email:
            <span class="email">{{ exp.author_email }}</span>
          </p>
          <p v-if="exp.author_contact !== 'email istituzionale' && exp.author_contact !== exp.author_email &&
              exp.author_contact !== ''"
          >Ecco un altro mio contatto: {{ exp.author_contact }}</p>
          <h3>A chi ti devi rivolgere per organizzare l'esperienza?</h3>
          <p class="ref">{{ exp.ref }}</p>
        </div>
      </section>
      <div class="row back-experiences text-center text-md-left">
        <div class="col-12">
          <button class="btn" type="button" @click="backExperiences">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-return-left"
                viewBox="0 0 16 16"
            >
              <path
                  fill-rule="evenodd"
                  d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"
              />
            </svg>
            Torna a tutte le esperienze
          </button>
        </div>
      </div>
    </div>
    <div v-else><p>Questa esperienza non esiste</p></div>
    <base-dialog :show="hasError" title="Errore!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
  </div>
</template>

<script>
import {axiosService} from "../common/api.service.js";
import CongressConferenceSummerSchoolDetail
  from "../components/experiences/detail/CongressConferenceSummerSchoolDetail.vue";
import SfsLabErasmusDetail from "../components/experiences/detail/SfsLabErasmusDetail.vue";
import InternshipDetail from "../components/experiences/detail/InternshipDetail.vue";
import {ref, reactive, computed, toRefs, onDeactivated} from "vue";
import {useRouter} from "vue-router";
import {useGoodDateFormat} from "../hooks/dates.js";
import useAuth from "../hooks/auth.js";

export default {
  components: {
    CongressConferenceSummerSchoolDetail,
    SfsLabErasmusDetail,
    InternshipDetail
  },
  props: ["slug"],
  setup(props) {
    const baseUrl = import.meta.env.PROD ? "https://medexperiences.santannapisa.it/" : "http://127.0.0.1:8000/";
    const {theme} = useAuth();
    const exp = reactive({});
    const isLoading = ref(false);
    const error = ref(null);
    const component = ref(null);

    const {getGoodDateFormat, dateDiff} = useGoodDateFormat();

    const sDate = computed(function () {
      return getGoodDateFormat(exp.started_at);
    });

    const eDate = computed(function () {
      if (exp.ended_at) {
        return getGoodDateFormat(exp.ended_at);
      }
      return "Non disponibile"
    });

    const hasExp = computed(function () {
      return Object.keys(exp).length > 0 && exp.constructor === Object;
    });
    const hasError = computed(function () {
      return error.value !== null;
    });

    const {slug} = toRefs(props);

    const reviewInformationA = ref(null);
    const reviewInformationB = ref(null);
    const reviewInformationC = ref(null);

    function getReviewInformation() {
      const reviewInformation = exp.review.split("&r)");
      for (const info of reviewInformation) {
        if (reviewInformation.indexOf(info) === 1) {
          reviewInformationA.value = info;
        } else if (reviewInformation.indexOf(info) === 2) {
          reviewInformationB.value = info;
        } else if (reviewInformation.indexOf(info) === 3) {
          reviewInformationC.value = info;
        }
      }
    }

    const duration = computed(function () {
      if (exp.ended_at) {
        return dateDiff(exp.started_at, exp.ended_at, "it");
      } else {
        return "In corso"
      }
    });

    async function setExperience() {
      isLoading.value = true;
      try {
        const response = await axiosService(`/api/experiences/${slug.value}/`);
        for (const key in response.data) {
          exp[key] = response.data[key];
          document.title = "Dettagli esperienza " + exp.description;
        }
        try {
          const responseAttrs = await axiosService(
              `/api/experience/${slug.value}/attrs/`
          );
          exp["attrs"] = responseAttrs.data;
          component.value = exp.attrs.component + "-detail";
        } catch (e) {
          console.log(e);
          error.value =
              e.response.status === 404
                  ? "Questa esperienza non ha attributi"
                  : e.message;
        }
      } catch (e) {
        error.value =
            e.response.status === 404 ? "L'esperienza non esiste" : e.message;
      }
      getReviewInformation();
      isLoading.value = false;
    }

    const router = useRouter();

    function backExperiences() {
      router.push({name: "experiences-list"});
    }

    setExperience();

    const starSize = ref(20);

    function setStarSize() {
      const size = window.innerWidth;
      if (size < 700) {
        starSize.value = 15;
      } else {
        starSize.value = 20;
      }
    }

    function resizeEventHandler() {
      const size = window.innerWidth;
      if (size < 700) {
        starSize.value = 20;
      } else {
        starSize.value = 30;
      }
    }

    window.addEventListener("resize", resizeEventHandler);

    onDeactivated(() => {
      window.removeEventListener("resize", resizeEventHandler);
    });

    setStarSize();

    function handleError() {
      error.value = null;
    }

    return {
      baseUrl,
      theme,
      exp,
      isLoading,
      error,
      component,
      sDate,
      eDate,
      hasExp,
      hasError,
      reviewInformationA,
      reviewInformationB,
      reviewInformationC,
      starSize,
      handleError,
      backExperiences,
      duration
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 3rem;
  line-height: 1.07143;
  font-weight: 700;
  letter-spacing: -0.005em;
  margin: 2rem auto;
}

.section1 h2 {
  margin: 1.5rem auto;
  font-size: 2.7rem;
  line-height: 1.08349;
  font-weight: 600;
  letter-spacing: -0.003em;
  text-align: center;
}

[data-theme="dark"] .section1 h2 {
  background-size: 54% 156%;
  background: radial-gradient(ellipse at center, #eff1ff 10%, #000 100%) center center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

[data-theme="light"] .section1 h2 {
  background-size: 54% 156%;
  background: radial-gradient(ellipse at center, #3b3d47 10%, #000 100%) center center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.element {
  margin: 3rem 0;
}

.subtitleA {
  color: #F56300;
  font-weight: 600;
  font-size: 1.3rem;
}

.subtitleB {
  font-size: 2.5rem;
  line-height: 1.19048;
  font-weight: 600;
  letter-spacing: .004rem;
  margin: 1rem 0;
}

[data-theme="light"] .subtitleB {
  color: #130f0f;
}

[data-theme="dark"] .subtitleB {
  color: #F5F5F7;
}

.subtitleC {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  line-height: 1.19048;
  font-weight: 600;
  color: #0071e3;
  letter-spacing: 0.011em;
  font-size: 1.3rem;
}

.information {
  font-size: 1.2rem;
  line-height: 1.19048;
  letter-spacing: .011em;
  text-align: justify;
  text-justify: inter-word;
}

.contacts-box, .back-experiences {
  margin: 0.5rem;
}

[data-theme="light"] .contacts {
  color: #58585A;
}

.contacts h3 {
  margin: 0 0 1rem 0;
  padding-top: 0;
}

.contacts p {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.section2 {
  margin: 2rem 1.5rem;
  padding: 1rem;
}

.section2 h2 {
  margin: 0.8rem 0;
}

.section2 h3 {
  margin: 0.4rem 0;
}

.email {
  line-height: 1.07143;
  font-weight: 700;
  color: #0077ED;
}

.author, .ref {
  color: #373739;
  font-weight: bold;
}

[data-theme="dark"] .author, [data-theme="dark"] .ref {
  color: white;
}

.back-experiences {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.back-experiences button {
  font-size: 1.3rem;
  background-color: #0077ED;
  color: white;
  border-radius: 1rem;
  transition: 0.3s;
  outline: none;
  border: none;
  position: relative;
  padding: .5rem;
}

.back-experiences button:hover {
  transform: scale(1.03);
}

.section1 {
  margin-bottom: 0.5rem;
}
@media screen and (min-width: 768px) {
  .element {
    margin: 4rem;
  }
}
.grey {
  background-color: var(--itembackgroundColorList);
}
.city {
  color: var(--orange);
  font-weight: 800;
}
.fit-img {
  width: 100%;
  object-fit: cover;
}
.img-container {
  margin: 0;
  padding: 0;
}
@media screen and (min-width: 992px) {
  .img-container {
    max-width: 600px;
  }
}
</style>
