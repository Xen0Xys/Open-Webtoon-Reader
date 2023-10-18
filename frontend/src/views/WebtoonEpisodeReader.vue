<script>
import axios from 'axios'

export default {
  name: 'WebtoonEpisodeReader',
  data: () => ({
    images: [],
    episodeId: undefined,
    currentImage: 0,
    interval: undefined,
    observer: undefined
  }),
  computed: {
    progress () {
      return Math.floor((this.currentImage + 1) / this.images.length * 100) / 100
    }
  },
  methods: {
    saveProgress () {
      axios.put(`/user/state/${this.episodeId}`, {
        state: this.progress * 100
      }).then(e => console.log(`Progression saved! (${e.data.state}%)`)).catch(console.log)
    },
    startStateObserver () {
      if (this.interval) return
      this.interval = setInterval(this.saveProgress, 20000)
    },
    touchTheEnd () {
      if (!this.interval) return

      clearInterval(this.interval)
      this.interval = undefined

      axios.put(`/user/state/${this.episodeId}`, {
        state: 100
      }).then(_ => console.log('Progression saved! (100%, finished)')).catch(console.log)
    },
    startObserve () {
      this.observer = new IntersectionObserver((entries, observer) => {
        entries.filter(e => e.isIntersecting || e.target.id === 'end').forEach(e => {
          const { target, isIntersecting } = e

          if (target.id === 'end') {
            if (isIntersecting) this.touchTheEnd()
            else this.startStateObserver()
          } else this.currentImage = parseInt(target.getAttribute('data-count'))
        })
      }, {
        threshold: 0.6
      })

      this.observer.observe(document.getElementById('end'))
      document.querySelectorAll('.episode--image').forEach(e => this.observer.observe(e))
    }
  },
  beforeRouteLeave () {
    this.saveProgress()

    this.observer = undefined
    if (this.interval) clearInterval(this.interval)
    this.interval = undefined
    console.log('Interval cleared!')
  },
  created () {
    const episodeNumber = parseInt(this.$route.params.episode)

    axios.get(`/webtoons/${parseInt(this.$route.params.webtoon)}/episode/${episodeNumber}`).then((res1) => {
      this.images = res1.data.imageList
      this.episodeId = res1.data.episodeId

      axios.get(`/user/state/${this.episodeId}`).then((res2) => {
        if (res2.status !== 200) return
        window.scrollTo({
          top: (res2.data.state / 100) * document.body.offsetHeight,
          behavior: 'smooth'
        })
        this.startStateObserver()
        this.startObserve()
      }).catch(e => {
        if (e.response.status !== 404) return console.log(e)
        return axios.post(`/user/state/${this.episodeId}`, {
          state: 0
        }).then(_ => {
          this.startStateObserver()
          this.startObserve()
        }).catch(console.log)
      })
    }).catch(console.log)
  }
}
</script>

<template>
  <div class="episode" v-if="images.length > 0">
    <span class="episode--progress" :style="`--progress: ${progress};`"></span>
    <img :src="image" alt="" class="episode--image" :key="`img-${image}`" :data-count="index" v-for="(image, index) in images" />
    <span id="end" v-if="images">END</span>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/css/ds';

.episode {
  display: flex;
  padding: 4em 15em;
  align-items: center;
  flex-direction: column;

  &--progress {
    left: 0;
    bottom: 0;
    width: 100%;
    height: .25em;
    display: flex;
    position: fixed;
    background-color: ds.$secondary;

    &::before {
      content: '';
      width: 100%;
      height: 100%;
      transform-origin: left;
      background-color: ds.$primary;
      transform: scaleX(var(--progress));
      transition: transform 100ms ease-in-out;
    }
  }
}
</style>
