// TODO: Temporary markup, rewrite!
export const ViewSearch = {

  template:  `<section class="view-search">
                <div class="track-container">
                  <section class="left"></section>

                  <section class="right">
                    <h1 class="title">Search results</h1>
                    <p class="subtitle" v-if="!trackIDs.length">Darn it, no results! Need <a href="#" @click.prevent="$store.dispatch('enterUrl', 'https://open.spotify.com/playlist/7wJs9bUc1AzRE8sO5AzVF4?si=GDah1EHHS8uzmVMWoYtA6Q');">some songs</a> to process your grief?</p>
                  </section>
                </div>

                <audio-features-overview v-if="trackIDs.length" :trackIDs="trackIDs"/>
              </section>`,

  computed: {
    trackIDs () {
      return this.$store.state.searchResults.map(result => result.id);
    },
  },

};