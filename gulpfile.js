const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const nsp = require('gulp-nsp');
const plumber = require('gulp-plumber');
const coveralls = require('gulp-coveralls');
const excludeGitignore = require('gulp-exclude-gitignore');
const webpack = require('webpack-stream');
const CSSExtract = require('extract-text-webpack-plugin');
const open = require('gulp-open');
const nodemon = require('gulp-nodemon');
const ngAnnotate = require('gulp-ng-annotate');
const path = require('path');
const app = require('./config/application.js');

var started = false;

gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!public/dist/**'])
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
    '!public/dist/**'
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
      process.exit();
    });
});


gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});



gulp.task('pack', function() {
  var stream = webpack({
    output : {
      filename : 'bundle.js'
    },
    devtool: 'source-map',
    watch  : true,
    module : {
      loaders : [{
        test   : /\.s?css$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }]
    },
    plugins : [new CSSExtract('bundle.css')]
  },
  null,
  // Just the first time
  function() {
    if (!started) {
      gulp.start('open');
      started = true;
    }
  });

  return gulp.src('public/src/app/app.js').pipe(stream)
    .pipe(gulp.dest('public/dist'));
});


gulp.task('run', function() {
  var opts = {
    script : 'app.js',
    ignore : [
      'public/src', 'public/dist',
      'node_modules', 'gulpfile.js'
    ],
    ext    : 'js html',
    env    : {DEBUG : 'app'}
  };
  nodemon(opts);
});


gulp.task('open', function() {
  gulp.src('').pipe(open({
    uri: 'http://localhost:' + app.port
  }));
});


gulp.task('annotate', function () {
  return gulp.src('public/src/app/**/*.js')
    .pipe(ngAnnotate())
    .pipe(gulp.dest('public/src/app'));
});


gulp.task('build', ['annotate']);
gulp.task('serve', ['run',  'pack']);
gulp.task('prepublish', ['nsp']);
gulp.task('default', ['lint', 'test', 'coveralls']);