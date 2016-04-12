const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const nsp = require('gulp-nsp');
const plumber = require('gulp-plumber');
const coveralls = require('gulp-coveralls');
const excludeGitignore = require('gulp-exclude-gitignore');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const open = require('gulp-open');
const nodemon = require('gulp-nodemon');
const ngAnnotate = require('gulp-ng-annotate');
const path = require('path');
const app = require('./config/application.js');
const sequence = require('run-sequence');
const jsdoc = require('gulp-jsdoc3');

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


// Returns webpack stream
function pack(opts) {

  var wpObject = {
    output : {
      filename : 'bundle.js'
    },
    devtool: 'source-map',
    watch  : (opts.mode === 'development'),
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
    plugins : (opts.mode === 'development') ? [] : [new webpack.optimize.UglifyJsPlugin()]
  };

  return webpackStream(
    wpObject,
    null,
    (opts.mode === 'development') ? function () {
      if (!started) {
        gulp.start('open');
        started = true;
      }
    } : null
  );
}


gulp.task('pack-dev', function () {
  return gulp.src('public/src/app/app.js')
    .pipe(pack({
      mode: 'development'
    }))
    .pipe(gulp.dest('public/dist'));
});


gulp.task('pack-prod', function () {
  return gulp.src('public/build/app/app.js')
    .pipe(pack({
      mode : 'prod'
    }))
    .pipe(gulp.dest('public/dist'));
});


gulp.task('run', function () {
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


gulp.task('open', function () {
  gulp.src('').pipe(open({
    uri: 'http://localhost:' + app.port + '/login'
  }));
});


gulp.task('annotate', function () {
  return gulp.src('public/src/app/**/*.js')
    .pipe(ngAnnotate())
    .pipe(gulp.dest('public/build/app'));
});


gulp.task('copy-sass', function () {
  return gulp.src('public/src/sass/**')
  .pipe(gulp.dest('public/build/sass'));
});



gulp.task('docs', function (cb) {
  var config = {
    opts: {
      destination : './docs/',
      recurse     : true
    }
  };

  gulp.src([
    'Readme.md', '**/*.js', '!public/dist/**',
    '!gulpfile.js', '!config/**', '!test/**',
    '!docs/**'
    ], {
    read: false
  })
  .pipe(excludeGitignore())
  .pipe(jsdoc(config, cb));
});


gulp.task('build', function (done) {
  sequence(['annotate', 'copy-sass'], function () {
    gulp.start('pack-prod');
    done();
  });
});


gulp.task('serve', ['run',  'pack-dev']);
gulp.task('prepublish', ['nsp']);
gulp.task('default', ['lint', 'test', 'coveralls']);