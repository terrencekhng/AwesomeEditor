/**
 * Created by wujingheng on 2014/10/22.
 */


(function (doc) {

  var utils = {};

  var config = {
    toolbarTag: "div",
    toolbarId: "toolbar",
    toolbarItemsTag: "ul",
    toolbarItemsId: "items",
    content: [
      {cla: ["bold", "icon-bold"], dis: "", id: "toolbar-bold", action: "bold"},
      {cla: ["italic", "icon-italic"], dis: "", id: "toolbar-italic", action: "italic"},
      {cla: ["underline", "icon-underline"], dis: "", id: "toolbar-underline", action: "underline"},
      {cla: ["line-through", "icon-line-through"], dis: "abc", id: "toolbar-line-through", action: "line-through"},
      {cla: ["align-left", "icon-align-left"], dis: "", id: "toolbar-align-left", action: "align-left"},
      {cla: ["align-center", "icon-align-center"], dis: "", id: "toolbar-align-center", action: "align-center"},
      {cla: ["align-right", "icon-align-right"], dis: "", id: "toolbar-align-right", action: "align-right"},
      {cla: ["justify", "icon-align-justify"], dis: "", id: "toolbar-justify", action: "justify"},
      {cla: ["font-size"], dis: "font-size", id: "toolbar-font-size", action: "toggle-font-size"},
      {cla: ["font-type"], dis: "font-type", id: "toolbar-font-type", action: "toggle-font-type"}
    ]
  };

  /*-- utils */
  utils.createElement = function (tagname, id, klass) {
    var el = doc.createElement(tagname);
    el.id = id;
    el.setAttribute("class", klass);
    return el;
  };

  utils.getElement = {
    byID: function (id) {
      return doc.getElementById(id);
    }
  };

  /* utils --*/

  var Toolbar = function (config) {

    this.configure = config;

    this.construct();
  };

  Toolbar.prototype.construct = function () {

    var toolbar = utils.createElement(this.configure.toolbarTag, this.configure.toolbarId, this.configure.toolbarId);
    var items = utils.createElement(this.configure.toolbarItemsTag, this.configure.toolbarItemsId, this.configure.toolbarItemsId);
    //utils.getElement.byID("awesome-editor").appendChild(toolbar);
    utils.getElement.byID("navbar").appendChild(toolbar);
    //doc.body.appendChild(toolbar);
    //config.editor.appendChild(toolbar);
    toolbar.appendChild(items);

    for (var i = 0; i < this.configure.content.length; ++i) {
      var item = utils.createElement("li", this.configure.content[i].id, this.configure.content[i].cla.join(" "));
      //binding action using execCommand commands
      item.setAttribute("action", this.configure.content[i].action);
      item.innerHTML = this.configure.content[i].dis;

      items.appendChild(item);

    }

    /* compound toolbar items, should be manually created */

    /* font-size selector */

    // setup html content
    utils.getElement.byID("toolbar-font-size").innerHTML += "<b class=\"caret\"></b>";
    /* dropdown menu */
    utils.getElement.byID("toolbar-font-size").innerHTML += "<ul id=\"font-size-options\" class=\"font-size-options dropdown-menu\"><li action=\"8px\">8px</li><li action=\"12px\">12px</li><li action=\"14px\">14px</li><li action=\"16px\">16px</li><li action=\"18px\">18px</li><li action=\"22px\">22px</li><li action=\"26px\">26px</li><li action=\"32px\">32px</li><li action=\"48px\">48px</li><li action=\"64px\">64px</li></ul>";

    /* font-type selector */
    // setup html content
    utils.getElement.byID("toolbar-font-type").innerHTML += "<b class=\"caret\"></b>";
   utils.getElement.byID("toolbar-font-type").innerHTML += "<ul id=\"font-type-options\" class=\"font-type-options dropdown-menu\"><li action=\"Roboto-Slab\">Roboto Slab</li><li action=\"Monaco\">Monaco</li></ul>";

  };

  var toolbar = new Toolbar(config);
})(document);