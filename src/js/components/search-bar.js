export const SearchBar = {

  template:  `<section class="search-panel">
                <input
                  type="search"
                  rel="input"
                  placeholder="Enter or drag and drop Spotify link here"
                  v-model="spotifyUrl"
                  @keydown.enter="$store.dispatch('enterUrl')"
                />

                <button @click="$store.dispatch('enterUrl')">Open</button>
              </section>`,

computed: {
  spotifyUrl: {
    get () {
      return this.$store.state.spotifyUrl;
    },
    set (value) {
      this.$store.commit('updateSpotifyUrl', value);
    },
  },
},

};