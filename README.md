cms poc

----

    // start app / preview server
    node server
    
    // publish current content
    node publish

----

#### nodegit
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get install libstdc++-4.9-dev

----
#### todo
- full publish to output folder
symlink folder to output/latest

- page publish to output/timestamp/page folder
  - symlink file to output/latest
  - node publish home

- github for content versioning
  - ~~create version when publishing~~
  - show diff between versions

- input ui created based on page.json and components
  - form inputs