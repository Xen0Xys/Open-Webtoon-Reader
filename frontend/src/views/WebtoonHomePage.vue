<script>
import axios from 'axios'

export default {
  name: 'WebtoonHomePage',
  data: () => ({
    webtoon: {},
    episodes: []
  }),
  created () {
    axios.get(`/webtoons/${parseInt(this.$route.params.webtoon)}/episodes`).then(({ data }) => {
      this.webtoon = data.webtoon
      this.episodes = data.episodes

      axios.get(`/user/states/webtoon/${this.webtoon.id}`).then(res => {
        if (res.status === 204) return
        res.data.map(e => ({
          id: e.episode_id,
          state: e.state
        })).forEach(e => {
          this.episodes.filter(r => r.id === e.id)[0].state = e.state
        })
      })
    }).catch(console.log)
  }
}
</script>

<template>
  <div class="home" v-if="webtoon">
    <header class="home__banner">
      <img :src="webtoon.background_banner" alt="" class="home__banner--background" />
      <div class="home__banner__infos">
        <h1 class="home__banner__infos--title">{{ webtoon.title }}</h1>
        <p class="home__banner__infos--author">by {{ webtoon.author }}</p>
      </div>
      <img :src="webtoon.top_banner" alt="" class="home__banner--foreground" />
    </header>

    <section class="home--content">
      <RouterLink :to="`/episode/${webtoon.id}/${episode.number}`" class="home__episode" :key="`ep-${episode.id}`" v-for="episode in episodes">
        <img :src="episode.thumbnail" alt="" class="home__episode--thumbnail" />

        <div class="home__episode__infos">
          <h2 class="home__episode__infos--title">{{ episode.title }}{{ episode.state ? ` (${episode.state}%)` : '' }}</h2>
          <p class="home__episode__infos__number"><span class="home__episode__infos__number--icon">#</span>{{ episode.number }}</p>
        </div>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/css/ds';

.home {
  width: 100%;
  display: flex;
  flex-direction: column;

  &__banner {
    width: 100%;
    position: relative;

    &__infos {
      top: 50%;
      left: 50%;
      width: 40%;
      display: flex;
      position: absolute;
      align-items: center;
      translate: -50% -50%;
      color: ds.$background;
      flex-direction: column;

      &--title {
        font-size: 2.5em;
        font-weight: 800;
      }
      &--author {
        opacity: .65;
        font-weight: 300;
      }
    }

    &--background {
      width: 100%;
    }
    &--foreground {
      top: 0;
      left: 50%;
      height: 100%;
      translate: -50%;
      position: absolute;
    }
  }

  &--content {
    gap: 1em;
    display: flex;
    padding: 2em 15em;
    flex-direction: column;
  }

  &__episode {
    gap: 1em;
    width: 100%;
    padding: .5em;
    display: flex;
    border-radius: 1em;
    align-items: center;
    border: 1px solid rgba(ds.$text, .1);

    &--thumbnail {
      height: 4em;
      border-radius: .5em;
    }

    &__infos {
      display: flex;
      flex-direction: column;

      &--title {
        font-weight: 600;
      }

      &__number {
        gap: .25ch;
        display: flex;
        align-items: center;

        &--icon {
          opacity: .2;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
