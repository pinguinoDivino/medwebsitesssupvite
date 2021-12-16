<template>
  <div class="ward mb-1">
    <div class="ward-inner">
      <div class="ward-header" @click="toggleContent">
        <h3>{{ ward }}</h3>
      </div>
        <div v-if="isShow" class="animation">
          <div class="ward-body">
            <transition-group name="list">
              <div v-for="internship of internships" class="review-container" :key="internship.id">
              <div class="review-header">
                <p>di <span class="bold">{{ internship.author }}</span>, svolta al {{ func2(internship.academic_year) }}
                  anno</p>
                <p>presso <span class="bold">{{ func1(internship.place) }}</span>, consigliato da svolgere al
                  <span class="bold">{{ func2(internship.recommended_year) }} anno </span>
                </p>
              </div>
              <div class="review-content">
                <p>{{ internship.review }}</p>
                <star-rating
                    :read-only="true"
                    :rating="internship.rating"
                    :max-rating="10"
                    :show-rating="false"
                    :star-size="20"
                    :border-width="0"
                    :inline="true"
                    active-color="#f56300"
                ></star-rating>
              </div>
              <hr/>
            </div>
            </transition-group>
          </div>
          <div class="ward-footer pb-1">
            <base-button mode="default" @click="hideContent">Chiudi</base-button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  props: ['ward', 'internships', 'func1', 'func2'],
  setup() {
    const isShow = ref(false);

    function toggleContent() {
      isShow.value = !isShow.value;
    }

    function hideContent() {
      isShow.value = false;
    }

    return {
      isShow,
      toggleContent,
      hideContent
    }
  }
};
</script>

<style scoped>
.ward-header {
  cursor: pointer;
  display: inline-block;
}

@keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 0.95; }
}
.animation {
  animation: fadein 0.8s;
}

.review-header {
  display: flex;
  flex-direction: column;
}

.bold {
  color: var(--orange);
  font-weight: bold;
}

[data-theme="dark"] .bold {
  color: white;
}

@media screen and (min-width: 768px) {
  .review-header {
    display: flex;
    flex-direction: row;
  }

  .review-header p:last-child {
    margin-left: auto;
  }
}
.list-enter-active,
.list-leave-active,
.list-move {
  transition: 500ms cubic-bezier(0.64, 0.26, 0.08, 1.03);
  transition-property: opacity, transform;
}
.list-enter {
  opacity: 0;
  transform: translateY(50px) scaleY(0.5);
}
.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}
.list-leave-active {
  position: absolute;
  opacity: 0;
  transform: scaleY(0);
}
h3:hover {
  transform: scale(1.02);
}
.ward-footer {
  font-size: 0.8rem;
}
</style>