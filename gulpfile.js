var gulp = require("gulp"),
concat = require("gulp-concat"),
rename = require('gulp-rename'),
less = require('gulp-less'),
sass = require('gulp-sass'),
minifyCss = require("gulp-minify-css"),
uglify = require("gulp-uglify"),
gulpFilter = require('gulp-filter'),
bower = require('main-bower-files'),
plumber = require('gulp-plumber'),
imagemin = require('gulp-imagemin'),
please = require('gulp-pleeease'),
watch = require("gulp-watch"),
runSequence = require('run-sequence');

var cssLibDir = 'public/assets/css/lib/',
jsDir = 'public/assets/js/',
cssDir = 'public/assets/css/';

var cssFilter = gulpFilter('**/*.css', {restore: true}),
lessFilter = gulpFilter('**/*.less', {restore: true}),
scssFilter = gulpFilter('**/*.scss', {restore: true});

var SCSS_SRC = './src/assets/scss/**/*.scss';
var CSS_DEST = './public/assets/css/';
var JS_SRC =  './src/assets/js/*.js';
var JS_DEST = './public/assets/js/';
var PLUGINS_SRC = './src/assets/js/plugins/*.js';
var IMAGE_SRC = './src/assets/images/**/*';
var IMAGE_DEST = './public/assets/images/';

gulp.task('bowerCSS', function() {
 return gulp.src( bower({
  paths: {
   bowerJson: 'bower.json'
  }
 }) )
 //css
 .pipe( cssFilter )
 .pipe( rename({
  prefix: '_',
  extname: '.css'
 }) )
 .pipe( gulp.dest(cssLibDir) )
 .pipe( cssFilter.restore )
 //less
 .pipe( lessFilter )
 .pipe( less() )
 .pipe( rename({
  prefix: '_',
  extname: '.css'
 }) )
 .pipe( gulp.dest(cssLibDir) )
 .pipe( lessFilter.restore )
});
gulp.task('bowerCSS.concat', ['bowerCSS'] ,function() {
 return gulp.src(cssLibDir + '_*.css')
 .pipe( concat('_bundle.css') )
 .pipe( gulp.dest(cssDir) )
 .pipe( minifyCss() )
 .pipe( rename({
  extname: '.min.css'
 }) )
 .pipe( gulp.dest(cssDir) );
});
gulp.task('bowerJS', function() {
 var jsFilter = gulpFilter('**/*.js', {restore: true});
 return gulp.src( bower({
  paths: {
   bowerJson: 'bower.json'
  }
 }) )
 .pipe( jsFilter )
 .pipe( concat('_bundle.js') )
 .pipe( gulp.dest(jsDir) )
 .pipe( uglify({
  preserveComments: 'some'
 }) )
 .pipe( rename({
  extname: '.min.js'
 }) )
 .pipe( gulp.dest(jsDir) )
 .pipe( jsFilter.restore );
});
gulp.task('adminbsb.scss', function(){
 var base_path = "./bower_components/adminbsb-materialdesign/";
 return gulp.src( base_path + "**/*.scss")
 .pipe( sass() )
 .pipe( rename(
  "_admin_base.css"
 ))
 .pipe( gulp.dest(cssLibDir) )
})
gulp.task('adminbsb.css', function(){
 var base_path = "./bower_components/adminbsb-materialdesign/";
 return gulp.src( base_path + "css/*.css")
 .pipe( concat('_admin_style.css') )
 .pipe( gulp.dest(cssLibDir) )
})
gulp.task('adminbsb.js', function(){
 var base_path = "./bower_components/adminbsb-materialdesign/";
 return gulp.src( base_path + "js/*.js")
 .pipe( concat('_admin.js') )
 .pipe( gulp.dest(jsDir) )
 .pipe( uglify({
  preserveComments: 'some'
 }) )
 .pipe( rename({
  extname: '.min.js'
 }) )
 .pipe( gulp.dest(jsDir) )
})
gulp.task('adminbsb.plugins', function(){
 var base_path = "./bower_components/adminbsb-materialdesign/";
 return gulp.src(
  base_path + "plugins/**"
 )
 .pipe(gulp.dest('./public/assets/plugins/'))
})
gulp.task('fonts', function(){
 var path = "./bower_components/material-design-icons/iconfont"
 return gulp.src([
  path + '/*',
  '!**/*.md'
 ],{
  // base: 'fonts'
 })
 .pipe( gulp.dest('./public/assets/fonts/'))
})


//images
gulp.task('images', function() {
 return gulp.src([IMAGE_SRC])
 .pipe(plumber())
 .pipe(imagemin({
  optimizationLevel: 3,
  progressive: true,
  interlaced: true,
  svgoPlugins: [{removeViewBox: true}]
 }))
 .pipe(gulp.dest( IMAGE_DEST ))
});
//styles
gulp.task('styles', function() {
 gulp.src( SCSS_SRC )
 .on('error', function (err) {
  console.error('Error!', err.message);
 })
 .pipe(plumber())
 .pipe(sass().on('error', sass.logError))
 // .pipe(concatCss("app.css"))
 .pipe(concat("app.css", { newLine: "\n\n" }))
 .pipe(please({
  fallbacks: {
   autoprefixer: ['last 4 versions']
  },
  optimizers: {
   minifier: true
  },
 }))
 .pipe(rename({ suffix: '.min' }))
 .pipe(gulp.dest( CSS_DEST ))
});
//scripts
gulp.task('scripts', function() {
 return gulp.src([
  JS_SRC,
 ])
 .pipe(plumber())
 // .pipe(jshint('.jshintrc'))
 // .pipe(jshint.reporter('default'))
 // .pipe(gulp.dest( JS_DEST ))
 .pipe(concat('app.js'))
 .pipe(uglify())
 .pipe(rename({ suffix: '.min' }))
 .pipe(gulp.dest( JS_DEST ))
});
//files
gulp.task('files', function(){
 return gulp.src([
  './src/**/*.php'
 ],{})
 .pipe(gulp.dest('./public'))
})

gulp.task('watch', function() {
 watch(SCSS_SRC, function(){
  gulp.start('styles')
 });
 watch(JS_SRC, function(){
  gulp.start('scripts')
 });
 watch(IMAGE_SRC, function(){
  gulp.start('images')
 });
 watch('./src/**/*.php', function(){
  gulp.start('files')
 })
 //
 // gulp.watch([
 //     '**/*.html'
 // ], ['reload']);
 // gulp.watch('./assets/scss/*.scss', ['styles']);
});

gulp.task('default', function(){
 return runSequence(
  'adminbsb.js',
  ['bowerJS', 'adminbsb.scss', 'adminbsb.css', 'adminbsb.plugins'],
  'bowerCSS.concat'
 );
})
