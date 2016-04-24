var Git = require('nodegit');
var fileHelper = require('./fileHelper.js');
var path = require('path');
var promisify = require('promisify-node');
var fse = promisify(require('fs-extra'));

function cloneContentRepoToTmp() {
    // Clone a given repository into the `./tmp` folder.
    console.log('# VersionControl: cloning repo to ./tmp')
    Git.Clone("https://github.com/laubsauger/cmsly-test-content", "./tmp")
}

module.exports = {
    createNewRelease: function(publishTimestamp) {
        // clone repo
        cloneContentRepoToTmp();

        // overwrite with files from new release
        fileHelper.copyPublishResultToTmp(publishTimestamp);

        var repo;
        var index;
        var oid;

        Git.Repository.open('./tmp')
            .then(function(repoResult) {
                repo = repoResult;
                console.log(repo);
                return fse.ensureDir(path.join(repo.workdir(), 'home'));
            })
            .then(function() {
              return repo.refreshIndex();
            })
            .then(function(indexResult) {
                console.log(indexResult);
                index = indexResult;
            })
            .then(function() {
                // this file is in the root of the directory and doesn't need a full path
                return index.addByPath('home');
            })
            .then(function() {
                // this will write both files to the index
                return index.write();
            })
            .then(function() {
                return index.writeTree();
            })
            .then(function(oidResult) {
                oid = oidResult;
                return Git.Reference.nameToId(repo, "HEAD");
            })
            .then(function(head) {
                return repo.getCommit(head);
            })
            .then(function(parent) {
                var author = Git.Signature.create("blub", "laubsauger@gmail.com", 123456789, 60);
                var committer = Git.Signature.create("blub", "laubsauger@gmail.com", 987654321, 90);
            
                return repo.createCommit("HEAD", author, committer, "message", oid, [parent]);
            })
            .done(function(commitId) {
                console.log("New Commit: ", commitId);
            });

        // merge
        // commit
    }
}