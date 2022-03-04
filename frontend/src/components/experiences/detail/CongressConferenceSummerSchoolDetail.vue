<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-lg-6">
          <h3>Titolo</h3>
          <span class="information exp-title">
            <a v-if="attrs.link" :href="attrs.link" target="_blank" class="information link">{{ attrs.title }}</a>
            <span class="information" v-else>{{ attrs.title }}</span>
          </span>
        </div>
        <div class="col-md-9 col-lg-4">
          <h3>Ente</h3>
          <a v-if="attrs.link_organization" :href="attrs.link_organization" target="_blank" class="information link">
            {{ attrs.organization }}</a>
          <span class="information" v-else>{{ attrs.organization }}</span>
        </div>
        <div class="col-md-3 col-lg-2">
          <h3>Costo</h3>
          <span class="information">{{ attrs.cost }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["attrs"]
};
</script>

<style scoped>
h3 {
}

.link {
  transition: all .2s ease-in-out;
}

.link:hover {
  text-decoration: none;
  transform: scale(1.2);
  font-weight: bold;
  color: #449C9F;
}

.information {
  font-size: 1.5rem;
}

.exp-title {
  color: #449C9F;
}
</style>
