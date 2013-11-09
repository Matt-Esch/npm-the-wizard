module.exports = {
  commit: decodeCommit,
  tag: decodeTag,
  tree: decodeTree,
  blob: decodeBlob,
  text: decodeText
};

function decodeCommit(result) {
  return {
    tree: result.tree.sha,
    parents: result.parents.map(pickSha),
    author: pickPerson(result.author),
    committer: pickPerson(result.committer),
    message: result.message
  };
}

function decodeTag(result) {
  throw "TODO: decodeTag";
}

function decodeTree(result) {
  var typeCache = this.typeCache;
  return result.tree.map(function (entry) {
    typeCache[entry.sha] = entry.type;
    return {
      mode: parseInt(entry.mode, 8),
      name: entry.path,
      hash: entry.sha
    };
  });
}

function decodeBlob(result) {
  console.log("onBlob", result)
  throw "TODO: decodeBlob";
}

function decodeText(result) {
  console.log("onText", result)
  throw "TODO: decodeBlob";
}

function pickPerson(person) {
  return {
    name: person.name,
    email: person.email,
    date: new Date(person.date)
  };
}

function pickSha(object) {
  return object.sha;
}
