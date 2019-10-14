// ESM imports
import { config } from './config.js';
import Vue from '/node_modules/vue/dist/vue.esm.browser.js';

// Components
import { LoadingSpinner } from './components/loading-spinner.js';
import { SpotifyTrack } from './components/spotify-track.js';

Vue.component('loading-spinner', LoadingSpinner);
Vue.component('spotify-track', SpotifyTrack);

new Vue({
  el: '#app',

  template:  `<div id="app">
                <div class="search-panel">
                  <input
                    type="text"
                    rel="input"
                    size="100"
                    placeholder="Paste Spotify link here"
                    v-model="spotifyUrl"
                    v-on:keydown.enter="search"
                  />

                  <button @click="search">Search</button>
                </div>

                <div class="results-panel">
                  <loading-spinner v-if="searching"/>
                  <p v-if="errored">The link you entered could not be processed, it should look something like: <a href="https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK" target="_blank">https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK</a></p>

                  <template v-if="searching === false && errored === false">
                    <spotify-track
                      v-for="(trackData) of displayedData"
                      :key="trackData.track.id"
                      :trackData="trackData"
                    />
                  </template>
                </div>

                <p class="subscript"><small>Are things broken? <a @click="clearSpotifyAccessToken" href="#">Refresh Spotify access token</a></small></p>
              </div>`,

  data () {
    const spotifyApi = new SpotifyWebApi(),
          spotifyAccessToken = this.getSpotifyAccessToken();

    spotifyApi.setAccessToken(spotifyAccessToken);

    return {
      spotifyApi,
      
      // spotifyUrl: 'https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK?si=z3gp-b9HSNiXXpHNeDzi8Q',
      spotifyUrl: 'https://open.spotify.com/track/6RpunyUP44SDweJPDScLSF?si=LTzdhedRROGphyIrBU30mg',
      supportedTypes: ['track', 'playlist', 'album'],

      searching: false,
      errored: false,

      displayedData: [],
    };
  },

  mounted () {
    if (this.spotifyUrl !== '') {
      this.search();
    }
  },

  methods: {
    getSpotifyAccessToken () {
      // Get the hash of the url
      const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});

      // Clear hash
      window.location.hash = '';

      // Set token in localStorage
      if (hash.access_token) {
        localStorage.setItem('spotify_access_token', hash.access_token);
      }

      // Get freshly created or previously set access token from localStorage
      const spotifyAccessToken = localStorage.getItem('spotify_access_token');

      // If there is no token, redirect to Spotify authorization
      if (!spotifyAccessToken) {
        const authEndpoint = 'https://accounts.spotify.com/authorize';

        // Replace with your app's client ID, redirect URI and desired scopes
        const clientId = config.spotifyClientId;
        const redirectUri = 'http://localhost:3000';
        const scopes = [
          'user-read-private',
          'user-read-email',
        ];

        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
      }

      return spotifyAccessToken;
    },

    clearSpotifyAccessToken () {
      localStorage.removeItem('spotify_access_token');
      window.location.reload();
    },

    async search (event) {
      if (this.searching === true) return false;

      this.searching = true;
      this.errored = false;

      const { spotifyUrl } = this;
      const urlParsed = new URL(spotifyUrl);

      if (urlParsed.host !== 'open.spotify.com') {
        return this.stopSearch(true);
      }

      const [type, id] = urlParsed.pathname.slice(1).split('/');

      if (!this.supportedTypes.includes(type)) {
        return this.stopSearch(true);
      }

      switch (type) {
        case 'track':
          const trackData = await this.getTrack(id);
          this.displayedData = [trackData];
          break;
        case 'album':
        case 'playlist':
        default:
          alert('not supported yet');
          break;
      }

      this.stopSearch(false);
    },

    stopSearch (errored = false) {
      this.searching = false;
      this.errored = errored;
    },

    async getTrack (trackID) {
      try {
        return {
          track: await this.spotifyApi.getTrack(trackID),
          audioAnalysis: await this.spotifyApi.getAudioAnalysisForTrack(trackID),
          audioFeatures: await this.spotifyApi.getAudioFeaturesForTrack(trackID),
        };
      }

      catch (err) {
        console.log(err);
      }
    }

    // async getTrackAnalysis (trackID) {
    //   // https://api.spotify.com/v1/tracks/{id}
    //   // https://api.spotify.com/v1/audio-analysis/{id}
    //   // https://api.spotify.com/v1/audio-features/{id}
    //   const opts = {
    //     method: 'GET',
    //     client_id,
    //   };

    //   const result = await fetch(`${this.baseUrl}/v1/tracks/${trackID}`, opts),
    //         data = await result.json();

    //   console.log(data);
    // },

    // getPlaylistContents () {

    // },

    // getAlbumContents () {

    // },
  },

});