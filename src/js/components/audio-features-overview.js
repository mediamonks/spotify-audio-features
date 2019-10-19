export const AudioFeaturesOverview = {

  props: [
    'trackIDs',
  ],

  template:  `<table class="audio-features-overview">
                <thead>
                  <audio-features-header/>
                </thead>
                <tbody>
                  <spotify-track
                    v-for="trackID of trackIDs"
                    :key="trackID"
                    :trackID="trackID"
                  />
                </tbody>
              </table>`,

};