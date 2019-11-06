const production = false;

let debugPreference = localStorage.getItem('debug');
if (debugPreference !== null) {
  // TODO: debugPreference = JSON.parse(debugPreference)
  debugPreference = (debugPreference === 'true' || debugPreference === true) ? true : false;
}

export const config = Object.freeze({
  production,
  debug: debugPreference !== null ? debugPreference : !production,
  appName: 'Spotify Audio Features',
  appID: 'spotify_audio_features',
  spotifyClientId: '51293fca304b49a0b24c779966829ca9',
});