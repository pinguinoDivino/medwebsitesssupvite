<template>
  <nav id="siteMenu">
    <div class="navbar">
      <div class="navbar-logo">
        <router-link :to="{ name: 'home' }">MEDSSSUP</router-link>
      </div>
      <div class="navbar-item" @click.prevent="openNavBar">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
    <ul class="menu" id="menu" @click.prevent="closeNavBar">
      <li>
        <router-link :to="{ name: 'experiences-list' }">Esperienze</router-link>
      </li>
      <li  v-if="userIsAuth1">
        <router-link :to="{ name: 'internships-list' }">Tirocini</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'opportunities-list' }">Opportunità</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'activity-editor' }">Aggiungi</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'personal-page' }"
          >Area Personale</router-link
        >
      </li>
      <li onclick="location.href = '/accounts/logout/';" @click.stop>
        <a href="/accounts/logout/">Logout</a>
      </li>
      <li  class="theme-switch-wrapper" @click.stop>
        <label class="theme-switch" for="themeInput">
          <input type="checkbox" id="themeInput" @change="switchTheme" />
          <div class="slider round"></div>
        </label>
        <em>Dark mode</em>
      </li>
    </ul>
  </nav>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import useAuth from "../../hooks/auth";
export default {
  setup() {
    const store = useStore();
    function closeNavBar() {
      const x = document.getElementById("menu");
      x.classList.remove("open");
    }
    function openNavBar() {
      const x = document.getElementById("menu");
      x.classList.add("open");
    }
    const { userIsAuth1 } = useAuth();

    function switchTheme(e) {
      if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        store.dispatch("changeUserTheme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        store.dispatch("changeUserTheme", "light");
      }
    }

    const currentTheme = computed(function() {
      return store.getters.theme ? store.getters.theme : null;
    });

    if (currentTheme.value) {
      document.documentElement.setAttribute("data-theme", currentTheme.value);
    }

    window.onload = function() {
      if (currentTheme.value === "dark") {
        document.getElementById("themeInput").checked = true;
      }
    };
    return {
      closeNavBar,
      openNavBar,
      switchTheme,
      currentTheme,
      userIsAuth1,
    };
  }
};
</script>
<style lang="css" scoped>
nav {
  background-color: #333333;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0.5rem 0;
  font-family: "Zilla Slab", serif;
}

.navbar {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.menu {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  list-style: none;
  width: 70%;
  height: 100%;
  margin-left: auto;
  background-color: inherit;
  font-size: 1.3rem;
}

.navbar-logo {
  font-size: 2.5rem;
  margin-left: 1rem;
}
2
a {
  text-decoration: none;
  color: var(--white);
  line-height: 1.23536;
  font-weight: 400;
  letter-spacing: -0.022em;
}

a:active,
a.router-link-active {
  font-weight: bold;
  color: #f56300 !important;
  text-decoration: none;
}

ul {
  margin: 0;
  padding: 0;
}
a:hover {
  color: var(--orange);
  font-weight: 800;
  text-decoration: none;
}
@media screen and (max-width: 1020px) {
  nav {
    position: relative;
    z-index: 100;
    display: block;
    min-height: 12vh;
    padding-top: 0rem;
    padding-bottom: 0rem;
    margin: 0;
  }

  .navbar-logo {
    position: absolute;
    top: 50%;
    margin-left: 1rem;
    font-size: 4rem;
    transform: translate(0, -50%);
  }

  .navbar-item {
    position: absolute;
    right: 5%;
    top: 50%;
    cursor: pointer;
    transform: translate(-5%, -50%);
  }
  .navbar div:last-child {
    margin-left: auto;
  }

  .menu {
    position: fixed;
    height: 100vh;
    width: 100%;
    flex-direction: column;
    clip-path: circle(10px at 90% -10%);
    -webkit-clip-path: circle(10px at 90% -10%);
    transition: all 600ms ease-out;
    pointer-events: all;
    text-align: center;
    background-color: var(--backgroundColor);
  }

  .line {
    width: 30px;
    height: 2px;
    background-color: white;
    margin: 0.4rem;
  }
  [data-theme="light"] em {
    color: black;
  }

  .open {
    clip-path: circle(3000px at 90% -10%);
    -webkit-clip-path: circle(3000px at 90% -10%);
  }

  .menu a {
    color: var(--fontColor);
    font-size: 2.3rem;
  }

  a:hover {
    color: var(--orange);
    font-weight: 800;
    text-decoration: none;
  }

}
@media screen and (max-width: 500px) {
  .navbar-logo {
    position: absolute;
    top: 50%;
    margin-left: 1rem;
    font-size: 2.5rem;
    transform: translate(0, -50%);
  }
}
</style>
