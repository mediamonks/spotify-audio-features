export const ViewSearch = {

  template:  `<div class="view-search">
                <div class="track-container">
                  <section class="left"></section>

                  <section class="right">
                    <h1 class="title">Search results</h1>
                    <p class="subtitle" v-if="!trackIDs.length">Darn it, no results! <span class="link" @click="$store.dispatch('enterUrl', 'https://open.spotify.com/playlist/7wJs9bUc1AzRE8sO5AzVF4?si=GDah1EHHS8uzmVMWoYtA6Q');">This</span> could help to process your disappointment.</p>
                  </section>
                </div>

                <audio-features-overview v-if="trackIDs.length" :trackIDs="trackIDs"/>
              </div>`,

  computed: {
    trackIDs () {
      return this.$store.state.searchResults.map(result => result.id);
    },
  },

};