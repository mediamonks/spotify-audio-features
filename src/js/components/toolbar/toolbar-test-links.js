export const ToolbarTestLinks = {

  template:  `<div class="toolbar-test-links">
                <button class="small" @click="$store.dispatch('enterUrl', 'https://open.spotify.com/track/2BndJYJQ17UcEeUFJP5JmY?si=8B72iVW6RHK0VgK_MB7iIw')">Test track</button>
                <button class="small" @click="$store.dispatch('enterUrl', 'https://open.spotify.com/playlist/5SYLNmW407gyhDSUYarXYL?si=MOLFV-nQSoKZoMkFBVT16A')">Test playlist</button>
                <!-- <button class="small" @click="$store.dispatch('enterUrl', 'https://open.spotify.com/playlist/1DTzz7Nh2rJBnyFbjsH1Mh?si=Fq7UiYYSSlu8w3xkahw7TQ')">Test playlist (long)</button> -->
                <button class="small" @click="$store.dispatch('enterUrl', 'https://open.spotify.com/album/3gxOtUSRzweDWBKlpj7cG6?si=UGP0jnOFTmyzHZ1BvH7fEA')">Test album</button>
              </div>`,

};