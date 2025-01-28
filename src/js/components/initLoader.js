export function initLoader() {
  const main = document.getElementById("main");

  if (main) {
    const loaderElement = document.createElement("div");
    loaderElement.classList.add("loader");
    loaderElement.innerHTML = `
      <div class="loader__spinner"></div>
    `;

    main.appendChild(loaderElement);

    return {
      showLoader: () => {
        loaderElement.style.display = "block";
      },
      hideLoader: () => {
        loaderElement.style.display = "none";
      },
    };
  } else {
    console.error("Element with id 'main' not found");
    return {
      showLoader: () => console.error("Cannot show loader: 'main' element not found"),
      hideLoader: () => console.error("Cannot hide loader: 'main' element not found"),
    };
  }
}
