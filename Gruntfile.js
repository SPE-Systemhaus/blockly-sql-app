module.exports = function(grunt) {

var license = '/* Copyright 2016 SPE Systemhaus GmbH\n\n' +
			  'Licensed under the Apache License, Version 2.0 (the "License");\n' +
			  'you may not use this file except in compliance with the License.\n' +
			  'You may obtain a copy of the License at\n\n' +
			  'http://www.apache.org/licenses/LICENSE-2.0\n\n' +
			  'Unless required by applicable law or agreed to in writing, software\n' +
			  'distributed under the License is distributed on an "AS IS" BASIS,\n' +
			  'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
			  'See the License for the specific language governing permissions and\n' +
			  'limitations under the License. */';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'jison-processor': {
      sql : {
        options : { 
          output: 'build/SQLParser.js',
          grammar: 'src/parser/SQLGrammar.jison',
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
        src: ['lang/**/*.js', 
              'src/constants.js', 
              'src/generator/sql.js', 
              'src/generator/blocks/*.js', 
              'src/**/*.js', 
              'build/SQLParser.js'],
        dest: 'build/<%= pkg.name %>.concat.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n\n' + license,
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