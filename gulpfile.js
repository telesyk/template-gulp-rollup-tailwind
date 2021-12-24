const { series, parallel, src, dest, watch } = require('gulp');
const del = require('delete');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const discardComments = require('postcss-discard-comments');
const autoprefixer = require('autoprefixer');

const isProduction = process.env.NODE_ENV === 'production' || true; // is NODE_ENV === 'production'
console.debug('[Build is for production]', isProduction); // debug purpose only
const destDir = !isProduction ? 'dist' : 'build';
const initSrcMaps = { loadMaps: !isProduction };
const errorMsg = '[Error] ';

const path = {
  src: {
    html: 'src/*.html',
    js: 'src/js/index.js',
    styles: 'src/styles/index.scss',
    fonts: 'src/fonts/**/*.*',
    images: 'src/images/**/*.*',
    vendor: 'src/vendor/**/*.*',
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    styles: 'src/styles/**/*.scss',
    fonts: 'src/fonts/**/*.*',
    images: 'src/images/**/*.*',
    vendor: 'src/vendor/**/*.*',
  },
  dest: {
    base: `${destDir}/`,
    fonts: `${destDir}/fonts/`,
    images: `${destDir}/images/`,
    vendor: `${destDir}/vendor/`,
  },
};

/* HTML */
function html() {
  return src(path.src.html)
    // .pipe(nunjucks.compile())
    .pipe(dest(path.dest.base))
  // .pipe(reload({
  //   stream: true
  // }));
}

/* STYLES */
function styles() {
  let plugins = [
    discardComments({ removeAll: true }),
    autoprefixer('last 2 versions', '> 1%'),
    cssnano()
  ];
  return src(path.src.styles)
    .pipe(sourcemaps.init(initSrcMaps))
    .pipe(sass())
    .on('error', function (err) {
      console.error(errorMsg + err.message + '|' + err.fileName + '|[' + err.lineNumber + ']')
    })
    .pipe(gulpif(
      isProduction,
      postcss(plugins)
    ))
    .pipe(gulpif(
      isProduction,
      rename({ extname: '.min.js' })
    ))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.dest.base))
  // .pipe(reload({
  //   stream: true
  // }))
}

/* JS */
function javascript() {
  return src(path.src.js)
    .pipe(sourcemaps.init(initSrcMaps))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('index.js'))
    .pipe(dest(path.dest.base))
    .pipe(gulpif(
      isProduction,
      uglify()
    ))
    .pipe(gulpif(
      isProduction,
      rename({ extname: '.min.js' })
    ))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.dest.base));
}

/* VENDOR */
function vendor() {
  return src(path.src.vendor)
    .pipe(dest(path.dest.vendor))
}

function clean(cb) {
  del([path.dest + '*'], cb);
}

function watching() {
  watch(path.watch.scss, { ignoreInitial: false }, styles);
  watch(path.watch.js, { ignoreInitial: false }, javascript);
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
// function build(cb) {
//   // body omitted
//   cb();
// }

// const builds = parallel(html, scss, js_vendor, js_main, images, fonts, json, vendor);
const build = parallel(html, styles, vendor, javascript);

exports.buildProd = series(clean, build);
exports.default = series(clean, build);
