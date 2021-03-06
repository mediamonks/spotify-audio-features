import { mapState, mapGetters } from '/node_modules/vuex/dist/vuex.esm.browser.js';
import { ModalShareCollection } from '../modals/modal-share-collection.js';
import { ModalAudioFeatureTypeExplanation } from '../modals/modal-audio-feature-type-explanation.js';

export const TopbarCollection = {

  template:  `<div class="topbar-collection">
                <button
                  :class="{ 'active': collectionOpen, 'animated': animateButton }"
                  @animationend.self="animateButton = false"
                  @click="$store.commit('toggleCollectionOpen')"
                >Collection {{ collectionTotalCountText }}</button>

                <div class="collection-contents" :class="{ 'visible': collectionOpen }">
                  <icon-close title="Close collection" @close="$store.commit('toggleCollectionOpen')"/>

                  <div class="collection-contents-inner">
                    <section class="left">
                      <p>Spotify lets you find recommendations based on artists, tracks and genres you like. You can choose any combination of input, but with a maximum of 5 items.</p>

                      <h3>Genres ({{ collectionGenres.length }})</h3>
                      <template v-if="spotifyAvailableGenreSeeds.length">
                        <vue-multiselect
                          :options="spotifyAvailableGenreSeeds"
                          :multiple="true"
                          placeholder="Search or select genres"
                          :value="collectionGenres.map(genre => genre.id)"
                          @input="updateCollectionGenres"
                        />
                      </template>
                      <loading-spinner v-else type="small"/>

                      <h3>Artists ({{ collectionArtists.length }})</h3>
                      <ul class="collection-artists">
                        <li v-if="collectionArtists.length === 0">
                          <!-- <div>To add artists for a music search, click the <icon-plus :clickable="false" class="in-body-text"/> signs</div> -->
                          <div class="warning">Sorry, adding artists is not supported yet!</div>
                        </li>
                        <li v-for="item of collectionArtists">{{ item.id }} <icon-plus :added="true" class="in-body-text" title="Remove from collection" @clicked="$store.commit('removeFromCollection', { id: item.id, type: item.type })"/></li>
                      </ul>

                      <h3>Tracks ({{ collectionTracks.length }})</h3>
                      <ul class="collection-tracks">
                        <li v-if="collectionTracks.length === 0">
                          <div>To add tracks for a music search, click the <icon-plus :clickable="false" class="in-body-text"/> signs</div>
                        </li>

                        <spotify-track
                          v-for="item of collectionTracks"
                          :key="item.id"
                          :trackID="item.id"
                          viewMode="teaser"
                        />
                      </ul>
                    </section>

                    <section class="right">
                      <p>You can filter the search results by selecting in which range the audio features of the results can be.</p>

                      <h3>Refine by audio features</h3>
                      <div class="audio-feature-ranges-wrapper" :style="{ '--vrs-dot-size': vrsDotSize + 'px' }">
                        <div v-for="audioFeature of $store.state.audioFeatures" class="audio-feature-range">
                          <p class="audio-feature-type clickable" title="Show explanation" @click="showAudioFeatureTypeExplanation(audioFeature)">{{ audioFeature.name }}</p>
                          <vue-range-slider
                            :key="audioFeature.id"
                            :step="1"
                            :min="0"
                            :max="100"
                            :value="$store.state.collectionAudioFeatures[audioFeature.id]"
                            :speed="0.3"
                            :tooltip-merge="false"
                            :dot-size="vrsDotSize"
                            @input="updateRange(audioFeature.id, $event)"
                          >
                            <template v-slot:label>
                              {{ audioFeature.name }}
                            </template>
                          </vue-range-slider>
                        </div>
                      </div>

                      <div class="buttons-wrapper">
                        <button class="small secondary" @click="$store.commit('clearCollection')">Clear</button>
                        <button class="small secondary" @click="openShareModal">Share</button>
                        <button class="small" @click="startSearch" :disabled="collectionMaxItemsExceeded">Search</button>
                        <p class="error warning" v-if="collectionMaxItemsExceeded">{{ collectionTotalCount }} items selected, maximum is {{ maxItems }}.</p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>`,

  data () {
    return {
      maxItems: 5,
      vrsDotSize: 28,
      animateButton: false,
    };
  },

  // Assuming users only add tracks that were already loaded in the application, we can simply fetch the tracks that
  // are in the collection on the initial page load to get all the data we need to show the collection tracks...
  mounted () {
    if (this.collectionTracks.length) {
      this.$store.dispatch('getTracks', this.collectionTracks.map(track => track.id));
    }
  },

  computed: {
    ...mapState([
      'collectionOpen',
      'spotifyAvailableGenreSeeds',
    ]),

    ...mapGetters([
      'collectionTotalCount',
      'collectionArtists',
      'collectionTracks',
      'collectionGenres',
    ]),

    collectionTotalCountText () {
      return `(${this.collectionTotalCount})`;
    },

    collectionMaxItemsExceeded () {
      return this.collectionTotalCount > this.maxItems;
    },
  },

  watch: {
    collectionTotalCount (newCount, oldCount) {
      this.animateButton = true;

      // NOTE: Code below only triggers the animation when items get added, not when they are removed.
      // if (typeof oldCount !== 'undefined' && newCount > oldCount) {
      //   this.animateButton = true;
      // }
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

    updateRange (audioFeatureID, [newRangeMin, newRangeMax]) {
      this.$store.commit('updateCollectionAudioFeatureRange', {
        id: audioFeatureID,
        newRangeMin,
        newRangeMax,
      });
    },

    async startSearch () {
      // Not using await here, that would feel unresponsive
      this.$store.dispatch('getRecommendations');
      this.$store.commit('setCollectionOpen', false);
    },

    showAudioFeatureTypeExplanation (audioFeature) {
      this.$modal.show(ModalAudioFeatureTypeExplanation, { audioFeature }, {
        name: 'audio-feature-type-explanation',
        scrollable: true,
        width: 600,
        height: 'auto',
      });
    },

    openShareModal () {
      const { shareLink } = this.$store.getters;

      this.$modal.show(ModalShareCollection, { shareLink }, {
        name: 'share-collection',
        scrollable: true,
        width: 600,
        height: 'auto',
      });
    },
  },

};