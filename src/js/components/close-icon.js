export const CloseIcon = {

  props: {
    'title': {
      type: String,
      default: 'Close',
    },
  },

  template:  `<span class="close-icon" :title="title" @click="$emit('close')"></span>`,

};