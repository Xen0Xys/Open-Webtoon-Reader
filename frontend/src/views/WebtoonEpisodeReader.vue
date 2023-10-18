<script>
import axios from 'axios'

export default {
  name: 'WebtoonEpisodeReader',
  data: () => ({
    images: []
  }),
  created () {
    axios.get(`/webtoons/${parseInt(this.$route.params.webtoon)}/episode/${parseInt(this.$route.params.episode)}`).then(({ data }) => {
      this.images = data
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
