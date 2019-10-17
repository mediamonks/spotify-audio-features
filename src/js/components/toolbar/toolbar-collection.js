export const ToolbarCollection = {

  template:  `<div class="toolbar-collection">
                <button class="small" @click="foldoutVisible = !foldoutVisible">Collection {{ collectionCountText }}</button>
                <div class="collection-contents" :class="{ 'visible': foldoutVisible }">
                  <template v-if="collectionCount === 0">
                    <p>To add input for a music search, click the <span class="plus"></span> signs</p>
                  </template>
                  <template v-else>
                    <p v-for="item of $store.state.collection">{{ item.type }} – {{ item.id }} (<a href="#" @click.prevent="$store.commit('removeFromCollection', { id: item.id, type: item.type })">remove</a>)</p>
                    <button class="small" @click="startSearch">Search</button>
                  </template>
                </div>
              </div>`,

  data () {
    return {
      foldoutVisible: false,
    };
  },

  computed: {
    collectionCount () {
      return this.$store.state.collection.length;
    },

    collectionCountText () {
      return `(${this.collectionCount})`;
    },
  },

  methods: {
    startSearch () {
      alert('SEAAAARCH');
    },
  },

};