export const TestLinks = {

  template:  `<div class="test-links">
                <button class="small" @click="$store.dispatch('enterUrl', getRandom(tracks));">Test track</button>
                <button class="small" @click="$store.dispatch('enterUrl', getRandom(playlists))">Test playlist</button>
                <button class="small" @click="$store.dispatch('enterUrl', getRandom(albums))">Test album</button>
              </div>`,

  data () {
    return {
      tracks: [
        'https://open.spotify.com/track/2BndJYJQ17UcEeUFJP5JmY?si=8B72iVW6RHK0VgK_MB7iIw',
        'https://open.spotify.com/track/4oyvskg9RfO3Y0JPHrrjEX?si=MJlMr0ZLQk-ol7n5EQuyOA',
        'https://open.spotify.com/track/5EzGOkUwkRUXYAyvjlEHah?si=29ztxsmjSKCGXj2_tozkzw',
        'https://open.spotify.com/track/3oAHuXFJ2L7V5As4jXsXAZ?si=Vj4ehc-lSnye7s6CxvlMxg',
      ],
      playlists: [
        'https://open.spotify.com/playlist/5SYLNmW407gyhDSUYarXYL?si=MOLFV-nQSoKZoMkFBVT16A',
        'https://open.spotify.com/playlist/66Vo5gwluDeNdM8DIciM85?si=nt8mgdMIT9OcCsKRrcfT5g',
        'https://open.spotify.com/playlist/10lrBSG708fHzXSigGpeFK?si=oXWXeWiqSZWnbd2hYj0hPQ',
        'https://open.spotify.com/playlist/1DTzz7Nh2rJBnyFbjsH1Mh?si=Fq7UiYYSSlu8w3xkahw7TQ',
      ],
      albums: [
        'https://open.spotify.com/album/3gxOtUSRzweDWBKlpj7cG6?si=UGP0jnOFTmyzHZ1BvH7fEA',
        'https://open.spotify.com/album/64iEo3whZTY6g9vwap2H2Q?si=oYgpMCsxRr2x5KfFP1Yy7g',
        'https://open.spotify.com/album/49MNmJhZQewjt06rpwp6QR?si=8mSCmR2AS_O70CeEKtYFyw',
        'https://open.spotify.com/album/1rxWlYQcH945S3jpIMYR35?si=K-8oOKzJSdqH1AzCB5em6w',
        'https://open.spotify.com/album/1q6BVqvTJ7RdOWQGtgc9HH?si=O5sZGJUBSPGtgxM8imDUjw',
      ],
    };
  },

  methods: {
    getRandom (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
  },

};