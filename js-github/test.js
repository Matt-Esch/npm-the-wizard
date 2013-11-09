
  var log = console.log = console.error = require('domlog');
  log.setup({
    whiteSpace: "pre-wrap",
    lineHeight: "1em",
    transition: "inherit",
    background: "#000",
    top: "0",
    height: "100%",
    overflow: "auto",
  });

var githubRepo = require('./repo.js');

var repo = githubRepo("creationix/conquest");

console.log(repo);

repo.logWalk("HEAD", function (err, log) {
  if (err) throw err;
  var shallow;
  return log.read(onRead);

  function onRead(err, commit) {
    if (err) throw err;
    if (!commit) return logEnd(shallow);
    if (commit.last) shallow = true;
    logCommit(commit);
    // return log.read(onRead);
    repo.loadAs("tree", commit.tree, function (err, tree) {
        if (err) throw err;
        repo.treeWalk(commit.tree, function (err, tree) {
          if (err) throw err;
          tree.read(onEntry);
          function onEntry(err, entry) {
            if (err) throw err;
            if (!entry) {
              return log.read(onRead);
            }
            logEntry(entry);
            return tree.read(onEntry);
          }
        });
    });
  }
});

function logCommit(commit) {
  var author = commit.author;
  var message = commit.message;
  console.log("commit " + commit.hash + "\n" +
              "Author: " + author.name + " <" + author.email + ">\n" +
              "Date:   " + author.date + "\n" +
              "\n    " + message.trim().split("\n").join("n    ") + "\n");
}

function logEntry(entry) {
  var path = entry.path.replace(/\//g, "/") + "";
  console.log(" " + entry.hash + " " + path);
}

function logEnd(shallow) {
  var message = shallow ? "End of shallow record." : "Beginning of history";
  console.log("\n" + message + "\n");
}
// repo.loadAs("commit", "HEAD", function (err, commit) {
//   if (err) throw err;
//   console.log("HEAD", commit);
//   repo.loadAs("tree", commit.tree, function (err, tree) {
//     if (err) throw err;
//     console.log("TREE", tree);

//     tree.forEach(function (entry) {
//       repo.load(entry.hash, function (err, object) {
//         if (err) throw err;
//         console.log(entry.name, object);
//       });
//     });
//   });
// });

