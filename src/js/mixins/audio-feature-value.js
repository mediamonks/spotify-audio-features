export const AudioFeatureValue = {

  data () {
    return {
      minOpacity: 0.3,
      maxOpacity: 1,
    };
  },

  methods: {
    getValueMeaning (audioFeature, value) {
      const {
        minLimit,
        maxLimit,
        minText,
        maxText,
        midText,
      } = audioFeature;

      // < min
      if (value < minLimit) {
        return minText;
      }

      // > max
      else if (value > maxLimit) {
        return maxText;
      }

      // in between
      else if (value >= minLimit && value <= maxLimit) {
        return midText;
      }

      // Should never happen, but if the stats get rendered and a metric results in NaN for some reason, this will prevent some textual bugs.
      else {
        return null;
      }
    },

    getPercentageStyles (audioFeatureValue) {
      const opacity = this.minOpacity + (this.maxOpacity - this.minOpacity) * audioFeatureValue;

      let fontWeight;

      if (audioFeatureValue < 0.3) {
        fontWeight = 300;
      }
      else if (audioFeatureValue > 0.9) {
        fontWeight = 900;
      }
      else {
        fontWeight = 400;
      }

      return {
        'opacity': opacity,
        'font-weight': fontWeight,
        'text-decoration': audioFeatureValue > 0.9 ? 'underline' : 'normal',
      };
    },
  },

};