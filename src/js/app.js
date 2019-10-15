// ESM imports
import { config } from './config.js';
import Vue from '/node_modules/vue/dist/vue.esm.browser.js';

// Components
import { LoadingSpinner } from './components/loading-spinner.js';
import { SpotifyTrack } from './components/spotify-track.js';
import { SpotifyPlaylist } from './components/spotify-playlist.js';
import { SpotifyAlbum } from './components/spotify-album.js';
import { SpotifyAudioFeaturesHeader } from './components/spotify-audio-features-header.js';
import { SpotifyAudioFeaturesMetrics } from './components/spotify-audio-features-metrics.js';

// Helpers
import { audioFeatures } from './helpers/audio-features.js';

Vue.component('loading-spinner', LoadingSpinner);
Vue.component('spotify-track', SpotifyTrack);
Vue.component('spotify-playlist', SpotifyPlaylist);
Vue.component('spotify-album', SpotifyAlbum);
Vue.component('spotify-audio-features-header', SpotifyAudioFeaturesHeader);
Vue.component('spotify-audio-features-metrics', SpotifyAudioFeaturesMetrics);

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

                <div v-if="config.debug === true" class="test-links">
                  <button class="small" @click="testUrl('https://open.spotify.com/track/2BndJYJQ17UcEeUFJP5JmY?si=8B72iVW6RHK0VgK_MB7iIw')">Test track</button>
                  <button class="small" @click="testUrl('https://open.spotify.com/playlist/5SYLNmW407gyhDSUYarXYL?si=MOLFV-nQSoKZoMkFBVT16A')">Test playlist (short)</button>
                  <button class="small" @click="testUrl('https://open.spotify.com/playlist/1DTzz7Nh2rJBnyFbjsH1Mh?si=Fq7UiYYSSlu8w3xkahw7TQ')">Test playlist (long)</button>
                  <button class="small" @click="testUrl('https://open.spotify.com/album/3gxOtUSRzweDWBKlpj7cG6?si=UGP0jnOFTmyzHZ1BvH7fEA')">Test album</button>
                </div>

                <div class="results-panel">
                  <loading-spinner v-if="searching"/>
                  <p v-if="errored">The link you entered could not be processed, it should look something like: <a href="https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK" target="_blank">https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK</a></p>

                  <template v-if="searching === false && errored === false">
                    <component
                      :is="'spotify-' + data.type"
                      v-for="(data) of displayedData"
                      :key="data.id"
                      :contentData="data"
                    />
                  </template>
                </div>

                <p class="subscript"><small>Broken? <a @click="clearSpotifyAccessToken" href="#">Refresh Spotify access token</a></small></p>
              </div>`,

  data () {
    const spotifyApi = new SpotifyWebApi(),
          spotifyAccessToken = this.getSpotifyAccessToken();

    spotifyApi.setAccessToken(spotifyAccessToken);

    return {
      config,
      spotifyApi,
      
      spotifyUrl: '',

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

      switch (type) {
        case 'track':
          const trackID = id;
          await this.getTracks([trackID]);
          break;
        case 'playlist':
          const playlistID = id;
          await this.getPlaylist(playlistID);
          break;
        case 'album':
          const albumID = id;
          await this.getAlbum(albumID);
          break;
        default:
          return this.stopSearch(true);
      }

      this.stopSearch(false);
    },

    stopSearch (errored = false) {
      this.searching = false;
      this.errored = errored;
    },

    async getTracks (trackIDs, alreadyAvailableData = {}, returnValue = false) {
      const tracksData = [];

      try {
        const { tracks } = ('tracks' in alreadyAvailableData) ? alreadyAvailableData : await this.spotifyApi.getTracks(trackIDs),
              { audio_features } = ('audio_features' in alreadyAvailableData) ? alreadyAvailableData : await this.spotifyApi.getAudioFeaturesForTracks(trackIDs);

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
        this.checkError(err);
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
        // targetObj._audio_features[audioFeature.id] = {
        //   values,
        //   valuesAmount,
        //   sum,
        //   average,
        // };
      }
    },

    checkError (err) {
      if (err.status === 401) {
        if (config.debug === true) console.warn('Spotify access token missing or outdated');
        this.clearSpotifyAccessToken();
      }

      else {
        if (config.debug === true) console.error(err);
      }
    },

    testUrl (url) {
      this.spotifyUrl = url;
      this.search();
    },
  },

});