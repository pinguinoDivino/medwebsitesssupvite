<template>
  <div class="index-container">
    <div :class="{'index': !animated, 'index-done': animated}">
      <div :class="{'content': !animated, 'content-done': animated}" id="content-animated">
        <div class="container-fluid">
          <h1 class="title">Benvenuti</h1>
          <div class="row row-sfs card">
            <div class="col-lg-8 order-lg-2 img-container">
              <img class="img-responsive" :src="sfsSrc" alt="SFS immagine di riferimento"/>
            </div>
            <div class="col-lg-4">
              <div class="text-container">
                <h2>SFS e Laboratori</h2>
                <h3>Cosa sono?</h3>
                <p>
                  I soggiorni fuorisede e i laboratori sono parte intengrante della
                  nostra esperienza formativa, infatti già da febbraio del primo anno
                  siamo incoraggiati a recarci in alcuni dipartimenti dell'università
                  di Pisa e del CNR. Ci permettono di affacciarci non solo al mondo
                  della ricerca ma anche di visitare alcune delle università più
                  prestigiose al mondo (Cambridge, Harvard, Oxford e Yale per citarne
                  alcune).
                </p>
                <router-link
                    :to="{
                    name: 'experiences-list',
                    params: {
                      optionsOn: 'SFS'
                    }
                  }"
                >
                  Sfoglia le nostre esperienze nei laboratori di tutto il mondo
                </router-link>
              </div>
            </div>
          </div>
          <div class="row spacer"></div>
          <div class="row row-congress card">
            <div class="col-lg-8 img-container">
              <img
                  class="img-responsive"
                  :src="congressSrc"
                  alt="Congresso/Conferenza immagine di riferimento"
              />
            </div>
            <div class="col-lg-4 ">
              <div class="text-container">
                <h2>Conferenze e Congressi</h2>
                <h3>Dove?</h3>
                <p>
                  Ogni giorno nell'Aula Magna è organizzata almeno una conferenza
                  tenuta, oltre che dai nostri Professori, anche da ricercatori di altre
                  università.
                  Esistono programmi annuali, come 'The Human Brain Project'
                  o il ciclo di Orizzonti in Medicina e Biologia in cui si invitano ospiti di fama internazionale.
                  Inoltre grazie a Scuola possiamo assistere a dei congressi internazionali
                  tenuti in altre città.
                </p>
                <router-link
                    :to="{
              name: 'experiences-list',
              params: {
                optionsOn: 'Congresso'
              }
            }"
                >
                  Guarda le conferenze e i congressi a cui siamo andati
                </router-link>
              </div>
            </div>
          </div>
          <div class="row spacer"></div>
          <div class="row row-summerschool card">
            <div class="col-lg-8 order-lg-2 img-container">
              <img
                  class="img-responsive"
                  :src="summerschoolSrc"
                  alt="Summerschool immagine di riferimento"
              />
            </div>
            <div class="col-lg-4">
              <div class="text-container">
                <h2>Summer Schools</h2>
                <h3>Davvero?</h3>
                <p>
                  E' una scuola, o un programma generalmente sponsorizzato da una scuola o da un
                  distretto scolastico che fornisce lezioni e
                  attività durante le vacanze estive. La partecipazione alle scuole estive ha dimostrato di
                  avere effetti benefici sostanziali sul progresso educativo.
                  Negli ultimi anni sono state particolarmente apprezzate quelle di
                  neuroscienze presso l' SNS.
                </p>
                <router-link
                    :to="{
              name: 'experiences-list',
              params: {
                optionsOn: 'SummerSchool'
              }
            }"
                >
                  Esplora le summer schools a cui abbiamo preso parte.
                </router-link>
              </div>
            </div>
          </div>
          <div class="row spacer"></div>
          <div class="row row-erasmus card">
            <div class="col-lg-8 img-container ">
              <img
                  class="img-responsive"
                  :src="eramusSrc"
                  alt="erasmus immagine di riferimento"
              />
            </div>
            <div class="col-lg-4 order-lg-2">
              <div class="text-container">
                <h2>Erasmus</h2>
                <h3>Dove?</h3>
                <p>
                  Il programma Erasmus è un programma di mobilità studentesca dell'Unione europea, creato nel 1987.
                  Esso dà la possibilità a uno studente universitario europeo di effettuare in una università di
                  un altro stato dell'UE un periodo di studio legalmente riconosciuto dalla propria università.
                  Il nome del programma deriva dall'umanista e teologo olandese Erasmo da Rotterdam,
                  che viaggiò diversi anni in tutta Europa per comprenderne le differenti culture.
                </p>
                <router-link
                    :to="{
              name: 'experiences-list',
              params: {
                optionsOn: 'Erasmus'
              }
            }"
                >
                  Scopri i nostri viaggi di Erasmus
                </router-link>
              </div>
            </div>
          </div>
          <div class="row spacer"></div>
          <div class="row row-internship card">
            <div class="col-lg-8 img-container order-lg-2">
              <img
                  class="img-responsive"
                  :src="internshipSrc"
                  alt="erasmus immagine di riferimento"
              />
            </div>
            <div class="col-lg-4">
              <div class="text-container">
                <h2>Tirocini</h2>
                <h3>Altri?</h3>
                <p>
                  Oltre ai tirocini professionalizzanti presso l'Università di Pisa si ha la possibilità
                  di svolgere internati presso la Fondazione Monasterio o presso altri enti associati a Scuola.
                  Inoltre esistono convenzioni con ospedali all'estero come il Sick Kids a Toronto che ci permettono
                  di accedere ai reparti dell'ospedale.
                </p>
                <router-link
                    :to="{
              name: 'experiences-list',
              params: {
                optionsOn: 'Tirocinio'
              }
            }"
                >
                  Scopri dei tirocini aggiuntivi ed extracurriculari
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <base-dialog title="Avviso" :show="!!error"
               @close="handleError('error')">
    <h3>Ciao {{ userFullName }}</h3>
    <p>
      Volevamo avvisarti che non disponi dei permessi necessari a modificare / aggiungere elementi alle pagine. Per
      questo motivo non potrai accedere ad alcune
      aree del sito. Se pensi ci sia un errore contatta un amministratore.</p>
  </base-dialog>
