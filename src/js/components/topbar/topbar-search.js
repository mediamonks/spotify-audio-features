export const TopbarSearch = {

  template:  `<nav class="topbar-search">
                <input
                  type="search"
                  rel="input"
                  placeholder="Enter or drag and drop Spotify link here"
                  v-model="spotifyUrl"
                  @[eventType]="$store.dispatch('enterUrl')"
                />

                <button @click="$store.dispatch('enterUrl')">Open</button>
              </nav>`,

  data () {
    return {
      // Some browsers support the 'search' event, which is somewhat smarter than just listening to pressing the enter button. It also fires when the search input's clear button is clicked.
      eventType: ('onsearch' in window) ? 'search' : 'keydown.enter',
    };
  },

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