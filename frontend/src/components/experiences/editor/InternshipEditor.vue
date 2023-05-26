<template>
  <div>
    <h2>Attributi di {{ type }}</h2>
    <div class="form-row row">
      <div class="form-group col-md-6" :class="{ invalid: !institution.isValid }">
        <label>Istituto</label>
        <input type="text" v-model.trim="institution.val"
               class="form-control" @click="clearValidity('institution')"
        />
        <div class="invalid-message" v-if="!institution.isValid">
          {{ istitution.errorText }}
        </div>
      </div>
      <div class="form-group col-md-6" :class="{ invalid: !ward.isValid }">
        <label>Reparto</label>
        <input type="text" v-model.trim="ward.val"
               class="form-control" @click="clearValidity('ward')"
        />
        <div class="invalid-message" v-if="!ward.isValid">
          {{ ward.errorText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

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
    const attrIsValid = ref(false);
    const ward = reactive({
      val: props.attrs !== null ? props.attrs.ward : "",
      isValid: true,
      errorText: ""
    });
    const institution = reactive({
      val: props.attrs !== null ? props.attrs.institution : '',
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
      if (ward.val === "") {
        attrIsValid.value = false;
        ward.isValid = false;
        ward.errorText = "Questo campo non può essere lasciato vuoto";
      }
      if (
          ward.val !== "" &&
          ward.val !== undefined &&
          ward.val.length > 50
      ) {
        attrIsValid.value = false;
        ward.isValid = false;
        ward.errorText = "Al massimo puoi usare 50 caratteri. Ne hai usati " + ward.val.length;
      }
    }

    function submitData() {
      attrIsValid.value = true;
      validateForm();
      if (!attrIsValid.value) {
        return;
      }
      const data = {
        ward: ward.val,
        institution: institution.val,
        attr: 'attrs3'
      };
      context.emit("update-attr", {data, attrIsValid: attrIsValid.value});
    }

    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = "";
    }

    return {ward, institution, clearValidity, submitData}
  }
};
</script>