</template>
<script>
import useAuth from "../hooks/auth.js";
import {computed, onDeactivated, ref} from "vue";
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";


export default {
  setup() {
    const store = useStore();
    const {userFullName, userIsAuth1} = useAuth();
    const error = ref(null);
    if (!userIsAuth1.value) {
      store.dispatch("turnOffAnimation");
      error.value = "Errore nell'autentificazione";
    }

    function handleError(input) {
      eval(input).value = null;
    }

    const width = ref(0);

    function srcByWidth(img1, img2) {
      if (width.value > 992 && width.value < 1401) {
        return img1;
      } else {
        return img2;
      }
    }

    const eramusSrc = computed(function () {
      return srcByWidth(
          "/static/img/frontend/home/erasmus2.jpeg",
          "/static/img/frontend/home/erasmus1.jpeg");
    });
    const sfsSrc = computed(function () {
      return srcByWidth(
          "/static/img/frontend/home/sfs2.jpeg",
          "/static/img/frontend/home/sfs1.jpeg");
    });
    const internshipSrc = computed(function () {
      return srcByWidth(
          "/static/img/frontend/home/internship2.jpeg",
          "/static/img/frontend/home/internship1.jpeg");
    });

    const congressSrc = computed(function () {
      return srcByWidth(
          "/static/img/frontend/home/congress2.jpeg",
          "/static/img/frontend/home/congress1.jpeg");
    });

    const summerschoolSrc = computed(function () {
      return srcByWidth(
          "/static/img/frontend/home/summerschool2.jpeg",
          "/static/img/frontend/home/summerschool1.jpeg");
    });

    const resizeEventHandler = () => {
      width.value = window.innerWidth;
    };
    width.value = window.innerWidth;
    window.addEventListener("resize", resizeEventHandler);

    onDeactivated(() => {
      window.removeEventListener("resize", resizeEventHandler);
    });


    const animated = store.getters.animated;
    onBeforeRouteLeave(() => {
      store.dispatch("turnOffAnimation");
    })

    document.title = "MEDSSSUP Esperienze & Tirocini";

    return {
      userFullName, error, handleError,
      eramusSrc, sfsSrc, internshipSrc, congressSrc, summerschoolSrc, animated
    };
  }
};
</script>
<style scoped>
.index-container {
  width: 100%;
  display: flex;
  justify-content: center;
  justify-items: center;
  background-color: var(--itembackgroundColorList);
  position: relative;
  perspective: 1000px;
  overflow: hidden;
}

