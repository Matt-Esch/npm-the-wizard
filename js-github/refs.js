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
  throw "TODO: Implement repo.resolve";
}

function updateHead(hash, callback) {
  if (!callback) return updateHead.bind(this, hash);
  throw "TODO: Implement repo.updateHead";
}

function getHead(callback) {
  if (!callback) return getHead.bind(this);
  throw "TODO: Implement repo.getHead";
}

function setHead(branchName, callback) {
  if (!callback) return setHead.bind(this, branchName);
  throw "TODO: Implement repo.setHead";
}

function readRef(ref, callback) {
  if (!callback) return readRef.bind(this, ref);
  throw "TODO: Implement repo.readRef";
}

function writeRef(ref, hash, callback) {
  if (!callback) return writeRef(this, ref, hash);
  throw "TODO: Implement repo.writeRef";
}

function deleteRef(ref, callback) {
  if (!callback) return deleteRef(this, ref);
  throw "TODO: Implement repo.deleteRef";
}

function listRefs(prefix, callback) {
  if (!callback) return listRefs.bind(this, prefix);
  throw "TODO: Implement repo.listRefs";
}
