/*
 * INITIALIZE GULP
 */

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    fs = require('fs'),
    proxy = require('http-proxy-middleware'),
    autoprefixer = require('gulp-autoprefixer'),
    pa11y = require('gulp-pa11y');

// Config vars
// If, after a while, there are a lot of config vars, we can move these to a separate file
var environment = {
    demo: {
        chat: 'http://demo.opendesk.dk:5280/http-bind',
        repo: 'http://demo.opendesk.dk:8080',
        share: 'http://demo.opendesk.dk:8081'
    },
    local: {
        chat: 'http://demo.opendesk.dk:5280/http-bind',
        repo: 'http://localhost:8080',
        share: 'http://localhost:8081'
    },
    staging: {
        repo: 'http://oda-test.rm.dk:8080/'
    }
};

var paths = {
    scripts: ['app/src/**/*.module.js', 'app/src/**/*.js', '!app/src/**/*Spec.js', '!app/src/modules/test/**/*.js', '!app/src/modules/**/tests/**/*.js'],
    scss: ['app/src/app.scss', 'app/src/**/*.scss']
};

var dist = {
    name: 'opendesk-app-129',
    folder: './dist/'
};


/*
 * LOCAL WEBSERVER
 */

function createWebserver(config) {
    return gulp.src('./')
        .pipe($.webserver({
            open: false, // Open up a browser automatically
            host: '0.0.0.0', // hostname needed if you want to access the server from anywhere on your local network
            port: '7674',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
                next();
            },
            proxies: [{
                source: '/alfresco',
                target: config.repo + '/alfresco'
            }, {
                source: '/share',
                target: config.share + '/share'
            }, {
                source: '/http-bind',
                target: config.chat
            }]
        }));
}


/*
 * GULP TASKS
 */

// Script tasks
gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe($.wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe($.concat(dist.name + '.js'))
        .pipe(gulp.dest(dist.folder))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.stripDebug())
        .pipe($.ngAnnotate())
        //.pipe($.uglify())
        .pipe(gulp.dest(dist.folder))
        .on('error', $.util.log);
});

// CSS tasks
gulp.task('css', function () {
    return gulp.src(paths.scss)
        .pipe($.wrap('/** ---------------- \n * Filepath: <%= file.relative %>\n */\n<%= contents %>'))
        .pipe($.concat(dist.name + '.scss'))
        .pipe($.sass())
        .pipe(gulp.dest(dist.folder))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.minifyCss())
        .pipe(gulp.dest(dist.folder))
        .on('error', $.util.log);
});

// Accessibility check
gulp.task('acc_check', function () {
    pa11y({ url: 'http://178.62.194.129/' });
});

// Set up watchers
gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.scss, ['css']);
});

/*
 * GULP TASK RUNS
 * Gulp tasks to run from the CLI
 */

// This task is used to just build the scripts and CSS.
// Useful if you want to deploy to production (e.g. with Apache).
gulp.task('build', ['scripts', 'css', 'acc_check']);

gulp.task('demo', ['build', 'watch'], function () {
    createWebserver(environment.demo);
});

gulp.task('local', ['build', 'watch'], function () {
    createWebserver(environment.local);
});

gulp.task('staging', ['build', 'watch'], function () {
    createWebserver(environment.staging);
});

// Tests
gulp.task('ui-test', ['e2e-tests']);

// Running 'gulp' is equal to running 'gulp build watch'
// In other words, the default task is the 'build' and 'watch' task
gulp.task('default', ['build', 'watch']);
