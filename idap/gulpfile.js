var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    tinypng = require('gulp-tinypng-compress'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    htmlImport = require('gulp-html-import');
    sourcemaps = require('gulp-sourcemaps');

gulp.task('import', function () {
    return gulp.src('src/components/pages/**/*.html')
        .pipe(rename({dirname: ''}))
        .pipe(htmlImport('src/components/'))
        .pipe(gulp.dest('src'))
        .pipe(browserSync.stream());
});
gulp.task('sass',function(){
  return gulp.src('src/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
      cascade: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
});
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false
  });
});
gulp.task('jquery', function(){
  return gulp.src(['src/libs/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('src/js'))
});
gulp.task('libs-css', ['sass'], function(){
  return gulp.src('src/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'));
});
gulp.task('libs-js', function(){
  return gulp.src([
      // 'src/libs/slick-carousel/slick/slick.min.js',
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});

gulp.task('tiny', function(){
  return gulp.src('src/img/**/*.+(png|jpg|jpeg)')
    .pipe(cache(tinypng({
      key: 'p9hZWdpVCqFgzxVSTKkTt7K2xwvC0ll6',
      sigFile: 'images/.tinypng-sigs',
      sameDest: true,
      log: true
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('img', ['tiny'], function(){
  return gulp.src('src/img/**/*.+(svg|ico)')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'libs-css', 'jquery', 'libs-js'], function() {
    gulp.watch(['src/sass/**/*.sass', 'src/components/pages/**/*.sass'], ['sass']);
    // gulp.watch('src/*.html', browserSync.reload);
    gulp.watch(['src/components/*.html', 'src/components/pages/**/*.html'], ['import'], browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});
gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('build', ['clean', 'sass', 'jquery', 'img'], function(){
  var buildCss = gulp.src([
    'src/css/main.css',
    'src/css/libs.min.css'
  ])
  .pipe(gulp.dest('dist/css'));

  var buildDist = gulp.src([
      'src/css',
      'src/js',
      'src/img',
      'src/.html',
  ])
  .pipe(gulp.dest('dist'));

  var buildFonts = gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('src/js/**/*')
  .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('src/*.html')
  .pipe(gulp.dest('dist'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
