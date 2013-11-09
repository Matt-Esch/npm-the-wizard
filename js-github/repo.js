module.exports = function (root) {
  var repo = { root: root };

  require('./objects.js')(repo);

  require('./refs.js')(repo);

  return repo;
};