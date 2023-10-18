<script>
import axios from 'axios'
import { setCookie } from '@/assets/js/cookies'
import ReactiveInput from '@/components/forms/ReactiveInput.vue'
import IconSlot from '@/components/misc/IconSlot.vue'

export default {
  name: 'LoginView',
  data: () => ({
    username: undefined,
    password: undefined,
    loading: false
  }),
  components: { IconSlot, ReactiveInput },
  methods: {
    signIn () {
      if (!this.username || !this.password) return

      this.loading = true
      axios.post('/user/login', {
        username: this.username,
        password: this.password
      }).then(({ data }) => {
        setCookie('token', data.token, 30 * 24 * 3600 * 1000)
        axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
        this.$router.push('/')
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    }
  }
}
</script>

<template>
  <main class="login">
    <form class="login__form">
      <header class="login__form__header">
        <img src="/img/logo.svg" alt="Open Webtoon Reader" class="login__form__header--logo" />
        <h1 class="login__form__header--title">Sign in</h1>
      </header>

      <ReactiveInput name="username" ref="uname" type="text" placeholder="Username" class="login__form--input" @filled="username = $event.value" />
      <ReactiveInput name="password" ref="passwd" type="password" placeholder="Password" class="login__form--input" @filled="password = $event.value" />

      <button class="login__form--submit" type="submit" @click.prevent="signIn" :disabled="loading">
        <IconSlot name="loader" v-if="loading" />
        <span v-else>Sign in</span>
      </button>
    </form>
  </main>
</template>

<style scoped lang="scss">
@use '../../assets/css/ds';

.login {
  display: grid;
  min-height: 100vh;
  place-items: center;

  &__form {
    gap: 1.5em;
    width: 100%;
    display: flex;
    max-width: 20em;
    flex-direction: column;

    &__header {
      gap: 1em;
      display: flex;
      align-items: center;
      flex-direction: column;

      &--logo {
        height: 5em;
      }

      &--title {
        font-size: 1.75em;
        font-weight: 800;
        text-transform: uppercase;
      }
    }

    &--submit {
      line-height: 1;
      border-radius: .5em;
      padding: .75em 1.5em;
      color: ds.$background;
      background-color: ds.$primary;
      transition: background-color 100ms ease-in-out;

      &:disabled {
        opacity: .6;
        cursor: not-allowed;
      }

      &:hover {
        background-color: rgba(ds.$primary, .8);
      }
    }
  }
}
</style>
