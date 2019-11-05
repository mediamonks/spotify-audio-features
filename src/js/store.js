import Vue from '/node_modules/vue/dist/vue.esm.browser.js';
import Vuex from '/node_modules/vuex/dist/vuex.esm.browser.js';

import { config } from './config.js';
import { log, warn, error } from './helpers/log.js';
import { audioFeatures } from './helpers/audio-features.js';

// Helpers
import { isValidUrl } from './helpers/valid-url.js';

Vue.use(Vuex);

const savedCollection = localStorage.getItem(`${config.appID}_collection`),
      savedCollectionAudioFeatures = localStorage.getItem(`${config.appID}_collection_audio_features`),
      collectionAudioFeaturesDefaults = audioFeatures.reduce((all, curr) => {
        return {
          ...all,
          [curr.id]: [0, 100],
        };
      }, {});

export const store = new Vuex.Store({

  strict: true, // TODO: turn this off during the bundling process, this can have a big performance cost!

  state: {
    setupComplete: false,

    // App view
    currentView: 'view-start',
    currentViewData: {},

    // Spotify
    spotifyApi: new SpotifyWebApi(),
    spotifyAccessToken: '',
    spotifyGetTracksLimit: 50,
    spotifyAvailableGenreSeeds: [],
    audioFeatures,

    // Search bar value
    spotifyUrl: '',

    // Searching state
    searching: false,
    errored: false,
    errorMsg: '',

    // All data fetched from Spotify API
    fetchedContent: [],
    fetchingContent: [],

    // Search by audio feature collection
    collection: savedCollection ? JSON.parse(savedCollection) : [],
    collectionAudioFeatures: savedCollectionAudioFeatures ? Object.assign(collectionAudioFeaturesDefaults, JSON.parse(savedCollectionAudioFeatures)) : collectionAudioFeaturesDefaults,
    collectionOpen: false,

    // Search results
    searchResults: {},

    // Playback state
    nowPlaying: null,
  },

  getters: {
    collectionTotalCount: state => state.collection.length,
    collectionArtists: state => state.collection.filter(item => item.type === 'artist'),
    collectionTracks: state => state.collection.filter(item => item.type === 'track'),
    collectionGenres: state => state.collection.filter(item => item.type === 'genre'),
  },

  mutations: {
    setSetupComplete (state, completeStatus) {
      state.setupComplete = completeStatus;
    },

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

    // TODO: FINISH
    // addToFetchingContent (state, newFetchingContent) {
    //   log('New fetching content:', newFetchingContent);
    //   state.fetchingContent.push(...newFetchingContent);
    // },

    // Adds newly fetched content or replaces content that has already been fetched before
    addToFetchedContent (state, newContent) {
      if (Array.isArray(newContent) === false) newContent = [newContent];

      log('Saved fetched content:', newContent);

      for (const newContentItem of newContent) {
        // Search state.fetchedContent for duplicate
        const index = state.fetchedContent.findIndex((fetchedContentItem) => {
          return (fetchedContentItem.id === newContentItem.id && fetchedContentItem.type === newContentItem.type);
        });

        // If content with same ID and same type exists in state.fetchedContent, replace item.
        // Previously, we didn't re-fetch albums and playlist, but now we do.
        if (index >= 0) {
          state.fetchedContent[index] = newContentItem;
          log(`Replaced data of ${newContentItem.type} with ID '${newContentItem.id}' with newer version`);
        }

        else {
          state.fetchedContent.push(newContentItem);
        }
      }
    },

    setAvailableGenreSeeds (state, availableGenreSeeds) {
      state.spotifyAvailableGenreSeeds = availableGenreSeeds;
    },

    toggleCollectionOpen (state) {
      state.collectionOpen = !state.collectionOpen;
    },

    setCollectionOpen (state, newOpenState) {
      state.collectionOpen = newOpenState;
    },

    addToCollection (state, { type, id }) {
      state.collection.push({ type, id });
      localStorage.setItem(`${config.appID}_collection`, JSON.stringify(state.collection));
    },

    removeFromCollection (state, { type, id }) {
      const indexOfItemToDelete = state.collection.findIndex((item) => {
        return item.type === type && item.id === id;
      });

      state.collection.splice(indexOfItemToDelete, 1);
      localStorage.setItem(`${config.appID}_collection`, JSON.stringify(state.collection));
    },

    updateCollectionAudioFeatureRange (state, { id, newRangeMin, newRangeMax }) {
      state.collectionAudioFeatures[id] = [newRangeMin, newRangeMax];
      localStorage.setItem(`${config.appID}_collection_audio_features`, JSON.stringify(state.collectionAudioFeatures));
    },

    setNowPlaying (state, trackID) {
      state.nowPlaying = trackID;
    },

    setSearchResults (state, results) {
      state.searchResults = results;
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
            await dispatch('getTracks', [contentID]);
            commit('setView', {
              view: 'view-track',
              data: {
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
            await dispatch('getPlaylist', contentID);
            commit('setView', {
              view: 'view-playlist',
              data: {
                id: contentID,
              },
            });
            break;

          case 'album':
            await dispatch('getAlbum', contentID);
            commit('setView', {
              view: 'view-album',
              data: {
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
          error(err);
        }
      }

      // Only runs if no errors occurred, which is exactly what we want
      commit('endSearch');
    },

    async getTracks ({ state, commit, dispatch }, trackIDs) {
      const fetchedContent = [];

      if (trackIDs.includes(null)) {
        error(`Array of trackIDs to fetch contains 'null' at least once, which probably means something went wrong prior to calling getTracks`);
      }

      // Don't fetch already fetched tracks again
      const tracksToFetchIDs = trackIDs.filter(trackID => (typeof state.fetchedContent.find(content => content.type === 'track' && content.id === trackID) === 'undefined'));

      // TODO: Decide if we'll use "fetchingContent", then clean this up
      // const tracksToFetchIDs = trackIDs.filter((trackID) => {
      //   const isInFetchedContent = (typeof state.fetchedContent.find(content => content.type === 'track' && content.id === trackID) !== 'undefined'),
      //         isInFetchingContent = (typeof state.fetchingContent.find(content => content.type === 'track' && content.id === trackID) !== 'undefined');

      //   return (isInFetchedContent === false && isInFetchingContent === false);
      // });

      // If everything is already fetched or fetching, skip the rest and just resolve
      // REVIEW: Should we resolve or await all fetching promises? If we have to await, we have to store the fetchingContent promises somewhere too!
      if (tracksToFetchIDs.length === 0) {
        return Promise.resolve();
      }

      // TODO: FINISH
      // commit('addToFetchingContent', tracksToFetchIDs.map(trackID => ({ type: 'track', id: trackID })));

      try {
        const { tracks: tracksData } = await state.spotifyApi.getTracks(tracksToFetchIDs),
              { audio_features } = await state.spotifyApi.getAudioFeaturesForTracks(tracksToFetchIDs);

        // Spotify API returns null if an object wasn't found
        if (tracksData.every(trackData => trackData === null)) {
          throw {
            status: 400,
            reason: `All entered track IDs are invalid. We throw this error ourselves, because we always use the "get several tracks" endpoint, which only returns null if objects are not found`,
          };
        }

        for (const trackID of tracksToFetchIDs) {
          const trackData = tracksData.find(track => track.id === trackID);

          // If Spotify API returned null, the object wasn't found and we shouldn't save it in our store
          if (trackData === null) continue;

          fetchedContent.push({
            id: trackID,
            type: 'track',
            trackData,
            audioFeatures: audio_features.find(track => track.id === trackID),
          });
        }
      }

      catch (err) {
        await dispatch('handleError', err);
      }

      commit('addToFetchedContent', fetchedContent);
    },

    async getPlaylist ({ state, commit, dispatch }, playlistID) {
      try {
        const playlist = await state.spotifyApi.getPlaylist(playlistID),
              playlistTracks = playlist.tracks.items.filter(item => item.is_local !== true).map(item => item.track),
              trackIDs = playlistTracks.map(track => track.id);

        commit('addToFetchedContent', playlist);

        // Warn if results are limited by Spotify API request restrictions
        // if (playlist.tracks.total > state.spotifyGetTracksLimit) {
        //   alert(`This playlist contains ${playlist.tracks.total} tracks, but the Spotify API limits us to getting data for ${state.spotifyGetTracksLimit} tracks per request. For now, this tool will only get the first ${state.spotifyGetTracksLimit} items`);
        // }

        await dispatch('getTracks', trackIDs.slice(0, state.spotifyGetTracksLimit));
      }

      catch (err) {
        await dispatch('handleError', err);
      }
    },

    async getAlbum ({ state, commit, dispatch }, albumID) {
      try {
        const album = await state.spotifyApi.getAlbum(albumID),
              albumTracks = album.tracks.items,
              trackIDs = albumTracks.map(track => track.id);

        commit('addToFetchedContent', album);

        // Warn if results are limited by Spotify API request restrictions
        if (album.tracks.total > state.spotifyGetTracksLimit) {
          alert(`This album contains ${album.tracks.total} tracks, but the Spotify API limits us to getting data for ${state.spotifyGetTracksLimit} tracks per request. For now, this tool will only get the first ${state.spotifyGetTracksLimit} items`);
        }

        await dispatch('getTracks', trackIDs.slice(0, state.spotifyGetTracksLimit));
      }

      catch (err) {
        await dispatch('handleError', err);
      }
    },

    async getAvailableGenreSeeds ({ state, commit, dispatch }) {
      try {
        const { genres } = await state.spotifyApi.getAvailableGenreSeeds();
        commit('setAvailableGenreSeeds', genres);
      }

      catch (err) {
        await dispatch('handleError', err);
      }
    },

    async getRecommendations ({ state, getters, commit, dispatch }) {
      const seedArtists = getters.collectionArtists.map(artist => artist.id),
            seedTracks = getters.collectionTracks.map(track => track.id),
            seedGenres = getters.collectionGenres.map(genre => genre.id),
            recommendationsOptions = {
              limit: 100,
              ...seedArtists.length && { seed_artists: seedArtists },
              ...seedTracks.length && { seed_tracks: seedTracks },
              ...seedGenres.length && { seed_genres: seedGenres },
            };

      for (const audioFeature of state.audioFeatures) {
        const audioFeatureRange = state.collectionAudioFeatures[audioFeature.id],
              [rangeMin, rangeMax] = audioFeatureRange;

        recommendationsOptions[`min_${audioFeature.id}`] = rangeMin/100;
        recommendationsOptions[`max_${audioFeature.id}`] = rangeMax/100;
      }

      try {
        const { tracks: recommendations } = await state.spotifyApi.getRecommendations(recommendationsOptions);
        commit('setSearchResults', recommendations);
        commit('setView', {
          view: 'view-search',
          data: {},
        });

        await dispatch('getTracks', recommendations.map(result => result.id));
      }

      catch (err) {
        await dispatch('handleError', err);
      }
    },

    async handleError ({ dispatch }, err) {
      if (err.status === 400) {
        warn(`Wrong Spotify link formatting (too long or too short)`);
        return Promise.reject({
          reason: `The Spotify link you entered doesn't seem to work, did you perhaps copy too little or too much text?`,
          originalError: err,
        });
      }

      else if (err.status === 401) {
        warn('Spotify access token missing or outdated');
        dispatch('clearSpotifyAccessToken');
      }

      else if (err.status === 404) {
        warn(`Spotify link points to non-existent content`);
        return Promise.reject({
          reason: `The Spotify link you entered doesn't seem to work`,
          originalError: err,
        });
      }

      else {
        if (err.reason && err.originalError) {
          // HACK: Right now, in some situations, you'll get an error thrown by this function back inside this function, which is probably super wrong, but for now this is a quickfix.
          return Promise.reject(err);
        }

        error(err);
      }
    },

    async setup ({ state, commit, dispatch }) {
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
        commit('setSetupComplete', true);

        // Get available genres, but don't wait for it to finish.
        dispatch('getAvailableGenreSeeds');
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

    async clearSpotifyAccessToken ({ state }) {
      // If url was already filled in, preverse and prefill next time
      if (state.spotifyUrl) {
        window.location.search = `?search=${state.spotifyUrl}`;
      }

      localStorage.removeItem(`${config.appID}_access_token`);
      window.location.reload();
    },
  },

});