// ESM imports
import Vue from '/node_modules/vue/dist/vue.esm.browser.js';
import { config } from './config.js';
import { store } from './store.js';

// Components
import { LoadingSpinner } from './components/loading-spinner.js';
import { SpotifyTrack } from './components/spotify-track.js';
import { SpotifyPlaylist } from './components/spotify-playlist.js';
import { SpotifyAlbum } from './components/spotify-album.js';
import { SpotifyAudioFeaturesHeader } from './components/spotify-audio-features-header.js';
import { SpotifyAudioFeaturesMetrics } from './components/spotify-audio-features-metrics.js';
import { SpotifyAudioFeatureMetric } from './components/spotify-audio-feature-metric.js';
import { SpotifyTestLinks } from './components/spotify-test-links.js';
import { InputForSearch } from './components/input-for-search.js';

// Helpers
import { audioFeatures } from './helpers/audio-features.js';
import { isValidUrl } from './helpers/valid-url.js';

Vue.component('loading-spinner', LoadingSpinner);
Vue.component('spotify-track', SpotifyTrack);
Vue.component('spotify-playlist', SpotifyPlaylist);
Vue.component('spotify-album', SpotifyAlbum);
Vue.component('spotify-audio-features-header', SpotifyAudioFeaturesHeader);
Vue.component('spotify-audio-features-metrics', SpotifyAudioFeaturesMetrics);
Vue.component('spotify-audio-feature-metric', SpotifyAudioFeatureMetric);
Vue.component('spotify-test-links', SpotifyTestLinks);
Vue.component('input-for-search', InputForSearch);

