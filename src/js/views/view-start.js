// TODO: Make sure you can (share a) link to a specific collection (including audio features). Then this homepage can become much cooler.
export const ViewStart = {

  template:  `<div class="view-start">
                <h3>Always wanted to find tracks similar to <span class="link" @click="$store.dispatch('enterUrl', 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3?si=C0QuUrw4Q82pp1SjKsE41A')">Ed Sheeran's biggest hit</span>, but sadder?</h3>
                <h3>Or more like <span class="link" @click="$store.dispatch('enterUrl', 'https://open.spotify.com/track/3bCmDqflFBHijgJfvtqev5?si=9yObP37pR8u-1sGmBgyxGw')">Brian Eno</span>, but with vocals?</h3>
                <h3>Want to know how positive your favorite playlist is?</h3>
                <h3>Now you can! Simply drag and drop Spotify content into this webpage or paste a Spotify link in the search bar above to start searching. Refine your search by specifying genres, audio features and more.</h3>
              </div>`,

};