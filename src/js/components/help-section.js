export const HelpSection = {

  template:  `<div class="help-section">
                <button class="round" @click="toggleHelp">
                  <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111.577 111.577"><defs/>
                    <path d="M78.962 99.536l-1.559 6.373c-4.677 1.846-8.413 3.251-11.195 4.217-2.785.969-6.021 1.451-9.708 1.451-5.662 0-10.066-1.387-13.207-4.142-3.141-2.766-4.712-6.271-4.712-10.523 0-1.646.114-3.339.351-5.064.239-1.727.619-3.672 1.139-5.846l5.845-20.688c.52-1.981.962-3.858 1.316-5.633.359-1.764.532-3.387.532-4.848 0-2.642-.547-4.49-1.636-5.529-1.089-1.036-3.167-1.562-6.252-1.562-1.511 0-3.064.242-4.647.71-1.59.47-2.949.924-4.09 1.346l1.563-6.378c3.829-1.559 7.489-2.894 10.99-4.002 3.501-1.111 6.809-1.667 9.938-1.667 5.623 0 9.962 1.359 13.009 4.077 3.047 2.72 4.57 6.246 4.57 10.591 0 .899-.1 2.483-.315 4.747-.21 2.269-.601 4.348-1.171 6.239l-5.82 20.605c-.477 1.655-.906 3.547-1.279 5.676-.385 2.115-.569 3.731-.569 4.815 0 2.736.61 4.604 1.833 5.597 1.232.993 3.354 1.487 6.368 1.487 1.415 0 3.025-.251 4.814-.744 1.784-.493 3.085-.926 3.892-1.305zm1.476-86.506c0 3.59-1.353 6.656-4.072 9.177-2.712 2.53-5.98 3.796-9.803 3.796-3.835 0-7.111-1.266-9.854-3.796-2.738-2.522-4.11-5.587-4.11-9.177 0-3.583 1.372-6.654 4.11-9.207C59.447 1.274 62.729 0 66.563 0c3.822 0 7.091 1.277 9.803 3.823 2.721 2.553 4.072 5.625 4.072 9.207z"/>
                  </svg> -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <defs/>
                    <path d="M9 11H6c0-3 1.6-4 2.7-4.6.4-.2.7-.4.9-.6.5-.5.3-1.2.2-1.4-.3-.7-1-1.4-2.3-1.4C5.4 3 5 4.9 5 5.3l-3-.4C2.2 3.2 3.7 0 7.5 0c2.3 0 4.3 1.3 5.1 3.2.7 1.7.4 3.5-.8 4.7-.5.5-1.1.8-1.6 1.1-.9.5-1.2 1-1.2 2zM9.5 14a2 2 0 11-3.999.001A2 2 0 019.5 14z"/>
                  </svg>
                </button>
              </div>`,

  methods: {
    toggleHelp () {
      this.$modal.show(
        {
          template:  `<div>
                        <h3>Ehhh.. “Audio Features”?</h3>
                        <p>Spotify runs a suite of audio analysis algorithms on every track in their catalog. These extract about a dozen high-level acoustic attributes from the audio. Some of these are well-known musical features, like tempo and key. Others are more specialized, like speechiness or danceability.</p>
                        <p>Spotify lets you find recommendations based on a set of seed artists, tracks, genres, or a combination of all three, with a maximum of 5 items. Use the <strong>Collection</strong> button to collect input for a music search. If you like, you can even filter on audio features!</p>

                        <hr/>

                        <details>
                          <summary>Audio Features details</summary>
                          <h2>Audio Features details</h2>
                          <template v-for="audioFeature of $store.state.audioFeatures">
                            <h3>{{ audioFeature.name }}</h3>
                            <p>{{ audioFeature.description }}</p>
                          </template>
                        </details>

                        <details>
                          <summary>Workflow tips</summary>
                          <h2>Workflow tips</h2>
                          <p>Use the <copy-link-icon class="in-body-text"/> icons to copy links to Spotify content. You can paste these links into the Spotify application search bar to open them.</p>
                          <p>Save your search by clicking the <strong>Share</strong> button in the <strong>Collection</strong> panel. This copies a link that opens this tool with a pre-filled Collection.</p>
                          <p>Sort by audio feature by clicking the table headers. Clicking again flips the sort order and click once more to revert to the original sort order.</p>
                        </details>

                        <hr/>

                        <p class="special-thanks"><small>
                          Question mark icon made by <a href="https://www.flaticon.com/authors/vaadin" title="Vaadin">Vaadin</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a><br/>
                          Link icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                        </small></p>

                        <div class="modal-buttons">
                          <button @click="$emit('close')">{{ buttonText }}</button>
                        </div>
                      </div>`,

          data () {
            const buttonTexts =  ['Ah I see', 'Ok thanks!', 'Gotcha.', 'Riiight, cool'];

            return {
              buttonText: buttonTexts[Math.floor(Math.random() * buttonTexts.length)],
            };
          },
        },
        {},
        {
          scrollable: true,
          height: 'auto',
        },
      );
    },
  },

};