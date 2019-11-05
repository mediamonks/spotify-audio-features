const debugMode = true;

let debugPreference = localStorage.getItem('debug');
if (debugPreference !== null) {
  debugPreference = (debugPreference === 'true' || debugPreference === true) ? true : false;
}

export const config = Object.freeze({
  production: false, // TODO: set to true in bundling process
  debug: debugPreference !== null ? debugPreference : debugMode,
  appName: 'Spotify Audio Features experiment',
  appID: 'spotify_audio_features',
  spotifyClientId: '51293fca304b49a0b24c779966829ca9',
});