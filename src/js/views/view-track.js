export const ViewTrack = {

  props: [
    'id',
  ],

  template:  `<section class="view-track">
                <audio-features-overview :trackIDs="[id]"/>
              </section>`,

};