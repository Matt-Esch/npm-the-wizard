var isHash = require('./ishash.js');
// Implement the js-git references interface using github APIs
module.exports = function (repo) {

  repo.resolve = resolve;       // (hash-ish) -> hash
  repo.updateHead = updateHead; // (hash)
  repo.getHead = getHead;       // () -> ref
  repo.setHead = setHead;       // (ref)
  repo.readRef = readRef;       // (ref) -> hash
  repo.writeRef = writeRef;     // (ref, hash)
  repo.deleteRef = deleteRef;   // (ref)
  repo.listRefs = listRefs;     // (prefix) -> refs

};

function resolve(hash, callback) {
  if (!callback) return resolve.bind(this, hash);
  hash = hash.trim();
  var repo = this;
  if (isHash(hash)) return callback(null, hash);
  if (hash === "HEAD") return repo.getHead(onBranch);
  if ((/^refs\//).test(hash)) {
    return db.get(hash, checkBranch);
  }
  return checkBranch();

  function onBranch(err, ref) {
    if (err) return callback(err);
    if (!ref) return callback();
    return repo.resolve(ref, callback);
  }

  function checkBranch(err, hash) {
    if (err && err.code !== "ENOENT") return callback(err);
    if (hash) {
      return repo.resolve(hash, callback);
    }
    return db.get("refs/heads/" + hash, checkTag);
  }

  function checkTag(err, hash) {
    if (err && err.code !== "ENOENT") return callback(err);
    if (hash) {
      return repo.resolve(hash, callback);
    }
    return db.get("refs/tags/" + hash, final);
  }

  function final(err, hash) {
    if (err) return callback(err);
    if (hash) {
      return repo.resolve(hash, callback);
    }
    err = new Error("ENOENT: Cannot find " + hash);
    err.code = "ENOENT";
    return callback(err);
  }
}

function updateHead(hash, callback) {
  if (!callback) return updateHead.bind(this, hash);
  throw "TODO: Implement repo.updateHead";
}

function getHead(callback) {
  if (!callback) return getHead.bind(this);
  this.apiGet("/repos/:root/git/refs/heads/master", function (err, result) {
    if (err) return callback(err);
    callback(null, result.object.sha);
  });
}

function setHead(branchName, callback) {
  if (!callback) return setHead.bind(this, branchName);
  throw "TODO: Implement repo.setHead";
}

function readRef(ref, callback) {
  if (!callback) return readRef.bind(this, ref);
  if (!(/^ref\//).test(ref)) {
    return callback(new Error("Invalid ref: " + ref));
  }
  return this.apiGet("/repos/:root/git/" + ref, onRef);

  function onRef(err, result) {
    if (err) return callback(err);
    return callback(null, result.object.sha);
  }
}

function writeRef(ref, hash, callback) {
  if (!callback) return writeRef(this, ref, hash);
  if (!(/^ref\//).test(ref)) {
    return callback(new Error("Invalid ref: " + ref));
  }
  this.apiPost("/repos/:root/git/ref", {
    sha: hash
  }, function (err) {
    if (err) return callback(err);
    callback();
  });
}

function deleteRef(ref, callback) {
  if (!callback) return deleteRef(this, ref);
  throw "TODO: Implement repo.deleteRef";
}

function listRefs(prefix, callback) {
  if (!callback) return listRefs.bind(this, prefix);
  throw "TODO: Implement repo.listRefs";
}

