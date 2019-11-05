import { config } from '../config.js';

export function log (...args) {
  if (config.debug === true) {
    console.log(...args);
  }
}

export function warn (...args) {
  if (config.debug === true) {
    console.warn(...args);
  }
}

export function error (...args) {
  if (config.debug === true) {
    console.error(...args);
  }
}