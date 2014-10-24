/**
 * Created by wujingheng on 2014/10/14.
 */

(function (doc) {
  var Awesome, utils = {};

  var config = {
    debug: false,
    editorElementId: "awesome-editor",
    tagWrap: "div",
    contentAreaId: "editor-content",
    contentAreaTag: "div", // textarea
    toolbarElementId: "toolbar",
    toolbarTag: "div",
    toolbarItemsId: "items",
    toolbarItemsTag: "ul",
    toolbarItemTag: "li"
  };

  /*-- utils */
  utils.log = function (msg) {
    if (config.debug) {
      console.log(msg);
    }
  };

  utils.getElement = {
    byID: function (id) {
      return doc.getElementById(id);
    },
    byClassName: function (klassname) {
      return doc.getElementsByClassName(klassname);
    }
  };

  utils.createElement = function (tagname, id, klass) {
    var el = doc.createElement(tagname);
    el.id = id;
    el.setAttribute("class", klass);
    return el;
  };

  utils.addClass = function (el, klassname) {
    if (el.className === "") {
      el.setAttribute("class", klassname);
    } else if (el.className !== "" && el.classList.toString()[el.classList.toString().length - 1] !== " ") {
      el.setAttribute("class", el.classList.toString() + " " + klassname);
    } else {
      el.setAttribute("class", el.classList.toString() + "" + klassname);
    }
  };

  utils.removeClass = function (el, klassname) {
    if (el.className.length == 0) {
      return;
    }
    if (el.className == klassname) {
      el.className = "";
      return;
    }
    /*if (el.className.match((new RegExp("(^|\\s)" + klassname + "(\\s|$)")))) {
     el.className = el.className.replace(new RegExp("(^|\\s)" + klassname + "(\\s|$)"), "");
     //alert(el.className);
     }*/
    if (el.className.match((new RegExp(("([A-Za-z]+|\\s)" + klassname + "(\\s|[A-Za-z])"))))) {
      el.className = el.className.replace(new RegExp("([A-Za-z]+|\\s)" + klassname + "(\\s|[A-Za-z])"), " ");
    } else if (el.className.match(new RegExp("(^|\\s)" + klassname + "(\\s|$)"))) {
      el.className = el.className.replace(new RegExp("(^|\\s)" + klassname + "(\\s|$)"), "");
    }

  };

  utils.hasClass = function (el, klassname) {
    var _classList = el.classList.toString().split(" ");
    for (var i = 0; i < _classList.length; ++i) {
      if (_classList[i] === klassname) {
        return true;
      }
    }
    return false;
  };

  utils.removeMultiClasses = function (el, klassnames) {
    if (typeof(klassnames) === "string") {
      this.removeClass(el, klassnames);
      return 0;
    } else if (klassnames.length != 0 && el.classList.length != 0) {
      for (var i = 0; i < el.classList.length; ++i) {
        for (var j = 0; j < klassnames.length; ++j) {
          if (el.classList[i] == klassnames[j]) {
            this.removeClass(el, klassnames[j]);
          }
        }
      }

    }
  };
  /* utils --*/

  Awesome = function (config) {
    this.Editor = utils.getElement.byID(config.editorElementId);
    this.editor = utils.getElement.byID(config.contentAreaId);
    this.items = utils.getElement.byID(config.toolbarItemsId);
    this.sel = doc.getSelection();
    this.configure = config;

    //toolbar implementation
    this.toolbar();

  };

  /* toolbar */
  Awesome.prototype.toolbar = function () {
    var editor = this.editor;
    var items = this.items;
    var that = this;

    var highlight = function () {
      var range = that.sel.getRangeAt(0);
      that._range = that.sel.getRangeAt(0);
      that.highlight2(that._effectNode(range.startContainer), that._effectNode(range.endContainer));

      //alert(that._effectNode(range.startContainer));

      //alert(result);
    };

    var displayDropdow = function (action, disp) {
      switch (action) {
        case "toggle-font-size":
          if (disp) {
            utils.getElement.byID("font-size-options").style.display = "block";
          } else {
            utils.getElement.byID("font-size-options").style.display = "none";
          }
          break;
        case "toggle-font-type":
          if (disp) {
            utils.getElement.byID("font-type-options").style.display = "block";
          } else {
            utils.getElement.byID("font-type-options").style.display = "none";
          }
          break;
      }
    };

    /* toolbar item clicked */
    items.addEventListener("click", function (e) {

      var action = e.target.getAttribute("action");
      if (!action) return;

      var apply = function () {
        that.sel.removeAllRanges();
        that.sel.addRange(that._range);
        if (typeof(arguments[0]) !== "undefined") {
          that.actions(arguments[0]);
        } else {
          that.actions(action);
        }
        that._range = that.sel.getRangeAt(0);
      };


      if (utils.hasClass(e.target, "active")) {
        utils.removeClass(e.target, "active");
        that._clearScreen();
      } else if (utils.hasClass(e.target, "toggle")) {
        utils.removeClass(e.target, "toggle");
        that._clearScreen();
      } else {
        that._clearScreen();
        switch (action) {
          case "toggle-font-size":
          case "toggle-font-type":
            utils.addClass(e.target, "toggle");
            displayDropdow(action, true);
            e.target.addEventListener("click", function(_e) {
              //e.target.innerText = _e.target.innerText;
              apply(_e.target.className);
            });
            break;
          default:
            utils.addClass(e.target, "active");
            apply();
            break;
        }

      }
      highlight();

    });

    /* highlight toolbar action binding */
    editor.addEventListener("mouseup", function() {
      highlight();
    });

    /* click other area to clean screen */
    editor.addEventListener("click", function () {
      that._clearScreen();
    });

  };
  /* toolbar */

  /*-- highlight2 for menu highlight */
  Awesome.prototype.highlight2 = function (elBegin, elEnd) {
    var toggle = function (off, el) {
      if (off == true) {
        utils.addClass(el, "active");
      } else {
        utils.removeClass(el, "active");
      }

    };

    var reset = function () {
      var items = utils.getElement.byID(config.toolbarItemsId);
      var _childNodes = items.children || items.childNodes;
      //alert(items);
      for (var i = 0; i < _childNodes.length; ++i) {
        //utils.removeClass(_childNodes[i], "active");
        toggle(false, _childNodes[i]);
      }
    };

    reset();

    for (var i = 0; i < elBegin.length; ++i) {
      for (var j = 0; j < elEnd.length; ++j) {
        /* highlight by tag name */
        if (elBegin[i].nodeName == elEnd[j].nodeName) {
          var tag = elBegin[i].nodeName;
          switch (tag.toLowerCase()) {
            case "b":
              toggle(true, utils.getElement.byID("toolbar-bold"));
              break;
            case "i":
              toggle(true, utils.getElement.byID("toolbar-italic"));
              break;
            case "u":
              toggle(true, utils.getElement.byID("toolbar-underline"));
              break;
          }
        }
        /* highlight by classname */
        if (elBegin[i].className.split(" ")[0] == elEnd[j].className.split(" ")[0]) {
          //var klassname = elBegin[i].className.split(" ")[0];
          var klassname = elBegin[i].className;
          /*switch (klassname.trim()) {
           case "align-right":
           toggle(true, utils.getElement.byID("toolbar-align-right"));
           break;
           case "align-center":
           toggle(true, utils.getElement.byID("toolbar-align-center"));
           break;
           case "align-left":
           toggle(true, utils.getElement.byID("toolbar-align-left"));
           break;
           case "justified":
           toggle(true, utils.getElement.byID("toolbar-justify"));
           break;
           }*/
          if (klassname.indexOf("align-right") != -1) {
            toggle(true, utils.getElement.byID("toolbar-align-right"));
            break;
          } else if (klassname.indexOf("align-center") != -1) {
            toggle(true, utils.getElement.byID("toolbar-align-center"));
            break;
          } else if (klassname.indexOf("align-left") != -1) {
            toggle(true, utils.getElement.byID("toolbar-align-left"));
            break;
          } else if (klassname.indexOf("justify") != -1) {
            toggle(true, utils.getElement.byID("toolbar-justify"));
            break;
          }
        }
      }
    }
  };
  /* highlight2 --*/

  /*-- Clear screen */
  Awesome.prototype._clearScreen = function () {
    //clear dropdown menu
    var dropdowns = utils.getElement.byClassName("dropdown-menu");
    for (var i = 0; i < dropdowns.length; ++i) {
      //alert(dropdowns[i].className);
      dropdowns[i].style.display = "none";
    }
    /*dropdowns.forEach(function(dropdown) {
     dropdown.style.display = "none";
     });*/
  };
  /* Clear screen --*/

  Awesome.prototype._effectNode = function (el, returnAsNodeName) {
    var nodes = [];
    while (el !== this.Editor) {
      if (el.nodeName.match(/(?:[pubia]|h[1-6]|blockquote|[uo]l|li)/i)) {
        nodes.push(returnAsNodeName ? el.nodeName.toLowerCase() : el);
      }
      el = el.parentNode;
    }
    return nodes;
  };

  /*-- containNodes - list all nodes that below start node and above end node
   * @params: {startNode} - upper bound node
   *          {endNode}   - lower bound node
   *          {outer}     - search range should not exceed outer node
   *          {filter}    - filter nodes which do not have the target node name
   * @ret:    {nodes}     - specific nodes between startNode and endNode
   */
  Awesome.prototype.containNodes = function (startNode, endNode, outer, filter) {
    var nodes = [], current, same = false, endNodeParent;
    if (startNode.length == 0 || endNode.length == 0) {
      return nodes;
    } else if (startNode == endNode) {
      return nodes;
    } else {

      /* get the node's outest element before outer element{outer} range */
      current = startNode;
      while (current.parentNode != outer) {
        if (current.nodeName.toLowerCase() == filter) {
          nodes.push(current);
        }
        current = current.parentNode;
      }
      /*endNodeParent = endNode;
       while (endNodeParent.parentNode != outer) {
       endNodeParent = endNodeParent.parentNode;
       }*/

      /* iterate every child nodes and find the one applys to filter{filter} */
      var _iterate = function (node) {
        if (node != endNode) {
          if (node.nodeName.toLowerCase() == filter) {
            nodes.push(node);
          }
          if (node.childNodes.length != 0) {
            for (var i = 0; i < node.childNodes.length; ++i) {
              _iterate(node.childNodes[i]);
            }
          }
        } else {
          same = true;
        }
      };

      /* iterate every sibling till reach the end node's outest parent before element range */
      while (current.nextSibling != null) {
        if (same == false) {
          current = current.nextSibling;
          _iterate(current);
        } else {
          break;
        }
      }
      return nodes;
    }
  };
  /* containNodes --*/

  Awesome.prototype.getSpecifiedEl = function (oriNode, nodeName) {
    while (oriNode.nodeName.toLowerCase() !== nodeName && oriNode != null) {
      oriNode = oriNode.parentNode;
    }
    return oriNode;
  };

  Awesome.prototype.getSpecifiedEls = function (oriNode, nodeName) {

  };

  Awesome.prototype.actions = function (action) {
    var range = this.sel.getRangeAt(0);
    var alignTypes = ["align-center", "align-right", "justify", "align-left"];
    var that = this;

    var _setAlign = function (_action) {
      if (range.startContainer == range.endContainer) {
        var par = that.getSpecifiedEl(range.startContainer, "p");
        utils.removeMultiClasses(par, alignTypes);
        if (utils.hasClass(par, _action) == false) {
          utils.addClass(par, _action);
        }
      } else {
        var _nodes = that.containNodes(range.startContainer, range.endContainer, that.editor, "p");
        if (_nodes.length != 0) {
          for (i = 0; i < _nodes.length; ++i) {
            utils.removeMultiClasses(_nodes[i], alignTypes);
            if (utils.hasClass(_nodes[i], _action) == false) {
              utils.addClass(_nodes[i], _action);
            }
          }
        }
      }
    };

    switch (action) {
      case "bold":
      case "italic":
      case "underline":
        if (doc.execCommand(action, false)) {
          utils.log("success to execute command!\n");
        } else {
          utils.log("failed to execute command: " + action);
        }
        break;
      case "align-left":
      case "align-center":
      case "align-right":
      case "justify":
        _setAlign(action);
        break;
      case "font8":
      case "font12":
      case "font14":
      case "font16":
      case "font18":
      case "font22":
      case "font26":
      case "font32":
      case "font48":
      case "font64":
          _setAlign(action);
        break;
      default:
        break;
    }
  };

  var awesome = new Awesome(config);


})(document);