import Vue from '/node_modules/vue/dist/vue.esm.browser.js';
import Vuex from '/node_modules/vuex/dist/vuex.esm.browser.js';

import { config } from './config.js';

// Helpers
import { isValidUrl } from './helpers/valid-url.js';

Vue.use(Vuex);

export const store = new Vuex.Store({

  strict: true, // TODO: turn this off during the bundling process, this can have a big performance cost!

  state: {
    currentView: 'view-start',
    currentViewData: {},

    spotifyApi: new SpotifyWebApi(),
    spotifyAccessToken: '',

    spotifyUrl: '',

    searching: false,
    errored: false,
    errorMsg: '',

    fetchedContent: [],

    // Search by audio feature collection
    collection: [],
  },

  mutations: {
    setView (state, { view, data }) {
      state.currentView = view;
      state.currentViewData = data;
    },

    updateSpotifyUrl (state, newUrl) {
      state.spotifyUrl = newUrl;
    },

    setSpotifyUrlFromSearchParams (state) {
      state.spotifyUrl = new URL(window.location).searchParams.get('search') || '';
    },

    startSearch (state) {
      state.searching = true;
      state.errored = false;
      state.errorMsg = '';
    },

    endSearch (state) {
      state.errorMsg = '';
      state.errored = false;
      state.searching = false;
    },

    crashSearch (state, errorMsg) {
      state.errorMsg = errorMsg;
      state.errored = true;
      state.searching = false;
    },

    addToFetchedContent(state, newContent) {
      state.fetchedContent.push(...newContent);
    },

    addToCollection (state, { type, id }) {
      // TODO: Max 5 items
      state.collection.push({ type, id });
    },

    removeFromCollection (state, { type, id }) {
      const indexOfItemToDelete = state.collection.findIndex((item) => {
        return item.type === type && item.id === id;
      });

      state.collection.splice(indexOfItemToDelete, 1);
    },
  },

  actions: {
    async enterUrl ({ state, commit, dispatch }, url = state.spotifyUrl) {
      history.pushState(null, null, `/?search=${url}`);
      commit('setSpotifyUrlFromSearchParams');
      await dispatch('doSearch');
    },

    async doSearch ({ state, commit, dispatch }) {
      if (state.searching === true) return false;

      commit('startSearch');

      const { spotifyUrl } = state;

      if (spotifyUrl === '') {
        commit('setView', {
          view: 'view-start',
          data: {},
        });

        commit('endSearch');
        return;
      }

      if (!isValidUrl(spotifyUrl)) {
        commit('crashSearch', `A valid URL should look something like <a href="https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK" target="_blank">https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK</a>`);
        return;
      }

      const urlParsed = new URL(spotifyUrl);

      if (urlParsed.host !== 'open.spotify.com') {
        commit('crashSearch', `The link you entered could not be processed, it should look something like: <a href="https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK" target="_blank">https://open.spotify.com/track/2WjkOw9JVbvAdKKUaGs3OK</a>`);
        return;
      }

      const spotifyUrlSplit = urlParsed.pathname.slice(1).split('/');

      let contentType = spotifyUrlSplit[0],
          contentID = spotifyUrlSplit[1];

      try {
        switch (contentType) {
          case 'track':
            await dispatch('getTracks', { IDs: [contentID] });
            commit('setView', {
              view: 'view-track',
              data: {
                type: 'track',
                id: contentID,
              },
            });
            break;

          case 'user':
            // fall through only if is user/{uid}/playlist/{pid} format
            if (spotifyUrlSplit[2] === 'playlist') {
              contentType = spotifyUrlSplit[2]; // (will not re-execute switch)
              contentID = spotifyUrlSplit[3];
            }
            else {
              commit('crashSearch', `We can't process the type of Spotify link you entered yet, try entering a track, album or playlist`);
              return;
            }

          case 'playlist':
            await dispatch('getPlaylist', { ID: contentID });
            commit('setView', {
              view: 'view-playlist',
              data: {
                type: 'playlist',
                id: contentID,
              },
            });
            break;

          case 'album':
            await dispatch('getAlbum', { ID: contentID });
            commit('setView', {
              view: 'view-album',
              data: {
                type: 'album',
                id: contentID,
              },
            });
            break;

          default:
            commit('crashSearch', `We can't process the type of Spotify link you entered yet, try entering a track, album or playlist`);
            return;
        }
      }

      catch (err) {
        if (err.reason) {
          commit('crashSearch', err.reason);
          return;
        }

        else {
          if (config.debug === true) {
            console.error(err);
          }
        }
      }

      commit('endSearch');
    },

    async getTracks ({ state, commit, dispatch }, { IDs }) {
      const tracksData = [];

      try {
        // TODO: Don't fetch already fetched tracks again (find already present content with type 'track' and id is in IDs)
        const { tracks } = await state.spotifyApi.getTracks(IDs),
              { audio_features } = await state.spotifyApi.getAudioFeaturesForTracks(IDs);

        if (tracks.every(track => track === null)) {
          throw {
            status: 400,
            reason: `All entered track IDs are invalid. We throw this error ourselves, because we always use the "get several tracks" endpoint, which only returns null if objects are not found`,
          };
        }

        for (const trackID of IDs) {
          tracksData.push({
            id: trackID,
            type: 'track',
            trackInfo: tracks.find(track => track.id === trackID),
            audioFeatures: audio_features.find(track => track.id === trackID),
          });
        }
      }

      catch (err) {
        return dispatch('handleError', err);
      }

      commit('addToFetchedContent', tracksData);
    },

    async getPlaylist ({ state, commit, dispatch }, { ID }) {
      try {
        const playlist = await state.spotifyApi.getPlaylist(ID),
              playlistTracks = playlist.tracks.items.map(item => item.track),
              trackIDs = playlistTracks.map(track => track.id);

        commit('addToFetchedContent', [playlist]);
        await dispatch('getTracks', { IDs: trackIDs });

        // Warn if results are limited by Spotify API request restrictions
        if (playlist.tracks.total > playlist.tracks.limit) {
          alert(`Playlist has ${playlist.tracks.total} tracks, but the Spotify API limits us to getting data for ${playlist.tracks.limit} tracks per request. For simplicity, this tool will only get the first ${playlist.tracks.limit} items`);
        }
      }

      catch (err) {
        dispatch('handleError', err);
      }
    },

    async getAlbum ({ state, commit, dispatch }, { ID }) {
      try {
        const album = await state.spotifyApi.getAlbum(ID),
              albumTracks = album.tracks.items,
              trackIDs = albumTracks.map(track => track.id);

        commit('addToFetchedContent', [album]);
        await dispatch('getTracks', { IDs: trackIDs });

        // Warn if results are limited by Spotify API request restrictions
        if (album.tracks.total > album.tracks.limit) {
          alert(`Album has ${album.tracks.total} tracks, but the Spotify API limits us to getting data for ${album.tracks.limit} tracks per request. For simplicity, this tool will only get the first ${album.tracks.limit} items`);
        }
      }

      catch (err) {
        dispatch('handleError', err);
      }
    },

    // addAudioFeaturesData (targetObj, tracksData) {
    //   targetObj._audio_features = {};
    //   const tracksAudioFeatures = tracksData.filter(entry => entry.type === 'track').map(track => track.audioFeatures);

    //   for (const audioFeature of audioFeatures) {
    //     const values = tracksAudioFeatures.map(entry => entry[audioFeature.id]);

    //     targetObj._audio_features[audioFeature.id] = values;
    //   }
    // },

    handleError ({ dispatch }, err) {
      if (err.status === 400) {
        if (config.debug === true) console.warn(`Wrong Spotify link formatting (too long or too short)`);
        throw {
          reason: `The Spotify link you entered doesn't seem to work, did you perhaps copy too little or too much text?`,
          originalError: err,
        };
      }

      else if (err.status === 401) {
        if (config.debug === true) console.warn('Spotify access token missing or outdated');
        dispatch('clearSpotifyAccessToken');
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

    setup ({ state, commit }) {
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
          commit('updateSpotifyUrl', spotifyUrlToPrefill);
        }

        state.spotifyApi.setAccessToken(spotifyAccessToken);
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

    clearSpotifyAccessToken ({ state }) {
      // If url was already filled in, preverse and prefill next time
      if (state.spotifyUrl) {
        window.location.search = `?search=${state.spotifyUrl}`;
      }

      localStorage.removeItem(`${config.appID}_access_token`);
      window.location.reload();
    },
  },

});