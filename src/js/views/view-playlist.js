import { audioFeatures } from '../helpers/audio-features.js';

export const ViewPlaylist = {

  props: [
    'id',
  ],

  template:  `<section class="view-playlist">
                <div class="track-container">
                  <section class="left">
                    <img class="cover" :src="coverImage" v-if="coverImage"/>
                  </section>

                  <section class="right">
                    <span class="track-container-type">Playlist</span>
                    <h1 class="title">{{ playlistData.name }}</h1>
                    <p class="subtitle">Created by {{ playlistData.owner.display_name }} ・ {{ playlistData.tracks.total }} tracks</p>
                    <audio-features-metrics :inputData="audioFeatures"/>
                  </section>
                </div>

                <table>
                  <thead>
                    <audio-features-header/>
                  </thead>
                  <tbody>
                    <spotify-track
                      v-for="trackID of playlistTrackIDs"
                      :key="trackID"
                      :trackID="trackID"
                    />
                  </tbody>
                </table>
              </section>`,

  computed: {
    playlistData () {
      return this.$store.state.fetchedContent.find((content) => {
        return content.type === 'playlist' && content.id === this.id;
      });
    },

    playlistTrackIDs () {
      return this.playlistData.tracks.items.map(item => item.track.id);
    },

    playlistTracksData () {
      return this.$store.state.fetchedContent.filter((content) => {
        return content.type === 'track' && this.playlistTrackIDs.includes(content.id);
      });
    },

    audioFeatures () {
      const contentAudioFeatures = {};
      const tracksAudioFeatures = this.playlistTracksData.map(track => track.audioFeatures);

      for (const audioFeature of audioFeatures) {
        contentAudioFeatures[audioFeature.id] = tracksAudioFeatures.map(entry => entry[audioFeature.id]);;
      }

      return contentAudioFeatures;
    },

    coverImage () {
      if (this.playlistData.images.length === 1) {
        return this.playlistData.images[0].url;
      }
      else {
        return this.playlistData.images.find(image => image.width > 100 && image.width < 600).url;
      }
    }
  },

};