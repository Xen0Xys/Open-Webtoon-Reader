<script>
import IconSlot from '@/components/misc/IconSlot.vue'

export default {
  name: 'GridBox',
  components: {
    IconSlot
  },
  props: {
    webtoon: {
      type: Object,
      required: true
    }
  },
  methods: {
    like () {
      this.$emit('like', {
        webtoon: this.webtoon
      })
    }
  }
}
</script>

<template>
  <div class="box" :style="`--bg: url('${webtoon.thumbnail}')`">
    <RouterLink :to="`/webtoon/${webtoon.id}`" class="box--link" />

    <header class="box__header">
      <h2 class="box__header--title">{{ webtoon.title }}</h2>
      <p class="box__header--subtitle">{{ webtoon.author }}</p>
    </header>

    <button class="box__like" :class="{ active: webtoon.favorite }" @click="like">
      <IconSlot :type="webtoon.favorite ? 'fill' : 'outline'" name="heart" />
    </button>

    <span class="box--episodes">{{ webtoon.episode_count }} episodes</span>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/css/ds';

.box {
  padding: 1em;
  display: flex;
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: .75em;
  background-size: 100%;
  background-image: var(--bg);
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid rgba(ds.$text, .1);

  &--link {
    inset: 0;
    z-index: 2;
    position: absolute;
  }

  &__header {
    width: 85%;
    display: flex;
    flex-direction: column;

    * {
      line-height: 1.5;
    }

    &--title {
      font-weight: 600;
    }

    &--subtitle {
      opacity: .65;
      font-size: .75em;
    }
  }

  &__like {
    top: .5rem;
    z-index: 3;
    opacity: 0;
    right: .5rem;
    font-size: 1.5em;
    position: absolute;
    translate: 0 -.25em;
    pointer-events: none;
    transition-duration: 200ms;
    transition-property: opacity, translate;
    transition-timing-function: ease-in-out;

    &.active {
      opacity: 1;
      translate: none;
      color: ds.$primary;
      pointer-events: all;
      animation: like 300ms ease-in-out;

      @keyframes like {
        0% {
          scale: 1;
        }
        33.33% {
          scale: 1.2;
        }
        66.66% {
          scale: .9;
        }
        100% {
          scale: 1;
        }
      }
    }
  }

  &--episodes {
    left: .5rem;
    bottom: .5rem;
    padding: .5rem;
    line-height: 1;
    font-size: .75em;
    position: absolute;
    border-radius: .4rem;
    color: ds.$background;
    background-color: ds.$primary;
  }

  &:hover {
    .box {
      &__like {
        opacity: 1;
        translate: none;
        pointer-events: all;
      }
    }
  }
}
</style>
