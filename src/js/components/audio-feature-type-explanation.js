export const AudioFeatureTypeExplanation = {

  props: [
    'audioFeature',
  ],

  template:  `<div class="audio-feature-type-explanation">
                <h3>{{ audioFeature.name }}<template v-if="audioFeature.name !== audioFeature.originalName"> (originally called “{{ audioFeature.originalName }}”)</template></h3>
                <p>{{ audioFeature.description }}</p>
              </div>`,

};