<template>
  <div class="row text-center">
    <div class="col-md-6">
      <h3>Istituto</h3>
      <span class="information">{{ attrs.istitution }}</span>
    </div>
    <div class="col-md-6">
      <h3>Reparto</h3>
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
  font-size: 2rem;
  line-height: 1.19048;
  font-weight: 600;
  letter-spacing: .011em;
  margin: 1rem;
}
.information {
  font-weight: bold;
  font-size: 1.3rem;
  color: var(--orange);
}
.ward {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary);
}
</style>
