cms poc
***
    // start app / preview server
    node server
    
    // publish current content
    node publish
***
#### nodegit
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get install libstdc++-4.9-dev

***
### lessons learned
providing a preview with live editing via client side JS based on content that was rendered on the backend is pain.

ugly shit that happens:
- textContent can't be properly replaced without killing the rest of innerHTML
- eventListeners from the contentJs need to be reattached if adding module items like tabs, slides
- every variable needs to carry a type for the right update action to be executed (title != href != textContent etc)

when editing components, values should be submitted and included in a full page render
through the templating engine.  -> avoids unnecessary complexity for developer, template developer AND publishing dude

***
#### todo
- render page in iframe to avoid collision of ui js/css with page ui/css
- do a full rerender to refresh html with input data instead of client side js tinkering
  - execute onButtonClick instead of onKeyup  

- full publish to output folder
symlink folder to output/latest

- page list (dashboard + toolbar)
  - searchable like chosen
  - possibly hundreds of pages!
  - keywords/tagging?

- page publish to output/timestamp/page folder
  - symlink file to output/latest
  - node publish home

- checkout process (all / single page)
  - clone content repo as new editing base -> show warning/confirmation before!

- checkin process (all / single page)
    - publish to output folder
    - show diff against editing base, ask for confirmation
    - add, commit, merge

- ui
  - pages
    - creation
  - publishing 
    - show file states from git index
      - click shows diff
