import { audioFeatures } from '../helpers/audio-features.js';
import { AudioFeatureValue } from '../mixins/audio-feature-value.js';

export const SpotifyTrack = {

  props: [
    'contentData',
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
                  :src="contentData.trackInfo.preview_url"
                  style="visibilty: hidden;"
                  @play="playingAudioPreview = true"
                  @pause="playingAudioPreview = false"
                  @ended="playingAudioPreview = false"
                ></audio>

                <section class="left" @click="hasAudioPreview && playPause()">
                  <img class="cover" :src="coverImage" v-if="coverImage"/>
                  <div class="song">
                    <h3 class="title">{{ contentData.trackInfo.name }}</h3>
                    <h5 class="artists">{{ contentData.trackInfo.artists.map(artist => artist.name).join(', ') }}</h5>
                  </div>
                  <span class="plus clickable" @click.stop="addToInputForSearch"></span>
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
    coverImage () {
      try {
        const albumArt = this.contentData.trackInfo.album.images[2].url;
        return albumArt;
      }

      catch (err) {
        return null;
      }
    },

    hasAudioPreview () {
      return !!this.contentData.trackInfo.preview_url;
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
      return this.contentData.audioFeatures[audioFeature.id];
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

    addToInputForSearch () {
      console.log(this);
    },
  },

};