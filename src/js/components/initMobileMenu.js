export default function initMobileMenu () {
  const openers = document.querySelectorAll(".menu__opener");
  const closes = document.querySelectorAll(".menu__close");
  const menuItems = document.querySelectorAll(".menu-list__elem");
  const body = document.querySelector('body');
  const activeClass = "nav-active";

  function menuOpener (elems) {
    elems.forEach(elem => {
      elem.addEventListener("click", () => {
        body.classList.toggle(activeClass);
      })
    })
  }

  function handleClick () {
    if (body.classList.contains(activeClass)) {
      body.classList.remove(activeClass);
    }
  }

  menuOpener(openers);
  menuOpener(closes);
  
  menuItems.forEach(item => {
    item.addEventListener("click", handleClick);
  });
}
