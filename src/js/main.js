// CSS imports
import '../styles/style.scss';

// JS imports
import $ from 'jquery';
import ready, { HTML } from './utils';
import initTabs from './components/initTabs';
import initSearch from './components/initSerach';

ready(() => {
  HTML.classList.add('is-loaded');

  initTabs();
  initSearch();
});


