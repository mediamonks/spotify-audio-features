export const SearchBar = {

  template:  `<section class="search-panel">
                <input
                  type="search"
                  rel="input"
                  placeholder="Enter or drag and drop Spotify link here"
                  v-model="spotifyUrl"
                  @[eventType]="test"
                />

                <button @click="$store.dispatch('enterUrl')">Open</button>
              </section>`,

  data () {
    return {
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

  methods: {
    test (e) {
      console.log('WGUDGWGFKVFW')
      this.$store.dispatch('enterUrl');
    },
  },

};