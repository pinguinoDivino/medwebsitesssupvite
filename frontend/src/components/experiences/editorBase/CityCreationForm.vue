<template>
  <base-dialog title="Aggiungi una nuova Città" @close="closeTab">
    <form @submit.prevent="submitData">
      <section>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <div v-else>
          <div class="form-group" v-if="!!error">{{ error }}</div>
          <div class="form-group" :class="{ invalid: !country.isValid }">
            <label for="countryCity">Stato</label>
            <select
              id="countryCity"
              v-model="country.val"
              class="form-control"
              @blur="clearValidity('country')"
            >
              <option
                v-for="c of countries"
                :key="c"
                :value="c"
                >{{ c }}</option
              >
            </select>
            <div class="invalid-message" v-if="!country.isValid">
              {{ country.errorText }}
            </div>
          </div>
          <div class="form-group" :class="{ invalid: !region.isValid }"
            v-if="country.val === 'Italy'"
          >
            <label for="region">Regione</label>
            <select
              id="region"
              v-model.trim="region.val"
              class="form-control"
              @blur="clearValidity('region')"
            >
              <option value="Abruzzo">Abruzzo</option>
              <option value="Basilicata">Basilicata</option>
              <option value="Calabria">Calabria</option>
              <option value="Campania">Campania</option>
              <option value="Emilia-Romagna">Emilia-Romagna</option>
              <option value="Friuli-Venezia Giulia"
                >Friuli-Venezia Giulia</option
              >
              <option value="Lazio">Lazio</option>
              <option value="Liguria">Liguria</option>
              <option value="Lombardia">Lombardia</option>
              <option value="Marche">Marche</option>
              <option value="Molise">Molise</option>
              <option value="Piemonte">Piemonte</option>
              <option value="Puglia">Puglia</option>
              <option value="Sardegna">Sardegna</option>
              <option value="Sicilia">Sicilia</option>
              <option value="Toscana">Toscana</option>
              <option value="Trentino-Alto Adige">Trentino-Alto Adige</option>
              <option value="Umbria">Umbria</option>
              <option value="Valle d'Aosta">Valle d'Aosta</option>
              <option value="Veneto">Veneto</option>
            </select>
            <div class="invalid-message" v-if="!region.isValid">
              {{ region.errorText }}
            </div>
          </div>
          <div class="form-group" :class="{ invalid: !name.isValid }">
            <label for="comune">Comune</label>
            <input
              id="comune"
              type="text"
              v-model.trim="name.val"
              class="form-control"
              @blur="clearValidity('name')"
            />
            <div class="invalid-message" v-if="!name.isValid">
              {{ name.errorText }}
            </div>
          </div>
        </div>
      </section>
      <footer>
        <base-button type="submit" mode="primary">Aggiungi città</base-button>
      </footer>
    </form>
  </base-dialog>
</template>

<script>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
export default {
  props: ["cities", "countries"],
  emits: ["close", "new-city"],
  setup(props, context) {
    const store = useStore();
    const name = reactive({ val: "", isValid: true, errorText: "" });
    const region = reactive({ val: "", isValid: true, errorText: "" });
    const country = reactive({ val: "", isValid: true, errorText: "" });
    const error = ref(null);
    const isLoading = ref(false);
    const formIsValid = ref(true);

    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = "";
    }
    function clearError() {
      error.value = null;
      name.val = "";
      name.isValid = true;
      name.errorText = "";
      region.val = "";
      region.isValid = true;
      region.errorText = "";
      country.val = "";
      country.isValid = true;
      country.errorText = "";
    }
    function closeTab() {
      clearError();
      context.emit("close");
    }
    function validateForm() {
      const emptyFieldError = "Questo campo non può essere lasciato vuoto";
      const tooLongTextFieldError =
        "Al massimo puoi usare 2000 caratteri. Ne hai usati ";
      let names = [];
      for (const city of props.cities) {
        names.push(city.city);
      }
      formIsValid.value = true;
      if (name.val === "") {
        formIsValid.value = false;
        name.isValid = false;
        name.errorText = emptyFieldError;
      }
      if (name.val.length > 2000) {
        formIsValid.value = false;
        name.isValid = false;
        name.errorText = tooLongTextFieldError + name.val.length;
      }
      if (names.some(item => name.val.toLowerCase() === item.toLowerCase())) {
        formIsValid.value = false;
        name.isValid = false;
        name.errorText = "Questa città esiste già";
      }
      if (country.val === "") {
        formIsValid.value = false;
        country.isValid = false;
        country.errorText = emptyFieldError;
      }
      if (country.val.length > 2000) {
        formIsValid.value = false;
        country.isValid = false;
        country.errorText = tooLongTextFieldError + country.val.length;
      }
      if (region.val.length > 2000) {
        formIsValid.value = false;
        region.isValid = false;
        region.errorText = tooLongTextFieldError + region.val.length;
      }
    }
    async function submitData() {
      validateForm();
      if (!formIsValid.value) {
        return;
      }
      const data = {
        city: name.val,
        country: country.val,
        region: region.val
      };
      await store.dispatch("experiences/addCity", { data });
      const newCity = await store.getters["experiences/cities"][
        (await store.getters["experiences/cities"].length) - 1
      ];
      context.emit("new-city", newCity);
      closeTab();
    }
    return {
      name,
      country,
      region,
      isLoading,
      error,
      clearValidity,
      closeTab,
      submitData
    };
  }
};
</script>