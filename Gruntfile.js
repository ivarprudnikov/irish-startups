'use strict';

var serveStatic = require('serve-static');

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: 'app',
    dist: 'dist',
    configFile: 'generatedConfig.js',
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
            additionalMiddlewares.push(['/node_modules', serveStatic('./node_modules')]);
            additionalMiddlewares.push(serveStatic(appConfig.app));
            return additionalMiddlewares.concat(middlewares);
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dev: [
        '.tmp',
        '<%= yeoman.app %>/scripts/<%= yeoman.configFile %>',
        '<%= yeoman.app %>/scripts/<%= yeoman.jsBundle %>',
        '<%= yeoman.app %>/styles/<%= yeoman.cssBundle %>*'
      ],
      dist: ['<%= yeoman.dist %>/{,*/}*']
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      dev: {
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
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['concat']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ]
      }
    },

    // compress css
    ///////////////////////
    cssmin: {
      options: {
        banner: '',
        report: 'min'
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: '**/*.css',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/environments',
          src: [ 'dev.js' ],
          dest: '<%= yeoman.app %>/scripts',
          rename: function(dest, src){
            return dest + '/' + appConfig.configFile
          }
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/environments',
          src: [ 'prod.js' ],
          dest: '<%= yeoman.app %>/scripts',
          rename: function(dest, src){
            return dest + appConfig.configFile
          }
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '{,**/}*.json',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          dest: '<%= yeoman.dist %>/images',
          src: '*'
        }, {
          expand: true,
          cwd: '.',
          src: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/*',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // uglify js files
    ///////////////////////////////////////
    uglify: {
      options: {
        mangle: false,
        compress: true,
        beautify: false
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: '{,**/}*.js',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,**/}*.js',
          '<%= yeoman.dist %>/styles/{,**/}*.css',
          '<%= yeoman.dist %>/images/{,**/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    }

  });

  grunt.registerTask('serve', 'Compile then start a web server', function (target) {

    if(target === 'dist'){
      return grunt.task.run([
        'build',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:dev',
      'copy:dev',
      'sass:dev',
      'browserify:dev',
      'connect:dev',
      'watch'
    ]);
  });

  grunt.registerTask('build', 'build assets', function (target) {
    grunt.task.run([
      'clean',
      'copy:dist',
      'sass:dev',
      'browserify:dev',
      'useminPrepare',  // read html build blocks and prepare to concatenate and move css,js to dist
      'concat',         // concatinates files and moves them to dist
      'cssmin',         // minify css in dist
      'htmlmin',        // minify and copy html files to dist
      'uglify',         // minifies & uglifies js files in dist
      'filerev',        // hashes js/css/img/font files in dist
      'usemin'
    ]);
  });

};
