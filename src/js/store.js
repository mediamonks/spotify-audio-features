import Vue from '/node_modules/vue/dist/vue.esm.browser.js';
import Vuex from '/node_modules/vuex/dist/vuex.esm.browser.js';

Vue.use(Vuex);

export const store = new Vuex.Store({

  strict: true, // TODO: turn this off during the bundling process, this can have a big performance cost!

  state: {
    spotifyUrl: '',
    inputForSearch: [],
  },

  mutations: {
    updateSpotifyUrl (state, newUrl) {
      state.spotifyUrl = newUrl;
    },
  },

  actions: {

  },

});