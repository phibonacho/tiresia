<template>
  <div class="random-picker">
    <form action='#' id="picker-form" :class="(children.length ? 'sticky' : '')">
      <div class="target-name" v-if="currentContainer">
        <input type="text"
               :id="`container-name`"
               v-model="currentContainer.name"
               maxlength="25"
               @focus="$event.target.select()">
        <label :for="`container-name`" class="sr-only">Container name</label>
        <small v-if="min && max">{{ currentContainer.items.length }}/{{ actualMax - intMin }}</small>
      </div>
      <div class="input-container">
        <div class='card'>
          <div class='info'>
            <font-awesome-icon icon='info-circle'/>
            Prova <span class="tiresia">TIRESIA</span>, imposta <span class="font-weight-bold">massimo</span> e
            <span class="font-weight-bold">minimo</span> ed inizia ad estrarre numeri casuali!
          </div>
          <div class='custom-field'>
            <input type='number' :class="(min ? ' filled' : '') + (this.errorMin ? ' text-secondary' : '')"
                   v-model="min"
                   @keyup="handleInput"
                   id='lower-bound'>
            <label for='lower-bound' class='text-uppercase'>Minimo</label>
          </div>
          <div class='custom-field'>
            <input type='number' :class="(max ? ' filled' : '') + (this.errorMax ? ' text-secondary' : '')"
                   v-model="max"
                   @keyup="handleInput"
                   id='upper-bound'>
            <label for='upper-bound' class='text-uppercase'>Massimo</label>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button v-if="children.length" @click="pickRandom" :disabled="disablePick">Estrai</button>
      </div>
    </form>
    <div class="containers-area">
      <number-container
        v-for="(child, i) in children"
        :collapse="child.collapse"
        :position="i"
        :name="child.name"
        :max="child.max"
        :min="child.min"
        :picked="child.items"
        :selected="i === currentChild"
        :key="i"
        @click="targetChild"
        @prop-change="updateChild"
        @delete-container="deleteChild"
        @select-container="targetChild"/>
    </div>
    <div class="mx-auto mt-3">
      <button id="add-container"
              @click="addChild()"
              v-if="children.length">
        <font-awesome-icon icon='plus-circle'/>
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
    actualMax () {
      return this.intMax + 1
    },
    intMax () {
      return parseInt(this.max)
    },
    intMin () {
      return parseInt(this.min)
    },
    limitReached () {
      return this.actualMax - this.intMin <= (this.currentContainer?.items.length || 0)
    },
    disablePick () {
      return this.limitReached || !this.currentContainer || this.errorMax || this.errorMin
    },
    disableAddChild () {
      return this.children.length <= 1
    },
    currentContainer () {
      return this.children[this.currentChild]
    }
  },
  created () {
    // window.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  destroyed () {
    // window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // scroll handler
    handleScroll () {
      const elem = document.querySelector('.containers-area')
      if (elem.getBoundingClientRect().top < 0) {
        this.scrollPast = true
      }

      if (elem.getBoundingClientRect().top >= 0) {
        this.scrollPast = false
      }
    },
    // container handlers
    addChild (max = null, min = null) {
      this.children.push({ items: [], max: max, min: min, name: `Nuovo contenitore (${this.children.length})`, collapsed: false })
      this.targetChild(this.children.length - 1)
    },
    updateChild (i, data) {
      const targetChild = this.children[i]
      for (const key in data) {
        targetChild[key] = data[key]
      }
    },
    targetChild (i) {
      this.currentChild = i
      this.max = this.currentContainer.max
      this.min = this.currentContainer.min
    },
    deleteChild (i) {
      this.max = null
      this.min = null
      this.children.splice(i, 1)
      if (i === this.currentChild && this.children.length > 0) {
        if (i === 0) {
          this.targetChild(i)
        } else {
          this.targetChild(i - 1)
        }
      } else if (i < this.currentChild && this.children.length > 0) {
        this.targetChild(this.currentChild - 1)
      } else if (!this.children.length) {
        this.currentChild = null
      }
    },
    flushPicked () {
      this.currentContainer.items = []
    },
    // picker handler
    handleInput () {
      if (this.currentContainer) {
        const { min, max } = this.currentContainer
        if (this.intMax < max || this.intMin > min) {
          this.flushPicked()
        }

        if (!this.errorMax) {
          this.currentContainer.max = this.max
        }
        if (!this.errorMin) {
          this.currentContainer.min = this.min
        }
      } else if (this.max && this.min) {
        this.addChild(this.max, this.min)
      }
    },
    pickRandom (event) {
      event.preventDefault()

      const { intMin, actualMax } = this

      let random
      do {
        random = Math.floor((Math.random() * (actualMax - intMin))) + intMin
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

#picker-form {
  background: $dark;
  transition: all ease .2s;

  @include media-breakpoint-down(md) {
    &:focus-within:not(.sticky) {
      margin-bottom: calc(100vh * .2);
    }
  }

  &.sticky {
    border: solid 1px rgba(0, 0, 0, 0.125);
    border-radius: .5rem;
    overflow: hidden;
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

  .target-name {
    flex: 3 3 100%;
    text-align: left;
    color: $text-muted;
    padding: .5rem;
    background: rgba(0, 0, 0, .025);
    border-bottom: solid 2px rgba(0, 0, 0, .125);
    input {
      text-transform: uppercase;
      background: transparent;
      color: $text-muted;
      font-weight: bold;
      border: none;
      font-size: .8rem;
      outline: none;
      padding: .2rem 0;
      text-align: left;
    }
  }

  .input-container {

    @at-root.sticky#{&} {
      flex: 0 0 66.66667%;
      max-width: 66.66667%;
    }

    .card {
      background: transparent;

      @at-root.sticky#{&} {
        border: none;
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

.containers-area {
  margin-top: 100px;
}

.tiresia {
  font-family: 'Montserrat', sans-serif;
  color: $primary;
  text-shadow: $secondary 1px 1px;
  text-transform: uppercase;
  font-weight: bold;
}

#add-container {
  background: transparent;
  color: $primary;
  font-size: 2rem;
  border: transparent;
  outline: none;
  animation: .7s ease zoom-spin;
}

@keyframes slide-in {
  from {
    top: -100%;
  }

  to {
    top: 0;
  }
}

.random-picker {
  width: 100%;
}

@keyframes zoom-spin {
  0% {
    transform: scale(0) rotate(135deg);
  }

  50% {
    transform: scale(1.2) rotate(-90deg);
  }

  80% {
    transform: rotate(0);
  }

  100% {
    transform: scale(1);
  }
}

</style>
