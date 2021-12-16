<template>
  <div>
    <h2>Attributi di {{ type }}</h2>
    <div class="form-row row">
      <div class="form-group col-md-6" :class="{ invalid: !istitution.isValid }">
        <label>Istituto</label>
        <input type="text" v-model.trim="istitution.val"
               class="form-control" @click="clearValidity('istitution')"
        />
        <div class="invalid-message" v-if="!istitution.isValid">
          {{ istitution.errorText }}
        </div>
      </div>
      <div class="form-group col-md-6 text-left">
        <label>Si può scrivere la tesi?</label>
        <div class="form-control form-check-container">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="true" id="yes"
                   v-model="thesis.val"/>
            <label class="form-check-label" for="yes">Sì</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="false" id="no"
                   v-model="thesis.val"/>
            <label class="form-check-label" for="no">No</label>
          </div>
          <div class="form-check form-check-inline long">
             <input class="form-check-input" type="radio" value="null" id="null"
                   v-model="thesis.val"/>
            <label class="form-check-label" for="null">Non so</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, reactive} from 'vue';

export default {
  props: {
    type: {
      type: String,
      required: true
    },
    attrs: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['update-attr'],
  setup(props, context) {
    const attrIsValid = ref(true);
    const thesis = reactive({
      val: props.attrs !== null ? props.attrs.thesis : false,
      isValid: true,
      errorText: ""
    });
    const istitution = reactive({
      val: props.attrs !== null ? props.attrs.istitution : '',
      isValid: true,
      errorText: ""
    });

    function validateForm() {
      if (istitution.val === "") {
        attrIsValid.value = false;
        istitution.isValid = false;
        istitution.errorText = "Questo campo non può essere lasciato vuoto";
      }
      if (
          istitution.val !== "" &&
          istitution.val !== undefined &&
          istitution.val.length > 300
      ) {
        attrIsValid.value = false;
        istitution.isValid = false;
        istitution.errorText = "Al massimo puoi usare 300 caratteri. Ne hai usati " + istitution.val.length;
      }
    }

    function submitData() {
      attrIsValid.value = true;
      validateForm();
      if (!attrIsValid.value) {
        return;
      }
      const data = {
        thesis: thesis.val,
        istitution: istitution.val,
        attr: 'attrs1'
      };
      context.emit("update-attr", {data, attrIsValid: attrIsValid.value});
    }

    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = "";
    }

    return {
      thesis,
      istitution,
      clearValidity,
      submitData
    }
  }
};
</script>

<style scoped>
.form-check-container {
  display: flex;
  flex-direction: row;
  justify-content: left;
  width: 100%;
  position: relative;
}

.form-check-inline {
  position: relative;
  display: flex;
  flex-direction: row;
  margin: 0.5rem 9rem 0.5rem 0;
}

.form-check-label {
  position: absolute;
  top: 50%;
  margin-left: 1rem;
  transform: translateY(-50%);
}
.long {
  flex: 1 1 auto;
}
</style>
