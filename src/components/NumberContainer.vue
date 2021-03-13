<template>
  <div class="ext-container" :class="containerClasses" id="target-container" @click="emitSelect">
    <button class='remove-container'
            @click="emitFLush">
      <font-awesome-icon icon='times'/>
    </button>
    <div class="slot" v-for="(item, i) in picked" :key="i">
      <div class="number-card">
        {{ item }}
      </div>
    </div>
    <div class="mx-auto text-muted" v-if="!picked.length">
      Questo contenitore è vuoto.
    </div>
  </div>

</template>

<script>
export default {
  name: 'NumberContainer',
  props: {
    picked: Array,
    position: Number,
    selected: Boolean
  },
  computed: {
    containerClasses () {
      return [
        // this.picked.length === 0 ? 'empty' : null,
        this.selected ? 'selected' : null
      ].join(' ')
    }
  },
  methods: {
    emitFLush (event) {
      event.stopPropagation()
      this.$emit('delete-container', this.position)
    },
    emitSelect () {
      this.$emit('select-container', this.position)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables';
@import '~bootstrap/scss/card';
@import '~bootstrap/scss/buttons';

.ext-container {
  &.empty {
    border: solid 2px transparent;
  }

  &.selected {
    border: dashed 2px $secondary;
  }

  transition: all .3s ease;
  border: dashed 2px $text-muted;
  padding: 1.5rem 2rem 1rem;
  margin: 2rem auto auto;
  border-radius: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  position: relative;

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
    }
  }

  .remove-container {
    background: $secondary;
    color: $dark;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    padding: 0 .1rem;
    border: solid 2px $secondary;
    outline: none;

    position: absolute;
    top: .5rem;
    right: .5rem;
  }
}
</style>
