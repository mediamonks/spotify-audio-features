# Spotify Audio Features
Besides simple metadata, such as the artist and name of a track, Spotify also offers song analysis data through their API: so called [audio features](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/) and [audio analysis](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/).
This tool gives you a quick overview of a subset (for now) of this data by letting you paste or drag in a Spotify link to a track, album or playlist.

Use this tool at: [https://spotify-audio-features.eu.dev.monkapps.com/](https://spotify-audio-features.eu.dev.monkapps.com/) or [https://spotify.anoesjsadraee.com/](https://spotify.anoesjsadraee.com/)

# Use cases
- Get easy insight in audio features of Spotify content.
- Understand trends and movements by easily finding similar tracks.
- Find recommendations by up to 5 seed tracks/artists/genres and refine results by audio features.

# Contribute
- Feel free to fork and submit PRs
- Please use `pnpm`, not `npm` (install at https://github.com/pnpm/pnpm#install)
- `pnpm i`
- Run `pnpm run serve` to serve app locally
- Run `pnpm run compile` to compile app to /dist
- To debug on production: `localStorage.setItem('debug', true)` + refresh page
