var promisify = require('promisify-node');
var Git = require('nodegit');
var sys = require('sys');
var exec = require('child_process').exec;
var path = require('path');

var fileHelper = require('./fileHelper.js');
var contentRepoPath = '../cmsly-test-content';


function execCallback(error, stdout, stderr) { 
    console.log('# VersionControl: Pushing commit');
    
    if (error) {
        console.error('# VersionControl: Error while pushing. Done. ' + stderr);
        return;
    }

    console.log('# VersionControl: Push successful. Done. ' + stdout);
}

function cloneContentRepoToTmp() {
    // Clone a given repository into the `./tmp` folder.
    console.log('# VersionControl: cloning repo to ' + contentRepoPath)
    Git.Clone('https://github.com/laubsauger/cmsly-test-content', contentRepoPath)
}


function commitAddAndPush(publishTimestamp, changeMap) {
    var repo;
    var index;
    var oid;

    Git.Repository.open(path.resolve(__dirname, '../' + contentRepoPath + '/.git'))
    .then(function(repoResult) {
        repo = repoResult;
        return repo.openIndex();
    })
    .then(function(indexResult) {
        index = indexResult;
    })
    .then(function() {
        console.log('# VersionControl: Adding all changes');
        return index.addAll();
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
        var timestamp =  Math.floor(Date.now() / 1000);
        var author = Git.Signature.create("author", "author@example.com", timestamp, 0);
        var committer = Git.Signature.create("cmsly", "cmsly@example.com", timestamp, 0);
    
        return repo.createCommit("HEAD", author, committer, publishTimestamp, oid, [parent]);
    })
    .done(function(commitId) {
        console.log('# VersionControl: New Commit: ', commitId);
        
        exec('cd ' + contentRepoPath +  '&& git push origin master', execCallback);
    });
}

function checkForChanges(publishTimestamp, doneCallback, noOpCallback) {
    var repo;
    var index;
    var oid;

    Git.Repository.open(path.resolve(__dirname, '../' + contentRepoPath + '/.git'))
    .then(function(repo) {
        repo.getStatus().then(function(statuses) {
            var changeMap = [];
            function statusToText(status) {
                var words = [];
                if (status.isNew()) { words.push("NEW"); }
                if (status.isModified()) { words.push("MODIFIED"); }
                if (status.isTypechange()) { words.push("TYPECHANGE"); }
                if (status.isRenamed()) { words.push("RENAMED"); }
                if (status.isIgnored()) { words.push("IGNORED"); }
                if (status.isDeleted()) { words.push("DELETED"); }
                if (status.isConflicted()) { words.push("CONFLICTED"); }
                
                return words.join(" ");
            }
            
            statuses.forEach(function(file) {
                changeMap.push({"path": file.path(), "status": statusToText(file)});
                console.log(file.path() + " " + statusToText(file));
            });
            
            return changeMap;
        }).done(function(changeMap) {
            // console.log(changeMap);
            if (changeMap.length) {
                console.log('# VersionControl: Changes detected. Commit and push...');
                return doneCallback(publishTimestamp, changeMap);
            }

            return noOpCallback();
        });
    });
}

module.exports = {
    createNewRelease: function(publishTimestamp) {
        // clone repo
        cloneContentRepoToTmp();

        // overwrite with files from new release
        fileHelper.copyPublishResult(publishTimestamp, contentRepoPath);
        
        // detect changes and push a commit if there are any
        checkForChanges(publishTimestamp, commitAddAndPush, function(){ console.log('# VersionControl: No changes. Nothing to commit. Done'); });
    }
}