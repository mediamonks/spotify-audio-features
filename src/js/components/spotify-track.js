import { AudioFeatureValue } from '../mixins/audio-feature-value.js';

export const SpotifyTrack = {

  props: [
    'trackID',
  ],

  mixins: [
    AudioFeatureValue,
  ],

  template:  `<tr
                class="spotify-track"
              >
                <th
                  scope="col"
                  class="left"
                  :class="{
                    'clickable': hasAudioPreview,
                    'playing-preview': playingAudioPreview,
                  }"
                  @click="togglePlayIfHasAudioPreview"
                >
                  <audio
                    ref="player"
                    preload="none"
                    v-if="hasAudioPreview"
                    :src="track.trackData.preview_url"
                    style="visibilty: hidden;"
                    @ended="playingAudioPreview = false"
                  ></audio>

                  <svg class="icon-play" viewBox="0 0 85 100" v-if="hasAudioPreview && playingAudioPreview === false">
                    <path fill="currentColor" d="M81 44.6c5 3 5 7.8 0 10.8L9 98.7c-5 3-9 .7-9-5V6.3c0-5.7 4-8 9-5l72 43.3z">
                      <title>Play</title>
                    </path>
                  </svg>

                  <svg class="icon-pause" viewBox="0 0 60 100" v-if="hasAudioPreview && playingAudioPreview === true">
                    <path fill="currentColor" d="M0 8c0-5 3-8 8-8s9 3 9 8v84c0 5-4 8-9 8s-8-3-8-8V8zm43 0c0-5 3-8 8-8s8 3 8 8v84c0 5-3 8-8 8s-8-3-8-8V8z">
                      <title>Pause</title>
                    </path>
                  </svg>

                  <img class="cover" :src="coverImage" v-if="coverImage"/>
                  <div class="song">
                    <h3 class="title">{{ track.trackData.name }}</h3>
                    <h5 class="artists">{{ $listFormatter.format(track.trackData.artists.map(artist => artist.name)) }}</h5>
                  </div>
                  <span
                    class="plus clickable"
                    :class="{ 'added': isInCollection }"
                    @click.stop="toggleInCollection"
                  ></span>
                </th>

                <td
                  v-for="audioFeature in $store.state.audioFeatures"
                  class="audio-feature-value clickable"
                  @click="showDetails(audioFeature)"
                >
                  <span :style="getPercentageStyles(getAudioFeatureValue(audioFeature))">{{ getAudioFeatureRoundedValue(audioFeature) }}%</span>
                </td>
              </tr>`,

  computed: {
    track () {
      return this.$store.state.fetchedContent.find((content) => {
        return content.type === 'track' && content.id === this.trackID;
      });
    },

    coverImage () {
      try {
        const albumArt = this.track.trackData.album.images[2].url;
        return albumArt;
      }

      catch (err) {
        return null;
      }
    },

    hasAudioPreview () {
      return !!this.track.trackData.preview_url;
    },

    isInCollection () {
      return !!this.$store.state.collection.find(item => {
        return item.type === 'track' && item.id === this.trackID;
      });
    },

    playingAudioPreview: {
      get () {
        return this.$store.state.nowPlaying === this.trackID;
      },
      set (value) {
        this.$store.commit('setNowPlaying', (value === true) ? this.trackID : null);
      },
    },
  },

  watch: {
    playingAudioPreview (newVal) {
      if (newVal === true) {
        this.$refs.player.play();
      }

      else {
        this.$refs.player.pause();
        this.$refs.player.currentTime = 0;
      }
    },
  },

  methods: {
    getAudioFeatureValue (audioFeature) {
      return this.track.audioFeatures[audioFeature.id];
    },

    getAudioFeatureRoundedValue (audioFeature) {
      // return (Math.round(this.getAudioFeatureValue(audioFeature) * 1000) / 10);
      return Math.round(this.getAudioFeatureValue(audioFeature) * 100);
    },

    showDetails (audioFeature) {
      const value = this.getAudioFeatureValue(audioFeature),
            meaning = this.getValueMeaning(audioFeature, value);

      alert(`This track scores ${this.getAudioFeatureRoundedValue(audioFeature)}% on ${audioFeature.id}, which means:\n` +
            `${meaning}\n\n` +
            `${audioFeature.name}:\n${audioFeature.description}`);
    },

    togglePlayIfHasAudioPreview () {
      if (this.hasAudioPreview === true) {
        this.playingAudioPreview = !this.playingAudioPreview;
      }
    },

    toggleInCollection () {
      if (this.isInCollection === true) {
        this.$store.commit('removeFromCollection', {
          type: 'track',
          id: this.trackID,
        });
      }

      else {
        this.$store.commit('addToCollection', {
          type: 'track',
          id: this.trackID,
        });
      }
    },
  },

};