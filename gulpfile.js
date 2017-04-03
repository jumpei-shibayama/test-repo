'use strict';

/*
 * $ npm install gulp -g
 * $ npm install
 */

// load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    please = require('gulp-pleeease'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    rename = require('gulp-rename'),
    browsersync = require('browser-sync'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    iconfont = require('gulp-iconfont'),
    iconfontcss = require('gulp-iconfont-css');

// styles
gulp.task('styles', function() {
   return sass('src/scss/*.scss')
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(plumber())
    .pipe(please({
      fallbacks: {
        autoprefixer: ['last 4 versions']
      },
      optimizers: {
        minifier: true
      }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/css'))
});

// scripts
gulp.task('scripts', function() {
    return gulp.src([
        'app/assets/scripts/*.js',
        'app/assets/scripts/plugins/*.js'
    ])
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('../../scripts'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('../../scripts'))
});

// plugins scripts
gulp.task('plugins', function() {
    return gulp.src([
        'app/assets/scripts/plugins/*.js',
    ])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('../../scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('../../scripts'))
});

// libs
gulp.task('libs', function() {
    return gulp.src([
        'app/assets/scripts/libs/*.js'
    ])
    .pipe(gulp.dest('../../scripts/libs'))
});

// fonts
gulp.task('fonts', function() {
    return gulp.src([
        'app/assets/fonts/**/*'
    ])
    .pipe(gulp.dest('../../fonts'))
});

// flags
gulp.task('flags', function() {
    return gulp.src([
        'app/assets/flags/**/*'
    ])
    .pipe(gulp.dest('../../flags'))
});

// json
gulp.task('json', function() {
    return gulp.src([
        'app/assets/json/**/*'
    ])
    .pipe(gulp.dest('../../json'))
});

// icons
gulp.task('icons', function(){
  return gulp.src(['app/assets/icons/*.svg'])
    .pipe(iconfontcss({
      fontName: 'icons',
      targetPath: '../styles/main/_icons.scss',
      fontPath: '../fonts/'
    }))
    .pipe(iconfont({
      fontName: 'icons',
      appendCodepoints: true,
      normalize: true,
      fontHeight: 500,
    }))
    .pipe(gulp.dest('app/assets/fonts/'))
});

gulp.task('icons_copy', function(){
  return gulp.src(['app/assets/icons/*.svg'])
    .pipe(iconfont({
      fontName: 'icons',
      appendCodepoints: true,
      normalize: true,
      fontHeight: 500,
    }))
    .pipe(gulp.dest('../../fonts/'));
});


// images
gulp.task('images', function() {
    return gulp.src(['app/assets/images/**/*'])
    .pipe(plumber())
    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest('../../images'))
});

// browsersync
// gulp.task('browsersync', function() {
//   return browsersync.init(null, {
//     server: {
//       baseDir: './dist'
//     },
//     notify: false,
//     open: false
//   });
// });

// gulp.task('reload', function () {
//   browsersync.reload();
// });

// default task
// gulp.task('default', ['clean'], function() {
//     gulp.start('templates', 'icons', 'icons_copy', 'styles', 'scripts', 'plugins', 'libs', 'images', 'fonts', 'flags', 'json');
// });
gulp.task('default', [], function() {
    gulp.start('watch');
});
gulp.task('build', [], function() {
    gulp.start('templates', 'styles', 'scripts', 'plugins', 'libs', 'images', 'fonts', 'flags', 'json');
});

// watch
gulp.task('watch', function() {

    // watch templates
    // gulp.watch('app/templates/**/*.jade', ['templates']);

    // watch assets
//  gulp.watch('app/assets/icons/**/*', ['icons']);
//  gulp.watch('app/assets/icons/**/*', ['icons_copy']) ;
    gulp.watch('src/scss/*.scss', ['styles']);
    // gulp.watch('app/assets/scripts/**/*.js', ['scripts']);
//  gulp.watch('app/assets/scripts/plugins/**/*.js', ['plugins']);
//  gulp.watch('app/assets/scripts/libs/**/*', ['libs']);
    // gulp.watch('app/assets/images/**/*', ['images']);
    // gulp.watch('app/assets/fonts/**/*', ['fonts']);
//  gulp.watch('app/assets/flags/**/*', ['flags']);
    // gulp.watch('app/assets/json/**/*.json', ['json']);

    // gulp.watch([
    //     '**/*.html'
    // ], ['reload']);
});
