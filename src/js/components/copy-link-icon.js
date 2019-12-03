export const CopyLinkIcon = {

  props: {
    'link': {},
    'animated': {
      default: true,
    },
  },

  template:  `<span
                class="copy-link-icon"
                :class="{
                  'clickable': !!link,
                  'animated': animated && animateNow,
                }"
                @animationend.self="animateNow = false"
                @click.stop="copyLink"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162.656 162.656">
                  <defs/>
                  <path d="M151.764 10.894c-14.522-14.522-38.152-14.525-52.676-.008l.003.003-22.979 22.983 10.607 10.605 22.983-22.988-.002-.002c8.678-8.663 22.785-8.658 31.457.014 8.673 8.672 8.672 22.786 0 31.461l-34.486 34.484a22.095 22.095 0 01-15.729 6.516 22.098 22.098 0 01-15.73-6.516L64.605 98.052c7.035 7.035 16.389 10.91 26.338 10.91 9.949 0 19.303-3.875 26.335-10.91l34.487-34.484c14.519-14.525 14.519-38.155-.001-52.674z"/><path d="M52.96 141.162c-8.675 8.67-22.788 8.668-31.461-.005-8.673-8.675-8.673-22.791-.001-31.465L55.98 75.21c8.675-8.674 22.789-8.674 31.462 0L98.05 64.604c-14.524-14.523-38.154-14.524-52.676 0L10.89 99.086c-14.519 14.523-14.519 38.154.001 52.678 7.263 7.262 16.801 10.893 26.341 10.892 9.536 0 19.074-3.629 26.333-10.887l.002-.001 22.984-22.99-10.608-10.606-22.983 22.99z"/>
                </svg>
              </span>`,

  data () {
    return {
      animateNow: false,
    };
  },

  methods: {
    async copyLink () {
      try {
        if (this.link) {
          await navigator.clipboard.writeText(this.link);

          // If animated, animate now
          if (this.animated) this.animateNow = true;

          // Parent element can decide what to do, but we at least show a small animation to indicate that the link has been copied
          this.$emit('copied');
        }
      } catch {}
    },
  },

};