'use strict';

var serveStatic = require('serve-static');

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: 'app',
    dist: 'dist',
    jsBundle: 'generated.js',
    cssBundle: 'generated.css'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/scripts/<%= yeoman.jsBundle %>',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 36868
      },
      dev: {
        options: {
          open: true,
          middleware: function (connect, options, middlewares) {
            var additionalMiddlewares = [];
            additionalMiddlewares.push(serveStatic('.tmp'));
            additionalMiddlewares.push(['/node_modules', serveStatic('./node_modules')]);
            additionalMiddlewares.push(serveStatic(appConfig.app));
            return additionalMiddlewares.concat(middlewares);
          }
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dev: [
        '.tmp',
        '<%= yeoman.app %>/scripts/<%= yeoman.jsBundle %>',
        '<%= yeoman.app %>/styles/<%= yeoman.cssBundle %>*'
      ],
      dist: ['<%= yeoman.dist %>/{,*/}*']
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= yeoman.app %>/styles/<%= yeoman.cssBundle %>':'<%= yeoman.app %>/styles/main.scss'
        }
      }
    },

    browserify: {
      dev: {
        src: '<%= yeoman.app %>/scripts/main.js',
        dest: '<%= yeoman.app %>/scripts/<%= yeoman.jsBundle %>',
        options: {
          watch: true
        }
      },
      options: {
        transform: ['babelify']
      }
    }

  });

  grunt.registerTask('serve', 'Compile then start a web server', function (target) {

    grunt.task.run([
      'clean:dev',
      'sass',
      'browserify:dev',
      'connect:dev',
      'watch'
    ]);
  });

};
