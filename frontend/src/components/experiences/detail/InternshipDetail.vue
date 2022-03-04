<template>
  <div class="row">
    <div class="col-md-6">
      <h3>Istituto: </h3>
      <span class="information">{{ attrs.istitution }}</span>
    </div>
    <div class="col-md-6">
      <h3>Reparto: </h3>
      <span class="ward">{{ attrs.ward }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['attrs'],
};
</script>

<style scoped>
h3 {
  display: inline-block;
  margin-right: 1rem;
}
.information {
  font-weight: bold;
  font-size: 1.3rem;
  color: var(--orange);
}
.ward {
  font-size: 1.3rem;
  font-weight: bold;
  font-style: italic;
}
</style>
