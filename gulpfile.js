let gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}))
});


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});


gulp.task('css-min', ['sass'], function() {
	return gulp.src('src/css/style.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('src/css'));
})


gulp.task('clean', function() {
	return del.sync('dist');
})

gulp.task('clear', function() {
	return cache.clearAll();
})


gulp.task('img', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoplugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
})




gulp.task('watch', ['browser-sync', 'css-min'], function() {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/*.html', browserSync.reload);
})




gulp.task('build', ['clean','img', 'sass'], function() {
	let buildCss = gulp.src([
			'src/css/bootstrap-reboot.min.css',
			'src/css/bootstrap-grid.min.css',
			'src/css/style.css',
			'src/css/style.min.css'
		])
		.pipe(gulp.dest('dist/css'));
	
	let buildFonts = gulp.src('src/font/**/*')
		.pipe(gulp.dest('dist/font'));

	let buildHtml = gulp.src('src/*.html')
		.pipe(gulp.dest('dist'));
})