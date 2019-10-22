import { audioFeatures } from '../helpers/audio-features.js';
import { AudioFeatureValue } from '../mixins/audio-feature-value.js';

export const AudioFeatureMetric = {

  props: [
    'audioFeatureID',
    'audioFeatureData',
    'statType',
  ],

  mixins: [
    AudioFeatureValue,
  ],

  template:  `<p class="audio-feature-metric">
                <strong class="audio-feature-type">{{ audioFeature.name }}</strong>
                <span
                  class="average-value"
                  :style="percentageStyles"
                >{{ percentageDisplay }} ({{ percentageDescription }})</span>
              </p>`,

  data () {
    return {
      audioFeatures,
    };
  },

  computed: {
    audioFeature () {
      return this.audioFeatures.find(audioFeature => audioFeature.id === this.audioFeatureID);
    },

    average () {
      const values = this.audioFeatureData,
            valuesAmount = values.length,
            sum = values.reduce((total, curr) => total + curr, 0),
            average = sum/valuesAmount;

      return average;
    },

    median () {
      const values = this.audioFeatureData,
            valuesAmount = values.length,
            oddOrEven = (valuesAmount % 2 === 0) ? 'even' : 'odd',
            valuesSorted = values.sort((a, b) => a - b);

      switch (oddOrEven) {
        case 'odd':
          return valuesSorted[((valuesAmount + 1) / 2) - 1];
        case 'even':
          const value1 = valuesSorted[valuesAmount / 2 - 1],
                value2 = valuesSorted[valuesAmount / 2];
          return (value1 + value2) / 2;
      }
    },

    percentage () {
      return this[this.statType];
    },

    percentageDisplay () {
      // return (Math.round(this.percentage * 1000) / 10) + '%';
      return Math.round(this.percentage * 100) + '%';
    },

    percentageStyles () {
      return this.getPercentageStyles(this.percentage, this.audioFeatureData);
    },

    percentageDescription () {
      return this.getMessage(this.audioFeature, this.percentage)
    },
  },

}