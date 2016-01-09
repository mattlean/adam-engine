module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      files: {
        src: ['static/adamengine-dev.js', 'static/qpcrcrush.js'],
        dest: 'static/qpcrcrush.min.js'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'static/game.min.html': 'static/game.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('default', ['uglify', 'htmlmin']);

};