var ajax = {};

ajax.get = (url) => {
  try {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    let token = localStorage.getItem("daeb2y5p8");
    console.log("token ", token);
    xhr.setRequestHeader("Content-Type", "application/json");
    token ? xhr.setRequestHeader("Authorization", `Bearer ${token}`) : null;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          document.getElementById("container").innerHTML = "";
          document.getElementById("container").innerHTML = xhr.responseText;
        } else {
          throw new Error(
            "failed request url: " + url + " status code : " + xhr.status
          );
        }
      }
    };

    xhr.send();
  } catch (error) {
    console.log("error : ", error);
  }
};

ajax.getDemo = (url) => {
  try {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    // let token = localStorage.getItem("daeb2y5p8");
    // console.log("token ", token);
    xhr.setRequestHeader("Content-Type", "application/json");
    // token ? xhr.setRequestHeader("Authorization", `Bearer ${token}`) : null;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          debugger;
          let json = JSON.parse(xhr.responseText);
          let fileContent = json.fileContent;
          const template = Handlebars.compile(fileContent);
          const html = template({ chapter: json.chapter, title: json.title });
          document.getElementById("container").innerHTML = "";
          document.getElementById("container").innerHTML = html;
        } else {
          throw new Error(
            "failed request url: " + url + " status code : " + xhr.status
          );
        }
      }
    };

    xhr.send();
  } catch (error) {
    console.log("error : ", error);
  }
};
