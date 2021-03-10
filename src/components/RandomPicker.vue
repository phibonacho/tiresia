<template>
  <div class="random-picker">
    <form action='#' id="main-form" :class="'picker-form ' + (scrollPast ? 'sticky' : '')">
      <div class="input-container">
        <div class='card'>
          <div class='info'>
            <font-awesome-icon icon='info-circle'/>
            Definisci l'intervallo da cui vuoi estrarre i valori, una volta terminati i valori potrai azzerare le
            estrazioni cliccando sul tasto di reset o modificando i limit dell'intervallo.
          </div>
          <div class='custom-field'>
            <input type='number' :class="min ? 'filled' : ''" v-model="min" @change="flushPicked" id='lower-bound'>
            <label for='lower-bound' class='text-uppercase'>Minimo</label>
          </div>
          <div class='custom-field'>
            <input type='number' :class="(max ? ' filled' : '') + (picked.length === parseInt(max) ? ' text-secondary' : '')" v-model="max" @change="flushPicked" id='upper-bound'>
            <label for='upper-bound' class='text-uppercase'>Massimo</label>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button @click="pickRandom">Estrai</button>
      </div>
    </form>
    <div class="ext-container" id="target-container">
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
      max: null,
      scrollPast: false
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      const elem = document.querySelector('#target-container')
      if (elem.getBoundingClientRect().top < -100) {
        this.scrollPast = true
      }

      if (elem.getBoundingClientRect().top >= -100) {
        this.scrollPast = false
      }
    },
    flushPicked () {
      this.picked = []
    },
    pickRandom (event) {
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

.random-picker {

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

.picker-form {
  background: $dark;
  &.sticky {
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    top: 0;
    left: 0;
  }
  .input-container {
    @at-root.sticky#{&} {
      flex: 0 0 66.66667%;
      max-width: 66.66667%;
    }

    .card {
      background: transparent;
      margin-bottom: 1rem;

      @at-root.sticky#{&} {
        flex-direction: row;
        margin-bottom: 0;
      }

      .info {
        text-align: left;
        padding: 1rem 1.5rem;
        color: $primary;

        @at-root.sticky#{&} {
          display: none;
        }
      }

      .custom-field {
        display: flex;
        flex-direction: row-reverse;
        padding: 1rem 2rem;
        background: lighten($dark, 2);

        @at-root.sticky#{&} {
          flex: 1 1 50%;
          max-width: 50%;
          display: inline;
          padding: 1.5rem .5rem .5rem 1rem;
          position: relative;
        }

        label {
          flex: 2 1 35%;
          max-width: 35%;
          color: lighten($dark, 50);
          font-size: 1.2rem;
          text-align: left;
          padding-top: .1rem;
          transition: all .1s linear;
          @at-root.sticky#{&} {
            position: absolute;
            flex: unset;
            max-width: unset;
            left: 1rem;
            top: 1.5rem;
            font-size: 1rem;
          }
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
          @at-root.sticky#{&} {
            text-align: left;
            flex: auto;
            width: 100%;
            max-width: 100%;
            font-size: 1.2rem;
            float: left;

            &:focus + label, &.filled + label {
              transform: scale(.75) translateX(-.6rem) translateY(-1.5rem);
            }
          }
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        &:not(:last-child) {
          border-bottom: solid 1px rgba(0, 0, 0, 0.125);
          @at-root.sticky#{&} {
            border-right: solid 1px rgba(0, 0, 0, 0.125);
            border-bottom: none;
          }
        }
      }
    }
  }

  .button-container {
    @at-root.sticky#{&} {
      flex: 0 0 33.33333%;
      max-width: 33.33333%;
    }

    button {
      text-transform: uppercase;
      background: $primary;
      color: $dark;
      padding: .5rem;
      width: 100%;
      font-weight: bold;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      border: 1px solid transparent;
      transition: all .2s ease-in-out;
      outline: none;
      border-radius: $border-radius;

      @at-root.sticky#{&} {
        height: 100%;
        border-radius: 0 $border-radius $border-radius 0;
        border: 1px solid #1b214b;
      }
    }
  }
}

</style>
