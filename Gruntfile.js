module.exports = function(grunt) {
  "use strict";

  //project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    jshint: {
      options: {
        jshintrc: true
      },
      files: ["Gruntfile.js", "src/**/*.js"]
    },

    uglify: {
      build: {
        src: "src/**/*.js",
        dest: "build/awesome_editor_<%= pkg.version %>.min.js"
      }
    },

    watch: {
      files: ["<%= jshint.files %>"],
      tasks: ["jshint"]
    }
  });

  //plugins
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  //Default task(s)
  grunt.registerTask("default", ["jshint", "uglify"]);
};