const ul = document.querySelector("#lessons-list");
const courseIDItem = document.querySelector(".player.player-full");
const courseID = courseIDItem ? +courseIDItem.getAttribute("data-id") : null;
console.log("called");
let data = [];

let progressBar = document.createElement("div");
const progressTitle = document.createElement("p");
const afterVideoPlayer = document.querySelector(
  ".hero.hero-gradient .container .relative",
);
// if (
//   afterVideoPlayer &&
//   afterVideoPlayer.contains(afterVideoPlayer.querySelector(".hero-source"))
// ) {
//   afterVideoPlayer.removeChild(afterVideoPlayer.querySelector(".hero-source"));
// }
const ulItem = document.createElement("ul");

function ListItem(title, duration, checked, percentage) {
  this.title = title;
  this.duration = duration;
  this.checked = checked;
  this.percentage = percentage;

  this.createListItem = (index) => {
    const liItem = document.createElement("li");
    liItem.setAttribute("data-item-id", index);
    liItem.innerHTML = `
  <div>
  <label class="">${this.title} <span>${
      this.percentage
    }%</span><input type="checkbox" ${this.checked ? "checked" : ""}
  ${this.checked ? "disabled" : ""}
  >
  <span class="checkmark"></span>
</label>
  </div>
  <span>${this.duration}</span>`;
    liItem.classList.add("li-list");

    return liItem;
  };
}
function calculateTime(arr) {
  return arr.length > 0
    ? arr.reduce((acc, curr) => {
        let [a_hr, a_min, a_sec] = acc.split(":").map((el) => +el);
        // eslint-disable-next-line no-unused-vars
        let [c_hr, c_min, c_sec] = curr.split(":").map((el) => +el);
        a_sec = a_sec + c_sec;
        if (a_sec > 60) {
          a_sec = a_sec - 60;
          if (a_min <= 60) {
            a_min = a_min + c_min + 1;
          } else {
            a_min = a_min + c_min - 60;
            a_hr++;
          }
        } else {
          if (a_min <= 60) {
            a_min = a_min + c_min;
          } else {
            a_min = a_min + c_min - 60;
            a_hr++;
          }
        }
        return `${a_hr < 10 ? "0" + a_hr : a_hr}:${
          a_min < 10 ? "0" + a_min : a_min
        }:${a_sec < 10 ? "0" + a_sec : a_sec}`;
      })
    : "00:00:00";
}
function listItems() {
  const fragment = document.createDocumentFragment();
  const items = document.querySelector("#player_playlist").children[0].children;
  for (let i = 0; i < items.length; i++) {
    const text = items[i].textContent;
    const liItem = document.createElement("li");
    liItem.innerHTML = `<div>
                        <label class="">${text}</label>
                        </div>`;
    fragment.appendChild(liItem);
  }
  ulItem.classList.add("ul-container");
  ulItem.append(fragment);
  //   afterVideoPlayer.insertAdjacentHTML(
  //     "afterbegin",
  //     `
  //   <div id="progress__container">
  //   <div class="heading__container">
  //       <h2 class="progress-heading">Course Progress%</h2>
  //       <p>something</p>
  //   </div>
  //   </div>
  // `,
  //   ),
  afterVideoPlayer.append(ulItem);
}
function renderItems(items) {
  const fragement = document.createDocumentFragment();
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const percentage = item ? item.percent : 0;
    const title = data[i].title;
    const liItem = new ListItem(
      title,
      data[i].duration,
      percentage === 100,
      percentage,
    ).createListItem(i);
    fragement.append(liItem);
    total += percentage;
  }
  const finalPercentage = `${Math.floor(total / items.length)}%`;
  progressTitle.innerText = finalPercentage;

  progressBar.style.width = finalPercentage;
  // ulItem.in
  afterVideoPlayer.querySelector(
    ".progress-heading",
  ).textContent = `Course Progress ${finalPercentage}`;
  ulItem.innerHTML = "";
  ulItem.append(fragement);
}
const getTimeInMilliseconds = (str) => {
  var hms = str; // your input string
  var a = hms.split(":"); // split it at the colons
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  const t = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  return t - 1;
};
function handleLessonComplete(event) {
  const index = +event.target.closest("li").getAttribute("data-item-id");
  if (courseID in localStorage) {
    const course = retrieve(courseID);

    const durationInMilli = getTimeInMilliseconds(data[index].duration);
    const res = {
      seek: 2,
      duration: durationInMilli,
      percent: 100,
    };
    course.data.lessons[index] = res;
    store(courseID, course);
    const fresh = retrieve(courseID);
    renderItems(fresh.data.lessons);
  }
  // find the index, change the property on localstorage, render out lis again
}
const store = (id, data) => {
  return localStorage.setItem(id, JSON.stringify(data));
};
const retrieve = (id) => {
  return JSON.parse(localStorage.getItem(id));
};
const calculateTotalTimeDone = () => {
  const done = ulItem.querySelectorAll(".li-list input:checked");
  const total = ulItem.querySelectorAll(".li-list");
  let courseDone = Array.from(done).map(
    (el) => el.closest("li").querySelector("div + span").textContent,
  );
  let totalTime = Array.from(total).map(
    (el) => el.closest("li").querySelector("div + span").textContent,
  );
  return {
    total: calculateTime(totalTime),
    courseDone: calculateTime(courseDone),
  };
};
console.log(courseID);

listItems();
if (courseID) {
  const list = ul ? ul.children : [];
  let total = 0;

  ulItem.classList.add("ul-list");
  const fragement = document.createDocumentFragment();
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const progress = item.querySelector("progress");
    const title = item.querySelector(".lessons-name").textContent;
    const duration = item.querySelector(".lessons-head .lessons-duration")
      .textContent;
    data.push({ title, duration });
    const progressValue = +progress.getAttribute("value");
    const percentage = Math.floor((progressValue / 100) * 100);
    const liItem = new ListItem(
      title,
      duration,
      progressValue === 100,
      percentage,
      progressValue,
    ).createListItem(i);
    fragement.append(liItem);
    total += percentage;
  }
  ulItem.append(fragement);
  window.ulItem = ulItem;
  ulItem.addEventListener("change", handleLessonComplete);

  const finalPercentage = Math.floor(total / ul.children.length);

  progressTitle.classList.add("progressTitle");
  progressTitle.innerText = finalPercentage + "%";
  afterVideoPlayer.insertAdjacentHTML(
    "afterbegin",
    `
  <div id="progress__container">
  <div class="heading__container">
      <h2 class="progress-heading">Course Progress ${finalPercentage}%</h2>
      <p>${calculateTotalTimeDone().courseDone} / ${
      calculateTotalTimeDone().total
    }</p>
  </div>
  </div>
`,
  );
  // const progressContainer = afterVideoPlayer.querySelector(
  //   "#progress__container",
  // );
  // progressContainer.append(ulItem);
  // window.progressTitle = progressTitle;
  // window.progressBar = progressBar;
  // progressBar.style.top = "0";
  // progressBar.classList.add("progressBar");
  // progressBar.style.width = finalPercentage + "%";
  // document.body.append(progressBar);
  // document.body.append(progressTitle);
}
