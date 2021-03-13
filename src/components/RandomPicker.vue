<template>
  <div class="random-picker">
    <form action='#' id="main-form" :class="'picker-form ' + (scrollPast ? 'sticky' : '')">
      <div class="input-container">
        <div class='card'>
          <div class='info'>
            <font-awesome-icon icon='info-circle'/>
            Prova <span class="font-weight-bold">TIRESIA</span>, imposta <span class="font-weight-bold">massimo</span> e
            <span class="font-weight-bold">minimo</span> ed inizia ad estrarre numeri casuali!
          </div>
          <div class='custom-field'>
            <input type='number' :class="(min ? ' filled' : '') + (this.errorMin ? ' text-secondary' : '')"
                   v-model="min" @keyup="validateInput" id='lower-bound'>
            <label for='lower-bound' class='text-uppercase'>Minimo</label>
          </div>
          <div class='custom-field'>
            <input type='number' :class="(max ? ' filled' : '') + (this.errorMax ? ' text-secondary' : '')"
                   v-model="max" @keyup="validateInput" id='upper-bound'>
            <label for='upper-bound' class='text-uppercase'>Massimo</label>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button @click="pickRandom" :disabled="disablePicker">Estrai</button>
      </div>
    </form>
    <div class="containers-area">
      <number-container
        v-for="(child, i) in children"
        :position="i"
        :picked="child.items"
        :selected="i === currentChild"
        :key="i"
        @click="targetChild"
        @delete-container="deleteChild"
        @select-container="targetChild"/>
    </div>
    <div class="mx-auto mt-3">
      <button class="add-container" @click="addChild">
        <font-awesome-icon icon='plus'/>
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import NumberContainer from '@/components/NumberContainer'

Vue.component('number-container', NumberContainer)

export default {
  name: 'RandomPicker',
  data () {
    return {
      picked: [],
      min: null,
      max: null,
      scrollPast: false,
      children: [],
      currentChild: null
    }
  },
  computed: {
    errorMax () {
      return !(this.max && this.intMax > (this.intMin || -Infinity))
    },
    errorMin () {
      return !(this.min && this.intMin < (this.intMax || Infinity))
    },
    intMax () {
      return parseInt(this.max) + 1
    },
    intMin () {
      return parseInt(this.min)
    },
    limitReached () {
      return this.intMax - this.intMin <= this.currentContainer.items.length
    },
    disablePicker () {
      return !this.intMin || !this.intMax || this.errorMin || this.errorMax || this.limitReached
    },
    currentContainer () {
      return this.children[this.currentChild]
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    addChild () {
      this.currentChild = this.children.length
      this.children.push({ items: [] })
    },
    targetChild (i) {
      this.currentChild = i
    },
    deleteChild (i) {
      if (this.currentChild >= i) {
        this.currentChild = this.currentChild - 1
      }
      this.children.splice(i, 1)
    },
    handleScroll () {
      const elem = document.querySelector('.containers-area')
      if (elem.getBoundingClientRect().top < 100) {
        this.scrollPast = true
      }

      if (elem.getBoundingClientRect().top >= 100) {
        this.scrollPast = false
      }
    },
    flushPicked () {
      this.currentContainer.items = []
    },
    validateInput () {
      this.flushPicked()
    },
    pickRandom (event) {
      event.preventDefault()

      if (!this.max || !this.min) {
        return
      }

      let random
      do {
        random = Math.floor((Math.random() * (this.intMax - this.intMin))) + this.intMin
      } while (this.currentContainer.items.includes(random))
      this.currentContainer.items.push(random)
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../styles/variables';
@import '~bootstrap/scss/card';
@import '~bootstrap/scss/buttons';

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
        background: rgba(0, 0, 0, .025);

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

.add-container {
  background: $primary;
  color: $dark;
  width: 32px;
  height: 32px;
  padding: .4rem;
  border-radius: 50%;
  border: solid 2px $primary;
  outline: none;
}

@keyframes slide-in {
  from {
    top: -100%;
  }

  to {
    top: 0;
  }
}

</style>
