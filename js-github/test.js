
var githubRepo = require('./repo.js');

var repo = githubRepo("creationix/conquest");

console.log(repo);

repo.loadAs("commit", "HEAD", function (err, commit) {
  if (err) throw err;
  console.log("HEAD", commit);
});

