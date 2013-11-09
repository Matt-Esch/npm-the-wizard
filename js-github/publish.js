var githubRepo = require('./repo.js');

// root is the github repo prefix, like "creationix/conquest"
// user is an object containing { name, email }
// files is an object with keys being filepaths (no leading slash) and values
// being text contents.  Folders are represented as nested objects.

// This function will create a tree/blob structure for the files, create a commit
// and update master to point to the new commit.
module.exports = function (root, user, files, message, callback) {
  var repo = githubRepo(root);

  console.log({
    root: root,
    user: user,
    files: files,
    message: message
  });

  return saveTree(files, function (err, treeHash) {
    if (err) return callback(err);
    console.log("tree hash", treeHash);
    return repo.resolve("HEAD", function (err, parentHash) {
      if (err) return callback(err);
      console.log("parent hash", parentHash);
      repo.saveAs("commit", {
        tree: treeHash,
        parent: parentHash,
        author: user,
        message: message
      }, onCommit);
    });
  });

  function onCommit(err, commitHash) {
    console.log("onCommit", arguments);
    if (err) return callback(err);
    console.log("commit hash", commitHash);
    console.log("Updating HEAD to point to new commit");
    return repo.writeRef("refs/heads/master", commitHash, function (err) {
      if (err) return callback(err);
      callback(null, commitHash);
    });
  }
  
  function saveTree(files, callback) {
    var done = false;
    var names = Object.keys(files);
    var left = names.length;
    var entries = new Array(left);
    names.forEach(function (name, i) {
      var entry = entries[i] = { name: name };
      var value = files[name];
      if (typeof value === "string") {
        entry.mode = 010644;
        repo.saveAs("blob", value, onSave);
      }
      else {
        entry.mode = 040000;
        saveTree(value, onSave);
      }

      function onSave(err, hash) {
        if (err) {
          if (done) return;
          done = true;
          return callback(err);
        }
        entry.hash = hash;
        if (--left) return;
        return repo.saveAs("tree", entries, callback);
      }
    });
  }
};
