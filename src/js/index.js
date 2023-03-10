/* eslint-disable no-unused-vars */
import arrowFunc from './test-es6';

// call test func
arrowFunc();

const template = document.querySelector('.starter-template');
if (template) {
  const testEl = document.createElement('code');
  testEl.className = 'px-2 py-1 border rounded-sm';
  testEl.textContent = 'Hello there';
  template.append(testEl);
}
