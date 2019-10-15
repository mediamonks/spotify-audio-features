export const AudioFeatureValue = {

  data () {
    return {
      minOpacity: 0.3,
      maxOpacity: 1,
    };
  },

  methods: {
    getMessage (audioFeature, value) {
      let message;
      if (value < audioFeature.minLimit) {
        message = audioFeature.minText;
      }
      else if (value > audioFeature.maxLimit) {
        message = audioFeature.maxText;
      }
      else {
        message = audioFeature.midText;
      }

      return message;
    },

    getStyles (audioFeatureValue) {
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