export const ModalShareCollection = {

  name: 'ModalShareCollection',

  props: [
    'shareLink',
  ],

  template:  `<div>
                <h3>Share collection</h3>
                <p>Share or save your search by copying the link below, that opens this tool with a pre-filled <strong>Collection</strong>.</p>

                <div class="copy-share-link">
                  <input
                    type="url"
                    class="small"
                    placeholder="Enter or drag and drop Spotify link here"
                    :value="shareLink"
                  />

                  <button
                    @click="copyShareLink"
                    class="small"
                  >
                    <icon-copy-link
                      ref="copyLinkIcon"
                      :link="shareLink"
                      :animated="false"
                      @copied="$emit('close')"
                    />Copy share link</span>
                  </button>
                </div>

                <div class="modal-buttons">
                  <button class="secondary" @click="$emit('close')">{{ buttonText }}</button>
                </div>

                <icon-close @close="$emit('close')"/>
              </div>`,

  data () {
    const buttonTexts =  ['Never mind', 'No thanks', 'I changed my mind'];

    return {
      buttonText: buttonTexts[Math.floor(Math.random() * buttonTexts.length)],
    };
  },

  methods: {
    copyShareLink () {
      // Not super koscher, but whatever
      this.$refs.copyLinkIcon.copyLink();
    },
  },

};