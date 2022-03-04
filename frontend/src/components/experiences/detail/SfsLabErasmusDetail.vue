<template>
  <div class="row">
    <div class="col-12">
      <h3>Istituto:</h3>
      <span class="information">{{ attrs.istitution }}</span>
    </div>
    <div class="col-12">
      <h3>Si può scrivere la tesi?</h3>
      <div v-if="attrs.thesis === true" class="check"></div>
      <div v-else-if="attrs.thesis === false">No</div>
      <div v-else class="not-found"><p>Non disponibile</p></div>
    </div>
  </div>
</template>disponibile

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
.check {
  display: inline-block;
  transform: rotate(45deg);
  height: 12px;
  width: 24px;
  border-bottom: 7px solid #4EAC47;
  border-right: 7px solid #4EAC47;
  padding: 1rem;
}
</style>
