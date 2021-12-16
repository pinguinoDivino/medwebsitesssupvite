<template>
  <div>
    <div class="form-group" >
      <input
          type="file"
          ref="imgs"
          accept="image/*"
          @change="handleFilesUpload()"
      />
      <span class="btn-file" @click.prevent="addFiles()" ref="btnFile">
        Aggiungi immagine
      </span>
    </div>
    <div >
      <div v-for="(img, key) in imgs" :key="key">
        {{ img.name }}
        <span class="remove-file" @click.prevent="removeFile(key)"
        >Rimuovi</span
        >
      </div>
    </div>
    <div  v-if="old_imgs.length > 0">
      <label>Immagini già caricate</label>
      <base-dialog
          :show="!!error"
          title="Immagine non valida"
          @close="handleError('error')"> {{ error }}

      </base-dialog>
      <div v-if="isLoading">
        <base-spinner></base-spinner>
      </div>
      <div v-else>
        <div v-for="(img, key) in old_imgs" :key="key">
          <a :href="img" target="_blank">{{getGoodImgLinkName(img)}}</a>
          <span class="remove-file" @click.prevent="removeOldFile(key)"
          >Rimuovi</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    oldImages: {
      type: Array,
      required: false,
      default: null
    }
  },
  emits: ["upload-images", ],
  data() {
    return {
      imgs: [],
      old_imgs: this.oldImages !== null ? this.oldImages : [],
      error: null,
      isLoading: false
    };
  },
  watch: {
    imgs: {
      handler(val) {
        if (val.length >= 1) {
          this.$refs.btnFile.style.display = "none";
        } else {
          this.$refs.btnFile.style.display = "inline-block";
        }
      },
      deep: true
    },
    old_imgs: {
      handler(val) {
        if (val.length >= 1) {
          this.$refs.btnFile.style.display = "none";
        } else {
          this.$refs.btnFile.style.display = "inline-block";
        }
      },
      deep: true
    }
  },
  methods: {
    addFiles() {
      this.$refs.imgs.click();
    },
    handleFilesUpload() {
      let uploadedImgs = this.$refs.imgs.files;
      for (let i = 0; i < uploadedImgs.length; i++) {
        if (uploadedImgs[i]['size'] < 5e6) {
          this.imgs.push(uploadedImgs[i]);
        } else {
          this.error = "Stai cercando di caricare un file troppo grande, la dimensione massima è di 5MB";
        }
      }
      this.$emit("upload-images", this.imgs);
    },
    removeFile(key) {
      this.imgs.splice(key, 1);
      this.$emit("upload-images", this.imgs);
    },
    handleError(input) {
      this[input] = null;
    },
    removeOldFileFromList(key) {
      this.old_imgs.splice(key, 1);
    },
    removeOldFile(key) {
      this.removeOldFileFromList(key)
    },
    getGoodImgLinkName(link){
      console.log(this.old_imgs)
      return link.split("/").pop();
    }
  }
};
</script>