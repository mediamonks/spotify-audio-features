import { buttonTextsUnderstanding, getRandomButtonText } from '../../helpers/button-texts.js';

export const ModalHelpSection = {

  name: 'ModalHelpSection',

  template:  `<div>
                <h3>Ehhh.. “Audio Features”?</h3>
                <p>Spotify runs a suite of audio analysis algorithms on every track in their catalog. These extract about a dozen high-level acoustic attributes from the audio. Some of these are well-known musical features, like tempo and key. Others are more specialized, like speechiness or danceability.</p>
                <p>Spotify lets you find recommendations based on a set of seed artists, tracks, genres, or a combination of all three, with a maximum of 5 items. Use the <strong>Collection</strong> button to collect input for a music search. If you like, you can even filter on audio features!</p>

                <hr/>

                <details>
                  <summary>The different kinds of Audio Features explained</summary>
                  <h2>The different kinds of Audio Features explained</h2>
                  <audio-features-type-explanation
                    v-for="audioFeature of $store.state.audioFeatures"
                    :key="audioFeature.id"
                    :audioFeature="audioFeature"
                  />
                </details>

                <details>
                  <summary>Workflow tips</summary>
                  <h2>Workflow tips</h2>
                  <ul>
                    <li>Not satisfied with search results? Smash that search button again! When Spotify finds enough recommendations, it will return a random selection every time.</li>
                    <li>Save your search by clicking the <strong>Share</strong> button in the <strong>Collection</strong> panel. This opens a modal where you can copy a link that opens this tool with a pre-filled Collection. Note this will save the search itself, not the actual results (see point above).</li>
                    <li>Sort by audio feature by clicking the table headers. Click again to flip the sort order and click once more to revert to the original sort order.</li>
                    <li>Use the <icon-copy-link class="in-body-text"/> icons to copy links to Spotify content. You can paste these links into the Spotify application search bar to open them.</li>
                    <li>If some tracks don't have a <icon-play class="in-body-text"/> button, that's most likely because their artists have turned off previews for those tracks.</li>
                  </ul>
                </details>

                <details>
                  <summary>Requesting a feature</summary>
                  <h2>Requesting a feature</h2>
                  <p>To submit feature requests, please submit an issue on <a href="https://github.com/Anoesj/spotify-audio-features/issues">this tool's GitHub repository</a></p>
                </details>

                <hr/>

                <p class="special-thanks"><small>
                  Question mark icon made by <a href="https://www.flaticon.com/authors/vaadin" title="Vaadin">Vaadin</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a><br/>
                  Link icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </small></p>

                <div class="modal-buttons">
                  <button @click="$emit('close')">{{ buttonText }}</button>
                </div>

                <icon-close @close="$emit('close')"/>
              </div>`,

  data () {
    return {
      buttonText: getRandomButtonText(buttonTextsUnderstanding),
    };
  },

};