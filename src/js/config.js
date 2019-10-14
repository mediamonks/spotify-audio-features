const debugMode = true;

let debugPreference = localStorage.getItem('debug');
if (debugPreference !== null) {
  debugPreference = (debugPreference === 'true' || debugPreference === true) ? true : false;
}

export const config = Object.freeze({
  debug: debugPreference !== null ? debugPreference : debugMode,
  // Updaten bij wijzingen in logica die verder gaan dan bijvoorbeeld bugfixes.
  appName: 'VueJS ES2015(+) template 2019',
});