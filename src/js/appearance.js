/**
 * Created by wujingheng on 2014/10/24.
 */


(function(doc) {

  var utils = {};

  var appearanceConfig = {
    nightModeButton: true,
    night: false,
    navbar: true
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

  utils.addClass = function (el, klassname) {
    if (el.className === "") {
      el.setAttribute("class", klassname);
    } else if (el.className !== "" && el.classList.toString()[el.classList.toString().length - 1] !==" ") {
      el.setAttribute("class", el.classList.toString() + " " + klassname);
    } else {
      el.setAttribute("class", el.classList.toString() + "" + klassname);
    }
  };
  /* utils --*/

  var Appearance = function(config) {
    this.configure = config;
    this.editor = utils.getElement.byID("editor-content");

    /* start to render appearance */
    this.render();
  };

  Appearance.prototype.render = function() {
    var that = this;

    this.editor.focus();

    /* create hint */
    var night_hint = utils.createElement("div", "", "night-hint");
    night_hint.innerText = "SWITCH BETWEEN NIGHT AND DAY MODE";
    doc.body.appendChild(night_hint);

    /*-- night mode setup */
    if (this.configure.nightModeButton) {
      var night = utils.createElement("div", "", "night-mode-ribbon");
      var icon = utils.createElement("i", "", "");
      //temporary text, to be replaced by icon
      if (this.configure.night) {
        icon.setAttribute("class", "icon-sun");
      } else {
        icon.setAttribute("class", "icon-sun-filled");
      }
      night.appendChild(icon);
      doc.body.appendChild(night);

      var toggleNight = function () {
        if (that.configure.night) {
          that.configure.night = false;
          doc.body.classList.remove("night");
          //night.innerText = "NIGHT MODE OFF";
          icon.setAttribute("class", "icon-sun-filled");
        } else {
          that.configure.night = true;
          utils.addClass(doc.body, "night");
          //night.innerText = "NIGHT MODE ON";
          icon.setAttribute("class", "icon-sun");
        }
      };

      /* get mouse position */
      var getMousePos = function (e) {
        if (e.pageX || e.pageY) {
          return {x: e.pageX, y: e.pageY};
        }
        return {
          x: e.clientX + doc.body.scrollLeft - doc.body.clientLeft,
          y: e.clientY + doc.body.scrollTop - doc.body.clientTop
        };
      };

      var pos;
      doc.addEventListener("mousemove", function (e) {
        pos = getMousePos(e);
      });

      /* toggle night mode */
      night.addEventListener("click", toggleNight);

      /* show hint */
      night.addEventListener("mouseover", function (e) {
        this._t = setInterval(function () {
          night_hint.style.left = pos.x + 10 + "px";
          night_hint.style.top = pos.y + 10 + "px";
          night_hint.style.display = "inline-block";
        }, 500);
      });

      night.addEventListener("mouseout", function () {
        clearInterval(this._t);
        night_hint.style.display = "none";
      });
    } /* night mode setup --*/


    /*-- navigation bar setup */
    if (this.configure.navbar) {
      var navbar = utils.createElement("div", "navbar", "navbar");
      if (this.configure.night) {
        var navbarNight = utils.createElement("div", "")
      }
      doc.body.appendChild(navbar);
      //doc.body.insertBefore(navbar, doc.body);
    }
    /* navigation bar setup --*/

  };

  var appearance = new Appearance(appearanceConfig);

})(document);