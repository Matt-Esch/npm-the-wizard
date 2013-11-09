var isHash = require('./ishash.js');
// Implement the js-git object interface using github APIs
module.exports = function (repo) {

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
  var root = this.root;
  return this.resolve(hash, onHash);

  function onHash(err, hash) {
    if (err) return callback(err);
    callback("TODO: Implement repo.load");
  }
}

function save(object, callback) {
  if (!callback) return save.bind(this, object);
  throw "TODO: Implement repo.save()";
}

function loadAs(type, hash, callback) {
  if (!callback) return loadAs.bind(this, type, hash);
  throw "TODO: Implement repo.loadAs()";
}

function saveAs(type, body, callback) {
  if (!callback) return saveAs.bind(this, type, body);
  throw "TODO: Implement repo.saveAs()";
}

function remove(hash, callback) {
  if (!callback) return remove.bind(this, hash);
  throw "TODO: Implement repo.remove()";
}