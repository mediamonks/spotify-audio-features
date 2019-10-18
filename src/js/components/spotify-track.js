import { audioFeatures } from '../helpers/audio-features.js';
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
                    :src="trackData.trackInfo.preview_url"
                    style="visibilty: hidden;"
                    @ended="playingAudioPreview = false"
                  ></audio>

                  <img class="cover" :src="coverImage" v-if="coverImage"/>
                  <div class="song">
                    <h3 class="title">{{ trackData.trackInfo.name }}</h3>
                    <h5 class="artists">{{ trackData.trackInfo.artists.map(artist => artist.name).join(', ') }}</h5>
                  </div>
                  <span
                    class="plus clickable"
                    :class="{ 'added': isInCollection }"
                    @click.stop="toggleInCollection"
                  ></span>
                </th>

                <!-- <section class="right"> -->
                  <td
                    v-for="audioFeature in audioFeatures"
                    class="audio-feature-value clickable"
                    @click="showDetails(audioFeature)"
                  >
                    <span :style="getPercentageStyles(getAudioFeatureValue(audioFeature))">{{ getAudioFeatureRoundedValue(audioFeature) }}%</span>
                  </td>
                <!-- </section> -->
              </tr>`,

  computed: {
    trackData () {
      return this.$store.state.fetchedContent.find((content) => {
        return content.type === 'track' && content.id === this.trackID;
      });
    },

    coverImage () {
      try {
        const albumArt = this.trackData.trackInfo.album.images[2].url;
        return albumArt;
      }

      catch (err) {
        return null;
      }
    },

    hasAudioPreview () {
      return !!this.trackData.trackInfo.preview_url;
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

  data () {
    return {
      audioFeatures,
    };
  },

  methods: {
    getAudioFeatureValue (audioFeature) {
      return this.trackData.audioFeatures[audioFeature.id];
    },

    getAudioFeatureRoundedValue (audioFeature) {
      return Math.round(this.getAudioFeatureValue(audioFeature) * 100);
    },

    showDetails (audioFeature) {
      const value = this.getAudioFeatureValue(audioFeature),
            message = this.getMessage(audioFeature, value);

      alert(`This track scores ${this.getAudioFeatureRoundedValue(audioFeature)}% on ${audioFeature.id}, which means:\n` +
            `${message}\n\n` +
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