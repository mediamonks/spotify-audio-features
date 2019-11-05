export const LoadingSpinner = {

  props: {
    'type': {
      type: String,
      default: 'small',
    },
  },

  template:  `<div class="loading-spinner" :class="type"></div>`,

};