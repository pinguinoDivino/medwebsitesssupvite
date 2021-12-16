import { computed, reactive, ref } from "vue";

const emptyFieldError = "Questo campo non può essere lasciato vuoto";
const tooLongBaseTextFieldError =
  "Al massimo puoi usare 2000 caratteri. Ne hai usati ";

export default function useBaseActivityForm(
  typ,
  pAct = null
) {
  const description = reactive({
    val: pAct !== null ? pAct.description : "",
    isValid: true,
    errorText: ""
  });
  const title = reactive({
    val: pAct !== null ? pAct.title : "",
    isValid: true,
    errorText: ""
  });
  const link1 = reactive({
    val: pAct !== null ? pAct.link1 : "",
    isValid: true,
    errorText: ""
  });
  const link2 = reactive({
    val: pAct !== null ? pAct.link2 : "",
    isValid: true,
    errorText: ""
  });
  const link3 = reactive({
    val: pAct !== null ? pAct.link3 : "",
    isValid: true,
    errorText: ""
  });
  const startingDate = reactive({
    val: pAct !== null ? pAct.started_at : "",
    isValid: true,
    errorText: ""
  });
  const endingDate = reactive({
    val: pAct !== null ? pAct.ended_at : null,
    isValid: true,
    errorText: ""
  });
  const budget = reactive({
    val: pAct !== null ? pAct.budget : null,
    isValid: true,
    errorText: ""
  });
  const externalBudget = reactive({
    val: pAct !== null ? pAct.external_budget : null,
    isValid: true,
    errorText: ""
  });
  const numberInternalPersonal = reactive({
    val: pAct !== null ? pAct.internal_staff_number : null,
    isValid: true,
    errorText: ""
  });
  const numberRecipient = reactive({
    val: pAct !== null ? pAct.recipient_number : null,
    isValid: true,
    errorText: ""
  });
  const univs_ids = ref(
    pAct !== null &&
      pAct.universities !== null &&
      pAct.universities !== undefined
      ? (() => {
          const ids = [];
          for (const uni of pAct.universities) {
            ids.push(uni.id);
          }
          return ids;
        })()
      : []
  );
  const imgs = ref(null);
  const docs = ref(null);
  const sdgs = reactive({
    val: pAct !== null ? JSON.parse("[" + pAct.sdgs + "]") : [18],
    isValid: true,
    errorText: ""
  });
  const selectedTags = ref(pAct !== null ? pAct.tags : null);

  function updateDocs(payload) {
    docs.value = payload;
  }
  function updateImgs(payload) {
    imgs.value = payload;
  }
  const maxDescriptionChar = 2000;
  const leftDescriptionChars = computed(function() {
    return maxDescriptionChar - description.val.length >= 0
      ? "Ti restano " +
          (maxDescriptionChar - description.val.length) +
          " caratteri"
      : "Hai usato troppi caratteri";
  });

  const formIsValid = ref(true);

  function validateBaseForm(formIsValid) {
    formIsValid.value = true;
    if (sector.val === "") {
      formIsValid.value = false;
      sector.isValid = false;
      sector.errorText = emptyFieldError;
    }
    if (istitute.val === "") {
      formIsValid.value = false;
      istitute.isValid = false;
      istitute.errorText = emptyFieldError;
    }
    if (description.val === "") {
      formIsValid.value = false;
      description.isValid = false;
      description.errorText = emptyFieldError;
    }
    if (
      description.val !== "" &&
      description.val !== undefined &&
      description.val.length > maxDescriptionChar
    ) {
      formIsValid.value = false;
      description.isValid = false;
      description.errorText =
        tooLongBaseTextFieldError + description.val.length;
    }
    if (title.val === "") {
      formIsValid.value = false;
      title.isValid = false;
      title.errorText = emptyFieldError;
    }
    if (title.val !== "" && title.val !== undefined && title.val.length > 300) {
      formIsValid.value = false;
      title.isValid = false;
      title.errorText =
        "Al massimo puoi usare 300 caratteri. Ne hai usati " + title.val.length;
    }
    if (
      link1.val !== "" &&
      link1.val !== null &&
      link1.val !== undefined &&
      link1.val.length > 2000
    ) {
      formIsValid.value = false;
      link1.isValid = false;
      link1.errorText = tooLongBaseTextFieldError + link1.val.length;
    }
    if (
      link2.val !== "" &&
      link2.val !== null &&
      link2.val !== undefined &&
      link2.val.length > 2000
    ) {
      formIsValid.value = false;
      link2.isValid = false;
      link2.errorText = tooLongBaseTextFieldError + link2.val.length;
    }
    if (
      link3.val !== "" &&
      link3.val !== null &&
      link3.val !== undefined &&
      link3.val.length > 2000
    ) {
      formIsValid.value = false;
      link3.isValid = false;
      link3.errorText = tooLongBaseTextFieldError + link3.val.length;
    }
    if (startingDate.val === "") {
      startingDate.isValid = false;
      startingDate.errorText = emptyFieldError;
      formIsValid.value = false;
    }
    if (
      endingDate.val !== null &&
      new Date(startingDate.val).getTime() > new Date(endingDate.val).getTime()
    ) {
      startingDate.isValid = false;
      startingDate.errorText =
        "La data di inizio non può essere maggiore di quella della fine";
      formIsValid.value = false;
    }
    if (sdgs.val === null || sdgs.val.length === 0) {
      formIsValid.value = false;
      sdgs.isValid = false;
      sdgs.errorText = emptyFieldError;
    }
    if (sdgs.val.toString().includes("18") && sdgs.val.length > 1) {
      formIsValid.value = false;
      sdgs.isValid = false;
      sdgs.errorText = "Hai selezionato nessun SDGs e un altro!";
    }
    if ((budget.val !== null && budget.val < 0) || budget > 10000000) {
      formIsValid.value = false;
      budget.isValid = false;
      budget.errorText = "Deve essere compreso fra 0 1 10.000.000";
    }
    if (
      externalBudget.val !== null &&
      externalBudget.val < 0 &&
      externalBudget > 10000000
    ) {
      formIsValid.value = false;
      externalBudget.isValid = false;
      externalBudget.errorText = "Deve essere compreso fra 0 1 10.000.000";
    }
    if (
      !Number.isInteger(numberInternalPersonal.val) &&
      numberInternalPersonal.val !== null
    ) {
      formIsValid.value = false;
      numberInternalPersonal.isValid = false;
      numberInternalPersonal.errorText = "Deve essere un numero intero";
    }
    if (numberInternalPersonal.val !== null && numberInternalPersonal.val < 0) {
      formIsValid.value = false;
      numberInternalPersonal.isValid = false;
      numberInternalPersonal.errorText = "Non può essere un numero negativo";
    }
  }

  function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const typeTitle = computed(function() {
    if (typ === "tec-transfer") {
      return "Attività di Trasferimento tecnologico";
    } else if (typ === "edu-formation") {
      return "Attività di Educazione e formazione continua";
    } else if (typ === "dissemination") {
      return "Attività di Dissemination";
    } else if (typ === "public-engagement") {
      return "Attività di Public engagement";
    } else if (typ === "social-impact") {
      return "Attività di Inclusione sociale e impatto";
    } else if (typ === "ist-support") {
      return "Attività di Supporto alle istituzioni";
    } else if (typ === "stakeholders") {
      return "Attività di Stakeholders";
    } else if (typ === "open-scy-tools") {
      return "Attività di Strumenti di open science";
    } else if (typ === "clinical-trials-health") {
      return "Attività di Clinical trials e tutela della salute e della biodiversità";
    } else if (typ === "art-culture") {
      return "Attività di Arte e cultura";
    } else {
      return "Attività generica";
    }
  });

  return {
    sector,
    istitute,
    univs_ids,
    description,
    leftDescriptionChars,
    title,
    link1,
    link2,
    link3,
    startingDate,
    endingDate,
    imgs,
    docs,
    sdgs,
    budget,
    externalBudget,
    numberInternalPersonal,
    numberRecipient,
    selectedTags,
    updateImgs,
    updateDocs,
    formIsValid,
    goToTop,
    validateBaseForm,
    typeTitle
  };
}

