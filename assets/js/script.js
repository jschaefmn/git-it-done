var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function (user) {
  // format the github api URL
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make request to the URL
  fetch(apiUrl)
    .then(function (response) {
      // request successful
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function (error) {
      // notice this `catch()` gettting chained onto the end of `.then()` method
      alert("Unable to connect to GitHub");
    })
};

var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value form input element
  var username = nameInputEl.value.trim();
  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
  console.log(event)
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = "No Repositories Found.";
    return;
  }
  console.log(repos);
  console.log(searchTerm);
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append to container
    repoEl.appendChild(titleEl);

    //apend container to the dom
    repoContainerEl.appendChild(repoEl);
  }
}

var getFeaturedRepos = function (language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";


  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      console.log("Error: GitHub User not found")
    }
  });
};

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute("data-language");
  if (language) {
    getFeaturedRepos(language);
    // clear old content
    repoContainerEl.textContent = "";
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);