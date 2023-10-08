import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    webtoons: []
  },
  getters: {
    all (state) {
      return state.webtoons
    },
    favorites (state) {
      return state.webtoons.filter(w => w.favorite)
    },
    unliked (state) {
      return state.webtoons.filter(w => !w.favorite)
    }
  },
  mutations: {
    loadWebtoons (state, payload) {
      state.webtoons = payload
    },
    webtoonFavoriteState (state, payload) {
      const index = state.webtoons.indexOf(state.webtoons.filter(w => w.id === payload.id)[0])
      state.webtoons[index].favorite = payload.favorite
    }
  },
  actions: {
    loadWebtoons (state, payload) {
      axios.get('/webtoons').then(({ data }) => {
        state.dispatch('loadFavorites', data)
      }).catch(console.log)
    },
    loadFavorites (state, payload) {
      axios.get('/user/favorites').then(({ data }) => {
        data.forEach(w => { payload.find(we => we.id === w.webtoon_id).favorite = true })
        state.commit('loadWebtoons', payload)
      }).catch(console.log)
    },
    toggleFavorite (state, payload) {
      const fav = payload.favorite
      const id = payload.id

      if (fav) {
        axios.delete(`/user/favorite/${id}`).then(_ => {
          state.commit('webtoonFavoriteState', {
            id: payload.id,
            favorite: false
          })
        }).catch(console.log)
      } else {
        axios.post(`/user/favorite/${id}`).then(_ => {
          state.commit('webtoonFavoriteState', {
            id: payload.id,
            favorite: true
          })
        }).catch(console.log)
      }
    }
  },
  modules: {
  }
})
