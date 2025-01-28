import { initLoader } from './initLoader';

export default function initTabs() {
  const tabs = document.querySelectorAll('.menu-list__elem');
  const contents = document.querySelectorAll('section');
  const body = document.querySelector('body');
  const { showLoader, hideLoader } = initLoader();

  function showContent(tabId) {
    contents.forEach(content => {
      content.classList.remove('visible');
    });

    const targetContent = document.getElementById(tabId);
    if (targetContent) {
      setTimeout(() => {
        targetContent.classList.add('visible');
      }, 300);
    }
  }

  function loadTabContent(tabId) {
    showLoader();
    body.classList.add('loader-visible');
    setTimeout(() => {
      hideLoader();
      body.classList.remove('loader-visible');
      showContent(tabId);
    }, 1000);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(tab => tab.classList.remove('active'));

      tab.classList.add('active');

      const tabId = tab.getAttribute('data-page');
      loadTabContent(tabId);
    });
  });

  tabs[0].click();
}
