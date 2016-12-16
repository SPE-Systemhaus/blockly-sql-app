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

  var modulePath = '../common/modules/';

  var modules = [
    modulePath + 'ace-builds/src-min/ace.js',
    modulePath + 'ace-builds/src-min/mode-sql.js',
    modulePath + 'ace-builds/src-min/theme-monokai.js',
    modulePath + 'ace-builds/src-min/theme-monokai.js',
    modulePath + 'blockly-colour-gradient/colour-gradient.js',
    modulePath + 'blockly-events/events.js',
    modulePath + 'blockly-type-indicator/typeIndicator.js'
  ];

  var sources = [
    'lang/**/*.js', 
    'src/constants.js', 
    'src/generator/sql.js', 
    'src/generator/blocks/*.js',
    'src/blocks/init.js',
    'src/blocks/fields.js',
    'src/blocks/operators.js',
    'src/blocks/values.js',
    'src/blocks/functions.js',
    'src/**/*.js', 
    'build/SQLParser.js'
  ];

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
        src: sources,
        dest: 'build/<%= pkg.name %>.concat.js',
      },
	  relase: {
      src: modules.concat(sources),
      dest: 'build/<%= pkg.name %>.concat_release.js'
	  }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> by Michael Kolodziejczyk, SPE Systemhaus GmbH <mk@spe-systemhaus.de> */\n\n' + license,
        sourceMap: true,
        sourceMapName: 'dist/<%= pkg.name %>.min.map',
        beautify: false,
		    mangle: true
      },
      build: {
        src: 'build/<%= pkg.name %>.concat_release.js',
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
  
  grunt.registerTask('debug', ['concat:dist']);
  grunt.registerTask('parser', ['jison-processor', 'concat:dist']); 

  grunt.registerTask('default', ['jison-processor', 'concat:relase', 'uglify']);  
  grunt.registerTask('release', ['jison-processor', 'concat:relase', 'uglify']);
};