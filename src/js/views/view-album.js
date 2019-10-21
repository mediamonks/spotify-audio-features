import { TrackContainer } from '../mixins/track-container.js';

export const ViewAlbum = {

  props: [
    'id',
  ],

  mixins: [
    TrackContainer,
  ],

  template:  `<section class="view-album">
                <div class="track-container">
                  <section class="left">
                    <img class="cover" :src="coverImage" v-if="coverImage"/>
                  </section>

                  <section class="right">
                    <span class="track-container-type">Album</span>
                    <h1 class="title">{{ albumData.name }}</h1>
                    <p class="subtitle">By {{ albumData.artists.map(artist => artist.name).join(', ') }}</p>
                    <audio-features-metrics :inputData="tracksAudioFeatures"/>
                  </section>
                </div>

                <audio-features-overview :trackIDs="trackIDs"/>
              </section>`,

  data () {
    return {
      trackContainerType: 'album',
    };
  },

  computed: {
    albumData () {
      return this.trackContainerData;
    },

    trackIDs () {
      return this.albumData.tracks.items.map(item => item.id);
    },
  },

};