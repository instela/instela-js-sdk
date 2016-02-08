module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {
                        cwd: 'build/',
                        src: ['instela-api.js', 'instela-api.min.js'],
                        dest: 'dist/',
                        filter: 'isFile',
                        expand: true
                    }
                ]
            }
        },
        mocha: {
            all: {
                src: ['test/testrunner.html'],
            },
            options: {
                run: true
            }
        },

        browserify: {
            main: {
                src: 'lib/*.js',
                dest: 'build/instela-api.js'
            },
            tests: {
                src: 'test/*.js',
                dest: 'build/instela-api-tests.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'build/instela-api.min.js': ['build/instela-api.js']
                }
            }
        }
    });

    // Load grunt mocha task
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['browserify', 'uglify', 'mocha', 'copy']);
};