/**
 * Running Grunt
	First make sure Node & NPM are installed on your computer! (If not installed use brew)
		node -v
		npm -v


 * Load Grunt plugins
 * This will now automatically load all of your Grunt plugins so you don’t have to manually list them out and keep that list up-to-date.


 * Install Grunt & packages in the root of your project folder:
	* If grunt and grunt-cli are NOT in your package.json run these first:
		npm install -g grunt-cli grunt
	* Or if you have grunt and grunt-cli in your package.json & you have a Gruntfile.js. (FYI: We will install LibSass vs Ruby Sass due to better performance)
		npm install
	* If they (Gruntfile.js & package.json) are not you can manually install all required packages with the command below (--save-dev adds the reference into the package.json):
		npm install --save-dev node-sass grunt-contrib-uglify grunt-contrib-concat grunt-sass grunt-contrib-sass node-bourbon grunt-contrib-watch grunt-stripcomments grunt-contrib-copy grunt-text-replace grunt-contrib-clean

 * Once you have verified everything has installed properly you can run Grunt in the root of your project folder with:
		grunt


 * If Grunt is not working run the following two commands!
		npm install --save-dev matchdep
		npm install --save-dev grunt-contrib-uglify grunt-contrib-concat grunt-contrib-watch
	* LibSass
		npm install --save-dev node-sass grunt-sass node-bourbon
	* OR if you really wanted to use Ruby Sass and are getting Ruby Sass errors, make sure it is installed:
		sudo gem install sass


 * Creating a new project (Shouldn't be necessary unless you want to start a new project from scratch!)
		npm init

 * Additional Functionality To Look Into:
		http://gruntjs.com/api/grunt.option

 */


