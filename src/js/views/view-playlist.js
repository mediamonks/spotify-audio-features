import { TrackContainer } from '../mixins/track-container.js';

export const ViewPlaylist = {

  props: [
    'id',
  ],

  mixins: [
    TrackContainer,
  ],

  template:  `<section class="view-playlist">
                <div class="track-container">
                  <section class="left">
                    <img class="cover" :src="coverImage" v-if="coverImage"/>
                  </section>

                  <section class="right">
                    <span class="track-container-type">Playlist</span>
                    <h1 class="title">{{ playlistData.name }}</h1>
                    <p class="subtitle">Created by {{ playlistData.owner.display_name }} <span class="dot">•</span> {{ playlistData.tracks.total }} tracks</p>
                    <audio-features-metrics :inputData="tracksAudioFeatures"/>
                  </section>
                </div>

                <audio-features-overview :trackIDs="trackIDs"/>
              </section>`,

  data () {
    return {
      trackContainerType: 'playlist',
    };
  },

  computed: {
    playlistData () {
      return this.trackContainerData;
    },

    trackIDs () {
      return this.playlistData.tracks.items.map(item => item.track.id);
    },
  },

};