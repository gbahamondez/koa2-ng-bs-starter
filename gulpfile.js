const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const nsp = require('gulp-nsp');
const plumber = require('gulp-plumber');
const coveralls = require('gulp-coveralls');
const excludeGitignore = require('gulp-exclude-gitignore');
const webpackStream = require('webpack-stream');
const open = require('gulp-open');
const nodemon = require('gulp-nodemon');
const path = require('path');
const app = require('./config/server.js');
const jsdoc = require('gulp-jsdoc3');

var started = false;

gulp.task('lint', function () {
  return gulp.src(['**/*.js'])
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});


gulp.task('pre-test', function () {
  return gulp.src([
    '**/*.js', '!gulpfile.js',
    '!test/**', '!config/**',
    '!client/**'
  ])
  .pipe(excludeGitignore())
  .pipe(istanbul({
    includeUntested: true
  }))
  .pipe(istanbul.hookRequire());
});


gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;
  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});


gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});


// Returns webpack stream
function pack(opts) {
  var webpackConf;
  var callback;
  if (opts.mode === 'development') {
    webpackConf = require('./config/webpack/dev.js');
    callback = function (){
      if (!started) {
        gulp.start('open');
        started = true;
      }
    };
  } else {
    webpackConf = require('./config/webpack/dist.js');
  }

  return webpackStream(webpackConf, null,callback);
}


gulp.task('webpack-development', function () {
  return gulp.src('client/src/app/app.js')
    .pipe(pack({
      mode: 'development'
    }))
    .pipe(gulp.dest('dist'));
});


gulp.task('webpack-production', function () {
  return gulp.src('client/src/app/app.js')
    .pipe(pack({
      mode : 'production'
    }))
    .pipe(gulp.dest('dist'));
});


gulp.task('run', function () {
  var opts = {
    script : 'app.js',
    ignore : [
      'config/webpack',
      'client/src', 'dist',
      'node_modules', 'gulpfile.js'
    ],
    ext    : 'js html',
    env    : {DEBUG : 'app'}
  };
  nodemon(opts);
});


gulp.task('open', function () {
  gulp.src('').pipe(open({
    uri: 'http://localhost:' + app.port + '/'
  }));
});

gulp.task('docs', function (cb) {
  var config = {
    opts: {
      destination : 'docs',
      recurse     : true
    }
  };
  gulp.src([
      'README.md', '**/*.js', '!gulpfile.js',
      '!config/**', '!test/**'
    ], {
    read: false
  })
  .pipe(excludeGitignore())
  .pipe(jsdoc(config, cb));
});


gulp.task('dist', ['webpack-production']);
gulp.task('serve', ['run', 'webpack-development']);
gulp.task('prepublish', ['nsp']);
gulp.task('default', ['lint', 'test', 'coveralls']);