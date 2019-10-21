import { audioFeatures } from '../helpers/audio-features.js';

export const TrackContainer = {

  computed: {
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

    coverImage () {
      if (this.trackContainerData.images.length === 1) {
        return this.trackContainerData.images[0].url;
      }
      else {
        return this.trackContainerData.images.find(image => image.width > 100 && image.width < 600).url;
      }
    },
  }

};