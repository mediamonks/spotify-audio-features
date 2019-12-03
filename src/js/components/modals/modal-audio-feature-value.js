export const ModalAudioFeatureValue = {

  props: [
    'audioFeature',
    'value',
    'meaning',
  ],

  template:  `<div class="modal-audio-feature-value">
                <p>This track has a value of <strong>{{ value }}</strong> on <strong>{{ audioFeature.name }}</strong>, which means:</p>
                <blockquote><p>{{ meaning }}.</p></blockquote>

                <details>
                  <summary>What is “{{ audioFeature.name }}”?</summary>
                  <p>{{ audioFeature.description }}</p>
                </details>

                <div class="modal-buttons">
                  <button class="secondary" @click="$emit('close')">{{ buttonText }}</button>
                </div>
              </div>`,

  data () {
    const buttonTexts =  ['Oh sick', 'Cool', 'Nice', 'Awesome', 'Great, thanks'];

    return {
      buttonText: buttonTexts[Math.floor(Math.random() * buttonTexts.length)],
    };
  },

};