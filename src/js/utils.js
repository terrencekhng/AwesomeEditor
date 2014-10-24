/**
 * Created by wujingheng on 2014/10/24.
 */

(function(doc) {

  var utils = {};

  /*-- utils */
  utils.log = function (msg) {
    if (config.debug) {
      console.log(msg);
    }
  };

  utils.getElement = {
    byID: function (id) {
      return doc.getElementById(id);
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
    } else if (el.className !== "" && el.classList.toString()[el.classList.toString().length - 1] !==" ") {
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
})(document);