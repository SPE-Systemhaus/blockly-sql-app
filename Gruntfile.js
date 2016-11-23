module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'jison-processor': {
      sql : {
        options : { 
          output: 'build/SQLParser.js',
          grammar: 'src/SQLGrammar.jison',
		  debug: true
        }
      }
    },
    jshint: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        options: {
          globals: {
            jQuery: true
          }
        }
      },
      watch: {
        files: ['<%= jshint.files %>'],
        tasks: ['concat', 'uglify']
      },
    concat: {
      dist: {
        src: ['plugins/**/*.js', 'src/**/*.js', 'build/SQLParser.js'],
        dest: 'build/<%= pkg.name %>.concat.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true,
        sourceMapName: 'dist/<%= pkg.name %>.min.map',
        beautify: true,
		mangle: false
      },
      build: {
        src: 'build/<%= pkg.name %>.concat.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jison');
  grunt.loadNpmTasks('grunt-jison-processor');
  
  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('withJison', ['jison-processor', 'concat', 'uglify']); 
};