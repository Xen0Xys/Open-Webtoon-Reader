<script>
import IconSlot from '@/components/misc/IconSlot.vue'

export default {
  name: 'ReactiveInput',
  components: { IconSlot },
  data: () => ({
    value: undefined,
    lType: undefined,
    shown: false
  }),
  props: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: () => 'text'
    },
    fill: String,
    placeholder: {
      type: String,
      default: () => 'Type something...'
    }
  },
  created () {
    this.value = this.fill

    switch (this.type) {
      case 'passwd': case 'password':
        this.lType = 'password'
        break
      case 'mail': case 'email':
        this.lType = 'email'
        break
      default:
        this.lType = 'text'
        break
    }
  },
  methods: {
    updateValue (e) {
      this.$emit('filled', { value: e.target.value })
    }
  }
}
</script>

<template>
  <div class="input">
    <input class="input--field" :type="lType === 'password' ? (shown ? 'text' : 'password') : lType" :id="name" v-model="value" @blur="updateValue" required />
    <label class="input--label" :for="name">{{ placeholder }}</label>

    <button class="input--action" v-if="lType === 'password'" @click.prevent="shown = !shown">
      <IconSlot :name="shown ? 'eye' : 'eye-slash'" type="outline" />
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/css/ds';

.input {
  $block: .75em;
  $inline: 1.5em;

  position: relative;
  border-radius: .5em;
  border: 2px solid ds.$primary;

  &--label {
    top: 50%;
    opacity: .3;
    padding: .5em;
    translate: 0 -50%;
    position: absolute;
    pointer-events: none;
    border-radius: .25em;
    left: $inline - .5em;
    transform-origin: left;
    transition-duration: 100ms;
    background-color: ds.$background;
    transition-timing-function: ease-in-out;
    transition-property: top, opacity, scale, color;
  }

  &:hover {
    .input--label {
      opacity: 1;
    }
  }

  &--field {
    width: 100%;
    border: none;
    outline: none;
    background: none;
    padding: $block $inline;

    &:focus, &:valid {
      + .input--label {
        top: 0;
        opacity: 1;
        scale: .75;
        color: ds.$primary;
      }
    }
  }

  &--action {
    top: .5rem;
    width: 2rem;
    right: .5rem;
    display: grid;
    font-size: 1.5em;
    position: absolute;
    place-items: center;
    aspect-ratio: 1 / 1;
    border-radius: .125rem;
    transition: background-color 100ms ease-in-out;

    &:hover {
      background-color: rgba(ds.$secondary, .5);
    }
  }
}
</style>
