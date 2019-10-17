export const ToolbarCollection = {

  template:  `<div class="toolbar-collection">
                <button class="small" @click="foldoutVisible = !foldoutVisible">Collection {{ collectionCountText }}</button>
                <div class="collection-contents" :class="{ 'visible': foldoutVisible }">
                  <template v-if="collectionCount === 0">
                    <p>To add input for a music search, click the <span class="plus"></span> signs</p>
                  </template>
                  <p v-else>
                    OMG SOMETHING IN THE COLLECTION, SO COOL!
                  </p>
                </div>
              </div>`,

  data () {
    return {
      foldoutVisible: false,
    };
  },

  computed: {
    collectionCount () {
      return this.$store.state.searchByAudioFeatureCollection.length;
    },

    collectionCountText () {
      return `(${this.collectionCount})`;
    },
  },

};