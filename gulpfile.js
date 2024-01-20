let project_folder = 'dist'
let source_folder = 'src'

let path = {
    dist: {
        html: project_folder + '/',
        css: project_folder + '/styles/',
        js: project_folder + '/scripts/',
        img: project_folder + '/assets/images/',
        fonts: project_folder + '/assets/fonts/',
    },
    src: {
        html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
        css: source_folder + ['/styles/**/*.css'],
        js: source_folder + '/scripts/main.js',
        img: source_folder + '/assets/images/**/*.+(png|jpg|jpeg|ico|svg|webp)',
        fonts: source_folder + '/assets/fonts/*',
    },
    watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + ['/styles/**/*.css'],
        js: source_folder + '/scripts/**/*.js',
        img: source_folder + '/assets/img/**/*.+(png|jpg|jpeg|ico|svg|webp)',
        fonts: source_folder + '/assets/fonts/*',
    },
    clean: './' + project_folder + '/',
}

let {src, dest, series} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    webpack = require("webpack-stream"),
    sass = require('gulp-sass')(require('sass')),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: './' + project_folder,
        },
        port: 3000,
        notify: false,
    })
}

function html() {
    return src(path.src.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest(path.dist.html))
        .pipe(browsersync.reload({stream: true}))
}

function images() {
    return src(path.src.img).pipe(dest(path.dist.img)).pipe(browsersync.stream())
}

function fonts() {
    return src(path.src.fonts).pipe(dest(path.dist.fonts)).pipe(browsersync.stream())
}

function img() {
    return src(path.src.img)
        .pipe(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [{removeViewBox: true}, {cleanupIDs: false}],
                }),
            ]),
        )
        .pipe(dest(path.dist.img))
}


function js() {
    return gulp.src(path.src.js)
        .pipe(webpack({
            mode: 'production', // or 'development' if needed
            entry: './src/scripts/main.js', // Specify your main entry file
            output: {
                filename: 'main.js', // Specify the output file
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                            },
                        },
                    },
                    {
                        test: /\.css$/,
                        use: [
                            process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                            'css-loader',
                        ],
                    },
                ],
            },
            plugins: [
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                    chunkFilename: '[id].css',
                })]
        }))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Завершить поток, чтобы Gulp не завис
        })
        .pipe(gulp.dest(path.dist.js))
        .pipe(browsersync.stream());
}

function animaCss() {
    return src('node_modules/animate.css/animate.css')
        .pipe(dest(path.dist.css));
}


function jss() {
    return src('src/scripts/main.js')
        .pipe(dest(path.dist.js));
}

function css() {
    return src(path.src.css)
        .pipe(sass({
            outputStyle: 'expanded',
        }).on('error', sass.logError))
        .pipe(group_media())
        .pipe(
            autoprefixer({
                cascade: true,
                overrideBrowserslist: ['last 5 versions'],
            }),
        )
        .pipe(dest(path.dist.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: '.min.css',
            }),
        )
        .pipe(dest(path.dist.css))
        .pipe(browsersync.stream());
}

function vendorJS() {
    const modules = [
        'node_modules/swiper/swiper-bundle.min.js',
        'node_modules/swiper/swiper-bundle.min.js.map',
    ];

    return src(modules)
        .pipe(dest('dist/scripts'));
};

function vendorCSS() {
    const modules = [
        'node_modules/swiper/swiper-bundle.min.css',
    ];

    return src(modules)
        .pipe(dest('dist/styles'));
};

function watchFiles(params) {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
    gulp.watch([path.watch.fonts], fonts)
}

function clean(params) {
    return del(path.clean)
}

let dist = gulp.series(gulp.parallel(html, js, animaCss, vendorJS, vendorCSS, jss, css, images, fonts))
let watch = gulp.parallel(dist, watchFiles, browserSync)

exports.img = img
exports.images = images
exports.js = js
exports.html = html
exports.css = css
exports.fonts = fonts
exports.dist = dist
exports.watch = watch
exports.default = watch
exports.animaCss = animaCss
exports.jss = jss;
exports.vendorJS = vendorJS;
exports.vendorCSS = vendorCSS;