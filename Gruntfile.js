module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        yuidoc: {
            compile: {
                name: 'Grunt test',
                description: 'Part Two ',
                version: '1',
                url: 'b-line.com',
                options: {
                    paths: './src',
                    //themedir: 'path/to/custom/theme/',
                    outdir: 'doc'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');


    // Default task(s).
    grunt.registerTask('doc', ['yuidoc']);

};