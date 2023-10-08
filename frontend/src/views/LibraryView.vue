<script>
import SelectMenu from '@/components/forms/SelectMenu.vue'
import GridBox from '@/components/webtoons/GridBox.vue'

export default {
  name: 'LibraryView',
  computed: {
    options () {
      return [
        {
          icon: {
            type: 'outline',
            name: 'grid'
          },
          value: 'all',
          label: 'All',
          selected: true
        },
        {
          icon: {
            type: 'outline',
            name: 'heart'
          },
          value: 'favorites',
          label: 'Favorites'
        },
        {
          icon: {
            type: 'outline',
            name: 'book'
          },
          value: 'others',
          label: 'Others'
        }
      ]
    },
    webtoons () {
      switch (this.$route.query.filter || 'all') {
        case 'all':
          return this.$store.getters.all
        case 'favorites':
          return this.$store.getters.favorites
        case 'others':
          return this.$store.getters.unliked
        default:
          return []
      }
    }
  },
  components: {
    GridBox,
    SelectMenu
  },
  methods: {
    select (s) {
      this.$router.push(`/library?filter=${s.option.value}`)
    },
    like (e) {
      this.$store.dispatch('toggleFavorite', {
        id: e.webtoon.id,
        favorite: e.webtoon.favorite
      })
    }
  },
  created () {
    this.$store.dispatch('loadWebtoons')
  }
}
</script>

<template>
  <div class="home">
    <header class="home__header">
      <h1 class="home__header--title">Library</h1>
      <SelectMenu class="home__header__selection" :options="options" placeholder="Filter..." @value-change="select" />
    </header>

    <main class="home__grid">
      <GridBox class="home__grid--element" :webtoon="webtoon" @like="like" :key="webtoon.id" v-for="webtoon in webtoons" />
    </main>
  </div>
</template>

<style scoped lang="scss">
.home {
  gap: 2em;
  display: flex;
  padding: 4em 5em;
  flex-direction: column;

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &--title {
      line-height: 1;
      font-size: 2.5em;
      font-weight: 700;
    }

    &__selection {
      width: 10em;
    }
  }

  &__grid {
    gap: 1.5em;
    display: grid;
    place-content: center;
    grid-template-columns: repeat(auto-fit, minmax(12em, 16em));
  }
}
</style>
