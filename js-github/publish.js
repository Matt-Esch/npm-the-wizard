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
};