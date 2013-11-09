var isHash = require('./ishash.js');
var bops = require('bops');
var decoders = require('./decoders.js');

// Implement the js-git object interface using github APIs
module.exports = function (repo) {

  repo.typeCache = {};

  // Add Object store capability to the system
  repo.load = load;     // (hash-ish) -> object
  repo.save = save;     // (object) -> hash
  repo.loadAs = loadAs; // (type, hash-ish) -> value
  repo.saveAs = saveAs; // (type, value) -> hash
  repo.remove = remove; // (hash)

  // This is a fallback resolve in case there is no refs system installed.
  if (!repo.resolve) repo.resolve = function (hash, callback) {
    if (isHash(hash)) return callback(null, hash);
    return callback(new Error("This repo only supports direct hashes"));
  };

};

function load(hash, callback) {
  if (!callback) return load.bind(this, hash);
  var type = this.typeCache[hash];
  if (!type) return callback(new Error("Raw load is not supported for unknown hashes"));
  return this.loadAs(type, hash, onLoad);

  function onLoad(err, body) {
    if (err) return callback(err);
    return callback(null, {
      type: type,
      body: body
    });
  }
}

function save(object, callback) {
  if (!callback) return save.bind(this, object);
  throw "TODO: Implement repo.save()";
}

function loadAs(type, hash, callback) {
  if (!callback) return loadAs.bind(this, type, hash);
  var repo = this;
  return repo.resolve(hash, onHash);

  function onHash(err, hash) {
    if (err) return callback(err);
    repo.apiGet("/repos/:root/git/" + type + "s/" + hash, onValue);
  }

  function onValue(err, result) {
    if (err) return callback(err);
    repo.typeCache[result.sha] = type;
    var body;
    try {
      body = decoders[type].call(repo, result);
    }
    catch (err) {
      return callback(err);
    }
    return callback(null, body);
  }
}

function saveAs(type, body, callback) {
  if (!callback) return saveAs.bind(this, type, body);
  throw "TODO: Implement repo.saveAs()";
}

function remove(hash, callback) {
  if (!callback) return remove.bind(this, hash);
  throw "TODO: Implement repo.remove()";
}


