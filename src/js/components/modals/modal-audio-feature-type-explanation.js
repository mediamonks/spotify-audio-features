import { buttonTextsSurprised, getRandomButtonText } from '../../helpers/button-texts.js';

export const ModalAudioFeatureTypeExplanation = {

  props: [
    'audioFeature',
  ],

  template:  `<div>
                <audio-features-type-explanation :audioFeature="audioFeature"/>

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