import eslint from 'gulp-eslint'
import gulp from 'gulp'
import makeWebpackConfig from './webpack/makeConfig'
import runSequence from 'run-sequence'
import webpackBuild from './webpack/build'
import bg from 'gulp-bg'
import clean from 'gulp-clean'
import env from 'gulp-env'

gulp.task('build', ['clean', 'set-env-prod'], (done) => webpackBuild(makeWebpackConfig(false))(done))
gulp.task('hot', ['set-env-dev'], bg('node', './webpack/server'))

gulp.task('eslint', () => {
  return gulp.src([
    'gulpfile.babel.js',
    'src/**/*.js',
    'webpack/*.js',
    '!**/__tests__/*.*',
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
})

gulp.task('set-env-dev', () => {
  env({vars: {env: 'development'}})
})

gulp.task('set-env-prod', () => {
  env({vars: {env: 'production'}})
})

gulp.task('clean', function() {
  return gulp.src('./build')
    .pipe(clean({force: true}))
})

gulp.task('test', (done) => {
  runSequence('eslint', done)
})

gulp.task('default', ['dev-server'])
