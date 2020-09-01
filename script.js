const ulItem = document.createElement("ul");
let sideUlItems = document.createElement("ul");
const videoBottomBar = document.querySelector(".course-wrap-bottom");
const changeViewButton = document.createElement("button");
changeViewButton.setAttribute("class", "btn btn-slim custom-button");
const player = document.querySelector("#player");
changeViewButton.appendChild(document.createTextNode("Change View"));
const afterVideoPlayer = document.querySelector(
  ".hero.hero-gradient .container .relative",
);

function listItems() {
  // Read the dock preference from the local storage
  const dockPreference = localStorage.getItem("preference");

  console.log("[CH Companion Loaded New]");
  const mainFragment = document.createDocumentFragment();
  const sidebarFragment = document.createDocumentFragment();
  const list = document.querySelector("#player_playlist");
  // This will be null if we're not logged in
  if (!list) return;
  const items = list.children[0].children;
  for (let i = 0; i < items.length; i++) {
    const text = items[i].textContent;

    const liItem = document.createElement("li");
    const sidebarListItem = document.createElement("li");

    sidebarListItem.addEventListener("click", () => {
      console.log("Clicked", i, text);
      items[i].click();
    });
    liItem.addEventListener("click", () => {
      console.log("Clicked", i, text);
      items[i].click();
    });
    liItem.innerHTML = `<div>
                        <label class="">${text}</label>
                        </div>`;
    sidebarListItem.innerHTML = `<div>
                        <label class="">${text}</label>
                        </div>`;
    mainFragment.appendChild(liItem);
    sidebarFragment.appendChild(sidebarListItem);
  }
  ulItem.classList.add("ul-container");
  ulItem.append(mainFragment);
  sideUlItems.setAttribute("class", "ul-container sidebar-ul");
  sideUlItems.append(sidebarFragment);
  afterVideoPlayer.append(ulItem);
  sideUlItems.style.paddingTop = "0px";
  sideUlItems.style.marginTop = "0px";
  sideUlItems.style.marginBottom = "0px";
  sideUlItems.style.paddingBottom = "0px";
  console.log("listItems -> dockPreference", dockPreference);
  if (dockPreference) {
    player.setAttribute("data-width", dockPreference);
  } else {
    player.setAttribute("data-width", "full");
  }
  if (dockPreference === "full") {
    makeItFullWidth();
  } else {
    makeItDockWidth();
  }
  videoBottomBar.appendChild(changeViewButton);
}
const makeItFullWidth = () => {
  player.setAttribute("data-width", "full");
  localStorage.setItem("preference", "full");
  // player.style.width = "100%";
  player.classList.add("player__full-width");
  player.classList.remove("player__dock-width");
  sideUlItems.style.display = "none";
};
const makeItDockWidth = () => {
  // Make it 70% then make it 100% and show the title list
  player.classList.add("player__dock-width");
  player.classList.remove("player__full-width");
  player.setAttribute("data-width", "dock");
  localStorage.setItem("preference", "dock");
  // player.style.width = "70%";
  const playerParent = player.parentNode;
  sideUlItems.style.display = "block";
  playerParent.append(sideUlItems);

  playerParent.style.display = "flex";
};
const handleChangeView = () => {
  // If the video player width is 100% then make it 70% and render the title items
  // aside it
  const currentPreference = player.getAttribute("data-width");
  if (currentPreference === "full") {
    makeItDockWidth();
  } else {
    makeItFullWidth();
    // Make it full then make it 100% and hide the title list
  }
  // (Optional) Side the preference into local storage
};

listItems();
changeViewButton.addEventListener("click", handleChangeView);
