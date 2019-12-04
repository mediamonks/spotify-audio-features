export const IconClose = {

  props: {
    'title': {
      type: String,
      default: 'Close',
    },
  },

  template:  `<span class="icon-close clickable" :title="title" @click="$emit('close')"></span>`,

};