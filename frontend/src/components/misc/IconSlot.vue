<script>
import icons from '@/assets/js/icons'

export default {
  name: 'IconSlot',
  props: {
    type: {
      type: String,
      default: () => 'generic'
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    icon () {
      return icons[this.type][this.name]
    }
  }
}
</script>

<template>
  <span class="icon" v-if="icon" v-html="icon"></span>
</template>

<style lang="scss">
.icon {
  height: 1em;
  width: max-content;
  display: inline-block;
}

svg[data-icon] {
  height: 100%;
}
</style>
