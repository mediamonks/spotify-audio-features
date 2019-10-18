import { audioFeatures } from '../helpers/audio-features.js';

export const AudioFeaturesHeader = {

  props: [
    'contentData',
  ],

  template:  `<div class="audio-features-header">
                <template v-for="audioFeature of audioFeatures">
                  <strong class="audio-feature-type" :title="audioFeature.description">{{ audioFeature.name }}</strong>
                </template>
              </div>`,

  data () {
    return {
      audioFeatures,
    };
  },

};