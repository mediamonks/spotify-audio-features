# Spotify Audio Features
Besides simple metadata, such as the artist and name of a track, Spotify also offers song analysis data through their API: so called [audio features](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/) and [audio analysis](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/).
This tool gives you a quick overview of a subset (for now) of this data by letting you paste or drag in a Spotify link to a track, album or playlist.

# Improvements
(Better) dialogs.
View calculated song segments, BPM, key, genre.
View audio features per genre?
The ability to enter artist links.
Asking the user what to do when the Spotify API returns limited data (e.g. only 100 results per time).

# Contribute
- Feel free to fork and submit PRs
- Please use `pnpm`, not `npm` (install at https://github.com/pnpm/pnpm#install)
- `pnpm i`
- Run `pnpm run serve` to serve app locally
- Run `pnpm run compile` to compile app to /dist
- To debug on production: `localStorage.setItem('debug', true)` + refresh page