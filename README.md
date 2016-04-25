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

- input ui created based on page.json and components
  - form inputs

- ui
  - pages
    - selecion
    - creation
    - page.json live view + edit
  - publishing 
    - show file states from git index
      - click shows diff
    - publish button