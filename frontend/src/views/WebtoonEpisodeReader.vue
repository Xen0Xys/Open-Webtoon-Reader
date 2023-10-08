<script>
import axios from 'axios'

export default {
  name: 'WebtoonEpisodeReader',
  data: () => ({
    webtoon: undefined
  }),
  created () {
    const webtoonId = parseInt(this.$route.params.webtoon)
    const episodeId = parseInt(this.$route.params.episode)
    this.webtoon = this.$store.state.webtoons.filter(w => w.id === webtoonId)[0]
    if (!this.webtoon) return this.$router.push('/library')

    axios.get(`/webtoons/${webtoonId}/episode/${episodeId}`).then(({ data }) => {
      this.webtoon.images = data.map(i => i.image)
    }).catch(console.log)
  }
}
</script>

<template>
  <div class="episode" v-if="webtoon">
    <img :src="image" alt="" class="episode--image" :key="`img-${image}`" v-for="image in webtoon.images" />
  </div>
</template>

<style scoped lang="scss">
.episode {
  display: flex;
  padding: 4em 15em;
  align-items: center;
  flex-direction: column;
}
</style>
