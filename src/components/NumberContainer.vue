<template>
  <div class="number-container" :class="containerClasses" :id="id" @click="emitSelect">
    <div class="command-bar">
      <div class="container-info">
        <span v-if="max && min" class="pill light">
          {{ info }}
        </span>
        <div v-else class="pill error">
           <font-awesome-icon class="mr-2" icon='exclamation'/> <span>definisci massimo e minino</span>
        </div>
      </div>
      <div class="container-name">
          <input type="text"
                 :id="`${id}-name`"
                 :value="name"
                 maxlength="25"
                 @change="handleNameChange"
                 @focus="$event.target.select()">
        <label :for="`${id}-name`" class="sr-only">Container name</label>
      </div>
      <div class="container-controls">
        <button class='remove-container'
                @click="emitFLush">
          <font-awesome-icon icon='times-circle'/>
        </button>

      </div>
    </div>
    <div class="container-slots">
      <div class="slot" v-for="(item, i) in picked" :key="i">
        <div class="number-card">
          {{ item }}
        </div>
      </div>
      <div class="mx-auto text-muted" v-if="!picked.length">
        Questo contenitore è vuoto <font-awesome-icon icon='ghost'/>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'NumberContainer',
  props: {
    name: String,
    position: Number,
    picked: Array,
    max: String,
    min: String,
    selected: Boolean,
    collapse: Boolean
  },
  created () {
    this.flushing = false
  },
  computed: {
    id () {
      return `container-${this.position}-${this.min}-${this.max}`
    },
    info () {
      return `${this.min} - ${this.max}`
    },
    containerClasses () {
      return [
        this.selected ? 'selected' : null,
        this.collapse ? 'collapsed' : null
      ].join(' ')
    }
  },
  methods: {
    handleNameChange (event) {
      this.$emit('prop-change', this.position, { name: event.target.value })
    },
    handleCollapseChange () {
      this.collapse = !this.collapse
      this.$emit('prop-change', this.position, { collapsed: !this.collapse })
    },
    emitFLush (event) {
      event.stopPropagation()
      this.$emit('delete-container', this.position)
    },
    emitSelect (event) {
      event.stopPropagation()
      this.$emit('select-container', this.position)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables';
@import '~bootstrap/scss/card';
@import '~bootstrap/scss/buttons';

$selection-color: $secondary;

.number-container {
  &.empty {
    border: solid 2px transparent;
  }

  &.selected {
    border: dashed 2px $selection-color;
  }

  transition: all .3s ease;
  border: dashed 2px $text-muted;
  padding: .9rem 1.2rem;
  margin: 2rem auto auto;
  border-radius: 1.5rem;
  position: relative;
  animation: .7s zoom-in;
  .command-bar {
    display: flex;
    flex-wrap: wrap;
    flex-flow: row;
    width: 100%;
    height: 1.5rem;
    .container {
      &-info {
        flex: 1 1 25%;
        max-width: 25%;
        text-align: left;
        font-size: .8rem;
        .error {
          height: 1.2rem;
          width: .3rem;
          text-align: left;
          padding-top: .1rem;
          overflow: hidden;
          cursor: pointer;
          transition: all .3s ease;
          animation: 3s pulse ease infinite;
          @include media-breakpoint-up(md) {
            &:hover {
              width: 100%;
              animation: none;
            }
          }
        }
      }

      &-name {
        flex: 1 1 50%;
        max-width: 50%;
        input {
          background: transparent;
          color: $text-muted;
          border: none;
          font-size: .8rem;
          outline: none;
          padding: .2rem 0;
          text-align: center;
          width: 100%;
        }
      }

      &-controls {
        flex: 1 1 25%;
        max-width: 25%;
        text-align: right;
        button {
          margin: -3px .2rem .2rem auto;
          background: transparent;
          border: transparent;
          padding: 0;
          color: $text-muted;
          font-size: 1.5rem;
          outline: none;
          cursor: pointer;
          transition: all .3s ease;
        }

        .remove-container {
          &:hover {
            color: $secondary;
          }
        }

        .collapse-container {
          svg {
            @at-root.collapsed#{&} {
              transform: rotate(180deg);
            }
          }
        }
      }
    }
  }

  .container-slots {
    display: flex;
    flex-wrap: wrap;
    max-height: none;
    overflow: hidden;
    @at-root.collapsed#{&} {
      max-height: 0;
    }
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
        box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.1);
        transition: all .2s ease;
        padding: 1rem;
        font-weight: bold;
        font-size: 1.2rem;

        &:hover {
          box-shadow: 2px 8px 6px rgba(0, 0, 0, 0.3);
          transform: translateY(-5px);
        }

        animation: .5s test-animation;
      }
    }
  }

  .pill {
    padding: .3rem .6rem .2rem .6rem;
    font-weight: bold;
    line-height: 24px;
    text-align: center;
    border-radius: 2rem;
    color: $dark;

    &.light {
      background: $text-muted;
    }

    &.error {
      background: $secondary;
    }
  }
}

@keyframes zoom-in {
  from {
    transform: scale(0) rotateX(75deg);
  }

  to {
    transform: scale(1);
  }
}

@keyframes test-animation {
  from {
    transform: rotateY(45deg) translateX(33%);
  }

  to {
    transform: unset;
  }
}

$pulse-color: rgba($secondary, .3);

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 $pulse-color;
  }

  25% {
    box-shadow: 0 0 0 5px $pulse-color;
  }

  50% {
    box-shadow: 0 0 2px 3px $pulse-color;
  }

  75% {
    box-shadow: 0 0 2px 8px $pulse-color;
  }

  100% {
    box-shadow: 0 0 0 0 $pulse-color;
  }
}

</style>
