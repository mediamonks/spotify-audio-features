import { buttonTextsSurprised, getRandomButtonText } from '../../helpers/button-texts.js';

export const ModalAudioFeatureValue = {

  props: [
    'audioFeature',
    'value',
    'meaning',
  ],

  template:  `<div>
                <p>This track has a value of <strong>{{ value }}</strong> on <strong>{{ audioFeature.name }}</strong>, which means:</p>
                <blockquote><p>{{ meaning }}.</p></blockquote>

                <hr/>

                <details>
                  <summary>What is “{{ audioFeature.name }}”?</summary>
                  <audio-features-type-explanation :audioFeature="audioFeature"/>
                </details>

                <div class="modal-buttons">
                  <button @click="$emit('close')">{{ buttonText }}</button>
                </div>

                <icon-close @close="$emit('close')"/>
              </div>`,

  data () {
    return {
      buttonText: getRandomButtonText(buttonTextsSurprised),
    };
  },

};