export const SpotifyAudioFeaturesMetrics = {

  props: [
    'inputData',
  ],

  template:  `<div class="spotify-audio-features-metrics">
                <h2>Stats</h2>
                <spotify-audio-feature-metric
                  v-for="(audioFeatureData, audioFeatureID) of inputData"
                  :key="audioFeatureID"
                  :audioFeatureID="audioFeatureID"
                  :audioFeatureData="audioFeatureData"
                />
              </div>`,
  
};