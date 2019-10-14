// ESM imports
import { config } from './config.js';
import Vue from '/node_modules/vue/dist/vue.esm.browser.js';

console.log(config);

// Wrap in closure.
(() => {

  new Vue({
    el: '#app',

    template:  `<div id="app">
                  <span>😁😁😁 Vue werkt! 😁😁😁</span>
                </div>`,
  });

})();