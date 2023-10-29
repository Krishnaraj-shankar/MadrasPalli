window.addEventListener("popstate", (event) => {
  console.log(event.state);
  const currentPath = window.location.pathname;
  console.log("currentPath: ",currentPath);
  if (currentPath == "/") {
    // window.history.pushState({}, "", currentPath);
    location.href = "/";
  } else {
    // window.history.pushState({}, "", currentPath);
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
  debugger;
  console.log("pushed: ",url);
  window.history.pushState({}, "", url);
  ajax.get(url);
});

xjarqseut11.addEventListener("click", function (event) {
  let url = getURL(event);
  let chosenClass = "/11th";
  url = `${chosenClass}${url}`;
  console.log("pushed: ",url);
  window.history.pushState({}, "", url);
  ajax.get(url);
});

xjarqseut12.addEventListener("click", function (event) {
  let url = getURL(event);
  let chosenClass = "/12th";
  url = `${chosenClass}${url}`;
  console.log("pushed: ",url);
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

function EventListenerForMaths(classBelongs) {
  debugger;
  let eventtriger = document.querySelectorAll(
    `.chapters .accordion-body [data-id1="${classBelongs}"]`
  );
  console.log(eventtriger);
  eventtriger.forEach((element) => {
    element.addEventListener("click", (event) => {
      debugger;
      let chapter_exercise = event.target.parentElement.attributes[1].value;
      let type = event.target.innerText;

      console.log(event.target.parentElement.attributes[1].value);
      console.log(event.target);
      console.log(event.target.innerText);

      let newUrl = location.href + "chapter";
      console.log("pushed: ",newUrl);
      window.history.pushState({}, "", newUrl);

      ajax.post(
        {
          chapter_exercise: chapter_exercise,
          type: type,
        },
        newUrl
      );
    });
  });
}

function EventListenerForSocial(classBelongs) {
  let eventtriger = document.querySelectorAll("[data-id1]");
  eventtriger.forEach((element) => {
    element.addEventListener("click", (event) => {
      debugger;
      let dataIdValue = event.target.parentElement.attributes[1].value;
      let newUrl = location.href + "chapter";
      let chapterCategory = dataIdValue.split("-")[0];
      let chapter_no = dataIdValue.split("-")[1];
      if (chapterCategory == "Geography") {
        chapter_no = Number(chapter_no) + 10;
      } else if (chapterCategory == "Civics") {
        chapter_no = Number(chapter_no) + 17;
      } else if (chapterCategory == "Economics") {
        chapter_no = Number(chapter_no) + 22;
      }
      console.log("pushed: ",newUrl);
      window.history.pushState({}, "", newUrl);
      ajax.post(
        {
          chapter_no: chapter_no,
        },
        newUrl
      );
    });
  });
}

function EventListenerForCPS(classBelongs) {
  let eventtriger = document.querySelectorAll("[data-id1]");
  eventtriger.forEach((element) => {
    element.addEventListener("click", (event) => {
      debugger;
      let element = event.target;
      let type = element.innerText;
      let chapter = element.getAttribute("data-id1");
      let newUrl = location.href + "chapter";
      console.log("pushed: ",newUrl);
      window.history.pushState({}, "", newUrl);
      ajax.post(
        {
          chapter_no: chapter,
          type: type
        },
        newUrl
      );
    });
  });
}

function embedurlParser(data,url) {
  debugger;
  data.forEach((datum, index) => {
    debugger;
    if(data[index].image != null){
      data[index].image = datum.image.replaceAll("'","");
      if(!data[index].image.includes(".png")){
        data[index].image += ".png";
      }
      if(url.includes("12thmath")){
        data[index].image = "maths12/"+data[index].image;
      } else if(url.includes("10thmath")){
        data[index].image = "maths10/"+data[index].image;
      } else if(url.includes("11thmath")){
        data[index].image = "maths11/"+data[index].image;
      }
    }
    let youtube_link = datum.youtube_link;
    if (youtube_link.includes("'")) {
      if (youtube_link.includes("https://youtu.be/")) {
        let without_SingleQuote = youtube_link.split("'")[1];
        let embed_link = without_SingleQuote.replace(
          "https://youtu.be/",
          "https://www.youtube.com/embed/"
        );
        data[index].youtube_link = embed_link;
      }
    } else {
      let embed_link = youtube_link.replace(
        "https://youtu.be/",
        "https://www.youtube.com/embed/"
      );
      data[index].youtube_link = embed_link;
    }
  });
  console.log(data);
  return data;
}
