<template>
  <transition name="flip">
    <div class="card" @click="flipCard">
      <div class="inner-card">
        <div class="front-card" v-show="!flipped">
          <slot name="front">

          </slot>
        </div>
        <div class="back-card" v-show="flipped">
          <slot name="back">

          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    isSelected: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  setup(props) {
    const flipped = ref(props.isSelected);
    function flipCard() {
      flipped.value = !flipped.value;
    }
    return { flipped, flipCard };
  }
};
</script>

<style lang="css" scoped>
.card {
  display: block;
  margin-top: 0.5rem;
}
.inner-card {
  max-width: 200px;
  position: relative;
  cursor: pointer;
}
.front-card,
.back-card {
  position: relative;
}
.flip-enter-active {
  transition: all 0.4s ease;
}

.flip-leave-active {
  display: none;
}

.flip-enter,
.flip-leave {
  transform: rotateY(180deg);
  opacity: 0;
}
@media screen and (min-width: 992px) {
  .inner-card {
    max-width: 140px;
}
}
</style>
