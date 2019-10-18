import { audioFeatures } from '../helpers/audio-features.js';

export const AudioFeaturesHeader = {

  props: [
    'contentData',
  ],

  template:  `<tr class="audio-features-header">
                <th scope="row"></th>
                <th scope="row" class="audio-feature-type" v-for="audioFeature of audioFeatures">
                  <strong :title="audioFeature.description">{{ audioFeature.name }}</strong>
                </th>
              </tr>`,

  data () {
    return {
      audioFeatures,
    };
  },

};