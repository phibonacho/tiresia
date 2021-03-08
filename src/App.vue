<template>
  <div id="app" class="bg-dark">
    <h1 class='main-title'>tiresia</h1>
    <RandomPicker/>
    <h1 class="main-title" style="font-size: 152px; text-shadow: #ec058e 5px 4px">t</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import './components/fontawesome/fontawesome'
import RandomPicker from './components/RandomPicker.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

@Component({
  components: {
    RandomPicker
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');

body {
  background: $dark;
}

* {
  font-family: 'Roboto', sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto auto;

  .main-title {
    font-family: 'Montserrat', sans-serif;
    color: $primary;
    text-shadow: $secondary 3px 2px;
    text-transform: uppercase;
    font-size: 3rem;
    position: relative;
  }

  @include media-breakpoint-down(lg) {
    width: 100%;
  }

  width: map-get($grid-breakpoints, lg);
}
</style>
