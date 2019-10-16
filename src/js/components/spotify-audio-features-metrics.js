import { audioFeatures } from '../helpers/audio-features.js';
import { AudioFeatureValue } from '../mixins/audio-feature-value.js';

export const SpotifyAudioFeaturesMetrics = {

  props: [
    'inputData',
  ],

  mixins: [
    AudioFeatureValue,
  ],

  template:  `<div class="spotify-audio-features-metrics">
                <h2>Stats</h2>
                <template v-for="(audioFeatureData, audioFeatureID) of inputData">
                  <p class="audio-feature-stat">
                    <strong class="audio-feature">{{ getAudioFeature(audioFeatureID).name }}</strong> – <span class="average-value" :style="getStyles(getAverage(audioFeatureData))">{{ Math.round(getAverage(audioFeatureData) * 1000) / 10 }}% ({{ getMessage(getAudioFeature(audioFeatureID), getAverage(audioFeatureData)) }})</span>
                  </p>
                </template>
              </div>`,

  data () {
    return {
      audioFeatures,
    };
  },

  methods: {
    getAudioFeature (audioFeatureID) {
      return this.audioFeatures.find(audioFeature => audioFeature.id === audioFeatureID);
    },

    getAverage (audioFeatureData) {
      const values = audioFeatureData,
            valuesAmount = values.length,
            sum = values.reduce((total, curr) => total + curr, 0),
            average = sum/valuesAmount;
      return average;
    },
  },
  
}