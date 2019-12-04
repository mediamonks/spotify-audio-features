export const IconPlus = {

  props: {
    clickable: {
      type: Boolean,
      default: true,
    },
    added: {
      type: Boolean,
      default: false,
    },
  },

  template:  `<span
                class="icon-plus"
                :class="{
                  'added': added,
                  'clickable': clickable,
                }"
                @click.stop="$emit('clicked')"
              ></span>`,

};
