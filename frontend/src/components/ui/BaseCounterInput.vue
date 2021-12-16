<template>
  <div class="number">
    <span class="minus" @click.prevent="minusValue">-</span>
    <input :placeholder="placeholder" type="number" class="counter"
           :class="{'counter-lg': longCounter, 'counter-md': mdCounter}"
           v-model.number="number"/>
    <span class="plus" @click.prevent="plusValue">+</span>
  </div>
</template>

<script>
import {ref, watch} from "vue";
export default {
  props: {
    oldVal: {
      required: false,
      default: null
    },
    mdCounter: {
      type: Boolean,
      required: false,
      default: false
    },
    longCounter: {
      type: Boolean,
      required: false,
      default: false
    },
    placeholder: {
      type: String,
      required: false,
      default: ""
    }
  },
  emits: ["update-value", "negative"],
  setup(props, context) {
    const number = ref(props.oldVal ? parseFloat(props.oldVal) : null);
    watch(number, (value)=>{
      context.emit("update-value", value);
    })
    function minusValue(){
      number.value = number.value - 1;
    }
    function plusValue(){
      number.value = number.value + 1;
    }
    return {
      number,
      minusValue,
      plusValue
    }
  }
};
</script>

<style lang="css" scoped>
.number {
  display: flex;
  align-items: center;
  justify-content: left;
}
span {
  cursor: pointer;
}
.minus, .plus {
  width: 25px;
  height: 25px;
  background-color: var(--itembackgroundColorList);
  border-radius: 4px;
  padding: 4px;
  border: 1px solid var(--itembackgroundColorList);
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

.counter {
  height: 34px;
  width: 130px;
  text-align: center;
  font-size: 1.3rem;
  border-radius: 4px;
  display: inline-block;
  vertical-align: middle;
  margin: 3px;
}
.counter-md {
  width: 240px !important;
  font-size: 1rem !important;
}
.counter-lg {
  width: 400px !important;
  font-size: 1rem !important;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>