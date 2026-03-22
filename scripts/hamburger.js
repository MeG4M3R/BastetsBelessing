const hamburgerButton = document.querySelector(".hamburger-button");
const hamburgerList = document.querySelector(".hamburger-list");
hamburgerButton.addEventListener("click", () => {
  hamburgerList.classList.toggle("show");
});
// Credits to https://www.youtube.com/watch?v=gOXYcXKVl1c for help with the hamburger menu code.
