// TODO: Temporary markup, rewrite!
export const ViewSearch = {

  template:  `<section class="view-search">
                <!-- <audio-features-overview :trackIDs="$store.state.searchResults.map(result => result.id)"/> -->
                <table class="audio-features-overview">
                  <!-- <thead>
                    <tr class="audio-features-overview-header">
                      <th scope="row" class="left"></th>
                      <th
                        scope="row"
                        class="audio-feature-type"
                        v-for="audioFeature of $store.state.audioFeatures"
                      >
                        <strong :title="audioFeature.description">{{ audioFeature.name }}</strong>
                      </th>
                    </tr>
                  </thead> -->
                  <tbody>
                    <template v-for="searchResult of $store.state.searchResults">
                      <div class="song">
                        <h3 class="title">{{ searchResult.name }}</h3>
                        <h5 class="artists">{{ $listFormatter.format(searchResult.artists.map(artist => artist.name)) }}</h5>
                      </div>
                    </template>
                  </tbody>
                </table>
              </section>`,

};