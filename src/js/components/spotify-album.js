export const SpotifyAlbum = {

  props: [
    'contentData',
  ],

  template:  `<div class="spotify-album">
                <section class="left">
                  <img class="cover" :src="albumCoverImage" v-if="albumCoverImage"/>
                </section>

                <section class="right">
                  <h1 class="album-title">{{ contentData.name }}</h1>
                  <p class="album-artists">By {{ contentData.artists.map(artist => artist.name).join(', ') }}</p>
                  <spotify-audio-features-metrics :inputData="contentData._audio_features"/>
                </section>
              </div>`,

  computed: {
    albumCoverImage () {
      if (this.contentData.images.length === 1) {
        return this.contentData.images[0].url;
      }
      else {
        return this.contentData.images.find(image => image.width > 100 && image.width < 600).url;
      }
    }
  },

};