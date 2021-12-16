<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: Object,
      required: false,
      default: null
    }
  }
};
</script>

<style scoped>
button,
a {
  text-decoration: none;
  font: inherit;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  border-radius: 30px;
  display: inline-block;
}

a:hover,
a:active,
button:hover,
button:active {
  transform: scale(1.04);
}

.flat {
  background-color: transparent;
  color: #3a0061;
  border: none;
}

.outline {
  background-color: transparent;
  border: 1px solid var(--primary);
  outline: 0;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  border: 1px solid #0c8ca7;
  transform: scale(1.001);
  outline: 0;
  text-decoration:none;
}
.success {
  background-color: var(--success);
  border: 1px solid var(--success);
  color: white;
}
.danger {
  background-color: var(--danger);
  border: 1px solid var(--danger);
  color: white;
}
.primary {
  background-color: var(--primary);
  border: 1px solid var(--primary);
  color: white;
}
.info, .default {
  background-color: var(--info);
  border: 1px solid var(--info);
  color: white;
}
.classic {
  background-color: #333333;
  border: 1px solid #333333;
  color: white;
}
.light {
  background-color: var(--itembackgroundColorList);
  border: 1px solid var(--itembackgroundColorList);
  color: var(--fontColor);
}
</style>