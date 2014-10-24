AwesomeEditor
=============
It's a WYSIWYG text editor Which focuses on smooth typing experience.


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

