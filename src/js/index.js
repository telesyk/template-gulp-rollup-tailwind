/* eslint-disable no-unused-vars */
/* Add Bootstrap bundle with all modules */
// import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
// import * as bootstrap from 'bootstrap/dist/js/bootstrap.esm.js'
// import * as Popper from '@popperjs/core'
// import { Dropdown } from 'bootstrap';
import arrowFunc from './test-es6';

// document.querySelectorAll('[data-bs-toggle="dropdown"]')
//   .forEach(dropdown => new bootstrap.Dropdown(dropdown))

// call test func
arrowFunc();

const template = document.querySelector('.starter-template');
if (template) {
  const testEl = document.createElement('code');
  testEl.className = 'px-2 py-1 border rounded-1';
  testEl.textContent = 'Hello there';
  template.append(testEl);
}
