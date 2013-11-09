module.exports = {
  commit: decodeCommit,
  tag: decodeTag,
  tree: decodeTree,
  blob: decodeBlob
};

function decodeCommit(result) {
  return {
    tree: result.tree.sha,
    parents: result.parents.map(pickSha),
    author: result.author,
    committer: result.committer,
    message: result.message
  };
}

function decodeTag(result) {
  throw "TODO: decodeTag";
}

function decodeTree(result) {
  throw "TODO: decodeTree";
}

function decodeBlob(result) {
  throw "TODO: decodeBlob";
}

function pickSha(object) {
  return object.sha;
}