<template>
  <div class="random-picker">
    <form action='#' id="main-form" :class="'picker-form ' + (scrollPast ? 'sticky' : '')">
      <div class="input-container">
        <div class='card'>
          <div class='info'>
            <font-awesome-icon icon='info-circle'/> Prova <span class="font-weight-bold">TIRESIA</span>, imposta <span class="font-weight-bold">massimo</span> e <span class="font-weight-bold">minimo</span> ed inizia ad estrarre numeri casuali!
          </div>
          <div class='custom-field'>
            <input type='number' :class="(min ? ' filled' : '') + (this.errorMin ? ' text-secondary' : '')" v-model="min" @keyup="validateInput" id='lower-bound'>
            <label for='lower-bound' class='text-uppercase'>Minimo</label>
          </div>
          <div class='custom-field'>
            <input type='number' :class="(max ? ' filled' : '') + (this.errorMax ? ' text-secondary' : '')" v-model="max" @keyup="validateInput" id='upper-bound'>
            <label for='upper-bound' class='text-uppercase'>Massimo</label>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button @click="pickRandom" :disabled="!this.min || !this.max || this.errorMin || this.errorMax || this.limitReached">Estrai</button>
      </div>
    </form>
    <div class="ext-container" :class="this.picked.length === 0 ? 'empty' : ''" id="target-container">
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
      scrollPast: false,
      errorMax: false,
      errorMin: false,
      limitReached: false
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
      if (elem.getBoundingClientRect().top < 0) {
        this.scrollPast = true
      }

      if (elem.getBoundingClientRect().top >= 0) {
        this.scrollPast = false
      }
    },
    flushPicked () {
      this.picked = []
      this.limitReached = false
    },
    validateInput () {
      this.errorMax = !(this.max && parseInt(this.max) > (parseInt(this.min) || -Infinity))
      this.errorMin = !(this.min && parseInt(this.min) < (parseInt(this.max) || Infinity))
      this.flushPicked()
    },
    pickRandom (event) {
      event.preventDefault()

      if (!this.max || !this.min) {
        return
      }

      const actualMax = parseInt(this.max) + 1
      let random
      do {
        random = Math.floor((Math.random() * (actualMax - this.min))) + parseInt(this.min)
      } while (this.picked.includes(random))
      this.picked.push(random)

      if (this.picked.length === (actualMax - this.min)) {
        this.limitReached = true
      }
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
    &.empty {
      border: solid 2px transparent;
    }

    transition: all .3s ease;
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
    z-index: 1050;
    transition: all .2s ease;
    animation: 1s slide-in;

    @include media-breakpoint-up(md) {
      left: 50%;
      transform: translateX(-50%);
    }
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
        position: relative;
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

        label {
          flex: 2 1 35%;
          max-width: 35%;
          color: lighten($dark, 50);
          font-size: 1.2rem;
          padding-top: .1rem;
          text-align: left;

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

      &:disabled {
        color: lighten($dark, 30);
        background: lighten($primary, 10);
      }

      @at-root.sticky#{&} {
        height: 100%;
        border-radius: 0 $border-radius $border-radius 0;
        border: 1px solid #1b214b;
      }
    }
  }
}

@keyframes slide-in {
  from {
    top: -100%;
  }

  to {
    top:0;
  }
}

</style>
