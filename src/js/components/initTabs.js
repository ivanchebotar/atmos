export default function initTabs() {
  const tabs = document.querySelectorAll('.menu-list__elem');
  const loader = document.querySelector('.loader');
  const contents = document.querySelectorAll('section');

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
    loader.classList.add('visible');
    setTimeout(() => {
      loader.classList.remove('visible');
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
