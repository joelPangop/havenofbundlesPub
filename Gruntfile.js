module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: './libs',
                    cleanTargetDir: true
                }
            }
        },
        html2js: {
            dist: {
                src: [ '*.html' ],
                dest: 'tmp/templates.js'
            }
        },
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    src: [ 'app/*.js' ],
                    dest: 'dist/',
                }],
                options: {
                    mangle: false
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    // require('autoprefixer')({overrideBrowserslist: 'last 2 versions'}), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        src: 'css/*.css',
                        dest: 'dist/'
                    }
                ]
            }
        },
        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': './index.html',     // 'destination': 'source'
                    'dist/success.html': './success.html'
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, src: ['fonts/*'], dest: 'dist/', filter: 'isFile'},

                    // includes files within path and its sub-directories
                    {expand: true, src: ['img/**'], dest: 'dist/'},
                ],
            },
        },
        clean: {
            temp: {
                src: [ 'tmp', 'dist' ]
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [ 'app/*.js', 'tmp/*.js' ],
                dest: 'dist/app.js'
            }
        },

        jshint: {
            all: [ 'Gruntfile.js', '.jshintrc', 'app/*.js', 'app/**/*.js' ],
            options : {
                // options here to override JSHint defaults
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                globals : {
                    jQuery : true,
                    console : true,
                    module : true,
                    document : true,
                    esversion: 6,
                    moz: true
                }
            }
        },

        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8080
                }
            }
        },

        watch: {
            dev: {
                files: [ 'Gruntfile.js', 'app/*.js', '*.html' ],
                tasks: [ 'jshint', 'karma:unit', 'html2js:dist', 'concat:dist', 'clean:temp' ],
                options: {
                    atBegin: true
                }
            },
            min: {
                files: [ 'Gruntfile.js', 'app/*.js', '*.html' ],
                tasks: [ 'jshint', 'karma:unit', 'html2js:dist', 'concat:dist', 'clean:temp', 'uglify:dist' ],
                options: {
                    atBegin: true
                }
            }
        },

        compress: {
            dist: {
                options: {
                    archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [{
                    src: [ 'index.html' ],
                    dest: '/'
                }, {
                    src: [ 'dist/**' ],
                    dest: 'dist/'
                }, {
                    src: [ 'assets/**' ],
                    dest: 'assets/'
                }, {
                    src: [ 'libs/**' ],
                    dest: 'libs/'
                }]
            }
        },

        karma: {
            options: {
                configFile: 'config/karma.conf.js'
            },
            unit: {
                singleRun: true
            },

            continuous: {
                singleRun: false,
                autoWatch: true
            }
        }
        // Task configuration will be written here
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('dev', [ 'bower', 'connect:server', 'watch:dev' ]);
    grunt.registerTask('test', [ 'bower', 'jshint', 'karma:continuous' ]);
    grunt.registerTask('minified', [ 'bower', 'connect:server', 'watch:min' ]);
    grunt.registerTask('package', [ 'bower', 'jshint', 'karma:unit', 'html2js:dist', 'concat:dist', 'uglify:dist',
        'clean:temp', 'compress:dist' ]);
    grunt.registerTask('heroku:production', 'build');
    // Default task(s).
    grunt.registerTask('default', ['clean:temp', 'uglify', 'postcss', 'htmlmin', 'copy']);
    // change the tasks in the list to your production tasks
    grunt.registerTask('heroku',
        ['compass:dist', 'autoprefixer', 'imagemin']);
    // Loading of tasks and registering tasks will be written here
};
