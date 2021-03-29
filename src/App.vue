<template>
  <div id="app" class="bg-dark">
    <div class="header-wrapper">
    </div>
    <main class="body-wrapper" role="main">
      <RandomPicker/>
    </main>
    <div class="footer-wrapper">
      <Footer/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import './components/fontawesome/fontawesome'
import RandomPicker from './components/RandomPicker.vue'
import Footer from './components/Footer.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

@Component({
  components: {
    RandomPicker,
    Footer
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "styles/variables";
@import "~bootstrap/scss/grid";
@import "~bootstrap/scss/print";
@import "~bootstrap/scss/utilities";
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

body {
  @include media-breakpoint-up(xl) {
    background: darken($dark, 2);
  }
  background: $dark;
}

* {
  font-family: 'Roboto', sans-serif;
}

#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: auto;
  background: $dark;
  @include media-breakpoint-up(xl) {
    padding: 1rem 2rem;
  }

  @include media-breakpoint-down(lg) {
    width: 100%;
  }

  width: map-get($grid-breakpoints, sm);

  .body-wrapper {;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
}
</style>
