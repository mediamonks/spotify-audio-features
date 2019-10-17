export const SpotifyAudioFeaturesMetrics = {

  props: [
    'inputData',
  ],

  template:  `<div class="spotify-audio-features-metrics">
                <h2>Stats</h2>
                <p class="clickable" @click="useMedian = !useMedian">Using {{ statType }}, click to switch to using {{ otherStatType }}</p>
                <spotify-audio-feature-metric
                  v-for="(audioFeatureData, audioFeatureID) of inputData"
                  :key="audioFeatureID"
                  :audioFeatureID="audioFeatureID"
                  :audioFeatureData="audioFeatureData"
                  :statType="statType"
                />
              </div>`,

  data () {
    return {
      useMedian: true,
    };
  },

  computed: {
    statType () {
      return this.useMedian ? 'median' : 'average';
    },

    otherStatType () {
      return this.useMedian ? 'average' : 'median';
    },
  },
  
};