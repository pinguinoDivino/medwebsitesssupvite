<template>
  <div class="card" :style="{ backgroundColor: cardBackgroundColor }">
    <div class="card-inner">
      <div class="card-header" :style="{ color: headerFontColor, fontSize: headerFontSize }">
        <slot name="header"> </slot>
      </div>
      <div class="card-body">
        <slot></slot>
      </div>
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cardBackgroundColor: {
      type: String,
      required: false
    },
    headerFontColor: {
      type: String,
      required: false,
      default: "#ffffff"
    },
    headerFontSize: {
      type: String,
      required: false,
      default: "2rem"
    }
  }
};
</script>
<style lang="css" scoped>
.card {
  max-width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  height: 100%;
  background-color: var(--itembackgroundColorList);
  color: var(--fontColor);
}
.card-inner {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.card-header {
  height: 150px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-header,
img {
  width: 100%;
  height: auto;
  position: relative;
  text-align: center;
  font-weight: 800;
}
.card-body {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  padding: 1rem;
  text-align: center;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 1.3rem;
  line-height: 1.125;
  font-weight: 600;
  letter-spacing: 0.004em;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  flex: 0 1;
  padding: 0.5rem;
}
@media screen and (min-width: 700px) {
  .card {
    max-width: 300px;
  }
}
</style>
