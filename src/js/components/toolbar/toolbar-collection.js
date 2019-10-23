export const ToolbarCollection = {

  template:  `<div class="toolbar-collection">
                <button class="small" @click="foldoutVisible = !foldoutVisible">Collection {{ collectionTotalCountText }}</button>
                <div class="collection-contents" :class="{ 'visible': foldoutVisible }">
                  <div class="collection-contents-inner">
                    <section class="left">
                      <p>Spotify lets you find recommendations based on artists, tracks and genres you like. You can choose any combination of input, but with a maximum of 5 items.</p>
                      <h3>Artists ({{ collectionArtists.length }})</h3>
                      <ul class="collection-artists">
                        <li v-if="collectionArtists.length === 0">
                          <div>To add artists for a music search, click the <span class="plus"></span> signs</div>
                          <div class="warning">Adding artists is not supported yet</div>
                        </li>
                        <li v-for="item of collectionArtists">{{ item.id }} <span class="plus clickable added" href="#" title="Remove from collection" @click.prevent="$store.commit('removeFromCollection', { id: item.id, type: item.type })"></span></li>
                      </ul>

                      <h3>Tracks ({{ collectionTracks.length }})</h3>
                      <ul class="collection-tracks">
                        <li v-if="collectionTracks.length === 0">
                          <div>To add tracks for a music search, click the <span class="plus"></span> signs</div>
                        </li>
                        <li v-for="item of collectionTracks">{{ item.id }} <span class="plus clickable added" href="#" title="Remove from collection" @click.prevent="$store.commit('removeFromCollection', { id: item.id, type: item.type })"></span></li>
                      </ul>
                    </section>

                    <section class="right">
                    <h3>Genres ({{ collectionGenres.length }})</h3>
                      <template v-if="spotifyAvailableGenreSeeds.length">
                        <vue-multiselect
                          :options="spotifyAvailableGenreSeeds"
                          :multiple="true"
                          label="id"
                          track-by="id"
                          placeholder="Search or select genres"
                          :value="collectionGenres.map(genre => genre.id)"
                          @input="updateCollectionGenres"
                        />
                      </template>
                      <loading-spinner v-else/>

                      <h3>Refine by audio features</h3>
                      <div class="audio-feature-ranges-wrapper" :style="{ '--vrs-dot-size': vrsDotSize + 'px' }">
                        <div v-for="audioFeature of $store.state.audioFeatures" class="audio-feature-range">
                          <p class="audio-feature-type">{{ audioFeature.name }}</p>
                          <vue-range-slider
                            :key="audioFeature.id"
                            :step="1"
                            :min="0"
                            :max="100"
                            :value="$store.state.collectionAudioFeatures[audioFeature.id]"
                            :speed="0.3"
                            :tooltip-merge="false"
                            :dot-size="vrsDotSize"
                          >
                            <template v-slot:label>
                              {{ audioFeature.name }}
                            </template>
                          </vue-range-slider>
                        </div>
                      </div>

                      <div class="search-button-wrapper">
                        <button class="search small" @click="startSearch" :disabled="maxExceeded">Search</button>
                        <p class="error" v-if="maxExceeded">{{ collectionTotalCount }} items selected, maximum is {{ maxItems }}.</p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>`,

  data () {
    return {
      foldoutVisible: false,
      maxItems: 5,
      vrsDotSize: 28,
    };
  },

  computed: {
    collectionTotalCount () {
      return this.$store.state.collection.length;
    },

    collectionArtists () {
      return this.$store.state.collection.filter(item => item.type === 'artist');
    },

    collectionTracks () {
      return this.$store.state.collection.filter(item => item.type === 'track');
    },

    collectionGenres () {
      return this.$store.state.collection.filter(item => item.type === 'genre');
    },

    spotifyAvailableGenreSeeds () {
      return this.$store.state.spotifyAvailableGenreSeeds.map(genreID => ({ id: genreID }));
    },

    collectionTotalCountText () {
      return `(${this.collectionTotalCount})`;
    },

    maxExceeded () {
      return this.collectionTotalCount > this.maxItems;
    },
  },

  methods: {
    updateCollectionGenres (newActiveGenreIDs) {
      const currentlyInCollectionGenreIDs = this.collectionGenres.map(genre => genre.id);

      const genresToAdd = newActiveGenreIDs.filter(genreID => !currentlyInCollectionGenreIDs.includes(genreID)),
            genresToRemove = currentlyInCollectionGenreIDs.filter(genreID => !newActiveGenreIDs.includes(genreID));

      for (const genreID of genresToAdd) {
        this.$store.commit('addToCollection', {
          type: 'genre',
          id: genreID,
        });
      }

      for (const genreID of genresToRemove) {
        this.$store.commit('removeFromCollection', {
          type: 'genre',
          id: genreID,
        });
      }
    },

    startSearch () {
      alert('SEAAAARCH');
    },
  },

};