<template>
  <footer class="sticky-footer">
    <div class="container-fluid my-auto">
      <div class="copyright text-center my-auto">
        <div v-if="userIsAuth1" class="mb-1">
          <router-link :to="{ name: 'diaries-list' }">Diari</router-link>
        </div>
        <div class="mb-1" v-if="userIsStaff" onclick="location.href = '/amministrazione/pannello/';" @click.stop>
          <a href="/amministrazione/pannello/">Admin</a>
        </div>
        <div class="mb-1">
          <a target="_blank" rel="noopener noreferrer" href="/accounts/trattamento-dati/">Trattamento dati</a>
        </div>
        <span>Copyright &copy; Scuola Superiore Sant'Anna 2022</span>
      </div>
    </div>
  </footer>
</template>
<script>
import useAuth from "../../hooks/auth.js";
export default {
  setup(){
    const {userIsStaff, userIsAuth1} = useAuth();
    return {userIsStaff, userIsAuth1}
  }
}
</script>
<style scoped>
footer.sticky-footer {
  margin-top: 1rem;
  padding: 2rem 0;
  flex-shrink: 0;
  display: block;
}

.my-auto {
  margin-bottom: auto !important;
  margin-top: auto !important;
}

footer.sticky-footer .copyright {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  line-height: 1;
  font-size: .8rem;
  gap: 20px;
}
</style>