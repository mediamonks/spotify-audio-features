import { TrackContainer } from '../mixins/track-container.js';

export const ViewTrack = {

  props: [
    'id',
  ],

  mixins: [
    TrackContainer,
  ],

  template:  `<section class="view-track">
                <div class="track-container">
                  <section class="left">
                    <img class="cover" :src="coverImage" v-if="coverImage"/>
                  </section>

                  <section class="right">
                    <span class="track-container-type">Track</span>
                    <h1 class="title">{{ trackContainerData.trackData.name }}</h1>
                    <p class="subtitle">By {{ $listFormatter.format(trackContainerData.trackData.artists.map(artist => artist.name)) }}</p>

                    <audio-features-metrics :inputData="tracksAudioFeatures"/>
                  </section>
                </div>

                <audio-features-overview :trackIDs="[id]"/>
              </section>`,

  data () {
    return {
      trackContainerType: 'track',
    };
  },

  computed: {
    trackIDs () {
      return [this.id];
    },
  },

};