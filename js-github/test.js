
var githubRepo = require('./repo.js');

var repo = githubRepo("creationix/conquest");

console.log(repo);

repo.loadAs("commit", "HEAD", function (err, commit) {
  if (err) throw err;
  console.log("HEAD", commit);
  repo.loadAs("tree", commit.tree, function (err, tree) {
    if (err) throw err;
    console.log("TREE", tree);

    tree.forEach(function (entry) {
      repo.load(entry.hash, function (err, object) {
        if (err) throw err;
        console.log(entry.name, object);
      });
    });
  });
});

