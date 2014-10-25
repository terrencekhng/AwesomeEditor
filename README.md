AwesomeEditor
=============
It's a WYSIWYG text editor which focuses on smooth typing and processing experience.

[![Build Status](https://travis-ci.org/hyaocuk/AwesomeEditor.svg?branch=master)](https://travis-ci.org/hyaocuk/AwesomeEditor)

## How to build ##
Node.js version greater than 0.8.0 is **required**!

1 Install [Node.js](http://nodejs.org/)

2 Fork the repo and enter the directory, and install dependencies using npm, and install [Grunt](http://gruntjs.com/):
  ```sh
  cd AwesomeEditor
  npm install
  sudo npm install -g grunt-cli
  ```
3 Start to get your hand dirty, build it:
  ```sh
  grunt
  ```
  watch while editing:
  ```sh
  grunt watch
  ```

## How to use? ##
So far, you have to create the necessary HTML elements manually like this if you want to use it in your page:

```html
<div class="awesome-editor" id="awesome-editor">
  <div contenteditable="true" id="editor-content" class="editor-content">
  Put what you want to type here! ...
  </div>
</div>
```
and include the javascript file and css file:

```html
<!--stylesheet-->
<link rel="stylesheet" type="text/css" href="PATH_TO_awesome_editor.css" />

<!--javascript-->
<script src="PATH_TO_appearance.js"></script>
<script src="PATH_TO_toolbar.js"></script>
<script src="PATH_TO_awesome_editor.js"></script>
```


## Features ##
* bold, italic, underline
* align{left|center|right|justify}
(in the future)
* Modularize
* Markdown
* Import(html, plain text, lex)/Export(PDF, html, txt)
* syntax highlight

## Acknowlegment ##
Well inspired by [Pen](https://github.com/sofish/pen) by [@sofish](https://github.com/sofish)

## License ##
MIT

