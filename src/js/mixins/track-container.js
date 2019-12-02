import { mapState } from '/node_modules/vuex/dist/vuex.esm.browser.js';
import { audioFeatures } from '../helpers/audio-features.js';

export const TrackContainer = {

  computed: {
    ...mapState([
      'spotifyGetTracksLimit',
    ]),

    trackContainerData () {
      return this.$store.state.fetchedContent.find((content) => {
        return content.type === this.trackContainerType && content.id === this.id;
      });
    },

    tracksData () {
      return this.$store.state.fetchedContent.filter((content) => {
        return content.type === 'track' && this.trackIDs.includes(content.id);
      });
    },

    tracksAudioFeatures () {
      const contentAudioFeatures = {};
      const tracksAudioFeatures = this.tracksData.map(track => track.audioFeatures);

      for (const audioFeature of audioFeatures) {
        contentAudioFeatures[audioFeature.id] = tracksAudioFeatures.map(entry => entry[audioFeature.id]);
      }

      return contentAudioFeatures;
    },

    tracksAmountExceedSpotifyGetTracksLimit () {
      return this.trackIDs.length > this.spotifyGetTracksLimit;
    },

    coverImage () {
      const imageContainer = (this.trackContainerType === 'track') ? this.trackContainerData.trackData.album.images : this.trackContainerData.images;

      if (imageContainer.length === 1) {
        return imageContainer[0].url;
      }

      else {
        return imageContainer.find(image => image.width > 100 && image.width < 600).url;
      }
    },
  }

};