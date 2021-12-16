<template>
  <div class="dropdown">
    <input
      v-if="Object.keys(selectedItem).length === 0"
      ref="dropdowninput"
      v-model.trim="inputValue"
      class="dropdown-input"
      type="text"
      :placeholder="placeholder"
    />
    <div v-else @click="resetSelection" class="dropdown-selected">
      {{ selectedItem.first_name }} {{ selectedItem.last_name }} ({{ selectedItem.ward }}) &#10060;
    </div>
    <div v-show="inputValue" class="dropdown-list">
      <div
        @click="selectItem(item)"
        v-show="itemVisible(item)"
        v-for="item of itemList"
        :key="item.id"
        class="dropdown-item"
      >
        {{ item.first_name }} {{ item.last_name }} ({{ item.ward }})
      </div>
      <div v-if="!areProfsVisible" class="dropdown-item">
        Nessun risultato trovato
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemList: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    firstSelectedItem: {
      type: Object,
      required: false,
      default: null
    },
    property: {
      type: String,
      required: true,
      default: null
    }
  },
  data() {
    return {
      selectedItem: {},
      inputValue: ""
    };
  },
  computed: {
    areProfsVisible() {
      for (const item of this.itemList) {
        if (this.inputValue !== "") {
          let currentItemProperty = item[this.property].toLowerCase();
          if (currentItemProperty.includes(this.inputValue.toLowerCase())) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    resetSelection() {
      this.selectedItem = {};
      this.$nextTick(() => this.$refs.dropdowninput.focus());
      this.$emit("on-item-reset");
    },
    selectItem(theItem) {
      this.selectedItem = theItem;
      this.inputValue = "";
      this.$emit("on-item-selected", theItem);
    },
    itemVisible(item) {
      let currentItemProperty = item[this.property].toLowerCase();
      let currentInput = this.inputValue.toLowerCase();
      return currentItemProperty.includes(currentInput);
    },
    handleScroll() {
      this.inputValue = "";
    }
  },
  created() {
    if (this.firstSelectedItem !== null) {
      this.selectedItem = this.firstSelectedItem;
    }
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style lang="css" scoped>
.dropdown {
  position: relative;
  width: 100%;
  max-width: 400px;
  color: inherit;
  background-color: inherit;
}

.dropdown-input,
.dropdown-selected {
  width: 100%;
  line-height: 1.5em;
}

.dropdown-input:focus,
.dropdown-selected:hover {
  color: inherit;
  background-color: inherit;
}

.dropdown-input::placeholder {
  opacity: 0.7;
}

.dropdown-selected {
  font-weight: bold;
  cursor: pointer;
}

.dropdown-list {
  width: 400px;
  padding-bottom: 1rem;
  margin-top: 4px;
  position: fixed;
  overflow-y: auto;
  z-index: 1000;
  color: inherit;
  background-color: var(--itembackgroundColorList);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.dropdown-item {
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}

.dropdown-item:hover {
  color: var(--orange);
  font-weight: bold;
  background-color: inherit;
}

.dropdown-item-flag {
  max-width: 24px;
  max-height: 18px;
  margin: auto 12px auto 0px;
}
</style>
