<template>
  <div>
    <div class="tooltip">
      <slot> </slot>
      <span
        class="tooltiptext"
        :class="{
          'tooltiptext-down': down,
          'tooltiptext-right': right,
          'tooltip-h3': height === 'h3',
          'tooltiptext-long': width === 'long'
        }"
      >
        <slot name="tooltip"> </slot>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    down: {
      type: Boolean,
      required: false,
      default: false
    },
    right: {
      type: Boolean,
      required: false,
      default: false
    },
    height: {
      type: String,
      required: false,
      default: "normal"
    },
    width: {
      type: String,
      required: false,
      default: "normal"
    }
  }
};
</script>
<style lang="css" scoped>
.tooltip {
  position: relative;
  display: inline-block;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 300px;
  background-color: var(--itembackgroundColorList);
  border: 1px solid var(--itembackgroundColorList);
  color: var(--fontColor);
  text-align: center;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -150px;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--itembackgroundColorList) transparent transparent transparent;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.tooltip:hover {
  transform: scale(1.01);
}
.tooltiptext-down {
  top: 100% !important;
  bottom: 0 !important;
  min-height: 40px;
}
.tooltiptext-down::after {
  display: none;
}
.tooltiptext-right {
  min-height: 45px;
}
.tooltiptext-right::after {
  display: none;
}
.tooltiptext-long {
  width: 400px;
}
@media screen and (min-width: 992px) {
  .tooltip .tooltiptext {
    visibility: hidden;
    background-color: var(--itembackgroundColorList);
    color: var(--fontColor);
    width: 400px;
    max-width: 600px;
    padding: 10px 4px;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    margin-left: 0;
    left: 0;
    opacity: 0;
    font-size: 0.8rem;
    transition: opacity 1s;
    display: block;
    font-weight: 400;
    line-height: 1.42857143;
    line-break: auto;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    letter-spacing: normal;
  }
  .tooltip .tooltiptext::after {
    display: none;
  }
  .tooltiptext-down {
    top: 100%;
    bottom: 0;
    min-height: 20px;
  }
  .tooltiptext-right {
    top: -5px;
    left: 105% !important;
    min-height: 38px;
  }
  .tooltip-h3 {
    min-height: 52px !important;
  }
  .tooltiptext-long {
    width: 500px !important;
  }
}
</style>
