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
                    <h1 class="title">{{ trackContainerData.name }}</h1>
                    <p class="subtitle">By {{ $listFormatter.format(trackContainerData.artists.map(artist => artist.name)) }} <span class="dot">•</span> {{ trackContainerData.tracks.total }} tracks</p>

                    <p v-if="tracksAmountExceedSpotifyGetTracksLimit" class="warning">This {{ trackContainerType }} contains {{ trackContainerData.tracks.total }} tracks, but the Spotify API limits us to getting data for {{ spotifyGetTracksLimit }} tracks per request. For now, this tool will only get the first {{ spotifyGetTracksLimit }} items.</p>

                    <audio-features-metrics :inputData="tracksAudioFeatures"/>
                  </section>
                </div>

                <audio-features-overview :trackIDs="trackIDs.slice(0, spotifyGetTracksLimit)"/>
              </section>`,

  data () {
    return {
      trackContainerType: 'album',
    };
  },

  computed: {
    trackIDs () {
      return this.trackContainerData.tracks.items.map(item => item.id);
    },
  },

};