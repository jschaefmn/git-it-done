var getUserRepos = function (user) {
  // format the github api URL
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make request to the URL
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
    });
  });
};

getUserRepos("jschaefmn");