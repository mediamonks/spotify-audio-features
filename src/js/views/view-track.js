export const ViewTrack = {

  props: [
    'id',
  ],

  template:  `<section class="view-track">
                <table>
                  <thead>
                    <audio-features-header/>
                  </thead>
                  <tbody>
                    <spotify-track :trackID="id"/>
                  </tbody>
                </table>
              </section>`,

};