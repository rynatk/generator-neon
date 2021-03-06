import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import browserSync from 'browser-sync';
import stylus from 'gulp-stylus';
import ghPages from 'gh-pages';
import gutil from 'gulp-util';

const sync = browserSync.create();

gulp.task('html', () => {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({
      stream: true
    }));
});

gulp.task('json', () => {
  gulp.src('src/**/*.json')
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({
      stream: true
    }));
});

gulp.task('script', () => {
  browserify({
      entries: ['./src/scripts/main.js'],
      extensions: ['.js', '.jsx'],
      debug: true
    }).transform(babelify.configure({
      plugins: ['transform-class-properties']
    })).bundle()
    .on('error', (error) => {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      gutil.beep();
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({
      stream: true
    }));
});

gulp.task('styles', ['fonts'], () => {
  gulp.src('src/styles/**/*.{css,styl}')
    .pipe(stylus()
      .on('error', (error) => {
        gutil.log(gutil.colors.red('Error: ' + error.message));
        gutil.beep();
      }))
      .pipe(gulp.dest('dist'))
      .pipe(sync.reload({
        stream: true
      }));
});

//Images
gulp.task('images', () => {
  gulp.src('src/styles/images/*')
    .pipe(gulp.dest('dist/images'))
});

//Fonts
gulp.task('fonts', () => {
  gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('build', ['html', 'script', 'styles', 'json', 'images']);

gulp.task('deploy', ['build'], () => {
  ghPages.publish('dist');
});

gulp.task('serve', ['build'], () => {
  sync.init({
    server: 'dist',
  });

  gulp.watch('src/**/*.{html,jade}', ['html']);
  gulp.watch('src/**/*.json', ['json']);
  gulp.watch('src/**/*.{css,scss,sass,stylus}', ['styles']);
  gulp.watch('src/**/*.{js,jsx}', ['script']);
  gulp.watch('src/styles/images/*', ['images']);
});

gulp.task('default', ['serve']);
