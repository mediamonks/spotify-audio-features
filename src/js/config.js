const debugMode = true;

let debugPreference = localStorage.getItem('debug');
if (debugPreference !== null) {
  debugPreference = (debugPreference === 'true' || debugPreference === true) ? true : false;
}

export const config = Object.freeze({
  debug: debugPreference !== null ? debugPreference : debugMode,
  // Updaten bij wijzingen in logica die verder gaan dan bijvoorbeeld bugfixes.
  appName: 'Spotify Audio Features experiment',
  spotifyClientId: '51293fca304b49a0b24c779966829ca9',
});