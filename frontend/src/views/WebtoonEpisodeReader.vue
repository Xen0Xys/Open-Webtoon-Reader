<script>
import axios from 'axios'

export default {
  name: 'WebtoonEpisodeReader',
  data: () => ({
    images: []
  }),
  created () {
    const webtoonId = parseInt(this.$route.params.webtoon)
    const episodeId = parseInt(this.$route.params.episode)

    axios.get(`/webtoons/${webtoonId}/episode/${episodeId}`).then(({ data }) => {
      this.images = data.map(i => i.image)
    }).catch(console.log)
  }
}
</script>

<template>
  <div class="episode" v-if="images.length > 0">
    <img :src="image" alt="" class="episode--image" :key="`img-${image}`" v-for="image in images" />
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
