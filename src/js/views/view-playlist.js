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
                    <h1 class="title">{{ trackContainerData.name }}</h1>
                    <p class="subtitle">Created by {{ trackContainerData.owner.display_name }} <span class="dot">•</span> {{ trackContainerData.tracks.total }} tracks</p>

                    <p v-if="localTracksAmount > 0" class="warning">This {{ trackContainerType }} contains {{ localTracksAmount }} local {{ localTracksAmount === 1 ? 'track' : 'tracks' }}, which will be omitted from the stats and overview below.</p>
                    <p v-if="tracksAmountExceedSpotifyGetTracksLimit" class="warning">This {{ trackContainerType }} contains {{ trackContainerData.tracks.total }} tracks, but the Spotify API limits us to getting data for {{ spotifyGetTracksLimit }} tracks per request. For now, this tool will only get the first {{ spotifyGetTracksLimit }} items.</p>

                    <audio-features-metrics :inputData="tracksAudioFeatures"/>
                  </section>
                </div>

                <audio-features-overview :trackIDs="trackIDs.slice(0, spotifyGetTracksLimit)"/>
              </section>`,

  data () {
    return {
      trackContainerType: 'playlist',
    };
  },

  computed: {
    trackIDs () {
      return this.trackContainerData.tracks.items.filter(item => item.track.is_local !== true).map(item => item.track.id);
    },

    localTracksAmount () {
      return this.trackContainerData.tracks.items.filter(item => item.track.is_local === true).length;
    },
  },

};