<template>
  <div>
    <h2>Attributi di {{ type }}</h2>
    <div class="form-row row">
      <div class="form-group col-12 col-md-5" :class="{ invalid: !title.isValid }">
        <label for="title">Titolo conferenza</label>
        <input
          id="title"
          type="text"
          v-model.trim="title.val"
          class="form-control"
          @click="clearValidity('title')"
        />
        <div class="invalid-message" v-if="!title.isValid">
          {{ title.errorText }}
        </div>
      </div>
      <div class="form-group col-10 col-md-5" :class="{ invalid: !link.isValid }">
        <label for="link">Link conferenza</label>
        <input
          id="link"
          type="text"
          v-model.trim="link.val"
          class="form-control"
          @click="clearValidity('link')"
        />
        <div class="invalid-message" v-if="!link.isValid">
          {{ link.errorText }}
        </div>
      </div>
      <div class="form-group col-2" :class="{ invalid: !cost.isValid }">
        <label for="cost">Costo</label>
        <input
          id="cost"
          type="number"
          v-model.number="cost.val"
          class="form-control"
          @click="clearValidity('cost')"
        />
        <div class="invalid-message" v-if="!cost.isValid">
          {{ cost.errorText }}
        </div>
      </div>
    </div>
    <div class="form-row row">
      <div class="form-group col-md-6" :class="{ invalid: !organization.isValid }">
        <label for="organization">Organizzazione</label>
        <input
          id="organization"
          type="text"
          v-model.trim="organization.val"
          class="form-control"
          @click="clearValidity('organization')"
        />
        <div class="invalid-message" v-if="!organization.isValid">
          {{ organization.errorText }}
        </div>
      </div>
      <div class="form-group col-md-6" :class="{ invalid: !organizationLink.isValid }">
        <label for="linkOrganizazion">Link Organizzazione</label>
        <input
          id="linkOrganizazion"
          type="text"
          v-model.trim="organizationLink.val"
          class="form-control"
          @click="clearValidity('organizationLink')"
        />
        <div class="invalid-message" v-if="!organizationLink.isValid">
          {{ organizationLink.errorText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, reactive} from "vue";

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
  emits: ["update-attr"],
  setup(props, context) {
    const attrIsValid = ref(false);
    const title = reactive({
      val: props.attrs !== null ? props.attrs.title : "",
      isValid: true,
      errorText: ""
    });
    const link = reactive({
      val: props.attrs !== null ? props.attrs.link : "",
      isValid: true,
      errorText: ""
    });
    const cost = reactive({
      val: props.attrs !== null ? props.attrs.cost : 0,
      isValid: true,
      errorText: ""
    });
    const organization = reactive({
      val: props.attrs !== null ? props.attrs.organization : "",
      isValid: true,
      errorText: ""
    });
    const organizationLink = reactive({
      val: props.attrs !== null ? props.attrs.link_organization : '',
      isValid: true,
      errorText: ""
    });

    function validateForm() {
      if (title.val === "") {
        attrIsValid.value = false;
        title.isValid = false;
        title.errorText = "Questo campo non può essere lasciato vuoto";
      }
      if (title.val !== "" && title.val !== undefined && title.val.length > 300) {
        attrIsValid.value = false;
        title.isValid = false;
        title.errorText = "Al massimo puoi usare 300 caratteri. Ne hai usati " + title.val.length;
      }
      if (organization.val === "") {
        attrIsValid.value = false;
        organization.isValid = false;
        organization.errorText = "Questo campo non può essere lasciato vuoto";
      }
      if (organization.val !== "" && organization.val !== undefined && organization.val.length > 300) {
        attrIsValid.value = false;
        organization.isValid = false;
        organization.errorText = "Al massimo puoi usare 300 caratteri. Ne hai usati " + organization.val.length;
      }
      if (link.val !== "" && link.val !== undefined && link.val.length > 1000) {
        attrIsValid.value = false;
        link.isValid = false;
        link.errorText = "Al massimo puoi usare 1000 caratteri. Ne hai usati " + link.val.length;
      }
      if (organizationLink.val !== "" && organizationLink.val !== undefined && organizationLink.val.length > 1000) {
        attrIsValid.value = false;
        organizationLink.isValid = false;
        organizationLink.errorText = "Al massimo puoi usare 1000 caratteri. Ne hai usati " + organizationLink.val.length;
      }
    }
    function submitData() {
      attrIsValid.value = true;
      validateForm();
      if (!attrIsValid.value) {
        return;
      }
      const data = {
        title: title.val,
        link: link.val,
        cost: cost.val,
        organization: organization.val,
        link_organization: organizationLink.val,
        attr: 'attrs2'
      };
      context.emit("update-attr", {data, attrIsValid: attrIsValid.value});
    }

    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = "";
    }

    return {
      title,
      organizationLink,
      cost,
      organization,
      link,
      submitData,
      clearValidity
    };
  }
};
</script>
