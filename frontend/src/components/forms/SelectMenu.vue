<script>
import IconSlot from '@/components/misc/IconSlot.vue'

export default {
  name: 'SelectMenu',
  components: { IconSlot },
  data: () => ({
    value: undefined,
    opened: false
  }),
  props: {
    options: {
      type: Array,
      required: true
    },
    selected: Object,
    placeholder: {
      type: String,
      default: () => 'Select something...'
    }
  },
  created () {
    this.value = this.options.filter(o => o.selected)[0] || undefined
  },
  methods: {
    selectOption (option) {
      this.value = option
      this.closeOptions()
      this.$emit('valueChange', {
        option
      })
    },
    openOptions () {
      this.opened = true
    },
    closeOptions () {
      this.opened = false
    },
    toggleOptions () {
      if (this.opened) return this.closeOptions()
      this.openOptions()
    }
  }
}
</script>

<template>
  <div class="menu">
    <button class="menu__toggle" :class="{ opened }" @click="toggleOptions" v-if="value">
      <IconSlot :type="value.icon.type" :name="value.icon.name" class="menu__toggle--icon" v-if="value.icon" />
      <span class="menu__toggle--content">{{ value.label }}</span>
      <IconSlot name="caret-down" class="menu__toggle--down" />
    </button>
    <button class="menu__toggle empty" :class="{ opened }" @click="toggleOptions" v-else>
      <span class="menu__toggle--content">{{ placeholder }}</span>
      <IconSlot name="caret-down" class="menu__toggle--down" />
    </button>

    <div class="menu__options" :class="{ opened }">
      <button class="menu__options__item" :class="{ selected: option.value === value?.value }" :key="`opt-${option.value}`" v-for="option in options" @click="selectOption(option)">
        <IconSlot :type="option.icon.type" :name="option.icon.name" class="menu__options__item--icon" v-if="option.icon" />
        <span class="menu__options__item--content">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/css/ds';

.menu {
  position: relative;

  &__toggle {
    gap: .5em;
    width: 100%;
    display: flex;
    padding: .75em;
    align-items: center;
    border-radius: .5em;
    border: 1px solid rgba(ds.$text, .15);

    &--icon, &--down {
      flex: 0 0 auto;
      font-size: 1.15em;
    }

    &--down {
      transition: rotate 150ms ease-in-out;
    }

    &--content {
      flex: 1 1 100%;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &.empty {
      > span.menu__toggle--content {
        opacity: .3;
        transition: opacity 100ms ease-in-out;
      }

      &:hover {
        > span.menu__toggle--content {
          opacity: 1;
        }
      }
    }

    &.opened {
      .menu__toggle--down {
        rotate: 180deg;
      }
    }
  }

  &__options {
    opacity: 0;
    z-index: 4;
    width: 100%;
    display: flex;
    translate: 0 -1em;
    position: absolute;
    border-radius: .5em;
    pointer-events: none;
    top: calc(100% + .5em);
    flex-direction: column;
    transition-duration: 250ms;
    background-color: ds.$background;
    border: 1px solid rgba(ds.$text, .15);
    transition-timing-function: ease-in-out;
    transition-property: opacity, translate;

    &.opened {
      opacity: 1;
      translate: none;
      pointer-events: all;
    }

    &__item {
      gap: .5em;
      opacity: .65;
      display: flex;
      padding: .75em;
      align-items: center;
      transition-duration: 100ms;
      transition-property: color, opacity;
      transition-timing-function: ease-in-out;

      &:hover, &.selected {
        opacity: 1;
      }
      &.selected {
        color: ds.$primary;
      }

      &--icon {
        font-size: 1.15em;
      }
    }
  }
}
</style>
