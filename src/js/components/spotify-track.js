import { AudioFeatureValue } from '../mixins/audio-feature-value.js';
import { ModalAudioFeatureValue } from './modals/modal-audio-feature-value.js';

import { log } from '../helpers/log.js';

// FIXME: When track component is displayed multiple times, all <audio> tags will play simultaneously, causing clipping audio and bleeding ears. Solution: don't use audio tag, but a Web Audio API solution, or with Howler or something.

export const SpotifyTrack = {

  props: {
    'trackID': {
      type: String,
      required: true,
    },
    'viewMode': {
      type: String,
      default: 'full',
      validator (value) {
        return ['full', 'teaser'].includes(value);
      },
    }
  },

  mixins: [
    AudioFeatureValue,
  ],

  template:  `<component
                :is="viewMode === 'full' ? 'tr' : 'div'"
                class="spotify-track"
                :class="{
                  [viewMode]: true,
                  'placeholder': isFetched === false,
                }"
              >
                <template v-if="isFetched">
                  <component
                    :is="viewMode === 'full' ? 'th' : 'div'"
                    v-bind="viewMode === 'full' ? { 'scope': 'col' } : {}"
                    class="left"
                    :class="{
                      'clickable': hasAudioPreview,
                      'playing-preview': playingAudioPreview,
                    }"
                    @click="togglePlayIfHasAudioPreview"
                    @mousedown="turnOnRecordSelectionChanges"
                  >
                    <audio
                      ref="player"
                      preload="none"
                      v-if="hasAudioPreview"
                      :src="track.trackData.preview_url"
                      style="visibilty: hidden;"
                      @ended="playingAudioPreview = false"
                    ></audio>

                    <icon-play v-if="hasAudioPreview && playingAudioPreview === false"/>
                    <icon-pause v-if="hasAudioPreview && playingAudioPreview === true"/>

                    <img class="cover" :src="coverImage" v-if="coverImage"/>

                    <div class="song">
                      <h3 class="title">{{ track.trackData.name }}</h3>
                      <h5 class="artists">{{ $listFormatter.format(track.trackData.artists.map(artist => artist.name)) }}</h5>
                    </div>

                    <icon-plus :added="isInCollection" @clicked="toggleInCollection" :title="isInCollection ? 'Remove from collection' : 'Add to collection'"/>

                    <icon-copy-link :link="track.trackData.external_urls.spotify" title="Copy Spotify link"/>
                  </component>

                  <td
                    v-if="viewMode === 'full'"
                    v-for="audioFeature in $store.state.audioFeatures"
                    class="audio-feature-value clickable"
                    @click="showDetails(audioFeature)"
                  >
                    <span :style="getPercentageStyles(getAudioFeatureValue(audioFeature))">{{ getAudioFeatureReadableValue(audioFeature) }}</span>
                  </td>
                </template>

                <template v-else>
                  <component
                    :is="viewMode === 'full' ? 'th' : 'div'"
                    v-bind="viewMode === 'full' ? { 'scope': 'col' } : {}"
                    class="left"
                  >
                    <loading-spinner type="small"/>
                  </component>

                  <td
                    v-if="viewMode === 'full'"
                    v-for="audioFeature in $store.state.audioFeatures"
                    class="audio-feature-value"
                  ></td>
                </template>
              </component>`,

  data () {
    return {
      selectionChangesSinceMousedown: 0,
    };
  },

  computed: {
    isFetched () {
      return (typeof this.track !== 'undefined');
    },

    track () {
      const track = this.$store.state.fetchedContent.find((content) => {
        return content.type === 'track' && content.id === this.trackID;
      });

      // Normalize audio preview playback volume
      if (track && ('audioPreviewGain' in track)) {
        // Template needs to render first, then we can set the volume
        this.$nextTick(() => {
          this.$refs.player.volume = track.audioPreviewGain;
        });
      }

      return track;
    },

    coverImage () {
      try {
        const albumArt = this.track.trackData.album.images[2].url;
        return albumArt;
      }

      catch (err) {
        return null;
      }
    },

    hasAudioPreview () {
      return !!this.track.trackData.preview_url;
    },

    isInCollection () {
      return !!this.$store.state.collection.find(item => {
        return item.type === 'track' && item.id === this.trackID;
      });
    },

    playingAudioPreview: {
      get () {
        return this.$store.state.nowPlaying === this.trackID;
      },
      set (value) {
        this.$store.commit('setNowPlaying', (value === true) ? this.trackID : null);
      },
    },
  },

  watch: {
    playingAudioPreview (newVal) {
      if (newVal === true) {
        this.$refs.player.play();
      }

      else {
        this.$refs.player.pause();
        this.$refs.player.currentTime = 0;
      }
    },
  },

  methods: {
    getAudioFeatureValue (audioFeature) {
      return this.track.audioFeatures[audioFeature.id];
    },

    getAudioFeatureReadableValue (audioFeature) {
      // TODO: Assumes a percentage value. Rewrite when implementing other audio features like loudness, tempo, etc.
      return `${Math.round(this.getAudioFeatureValue(audioFeature) * 100)}%`;
    },

    showDetails (audioFeature) {
      const valueExact = this.getAudioFeatureValue(audioFeature),
            valueReadble = this.getAudioFeatureReadableValue(audioFeature),
            meaning = this.getValueMeaning(audioFeature, valueExact);

      this.$modal.show(ModalAudioFeatureValue, {
        audioFeature,
        value: valueReadble,
        meaning,
      }, {
        name: 'audio-feature-value',
        scrollable: true,
        width: 600,
        height: 'auto',
      });
    },

    togglePlayIfHasAudioPreview () {
      const recordedSelectionChanges = this.selectionChangesSinceMousedown;

      // Reset stuff
      this.selectionChangesSinceMousedown = 0;
      document.removeEventListener('selectionchange', this.recordSelectionChange);

      if (recordedSelectionChanges > 1) {
        log('More than 1 selection change recorded, not toggling play/pause on the audio');
        return;
      }

      if (this.hasAudioPreview === true) {
        this.playingAudioPreview = !this.playingAudioPreview;
      }
    },

    toggleInCollection () {
      if (this.isInCollection === true) {
        this.$store.commit('removeFromCollection', {
          type: 'track',
          id: this.trackID,
        });
      }

      else {
        this.$store.commit('addToCollection', {
          type: 'track',
          id: this.trackID,
        });
      }
    },

    // Enables keeping track of how many 'selectionchange' events have happened since mousedown'ing on the element that would toggle play/pause on the audio.
    turnOnRecordSelectionChanges (e) {
      document.addEventListener('selectionchange', this.recordSelectionChange);
    },

    recordSelectionChange (e) {
      this.selectionChangesSinceMousedown += 1;
      log('Recorded selection changes:', this.selectionChangesSinceMousedown);
    },
  },

};