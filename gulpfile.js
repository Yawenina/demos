const gulp = require('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()

gulp.task('sass',function(){
	return gulp.src('app/scss/*.scss')
				.pipe(sass())
				.pipe(gulp.dest('dist/css'))
				.pipe(browserSync.stream())
})

gulp.task('babel',function(){
	return gulp.src('app/js/*.js')
				.pipe(babel({presets:['es2015']}))
				.pipe(gulp.dest('dist/js'))
				.pipe(browserSync.stream())
})

gulp.task('serve',['sass','babel'],function(){
	browserSync.init({
		server:{
			baseDir:'./'
		}
	})
	gulp.watch("app/scss/*.scss",['sass'])
	gulp.watch('app/js/*.js',['babel'])
	gulp.watch("*.html").on("change",browserSync.reload)
})

gulp.task('default',['serve'])