var bops = require('bops');
module.exports = function (root, accessToken) {
  var repo = {
    apiGet: apiGet,
    apiPost: apiPost
  };
  var auth;
  if (!accessToken) {
    var username = prompt("Enter github username");
    if (!username) return;
    var password = prompt("Enter github password");
    if (!password) return;
    auth = bops.to(bops.from(username + ":" + password), "base64");
  }

  require('./objects.js')(repo);

  require('./refs.js')(repo);

  require('js-git/mixins/walkers.js')(repo);

  return repo;

  function apiGet(url, callback) {
    url = 'https://api.github.com' + url.replace(":root", root);
    if (accessToken) url += "?access_token=" + accessToken;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    if (auth) xhr.setRequestHeader("Authorization", "Basic " + auth);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status !== 200) {
        return callback(new Error("Invalid HTTP response: " + xhr.status));
      }
      var response;
      try {
        response = JSON.parse(xhr.responseText);
      }
      catch (err) {
        return callback(err);
      }
      return callback(null, response);
    };
    xhr.send();
  }

  function apiPost(url, body, callback) {
    url = 'https://api.github.com' + url.replace(":root", root);
    if (accessToken) url += "?access_token=" + accessToken;
    var json;
    try {
      json = JSON.stringify(body);
    }
    catch (err) {
      return callback(err);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    if (auth) xhr.setRequestHeader("Authorization", "Basic " + auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status < 200 || xhr.status >= 300) {
        return callback(new Error("Invalid HTTP response: " + xhr.status));
      }
      var response;
      try {
        response = JSON.parse(xhr.responseText);
      }
      catch (err) {
        return callback(err);
      }
      return callback(null, response);
    };
    xhr.send(json);
  }

};