.index-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 100vh;
  background-color: var(--orange);
}

.index {
  position: relative;
  width: 20px;
  height: 100vh;
  background-color: var(--itembackgroundColorList);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotateX(180deg);
  animation: rotateX 1s 1s forwards 1, scale 2s 2.2s forwards 1;
}
.index::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 3px;
  height: 100%;
  background-color: white;
  animation: slide-in 1s forwards 1;
}

.index::after {
  content: "";
  position: absolute;
  top: -100%;
  right: 0;
  width: 3px;
  height: 100%;
  background-color: white;
  animation: slide-in 1s forwards 1;
}

@keyframes slide-in {
  99% {
    top: 0;
    opacity: 1;
  }
  100% {
    top: 0;
    opacity: 0;
  }
}

@keyframes rotateX {
  0% {
    transform: rotateX(180deg);
    height: 100vh;
    background-color: #fbfbfb;
  }
  100% {
    transform: rotateX(0deg);
    background-color: var(--backgroundColor);
  }
}

@keyframes scale {
  100% {
    width: 92%;
    height: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 0 60px;
    box-shadow: 0 40px 50px rgba(0, 0, 0, 0.25);
  }
}

.index-done {
  position: relative;
  width: 92%;
  height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 0 20px;
  box-shadow: 0 40px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--backgroundColor);
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade-in 1s forwards;
  opacity: 0;
  animation-delay: 4s;
}

@keyframes fade-in {
  100% {
    opacity: 1;
  }
}

.content-done {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}

.container-fluid {
  text-align: center;
}

h1 {
  font-weight: bold;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
}

h2 {
  padding-top: 0.4rem;
}

.card {
  color: white;
}
.text-container {
    height: 100%;
    padding: 3px;
}
.img-responsive,
.img-container {
  margin: 0;
  padding: 0;
  width: 100%;
}

.row-sfs {
  background-color: var(--danger);
}

.row-congress {
  background-color: var(--primary);
}

.row-summerschool {
  background-color: var(--info);
}

.row-erasmus {
  background-color: var(--success);
}

.row-internship {
  background-color: var(--secondary);
}

[data-theme="light"] .row a {
  text-decoration: none;
  color: black;
}

[data-theme="dark"] .row a {
  text-decoration: none;
  color: var(--orange);
}

a:hover {
  font-weight: bold;
}
.spacer {
    padding-top: 0.3rem;
    background-color: var(--backgroundColor);
  }
@media screen and (min-width: 992px) {
  .title {
    text-align: left;
  }

  .container-fluid {
    text-align: left;
    font-size: 1.18rem;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .text-container a {
    align-self: flex-end;
  }

  .spacer {
    padding-top: 1rem;
  }
}
@media screen and (min-width: 1060px) {
  .container-fluid {
    font-size: 1.35rem;
  }
}
@media screen and (min-width: 1200px) {
  .container-fluid {
    font-size: 1.40rem;
  }
}
</style>
