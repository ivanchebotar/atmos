// CSS imports
import '../styles/style.scss';

// JS imports
import $ from 'jquery';
import ready, { HTML } from './utils';
import { initMobileNav } from './components/initMobileNav';

ready(() => {
  HTML.classList.add('is-loaded');

  initMobileNav();
});
