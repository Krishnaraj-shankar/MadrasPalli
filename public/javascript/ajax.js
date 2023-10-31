var ajax = {};

ajax.get = (url) => {
  try {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    // let token = localStorage.getItem("daeb2y5p8");
    // console.log("token ", token);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader("Content-Type", "application/json");
    // token ? xhr.setRequestHeader("Authorization", `Bearer ${token}`) : null;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let json = JSON.parse(xhr.responseText);
          let fileContent = json.fileContent;
          const template = Handlebars.compile(fileContent);
          let html;
          if (url == "/10thsocial") {
            html = template({ sub: json.sub, title: json.title });
          } else {
            html = template({ chapter: json.chapter, title: json.title });
          }
          document.getElementById("container").innerHTML = "";
          document.getElementById("container").innerHTML = html;
          if (url == "/10thmath") {
            EventListenerForMaths("event10");
          } else if (url == "/11thmath") {
            EventListenerForMaths("event11");
          } else if (url == "/12thmath") {
            EventListenerForMaths("event12");
          } else if (url == "/10thsocial") {
            EventListenerForSocial("event10");
          } else if (url == "/11thchem") {
            EventListenerForCPS("event11");
          } else if(url == '/11thphy'){
            EventListenerForCPS("event11");
          } else if(url == '/10thscience'){
            EventListenerForCPS("event10");
          } else if(url == '/12thchem'){
            EventListenerForCPS("event12");
          } else if(url == '/12thphy'){
            EventListenerForCPS("event12");
          }
        } else {
          throw new error(
            "failed request url: ",
            url,
            " status code: ",
            xhr.status
          );
        }
      }
    };
    xhr.send();
  } catch (error) {
    console.log("error : ", error);
  }
};

ajax.post = (jsonData, url) => {
  // Create a new XMLHttpRequest object
  try {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json"); // For JSON data
    jsonData = JSON.stringify(jsonData);
    xhr.send(jsonData);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // console.log(xhr.responseText);
          let json = JSON.parse(xhr.responseText);
          let fileContent = json.fileContent;
          const template = Handlebars.compile(fileContent);
          let html;
          json.data = embedurlParser(json.data,url);
          if (json.data.length == 0) {
            html = template({ data: json.data, no_data: true });
          } else {
            html = template({ data: json.data });
          }
          document.getElementById("container").innerHTML = "";
          document.getElementById("container").innerHTML = html;
        } else {
          throw new Error(
            "failed request url: " + url + " status code : " + xhr.status
          );
        }
      }
    };
  } catch (error) {
    console.log("error : ", error);
  }
};
