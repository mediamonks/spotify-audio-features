import { audioFeatures } from '../helpers/audio-features.js';
import { AudioFeatureValue } from '../mixins/audio-feature-value.js';

export const SpotifyTrack = {

  props: [
    'trackID',
  ],

  mixins: [
    AudioFeatureValue,
  ],

  template:  `<div
                class="spotify-track"
                :class="{
                  'preview-available': hasAudioPreview,
                  'playing-preview': playingAudioPreview,
                }"
              >
                <audio
                  ref="player"
                  preload="none"
                  v-if="hasAudioPreview"
                  :src="trackData.trackInfo.preview_url"
                  style="visibilty: hidden;"
                  @play="playingAudioPreview = true"
                  @pause="playingAudioPreview = false"
                  @ended="playingAudioPreview = false"
                ></audio>

                <section class="left" @click="hasAudioPreview && playPause()">
                  <img class="cover" :src="coverImage" v-if="coverImage"/>
                  <div class="song">
                    <h3 class="title">{{ trackData.trackInfo.name }}</h3>
                    <h5 class="artists">{{ trackData.trackInfo.artists.map(artist => artist.name).join(', ') }}</h5>
                  </div>
                  <span
                    class="plus clickable"
                    :class="{
                      'added': isInSearchByAudioFeatureCollection,
                    }"
                    @click.stop="isInSearchByAudioFeatureCollection ? removeFromSearchByAudioFeatureCollection() : addToSearchByAudioFeatureCollection()"
                  ></span>
                </section>

                <section class="right">
                  <template v-for="audioFeature in audioFeatures">
                    <div class="audio-feature clickable" @click="showDetails(audioFeature)">
                      <span :style="getPercentageStyles(getAudioFeatureValue(audioFeature))">{{ getAudioFeatureRoundedValue(audioFeature) }}%</span>
                    </div>
                  </template>
                </section>
              </div>`,

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

    isInSearchByAudioFeatureCollection () {
      return !!this.$store.state.searchByAudioFeatureCollection.find(item => {
        return item.type === 'track' && item.id === this.trackID;
      });
    },
  },

  data () {
    return {
      audioFeatures,
      playingAudioPreview: false,
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

    playPause () {
      if (this.playingAudioPreview === false) {
        this.$refs.player.play();
      }

      else {
        this.$refs.player.pause();
        this.$refs.player.currentTime = 0;
      }
    },

    addToSearchByAudioFeatureCollection () {
      this.$store.commit('addToSearchByAudioFeatureCollection', {
        type: 'track',
        id: this.trackID,
      });
    },

    removeFromSearchByAudioFeatureCollection () {
      this.$store.commit('removeFromSearchByAudioFeatureCollection', {
        type: 'track',
        id: this.trackID,
      });
    },
  },

};