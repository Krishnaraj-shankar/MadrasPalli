window.addEventListener("popstate", (event) => {
  console.log(event.state);
  const currentPath = window.location.pathname;
  console.log(currentPath);
  if (currentPath == "/") {
    location.href = "/";
  } else {
    window.history.pushState({}, "", currentPath);
    ajax.get(currentPath);
  }
});

let xjarqseut10 = document.querySelector('[data-id="xjarqseut10"]');
let xjarqseut11 = document.querySelector('[data-id="xjarqseut11"]');
let xjarqseut12 = document.querySelector('[data-id="xjarqseut12"]');

//creating map to address the route to specific subject
let subjectMap = new Map([
  ["Mathematics", "math"],
  ["Science", "science"],
  ["Social Science", "social"],
  ["Physics", "phy"],
  ["Chemistry", "chem"],
  ["Computer Science", "comp"],
  ["Biology", "bio"],
]);

xjarqseut10.addEventListener("click", function (event) {
  let url = getURL(event);
  let chosenClass = "/10th";
  url = `${chosenClass}${url}`;
  console.log(url);
  window.history.pushState({}, "", url);
  ajax.get(url);
});

xjarqseut11.addEventListener("click", function (event) {
  let url = getURL(event);
  let chosenClass = "/11th";
  url = `${chosenClass}${url}`;
  console.log(url);
  window.history.pushState({}, "", url);
  ajax.get(url);
});

xjarqseut12.addEventListener("click", function (event) {
  let url = getURL(event);
  let chosenClass = "/12th";
  url = `${chosenClass}${url}`;
  console.log(url);
  window.history.pushState({}, "", url);
  ajax.get(url);
});

function getSubjectName(target) {
  if (target.tagName == "IMG") return target.parentElement.innerText;
  return target.innerText;
}

function getURL(event) {
  let chosenSubject;
  chosenSubject = getSubjectName(event.target);
  chosenSubject = subjectMap.get(chosenSubject);
  return chosenSubject;
}

//demo

function demoxml() {
  ajax.getDemo("/demo");
  window.history.pushState({}, "", "/demo");
}

function fun1(event) {
  debugger;
  console.log(event.target);
}
