<script>
import LogoIcon from '@/components/misc/LogoIcon.vue'
import { deleteCookie } from '@/assets/js/cookies'
import tokenCookieName from '@/assets/js/authentication'

export default {
  name: 'UserLayout',
  components: {
    LogoIcon
  },
  methods: {
    logout () {
      deleteCookie(tokenCookieName)
      this.$router.push('/auth/login')
    }
  }
}
</script>

<template>
  <div class="layout">
    <header class="header">
      <nav class="header__menu left">
        <RouterLink to="/library" class="header__menu--btn" active-class="active">Library</RouterLink>
      </nav>

      <RouterLink class="header__logo" to="/"><LogoIcon class="header__logo--icon" /></RouterLink>

      <nav class="header__menu right">
        <button class="header__menu--btn" @click="logout">Logout</button>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/css/ds';

.layout {
  width: 100%;
  display: flex;
  min-height: 100vh;
  position: relative;
  flex-direction: column;
}

.header {
  top: 0;
  z-index: 5;
  width: 100%;
  display: flex;
  flex: 0 0 auto;
  padding: 2em 5em;
  position: sticky;
  align-items: center;
  backdrop-filter: blur(2em);
  justify-content: space-between;
  background-color: rgba(ds.$background, .3);

  &__logo {
    top: 0;
    left: 50%;
    font-size: 5em;
    position: absolute;
    translate: -50% 1rem;
  }

  &__menu {
    display: flex;
    align-items: center;

    &--btn {
      line-height: 1;
      position: relative;
      transition: opacity 100ms ease-in-out;

      &::after {
        left: 0;
        opacity: 0;
        height: 2px;
        width: 100%;
        content: '';
        bottom: -.75em;
        position: absolute;
        translate: 0 -.25em;
        transition-duration: 150ms;
        background-color: ds.$primary;
        transition-property: opacity, translate;
        transition-timing-function: ease-in-out;
      }

      &:not(.active):hover {
        opacity: .65;
      }

      &.active {
        color: ds.$primary;

        &::after {
          opacity: 1;
          translate: none;
        }
      }
    }
  }
}

.content {
  flex: 1 1 100%;
}
</style>
