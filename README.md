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
providing a preview with live editing via client side JS is pain.

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

***
#### Must have Feature set

- Page types
  - homepage
    - bannerSlider (with TabHeadings)
      - Title
        - Text 
      - Image
        - Url
        - Text (Alt-Text)
      - Link
        - Url
      - scheduled publishing 

| Page Type | Component Name | Component Item         | Component Fields      |
|-----------|----------------|------------------------|-----------------------|
| homepage  | bannerSlider   | Tab-Title              | Text                  |
|           |                | Banner-Image           | Url (Image 957x260)   |
|           |                |                        | Text (alt-attr)       |
|           |                | Link                   | Url (Link)            | 
|           |                | scheduled publishing   | DateTime              |
|           |                |                        |                       | 
|           | teaserBox      | Teaser-Image           | Url (Image 306 × 109) |