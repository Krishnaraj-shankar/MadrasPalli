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
  let chosenSubject = event.target.innerText;
  chosenSubject = subjectMap.get(chosenSubject);
  let chosenClass = "/10th";
  let url = chosenClass + chosenSubject;
  console.log(url);
  ajax.get(url);
});

xjarqseut11.addEventListener("click", function (event) {
  let chosenSubject = event.target.innerText;
  chosenSubject = subjectMap.get(chosenSubject);
  let chosenClass = "/11th";
  let url = chosenClass + chosenSubject;
  console.log(url);
  ajax.get(url);
});

xjarqseut12.addEventListener("click", function (event) {
  let chosenSubject = event.target.innerText;
  chosenSubject = subjectMap.get(chosenSubject);
  let chosenClass = "/12th";
  let url = chosenClass + chosenSubject;
  console.log(url);
  ajax.get(url);
});
