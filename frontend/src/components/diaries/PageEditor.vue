<template>
  <div class="editor">
    <form @submit.prevent="submitData">
      <div class="updown">
        <label v-if="!oldPage" for="name"><strong>Inserisci il testo della pagina</strong></label>
        <label v-else for="name"><strong>Modifica il testo della pagina</strong></label>
      </div>
      <div>
        <div class="form-group" :class="{ invalid: !text.isValid }">
        <textarea
            rows="5"
            id="name"
            type="text"
            v-model.trim="text.val"
            class="form-control"
            @blur="clearValidity('text')"
        />
        <div class="invalid-message" v-if="!text.isValid">
          {{ text.errorText }}
        </div>
         <div class="form-group" v-if="!!error">{ error }}</div>
      </div>
      </div>

      <div class="updown">
        <base-button type="submit" mode="success">Salva</base-button>
        <base-button type="button" mode="danger" @click="closeEditor">Chiudi editor</base-button>
      </div>
  </form>
  </div>
</template>

<script>
import {reactive, ref} from "vue";
import {axiosService} from "../../common/api.service";

export default {
  props: {
    oldPage: {
      type: Object,
      default: null,
      required: false
    },
    diaryId: {
      type: Number,
      required: false,
      default: null
    }
  },
  emits: ['submitData', 'close'],
  setup(props, context) {

    let isNew = true;

    if(props.oldPage){
      isNew = false;
    }

     const text = reactive({
      val: isNew ? "" : props.oldPage.text,
      isValid: true,
      errorText: ""
    });
    const error = ref(null);

    function validateForm() {
      if (text.val === "") {
        text.isValid = false;
        text.errorText = "Inserisci il testo della pagina";
      }
      if (text.val.length > 5000) {
        text.isValid = false;
        text.errorText = "Massimo 5000 caratteri";
      }
    }

    const submitData = async () => {
      validateForm();
      if (!text.isValid) {
        return;
      }
      error.value = null;
      let url = `/api/diaries/${props.diaryId}/pages/create/`
      if(!isNew){
        url = `/api/pages/${props.oldPage.id}/`
      }
      try {
        await axiosService(url,  isNew? "POST": "PUT", {
          text: text.val
        });
        context.emit("submitData");
      } catch (error) {
        error.value = error.message;
      }
    };

    const closeEditor = () => {
      context.emit("close");
    }


    function clearValidity(input) {
      eval(input).isValid = true;
      eval(input).errorText = null;
    }

    return {
      text,
      error,
      submitData,
      closeEditor,
      clearValidity
    }
  }
};
</script>

<style lang="css" scoped>
.editor {
  background-color: var(--itembackgroundColorList);
  border-radius: 8px;
  border: 1px solid var(--itembackgroundColorList);
}
.updown {
  margin: 5px 10px;
  padding: 2px;
}
</style>