new Vue({

  el: '#app',

  store,

  template:  `<div id="app"
                @dragenter.capture.prevent.stop="draggingOver = true"
                @dragover.capture.prevent.stop
                @dragleave.self.capture.prevent.stop="draggingOver = false"
                @drop.capture.prevent.stop="testDroppedData"
                :class="{
                  'drag-over': draggingOver,
                }"
              >
                <section class="search-panel">
                  <input
                    type="search"
                    rel="input"
                    size="100"
                    placeholder="Enter or drag and drop Spotify link here"
                    v-model="spotifyUrl"
                    @keydown.enter="enterUrl(spotifyUrl)"
                  />

                  <button @click="enterUrl(spotifyUrl)">Search</button>
                </section>

                <section class="toolbar">
                  <spotify-test-links/>
                  <input-for-search/>
                </section>

                <section class="results-panel">
                  <loading-spinner v-if="searching === true"/>

                  <p v-if="searching === false && errored === true" v-html="errorMsg"></p>

                  <template v-if="searching === false && errored === false">
                    <component
                      :is="'spotify-' + data.type"
                      v-for="(data) of displayedData"
                      :key="data.id"
                      :contentData="data"
                    />
                  </template>
                </section>

                <p class="subscript"><small>Broken? <a @click="clearSpotifyAccessToken" href="#">Refresh Spotify access token</a></small></p>
              </div>`,

  data () {
    const spotifyApi = new SpotifyWebApi(),
          spotifyAccessToken = this.getSpotifyAccessToken();

    spotifyApi.setAccessToken(spotifyAccessToken);

    return {
      config,
      spotifyApi,
      
      // spotifyUrl: this.spotifyUrlToPrefill || '',

      searching: false,
      errored: false,
      errorMsg: '',

      draggingOver: false,

      displayedData: [],
    };
  },

  mounted () {
    // Instantly search prefilled track
    this.doSearch();

    // When going back/forward
    window.addEventListener('popstate', (event) => {
      this.setSpotifyUrlFromSearchParams();
    });
  },

  computed: {
    spotifyUrl: {
      get () {
        return this.$store.state.spotifyUrl;
      },
      set (value) {
        this.$store.commit('updateSpotifyUrl', value);
      }
    }
  },

  methods: {
    getSpotifyAccessToken () {
      // bool that indicates if this page is visited just after granting access on Spotify or if this is a 'normal' visit
      let postAuthSituation;

      const currentPage = new URL(window.location);

      // Get the hash of the url
      const hash = currentPage.hash
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

      // POST SPOTIFY AUTHORIZATION SITUATION
      if (hash.access_token) {
        postAuthSituation = true;
        // Set token in localStorage
        localStorage.setItem(`${config.appID}_access_token`, hash.access_token);
      }

      // 'NORMAL' SITUATION
      else {
        postAuthSituation = false;
      }

      if (postAuthSituation) {
        const postAuthSpotifyUrlToPrefill = localStorage.getItem(`${config.appID}_post_access_grant_url_prefill`);
        
        if (postAuthSpotifyUrlToPrefill) {
          history.replaceState(null, null, `/?search=${postAuthSpotifyUrlToPrefill}`);
        }
      }

      // Always clear this to prevent bugs, no matter what situation.
      localStorage.removeItem(`${config.appID}_post_access_grant_url_prefill`);
      
      // Search params will contain param 'search' when:
      // 1) User searched something then refreshed the page
      // 2) Opened direct link to a search
      // 3) User searched something but needed to re-authorize
      // 4) User just authorized and returned here by redirect link (which cannot contain dynamic parameters, so we save current search into localStorage)
      const spotifyUrlToPrefill = currentPage.searchParams.get('search');

      // Get freshly created or previously set access token from localStorage
      const spotifyAccessToken = localStorage.getItem(`${config.appID}_access_token`);

      // If token is present, continue starting up
      if (spotifyAccessToken) {
        if (spotifyUrlToPrefill) {
          this.spotifyUrlToPrefill = spotifyUrlToPrefill;
        }
  
        return spotifyAccessToken;
      }

      // If there is no token, redirect to Spotify authorization
      else {
        const authEndpoint = 'https://accounts.spotify.com/authorize';

        // Replace with your app's client ID, redirect URI and desired scopes
        const clientId = config.spotifyClientId;
        const redirectUri = currentPage.origin;
        const scopes = [
          'user-read-private',
          'user-read-email',
        ];

        if (spotifyUrlToPrefill) {
          localStorage.setItem(`${config.appID}_post_access_grant_url_prefill`, spotifyUrlToPrefill);
        }

        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
      }
    },

    clearSpotifyAccessToken () {
      // If url was already filled in, preverse and prefill next time
      if (this.spotifyUrl) {
        window.location.search = `?search=${this.spotifyUrl}`;
      }

      localStorage.removeItem(`${config.appID}_access_token`);
      window.location.reload();
    },

    async doSearch () {
      if (this.searching === true) return false;

      this.searching = true;
      this.errored = false;
      this.errorMsg = '';

      const { spotifyUrl } = this;

      if (spotifyUrl === '') {
        this.displayedData = [];
        return this.endSearch();
      }

      if (!isValidUrl(spotifyUrl)) {
        return this.crashSearch(`A valid URL should look something like <a href="https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK" target="_blank">https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK</a>`);
      }

      const urlParsed = new URL(spotifyUrl);

      if (urlParsed.host !== 'open.spotify.com') {
        return this.crashSearch(`The link you entered could not be processed, it should look something like: <a href="https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK" target="_blank">https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK</a>`);
      }

      const spotifyUrlSplit = urlParsed.pathname.slice(1).split('/');

      let type = spotifyUrlSplit[0],
          id = spotifyUrlSplit[1];

      try {
        switch (type) {
          case 'track':
            const trackID = id;
            await this.getTracks([trackID]);
            break;
          case 'user':
            // fall through only if is user/{uid}/playlist/{pid} format
            if (spotifyUrlSplit[2] === 'playlist') {
              type = spotifyUrlSplit[2]; // (will not re-execute switch)
              id = spotifyUrlSplit[3];
            }
            else {
              return this.crashSearch(`We can't process the type of Spotify link you entered yet, try entering a track, album or playlist`);
            }
          case 'playlist':
            const playlistID = id;
            await this.getPlaylist(playlistID);
            break;
          case 'album':
            const albumID = id;
            await this.getAlbum(albumID);
            break;
          default:
            return this.crashSearch(`We can't process the type of Spotify link you entered yet, try entering a track, album or playlist`);
        }
      }

      catch (err) {
        if (err.reason) {
          return this.crashSearch(err.reason);
        }

        else {
          if (config.debug === true) console.error(err);
        }
      }

      this.endSearch();
    },

    endSearch () {
      this.errorMsg = '';
      this.errored = false;
      this.searching = false;
    },

    crashSearch (errorMsg) {
      this.errorMsg = errorMsg;
      this.errored = true;
      this.searching = false;
    },

    async getTracks (trackIDs, alreadyAvailableData = {}, returnValue = false) {
      const tracksData = [];

      try {
        const { tracks } = ('tracks' in alreadyAvailableData) ? alreadyAvailableData : await this.spotifyApi.getTracks(trackIDs),
              { audio_features } = ('audio_features' in alreadyAvailableData) ? alreadyAvailableData : await this.spotifyApi.getAudioFeaturesForTracks(trackIDs);

        if (tracks.every(track => track === null)) {
          throw {
            status: 400,
            reason: `All entered trackIDs are invalid. We throw this error ourselves, because we always use the "get several tracks" endpoint, which only returns null if objects are not found`,
          };
        }

        for (const trackID of trackIDs) {
          tracksData.push({
            id: trackID,
            type: 'track',
            trackInfo: tracks.find(track => track.id === trackID),
            audioFeatures: audio_features.find(track => track.id === trackID),
          });
        }
      }

      catch (err) {
        return this.checkError(err);
      }

      if (tracksData.length) {
        tracksData.unshift({
          type: 'audio-features-header',
          contentData: null,
        });
      }

      if (returnValue === true) {
        return tracksData;
      }

      else {
        this.displayedData = tracksData;
      }
    },

    async getPlaylist (playlistID) {
      try {
        const playlist = await this.spotifyApi.getPlaylist(playlistID),
              playlistTracks = playlist.tracks.items.map(item => item.track),
              trackIDs = playlistTracks.map(track => track.id),
              tracksData = await this.getTracks(trackIDs, {
                tracks: playlistTracks,
              }, true);

        this.addAudioFeaturesData(playlist, tracksData);
        this.displayedData = [playlist, ...tracksData];

        // Warn if results are limited by Spotify API request restrictions
        if (playlist.tracks.total > playlist.tracks.limit) {
          alert(`Playlist has ${playlist.tracks.total} tracks, but the Spotify API limits us to getting data for ${playlist.tracks.limit} tracks per request. For simplicity, this tool will only get the first ${playlist.tracks.limit} items`);
        }
      }

      catch (err) {
        this.checkError(err);
      }
    },

    async getAlbum (albumID) {
      try {
        const album = await this.spotifyApi.getAlbum(albumID),
              albumTracks = album.tracks.items,
              trackIDs = albumTracks.map(track => track.id),
              tracksData = await this.getTracks(trackIDs, {
                tracks: albumTracks,
              }, true);

        this.addAudioFeaturesData(album, tracksData);
        this.displayedData = [album, ...tracksData];

        // Warn if results are limited by Spotify API request restrictions
        if (album.tracks.total > album.tracks.limit) {
          alert(`Album has ${album.tracks.total} tracks, but the Spotify API limits us to getting data for ${album.tracks.limit} tracks per request. For simplicity, this tool will only get the first ${album.tracks.limit} items`);
        }
      }

      catch (err) {
        this.checkError(err);
      }
    },

    addAudioFeaturesData (targetObj, tracksData) {
      targetObj._audio_features = {};
      const tracksAudioFeatures = tracksData.filter(entry => entry.type === 'track').map(track => track.audioFeatures);                                                    

      for (const audioFeature of audioFeatures) {
        const values = tracksAudioFeatures.map(entry => entry[audioFeature.id]);

        targetObj._audio_features[audioFeature.id] = values;
      }
    },

    checkError (err) {
      if (err.status === 400) {
        if (config.debug === true) console.warn(`Wrong Spotify link formatting (too long or too short)`);
        throw {
          reason: `The Spotify link you entered doesn't seem to work, did you perhaps copy too little or too much text?`,
          originalError: err,
        };
      }

      else if (err.status === 401) {
        if (config.debug === true) console.warn('Spotify access token missing or outdated');
        this.clearSpotifyAccessToken();
      }

      else if (err.status === 404) {
        if (config.debug === true) console.warn(`Spotify link points to non-existent content`);
        throw {
          reason: `The Spotify link you entered doesn't seem to work`,
          originalError: err,
        };
      }

      else {
        if (config.debug === true) console.error(err);
      }
    },

    setSpotifyUrlFromSearchParams () {
      this.spotifyUrl = new URL(window.location).searchParams.get('search') || '';
      this.doSearch();
    },

    enterUrl (url) {
      history.pushState(null, null, `/?search=${url}`);
      this.setSpotifyUrlFromSearchParams();
    },

    testDroppedData (event) {
      try {
        const possibleSpotifyUrl = event.dataTransfer.getData('text/uri-list');

        if (possibleSpotifyUrl) {
          this.enterUrl(possibleSpotifyUrl);
        }
      }

      finally {
        this.draggingOver = false;
      }
    },
  },

});
