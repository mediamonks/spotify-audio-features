export const AudioFeaturesOverview = {

  props: [
    'trackIDs',
  ],

  template:  `<table class="audio-features-overview">
                <thead>
                  <tr class="audio-features-overview-header">
                    <th scope="row" class="left"></th>
                    <th
                      scope="row"
                      class="audio-feature-type"
                      v-for="audioFeature of $store.state.audioFeatures"
                    >
                      <strong :title="audioFeature.description">{{ audioFeature.name }}</strong>
                    </th>
                  </tr>
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