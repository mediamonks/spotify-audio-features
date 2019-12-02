import { mapState } from '/node_modules/vuex/dist/vuex.esm.browser.js';

export const AudioFeaturesOverview = {

  props: [
    'trackIDs',
  ],

  template:  `<table class="audio-features-overview">
                <thead>
                  <tr class="audio-features-overview-header">
                    <th scope="row" class="left"></th>
                    <th
                      scope="row"
                      class="audio-feature-type"
                      v-for="audioFeature of $store.state.audioFeatures"
                      @click="sortByAudioFeature(audioFeature)"
                    >
                      <strong :title="audioFeature.description">{{ audioFeature.name }}<span class="sort-order" :class="audioFeaturesOverviewSortOrder">
                        <template v-if="audioFeaturesOverviewSortKey === audioFeature.id && audioFeaturesOverviewSortOrder === 'desc'">↓</template>
                        <template v-else-if="audioFeaturesOverviewSortKey === audioFeature.id && audioFeaturesOverviewSortOrder === 'asc'">↑</template>
                      </span></strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <spotify-track
                    v-for="trackID of sortedTrackIDs"
                    :key="trackID"
                    :trackID="trackID"
                  />
                </tbody>
              </table>`,

  computed: {
    ...mapState([
      'audioFeaturesOverviewSortKey',
      'audioFeaturesOverviewSortOrder',
    ]),

    sortedTrackIDs () {
      const sortKey = this.audioFeaturesOverviewSortKey,
            sortOrder = this.audioFeaturesOverviewSortOrder;

      if (sortKey === null) {
        return this.trackIDs;
      }

      else {
        const trackIDsCopy = [...this.trackIDs],
              getTrack = trackID => this.$store.state.fetchedContent.find((content) => {
                return content.type === 'track' && content.id === trackID;
              });

        // sort trackIDs by sortKey and sortOrder
        trackIDsCopy.sort((trackIDA, trackIDB) => {
          const trackA = getTrack(trackIDA),
                trackB = getTrack(trackIDB),
                audioFeatureValueA = trackA.audioFeatures[sortKey],
                audioFeatureValueB = trackB.audioFeatures[sortKey];

          return (sortOrder === 'desc') ? audioFeatureValueB - audioFeatureValueA : audioFeatureValueA - audioFeatureValueB;
        });

        // Return sorted trackIDs
        return trackIDsCopy;
      }
    },
  },

  methods: {
    // When user clicks table headers, we keep this order: 'desc', 'asc', null.
    sortByAudioFeature (audioFeature) {
      const sortKey = this.audioFeaturesOverviewSortKey,
            sortOrder = this.audioFeaturesOverviewSortOrder;

      if (sortKey !== audioFeature.id) {
        this.$store.commit('setAudioFeaturesOverviewSorting', {
          sortKey: audioFeature.id,
          sortOrder: 'desc',
        });
      }

      else {
        if (sortOrder === 'desc') {
          this.$store.commit('setAudioFeaturesOverviewSorting', {
            sortKey: audioFeature.id,
            sortOrder: 'asc',
          });
        }

        else if (sortOrder === 'asc') {
          this.$store.commit('setAudioFeaturesOverviewSorting', {
            sortKey: null,
            sortOrder: 'desc',
          });
        }
      }
    },
  },

};