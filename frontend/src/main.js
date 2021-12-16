import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from "./router/index.js";
import store from "./store/index.js";
import "vue-multiselect/dist/vue-multiselect.css";
import "vue-next-select/dist/index.css";
import "chartkick/chart.js";
const BaseDialog = defineAsyncComponent(() =>
  import("./components/ui/BaseDialog.vue")
);
const BaseSpinner = defineAsyncComponent(() =>
  import("./components/ui/BaseSpinner.vue")
);
const BaseToggledownElement = defineAsyncComponent(() =>
  import(
    "./components/ui/BaseToggledownElement.vue"
  )
);
const BaseCard = defineAsyncComponent(() =>
  import("./components/ui/BaseCard.vue")
);
const BaseButton = defineAsyncComponent(() =>
  import("./components/ui/BaseButton.vue")
);
const BaseBadge = defineAsyncComponent(() =>
  import("./components/ui/BaseBadge.vue")
);
const BaseSearchableDropdownList = defineAsyncComponent(() =>
  import(
    "./components/ui/BaseSearchableDropdownList.vue"
  )
);
const BaseFlipCard = defineAsyncComponent(() =>
  import(
    "./components/ui/BaseFlipCard.vue"
  )
);
const BaseCounterInput = defineAsyncComponent(() =>
  import("./components/ui/BaseCounterInput.vue")
);
const VueNextSelect = defineAsyncComponent(() =>
  import("vue-next-select")
);
const VueMultiselect = defineAsyncComponent(() =>
  import("vue-multiselect")
);
import Chartkick from 'vue-chartkick'
import { Chart } from 'chart.js'
import StarRating from "vue-star-rating";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Chartkick.use(Chart));
app.component("base-dialog", BaseDialog);
app.component("base-spinner", BaseSpinner);
app.component("base-toggledown-element", BaseToggledownElement);
app.component("base-card", BaseCard);
app.component("base-button", BaseButton);
app.component("base-badge", BaseBadge);
app.component("base-searchable-dropdown-list", BaseSearchableDropdownList);
app.component("base-flip-card", BaseFlipCard);
app.component("base-counter-input", BaseCounterInput);
app.component("vue-select", VueNextSelect);
app.component("vue-multiselect", VueMultiselect);
app.component("star-rating", StarRating);

app.mount("#app");
