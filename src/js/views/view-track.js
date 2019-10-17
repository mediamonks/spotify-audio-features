export const ViewTrack = {

  props: [
    'id',
  ],

  template:  `<section class="view-track">
                <audio-features-header/>
                <spotify-track :trackID="id"/>
              </section>`,

};