module.exports = function (root) {
  var repo = {
    apiGet: apiGet
  };

  function apiGet(url, callback) {
    url = 'https://api.github.com' + url.replace(":root", root);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
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

  require('./objects.js')(repo);

  require('./refs.js')(repo);

  return repo;
};