module.exports = function(grunt) {

	// 1. All configuration goes here
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Concatinate: all our JS files.
		concat:{
			dkomando:{ // dkomando will be our default object. -------------
				options:{
					// This banner is inserted at the top of the concatenated JS file.
					banner:'/*! <%= pkg.description %> v.<%=pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				// Create the concatenated version
				src:[
					'js/src/_common/strict_start.js',
					// This will load files in a specified order as well as only grabbing fies that begin with 'cs_' ONLY!
					'js/src/*.js',
					'js/src/_common/strict_end.js'
				],
				dest:'js/app.concat.js'
			}
		},


		// Replace the font path for font-awesome.
		replace: {
			fa_path:{
				src: ['css/font-awesome.css'],
				dest: 'css/font-awesome.min.css',
				replacements: [{
					from: /\.\.\/fonts\//g,
					to: 'fonts/'
				},{
					from: /[\?|\&]+v=4\.6\.1/g,
					to: ''
				}]
			}
		},


		// Copy File: For removing comments - comments plugin has no destination file option.
		copy: {
			dkomando: {
				src: 'js/app.concat.js',
				dest: 'js/app.js'
			},
			font_awesome: {
				expand: true,
				cwd: 'node_modules/font-awesome/fonts/',
				src: ['*'],
				dest: 'css/fonts/',
				filter: 'isFile'
			},
			material_icons:{
				expand: true,
				cwd: 'node_modules/material-design-icons/iconfont/',
				src: ['*'],
				dest: 'css/fonts/',
				filter: 'isFile'
			},
			ng_infinite_scroll:{
				expand: true,
				cwd: 'node_modules/ng-infinite-scroll/build/',
				src: ['ng-infinite-scroll.min.js'],
				dest: 'js/',
				filter: 'isFile'
			}
		},
		//grunt.file.copy('js/app.concat.js', 'js/app.js');


		// Remove Comments: To have a non-minified clean file for debugging use.
		comments: {
			js: {
				options: {
					singleline: true,
					multiline: true
				},
				src:['js/app.js']
			}
		},

		// Minify: Also, grab the concat file and minify JS.
		uglify:{
			dkomando:{
				options: {
					report: 'min',
					mangle: true
				},
				files:{
					// dkomando app
					'js/app.min.js' :['js/app.concat.js'] // Needs to match concat's distination file.
				}
			}
		},


		// Delete Unnecessary Files
		// https://github.com/gruntjs/grunt-contrib-clean
		clean: {
			font_awesome: ['css/font-awesome.css'],
			material_icons: ['css/fonts/codepoints','css/fonts/material-icons.css','css/fonts/README.md'],
			ds_store: ['**/.DS_Store']
		},


		// Bourbon = Predone Mixins -&&- Neat = Predone Grid Framework
		sass:{                                                // Task: SASS/SCSS

			minified:{                                              // Build Minified Version
				options:{                                         // Target options
					sourceMap: false,                                // Do we really need these?
					//includePaths: require('node-bourbon').with('node_modules/node-bourbon'),
					includePaths: require('node-bourbon').includePaths, // Include Just Bourbon (for the mixins)
					//loadPath: ['scss/'].concat(require('node-neat').includePaths),
					//loadPath: [['bourbon', 'neat'], 'scss/'],     // Include Both Bourbon & Neat
					outputStyle: 'compressed',                            // [ nested, compact, compressed, expanded ]
					noCache: true
				},
				files:{                                           // Dictionary of files
					// 'destination': 'source'
					'css/styles.min.css': 'css/scss/styles.scss' // All project files are imported through materialize.scss
				}
			},
			compact:{                                             // Build Non-minfied Version
				options:{                                         // Target options
					sourceMap: true,                               // Do we really need these?
					includePaths: require('node-bourbon').includePaths, // Include Just Bourbon (for the mixins)
					//loadPath: ['scss/'].concat(require('node-neat').includePaths), // Ruby
					//loadPath: [['bourbon', 'neat'], 'scss/'],     // Ruby Include Both Bourbon & Neat
					outputStyle: 'compact',                               // [ nested, compact, compressed, expanded]
					noCache: true
				},
				files:{                                           // Dictionary of files
					// 'destination': 'source'
					'css/styles.css': ['css/scss/styles.scss'] // All project files are imported through materialize.scss
				}
			},
			bootstrap: {
				options:{                                         // Target options
					sourceMap: false,                                // Do we really need these?
					//includePaths: require('node-bourbon').with('node_modules/node-bourbon'),
					includePaths: require('node-bourbon').includePaths, // Include Just Bourbon (for the mixins)
					//loadPath: ['scss/'].concat(require('node-neat').includePaths),
					//loadPath: [['bourbon', 'neat'], 'scss/'],     // Include Both Bourbon & Neat
					outputStyle: 'compressed',                            // [ nested, compact, compressed, expanded ]
					noCache: true
				},
				files:{                                           // Dictionary of files
					// 'destination': 'source'
					'css/bootstrap.min.css': 'node_modules/bootstrap/scss/bootstrap-flex.scss' // All project files are imported through materialize.scss
				}
			},
			font_awesome: {
				options:{                                         // Target options
					sourceMap: false,                                // Do we really need these?
					//includePaths: require('node-bourbon').with('node_modules/node-bourbon'),
					includePaths: require('node-bourbon').includePaths, // Include Just Bourbon (for the mixins)
					//loadPath: ['scss/'].concat(require('node-neat').includePaths),
					//loadPath: [['bourbon', 'neat'], 'scss/'],     // Include Both Bourbon & Neat
					outputStyle: 'compressed',                            // [ nested, compact, compressed, expanded ]
					noCache: true
				},
				files:{                                           // Dictionary of files
					// 'destination': 'source'
					'css/font-awesome.css': 'node_modules/font-awesome/scss/font-awesome.scss' // All project files are imported through materialize.scss
				}
			}

		},


		watch: {
			styles: {
				files: [
					// Listen for Sass/SCSS changes
					'css/scss/*.scss',
					'css/scss/**/*.scss',

					// Listen for JavaScript changes
					'js/src/**/*.js',
					'js/src/_common/*'
				],
				/* These are your tasks from above and they run in the order you have them here! */
				tasks: [ /* If you are getting default errors from grunt check this array! */
					'concat:dkomando',
					'copy:dkomando',
					'comments',
					'uglify:dkomando',
					'sass:minified',
					'sass:compact'
				],
				options: {
					nospawn: true
				}
			}
		}
	});



	// 2. Where we tell Grunt what plug-ins we plan on using.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-stripcomments');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');



	// 3. Where we tell Grunt what to do when we type "grunt" into the terminal.
	// Run The Default With: grunt
	grunt.registerTask('default', ['concat:dkomando','copy:dkomando','comments','uglify:dkomando','sass:minified','sass:compact','watch']);
	// Run just the add libs: Once npm install has been run we can add libraries to the project. - With: grunt addlibs
	grunt.registerTask('addlibs', [
		'copy:font_awesome','sass:font_awesome','replace:fa_path','clean:font_awesome',
		'copy:material_icons','clean:material_icons',
		'sass:bootstrap'
	]);
	// Run removal of Mac .DS_Store files!
	grunt.registerTask('rm_ds_store', ['clean:ds_store']);
};
