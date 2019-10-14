export const SpotifyTrack = {

  props: [
    'trackData',
  ],

  template:  `<div class="spotify-track">
                <section class="left">
                  <h3>{{ trackData.track.name }}</h3>
                  <h5>{{ trackData.track.artists.map(artist => artist.name).join(', ') }}</h5>
                </section>

                <section class="right">
                  <template v-for="feature in features">
                    <div :title="feature.description">
                      <h5>{{ feature.name }}</h5>
                      <input type="range" min="0" max="1" step="0.00001" :value="trackData.audioFeatures[feature.name]">
                    </div>
                  </template>
                </section>
              </div>`,

  mounted () {
    console.log(this.trackData);
  },

  data () {
    return {
      features: [
        {
          name: 'valence',
          minText: '',
          maxText: '',
          description: '...',
        },
        {
          name: 'energy',
          minText: '',
          maxText: '',
          description: '...',
        },
        {
          name: 'danceability',
          minText: '',
          maxText: '',
          description: '...',
        },
        {
          name: 'acousticness',
          minText: '',
          maxText: '',
          description: '...',
        },
        {
          name: 'instrumentalness',
          minText: '',
          maxText: '',
          description: '...',
        },
        {
          name: 'speechiness',
          minText: '',
          maxText: '',
          description: '...',
        },
        {
          name: 'liveness',
          minText: '',
          maxText: '',
          description: '...',
        },
      ],
    };
  },

};