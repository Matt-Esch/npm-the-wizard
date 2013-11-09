var githubRepo = require('./repo.js');

// root is the github repo prefix, like "creationix/conquest"
// user is an object containing { name, email }
// files is an object with keys being filepaths (no leading slash) and values
// being text contents.  Folders are represented as nested objects.

// This function will create a tree/blob structure for the files, create a commit
// and update master to point to the new commit.
module.exports = function (root, user, files, callback) {
  var repo = githubRepo(root);

  console.log({
    root: root,
    user: user,
    files: files
  });

  return saveTree(files, function (err, hash) {
    if (err) return callback(err);
    console.log("tree hash", hash);
    return callback(null);
  });

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
        console.log("onSave", i, left);
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
