export const InputForSearch = {

  template:  `<div class="input-for-search">
                <button class="small" @click="foldoutVisible = !foldoutVisible">Input for search {{ inputCountText }}</button>
                <div class="input" :class="{ 'visible': foldoutVisible }">
                  <template v-if="inputCount === 0">
                    <p>To add input for a music search, click the <span class="plus"></span> signs</p>
                  </template>
                </div>
              </div>`,

  data () {
    return {
      foldoutVisible: false,
      inputCount: 0,
    };
  },

  computed: {
    inputCountText () {
      return `(${this.inputCount})`;
    },
  },

};