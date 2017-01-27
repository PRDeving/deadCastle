var gulp = require('gulp');

var src = 'src';
var dist = 'mobile/www';

gulp.task('build', () => {
  gulp.src(`${src}/**/*`)
    .pipe(gulp.dest(dist));
});
