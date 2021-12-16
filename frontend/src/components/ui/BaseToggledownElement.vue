<template>
  <div class="dropdown-element">
    <div @click="toggleShow" class="dropdown-header col-12">
      <slot name="header"></slot>
      <i v-if="display" class="arrow up"></i>
      <i v-else class="arrow down"></i>
    </div>
    <div v-show="display" class="dropdown-content col-12">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const display = ref(false);

    function toggleShow() {
      display.value = !display.value;
    }

    return {
      display, toggleShow
    };
  }
}
</script>
<style lang="css" scoped>
.dropdown-element {
  transition: 0.5ms ease-in-out;
  font-size: inherit;
  border-bottom: 1px solid #c1b9b9;
}
.dropdown-header {
  padding: 0;
  margin: 0;
  cursor: pointer;
}
.dropdown-header:hover {
  color: var(--danger);
}
.arrow {
  border: solid var(--fontColor);
  border-width: 0 3px 3px 0;
  padding: 3px;
  margin-right: 10px;
  right: 0;
  vertical-align: center;
  top: 40%;
  position: absolute;
  transform: translateY(-50%);
}
.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.dropdown-content {
  overflow: visible;
  padding-bottom: 1rem;
}
</style>