// ESM imports
import Vue from '/node_modules/vue/dist/vue.esm.browser.js';
import { mapState } from '/node_modules/vuex/dist/vuex.esm.browser.js';
import VueRangeSlider from '/node_modules/vue-range-component/dist/vue-range-slider.esm.js';

// Core
import { store } from './store.js';

// Views
import { ViewStart } from './views/view-start.js';
import { ViewTrack } from './views/view-track.js';
import { ViewAlbum } from './views/view-album.js';
import { ViewPlaylist } from './views/view-playlist.js';
import { ViewSearch } from './views/view-search.js';

// Components
import { TopbarSearch } from './components/topbar/topbar-search.js';
import { TopbarCollection } from './components/topbar/topbar-collection.js';
import { TestLinks } from './components/test-links.js';
import { LoadingSpinner } from './components/loading-spinner.js';
import { HelpSectionButton } from './components/help-section-button.js';
import { SpotifyTrack } from './components/spotify-track.js';

import { IconCopyLink } from './components/icons/icon-copy-link.js';
import { IconClose } from './components/icons/icon-close.js';
import { IconPlay } from './components/icons/icon-play.js';
import { IconPause } from './components/icons/icon-pause.js';
import { IconDot } from './components/icons/icon-dot.js';
import { IconPlus } from './components/icons/icon-plus.js';

import { AudioFeaturesOverview } from './components/audio-features-overview.js';
import { AudioFeaturesMetrics } from './components/audio-features-metrics.js';
import { AudioFeatureMetric } from './components/audio-feature-metric.js';
import { AudioFeatureTypeExplanation } from './components/audio-feature-type-explanation.js';

Vue.prototype.$listFormatter = new Intl.ListFormat('en', { style: 'short', type: 'conjunction' });

const VueModal = window['vue-js-modal'].default;
Vue.use(VueModal, {
  dynamic: true,
});

Vue.use(VueRangeSlider);

Vue.component('vue-multiselect', window.VueMultiselect.default); // no ESM option available

Vue.component('view-start', ViewStart);
Vue.component('view-track', ViewTrack);
Vue.component('view-album', ViewAlbum);
Vue.component('view-playlist', ViewPlaylist);
Vue.component('view-search', ViewSearch);

Vue.component('topbar-search', TopbarSearch);
Vue.component('topbar-collection', TopbarCollection);
Vue.component('test-links', TestLinks);
Vue.component('loading-spinner', LoadingSpinner);
Vue.component('help-section-button', HelpSectionButton);
Vue.component('spotify-track', SpotifyTrack);

Vue.component('icon-copy-link', IconCopyLink);
Vue.component('icon-close', IconClose);
Vue.component('icon-play', IconPlay);
Vue.component('icon-pause', IconPause);
Vue.component('icon-dot', IconDot);
Vue.component('icon-plus', IconPlus);

Vue.component('audio-features-metrics', AudioFeaturesMetrics);
Vue.component('audio-feature-metric', AudioFeatureMetric);
Vue.component('audio-features-overview', AudioFeaturesOverview);
Vue.component('audio-features-type-explanation', AudioFeatureTypeExplanation);

new Vue({

  el: '#app',

  store,

  template:  `<div id="app"
                @dragenter.capture.prevent.stop="draggingOver = true"
                @dragover.capture.prevent.stop
                @dragleave.self.capture.prevent.stop="draggingOver = false"
                @drop.capture.prevent.stop="testDroppedData"
                :class="{
                  'drag-over': draggingOver,
                }"
              >
                <div class="topbar">
                  <topbar-search/>
                  <topbar-collection/>
                </div>

                <test-links v-if="debug === true"/>

                <main class="results">
                  <loading-spinner v-if="searching === true" type="large"/>

                  <p v-if="searching === false && errored === true" v-html="errorMsg"></p>

                  <component
                    v-if="searching === false && errored === false"
                    :is="currentView"
                    v-bind="currentViewData"
                  />
                </main>

                <help-section-button/>
                <modals-container/>
              </div>`,

  created () {
    // Since Vuex actions are technically async, we can't assume 'setup' is done on mounted. That's why we use a watch.
    this.$store.dispatch('setup');
  },

  data () {
    return {
      draggingOver: false,
    };
  },

  computed: {
    ...mapState([
      'debug',
      'setupComplete',
      'searching',
      'errored',
      'errorMsg',
      'currentView',
      'currentViewData',
    ]),
  },

  watch: {
    // Since Vuex action 'setup' is technically async, we can't assume it is done on mounted. That's why we use a watch.
    setupComplete: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal === true) {
          // Instantly search prefilled track
          this.$store.dispatch('doSearch');

          // This only triggers when navigating back/forward
          window.addEventListener('popstate', (event) => {
            this.$store.commit('setSpotifyUrlFromSearchParams');
            this.$store.dispatch('doSearch');
          });
        }
      },
    },
  },

  methods: {
    testDroppedData (event) {
      try {
        const possibleSpotifyUrl = event.dataTransfer.getData('text/uri-list');

        if (possibleSpotifyUrl) {
          this.$store.dispatch('enterUrl', possibleSpotifyUrl);
        }
      }

      finally {
        this.draggingOver = false;
      }
    },
  },

});
