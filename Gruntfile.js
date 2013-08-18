/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({

    // Metadata
    // --------
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',


    // Tasks
    // -----
    coffee: {
      dist: {
        options: {
          bare: true,
          sourceMap: true
        },
        expand: true,
        src: ['apps/**/*.coffee'],
        dest: 'dist/',
        ext: '.js'
      }
    },

    sass: {
      dist: {
        options: {
          sourcemap: true
        },
        expand: true,
        src: ['apps/**/*.scss'],
        dest: 'dist/',
        ext: '.css'
      }
    },

    slim: {
      dist: {
        options: {
          pretty: true
        },
        expand: true,
        src: ['apps/**/*.slim'],
        dest: 'dist/',
        ext: '.html'
      }
    },

    watch: {
      coffee: {
        files: '<%= coffee.dist.src %>',
        tasks: ['coffee:dist']
      },

      sass: {
        files: '<%= sass.dist.src %>',
        tasks: ['sass:dist']
      },

      slim: {
        files: '<%= slim.dist.src %>',
        tasks: ['slim:dist']
      }
    },

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 8080,
          base: './'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-slim');

  grunt.registerTask('default',[
    'coffee:dist',
    'sass:dist',
    'slim:dist'
  ]);
};
