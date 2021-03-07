<template>
  <div class="random-picker">
    <form action='#'>
      <div class='card mb-3'>
        <div class='info'>
          <font-awesome-icon icon='info-circle'/>
          Definisci l'intervallo da cui vuoi estrarre i valori, una volta terminati i valori potrai azzerare le
          estrazioni cliccando sul tasto di reset o modificando i limit dell'intervallo.
        </div>
        <div class='custom-field'>
          <label for='lower-bound' class='text-uppercase'>Minimo</label>
          <input type='number' v-model="min" @change="flushPicked" id='lower-bound'>
        </div>
        <div class='custom-field'>
          <label for='upper-bound' class='text-uppercase'>Massimo</label>
          <input type='number' v-model="max" @change="flushPicked" id='upper-bound'>
        </div>
      </div>
      <button class='btn btn-primary text-dark text-uppercase p-2 w-100 font-weight-bold'
              @click="testSubmit"
      >Estrai
      </button>
    </form>
    <div class="ext-container">
      <div class="slot" v-for="(item, i) in picked" :key="i">
        <div class="number-card">
          {{ item }}
        </div>
      </div>
      <div class="command-bar" :style="picked.length > 0 ? 'display: block' : 'display: none'">
        <button class='btn btn-secondary text-dark text-uppercase px-4 py-2 float-right font-weight-bold'
                @click="flushPicked"
        >Reset
        </button>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RandomPicker',
  data () {
    return {
      picked: [],
      min: null,
      max: null
    }
  },
  methods: {
    flushPicked () {
      this.picked = []
    },
    testSubmit (event) {
      event.preventDefault()

      if (!this.max || !this.min) {
        return
      }

      const actualMax = parseInt(this.max) + 1
      if (this.picked.length === (actualMax - this.min)) {
        return
      }
      let random
      do {
        random = Math.floor((Math.random() * (actualMax - this.min))) + parseInt(this.min)
      } while (this.picked.includes(random))
      this.picked.push(random)
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../styles/variables';
@import '~bootstrap/scss/card';
@import '~bootstrap/scss/buttons';
@import '~bootstrap/scss/grid';

.random-picker {
  .card {
    background: transparent;

    .info {
      text-align: left;
      padding: 1rem 1.5rem;
      color: $primary;
    }

    .custom-field {
      display: flex;
      padding: 1rem 2rem;
      background: lighten($dark, 2);

      label {
        flex: 2 1 35%;
        max-width: 35%;
        color: lighten($dark, 50);
        font-size: 1.2rem;
        vertical-align: baseline;
        text-align: left;
        padding-top: .1rem;
      }

      input {
        flex: 3 1 65%;
        max-width: 65%;
        text-align: right;
        background: transparent;
        border: none;
        outline: none;
        color: $white;
        font-size: 1.5rem;
        font-weight: bold;
      }

      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:not(:last-child) {
        border-bottom: solid 1px transparentize($dark, .1);
      }
    }
  }

  .ext-container {
    border: dashed 2px lighten($dark, 50);
    padding: 1rem;
    margin: 2rem auto auto;
    border-radius: $border-radius;
    display: flex;
    flex-wrap: wrap;

    .slot {
      @include media-breakpoint-up(md) {
        flex: 0 0 25%;
        max-width: 25%;
      }

      flex: 0 0 50%;
      max-width: 50%;

      flex-direction: column;
      box-sizing: border-box;
      transition: all .2s ease;
      text-align: center;

      .number-card {
        color: $primary;
        margin: .5rem;
        border-radius: $border-radius;
        text-align: center;
        border: solid 1px lighten($dark, 10);
        border-left: solid 3px $primary;
        box-shadow: 1px 2px 1px rgba(0,0,0,0.1);
        transition: all .2s ease;
        padding: 1rem;
        font-weight: bold;
        font-size: 1.2rem;

        &:hover {
          box-shadow: 2px 8px 6px rgba(0,0,0,0.3);
          transform: translateY(-5px);
        }
      }
    }
    .command-bar {
      width: 100%;
      &:not(:first-child) {
        margin-top: 1rem;
      }
    }
  }
}
</style>
