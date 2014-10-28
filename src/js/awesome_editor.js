/**
 * Created by wujingheng on 2014/10/14.
 */

/*
 * Initial state:
 * paragraph is using tag <p></p>
 * each time you type return and start a new paragraph a new <p> is generated
 *
 * each newly created paragraph is align left              with class "align-left"
 * each newly created paragraph font size is 22px          with class "font22"
 * each newly created paragraph font type is Roboto-Slab   with class "Roboto-Slab"
 * */

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
    if (el.className.length === 0) {
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
    } else if (klassnames.length !== 0 && el.classList.length !== 0) {
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

    //editor events
    this.Actions();

  };

  /* toolbar */
  Awesome.prototype.toolbar = function () {
    var editor = this.editor;
    var items = this.items;
    var self = this;

    var highlight = function () {
      var range = self.sel.getRangeAt(0);
      self._range = self.sel.getRangeAt(0);
      self.highlight2(self._effectNode(range.startContainer), self._effectNode(range.endContainer));

      //alert(self._effectNode(range.startContainer));

      //alert(result);
    };

    var displayDropdown = function (action, disp) {
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
        self.sel.removeAllRanges();
        self.sel.addRange(self._range);
        if (typeof(arguments[0]) !== "undefined") {
          self.actions(arguments[0]);
        } else {
          self.actions(action);
        }
        self._range = self.sel.getRangeAt(0);
      };


      if (utils.hasClass(e.target, "active")) {
        utils.removeClass(e.target, "active");
        self._clearScreen();
      } else if (utils.hasClass(e.target, "toggle")) {
        utils.removeClass(e.target, "toggle");
        self._clearScreen();
      } else {
        self._clearScreen();
        switch (action) {
          case "toggle-font-size":
          case "toggle-font-type":
            utils.addClass(e.target, "toggle");
            displayDropdown(action, true);
            e.target.addEventListener("click", function (_e) {
              e.target.childNodes[0].nodeType == 3 ? e.target.childNodes[0].nodeValue = _e.target.innerText : "";
              apply(_e.target.action);
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
    editor.addEventListener("mouseup", function () {
      highlight();
    });

    /* click other area to clean screen */
    editor.addEventListener("click", function () {
      self._clearScreen();
    });

  };
  /* toolbar */

  /*-- highlight2 for menu highlight */
  Awesome.prototype.highlight2 = function (elBegin, elEnd) {
    var toggle = function (off, el) {
      if (off === true) {
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
          var klassname = elBegin[i].className;
          if (klassname.indexOf("align-right") != -1) {
            toggle(true, utils.getElement.byID("toolbar-align-right"));
          }
          if (klassname.indexOf("align-center") != -1) {
            toggle(true, utils.getElement.byID("toolbar-align-center"));
          }
          if (klassname.indexOf("align-left") != -1) {
            toggle(true, utils.getElement.byID("toolbar-align-left"));
          }
          if (klassname.indexOf("line-through") != -1) {
            toggle(true, utils.getElement.byID("toolbar-line-through"));
          }
          if (klassname.indexOf("justify") != -1) {
            toggle(true, utils.getElement.byID("toolbar-justify"));
          }
          if (elBegin[i].getAttribute("font-size") != null) {
            utils.getElement.byID("toolbar-font-type").childNodes[0].nodeType == 3 ? utils.getElement.byID("toolbar-font-size").childNodes[0].nodeValue = elBegin[i].getAttribute("font-size") : "";
          }
          if (elBegin[i].getAttribute("font-type") != null) {
            utils.getElement.byID("toolbar-font-type").childNodes[0].nodeType == 3 ? utils.getElement.byID("toolbar-font-type").childNodes[0].nodeValue = elBegin[i].getAttribute("font-type") : "";
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

  /*-- containNodes - list all nodes self below start node and above end node
   * @params: {startNode} - upper bound node
   *          {endNode}   - lower bound node
   *          {outer}     - search range should not exceed outer node
   *          {filter}    - filter nodes which do not have the target node name
   * @ret:    {nodes}     - specific nodes between startNode and endNode
   */
  Awesome.prototype.containNodes = function (startNode, endNode, outer) {
    var nodes = [], current, same = false, endNodeParent;
    if (startNode.length === 0 || endNode.length === 0) {
      return nodes;
    } else if (startNode == endNode) {
      return nodes;
    } else {

      var filter = "";
      if (typeof(arguments[3]) !== "undefined") {
        filter = arguments[3];
      }

      /* get the node's outest element before breaching outer element{outer} range */
      current = startNode;
      while (current.parentNode != outer) {
        if (filter !== "") {
          if (current.nodeName.toLowerCase() == filter) {
            nodes.push(current);
          }
        } else {
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
          if (filter !== "") {
            if (node.nodeName.toLowerCase() == filter) {
              nodes.push(node);
            }
          } else {
            nodes.push(node);
          }
          if (node.childNodes.length !== 0) {
            for (var i = 0; i < node.childNodes.length; ++i) {
              _iterate(node.childNodes[i]);
            }
          }
        } else {
          same = true;
        }
      };

      /* iterate every sibling till reach the end node's outest parent before element range */
      while (current.nextSibling !== null) {
        if (same === false) {
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
    while (oriNode.nodeName.toLowerCase() !== nodeName && oriNode !== null) {
      oriNode = oriNode.parentNode;
    }
    return oriNode;
  };

  Awesome.prototype.getSpecifiedEls = function (oriNode, nodeName) {

  };

  /* to be removed classes */
  var alignTypes = ["align-center", "align-right", "justify", "align-left"];

  Awesome.prototype.actions = function (action) {
    var range = this.sel.getRangeAt(0);

    var self = this;

    var _takeAction = function (_action, klasses, target) {
      if (range.startContainer == range.endContainer) {
        var par = self.getSpecifiedEl(range.startContainer, target);
        utils.removeMultiClasses(par, klasses);
        if (utils.hasClass(par, _action) === false) {
          utils.addClass(par, _action);
        }
      } else {
        var _nodes = self.containNodes(range.startContainer, range.endContainer, self.editor, target);
        if (_nodes.length !== 0) {
          for (var i = 0; i < _nodes.length; ++i) {
            utils.removeMultiClasses(_nodes[i], klasses);
            if (utils.hasClass(_nodes[i], _action) === false) {
              utils.addClass(_nodes[i], _action);
            }
          }
        }
      }
    };

    var _takeAction2 = function (_action, target, attr) {
      if (range.startContainer == range.endContainer) {
        var par = self.getSpecifiedEl(range.startContainer, target);
        //utils.removeMultiClasses(par, klasses);
        /*if (utils.hasClass(par, _action) === false) {
         utils.addClass(par, _action);
         }*/
        if (par.getAttribute(attr) == null || typeof (par.getAttribute(attr)) === "undefined") {
          par.createAttribute(attr);
        }
        par.setAttribute(attr, _action);
      } else {
        var _nodes = self.containNodes(range.startContainer, range.endContainer, self.editor, target);
        if (_nodes.length !== 0) {
          for (var i = 0; i < _nodes.length; ++i) {
            //utils.removeMultiClasses(_nodes[i], klasses);
            /*if (utils.hasClass(_nodes[i], _action) === false) {
             utils.addClass(_nodes[i], _action);
             }*/
            if (_nodes[i].getAttribute(attr) == null || typeof (_nodes[i].getAttribute(attr)) === "undefined") {
              _nodes[i].createAttribute(attr);
            }
            _nodes[i].setAttribute(attr, _action);
          }
        }
      }
    };

    var _takeActionInline = function (_action) {
      /*var span = utils.createElement("span", "", _action);
      range.surroundContents(span);*/
      alert(self.containNodes(range.startContainer, range.endContainer, self.editor));
    };

    switch (action) {
      case "bold":
      case "italic":
      case "underline":
        /*if (doc.execCommand(action, false)) {
          utils.log("success to execute command!\n");
        } else {
          utils.log("failed to execute command: " + action);
        }*/
          _takeActionInline(action);
        break;
      case "align-left":
      case "align-center":
      case "align-right":
      case "justify":
      case "line-through":
        _takeAction(action, alignTypes, "p");
        break;
      case "8px":
      case "22px":
      case "12px":
      case "26px":
      case "14px":
      case "32px":
      case "16px":
      case "48px":
      case "18px":
      case "64px":
        //_takeAction(action, fontsizeTypes, "p");
        _takeAction2(action, "p", "font-size");
        break;
      case "Roboto-Slab":
      case "Monaco":
        //_takeAction(action, fonttypeTypes, "p");
        _takeAction2(action, "p", "font-type");
        break;
      default:
        break;
    }
  };

  Awesome.prototype.Actions = function () {

    var _generateInitialParagraph = function (id, klass) {
      var p = utils.createElement("p", id, klass);
      if (typeof(arguments[2]) !== "undefined") {
        var attr = arguments[2];
        p.setAttribute("action", attr["action"]);
        p.setAttribute("font-size", attr["font-size"]);
        p.setAttribute("font-type", attr["font-type"]);
      }

      return p;
    };

    /* keyboard actions */
    this.editor.addEventListener("keyup", function (e) {
      /*if (e.which == 13) {
       var newP = _generateInitialParagraph("", "align-left");
       e.target.appendChild(newP);
       newP.focus();
       }*/
    });
  };

  var awesome = new Awesome(config);

})(document);