<template>
  <div class="badge">
    <div class="badge-inner">
      {{ name }}
    </div>
    <div class="badge-count" v-if="count || count === 0">
      <span class="badge-count-inner">{{ count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: false,
      defaul: null
    }
  }
};
</script>

<style lang="css" scoped>
.badge {
  font-family: "Zilla Slab", serif;
  position: relative;
  display: inline-flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  color: var(--white);
  border-radius: 0.4rem;
  padding: 0.1rem 0 0.1rem 0.6rem;
  font-size: 1rem;
}
.badge-primary {
  background-color: var(--primary);
  border: 1px solid var(--primary);
}
.badge-danger {
  background-color: var(--danger);
  border: 1px solid var(--danger);
}
.badge-secondary {
  background-color: var(--secondary);
  border: 1px solid var(--secondary);
}
.badge-success {
  background-color: var(--success);
  border: 1px solid var(--success);
}
.badge-info {
  background-color: var(--info);
  border: 1px solid var(--info);
}
.badge-orange {
  background-color: var(--orange);
  border: 1px solid var(--orange);
}
[data-theme="light"] .badge-blue {
  background-color: #0065a7;
  border: 1px solid #0065a7;
}
[data-theme="dark"] .badge-blue {
  background-color: #153859;
  border: 1px solid #153859;
}
[data-theme="light"] .badge-purple {
  background-color: #db3efd;
  border: 1px solid #db3efd;
}
[data-theme="dark"] .badge-purple {
  background-color: #451d4f;
  border: 1px solid #451d4f;
}
.badge-inner {
  margin-right: 0.3rem;
}
.badge-count {
  position: relative;
  background-color: #f8f9fa;
  color: #2f3337;
  width: 1.3rem;
  height: 1.3rem;
  text-align: center;
  font-size: 0.8rem;
  margin-left: 0.1rem;
  margin-right: 0.3rem;
  border: 1px solid #f8f9fa;
  border-radius: 0.4rem;
}
.badge-count-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-weight: bold;
}
</style>
