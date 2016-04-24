var Git = require('nodegit');
var fileHelper = require('./fileHelper.js');
var path = require('path');
var promisify = require('promisify-node');
var fse = promisify(require('fs-extra'));

function cloneContentRepoToTmp() {
    // Clone a given repository into the `./tmp` folder.
    console.log('# VersionControl: cloning repo to ../cmsly-test-content')
    Git.Clone("https://github.com/laubsauger/cmsly-test-content", "../cmsly-test-content")
}

module.exports = {
    createNewRelease: function(publishTimestamp) {
        // clone repo
        cloneContentRepoToTmp();

        // overwrite with files from new release
        fileHelper.copyPublishResult(publishTimestamp, '../cmsly-test-content');

        var repo;
        var index;
        var oid;

        Git.Repository.open('../cmsly-test-content/.git')
        .catch(function(){
            console.log('arguments =>', arguments);
        })
        .then(function(repoResult) {
            repo = repoResult;
            repo.getStatus().then(function(statuses) {
                function statusToText(status) {
                    var words = [];
                    if (status.isNew()) { words.push("NEW"); }
                    if (status.isModified()) { words.push("MODIFIED"); }
                    if (status.isTypechange()) { words.push("TYPECHANGE"); }
                    if (status.isRenamed()) { words.push("RENAMED"); }
                    if (status.isIgnored()) { words.push("IGNORED"); }
                    
                    return words.join(" ");
                }
                    
                statuses.forEach(function(file) {
                    console.log('# VersionControl: ' + file.path() + ' ' + statusToText(file));
                });
            });
            return repo.openIndex();
        })
        .then(function(indexResult) {
            index = indexResult;
        })
        .then(function() {
           repo.getStatus().then(function(statuses) {
                statuses.forEach(function(file) {
                    return index.addByPath(file.path());
                });
            });
        })
        .then(function() {
            return index.write();
        })
        .then(function() {
            return index.writeTree();
        })
        .then(function(oidResult) {
            oid = oidResult;
            return Git.Reference.nameToId(repo, "HEAD");
        })
        .then(function(parent) {
            var timestamp = Math.floor(Date.now());
            var author = Git.Signature.create("author", "laubsauger@gmail.com", timestamp, 0);
            var committer = Git.Signature.create("committer", "laubsauger@gmail.com", timestamp, 0);
        
            return repo.createCommit("HEAD", author, committer, publishTimestamp, oid, [parent]);
        })
        .done(function(commitId) {
            console.log('# VersionControl: New Commit: ', commitId);
        });


        //@todo: push
    }
}