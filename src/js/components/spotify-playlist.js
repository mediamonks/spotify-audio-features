export const SpotifyPlaylist = {

  props: [
    'contentData',
  ],

  template:  `<div class="spotify-playlist">
                <section class="left">
                  <img class="cover" :src="playlistCoverImage" v-if="playlistCoverImage"/>
                </section>

                <section class="right">
                  <h2>{{ contentData.name }}</h2>
                  <p>Created by {{ contentData.owner.display_name }} - {{ contentData.tracks.total }} tracks</p>
                  <spotify-audio-features-metrics :inputData="contentData._audio_features"/>
                </section>
              </div>`,

  computed: {
    playlistCoverImage () {
      if (this.contentData.images.length === 1) {
        return this.contentData.images[0].url;
      }
      else {
        return this.contentData.images.find(image => image.width > 100 && image.width < 600).url;
      }
    }
  },

};