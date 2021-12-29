const { series, parallel, src, dest, watch } = require('gulp');
const del = require('delete');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const discardComments = require('postcss-discard-comments');
const autoprefixer = require('autoprefixer');
const nunjucks = require('gulp-nunjucks-render');

const isProduction = process.env.NODE_ENV === 'production' || false; // is NODE_ENV === 'production'
console.debug('[Build is for production]', isProduction); // debug purpose only
const destDir = !isProduction ? 'dist' : 'build';
const initSrcMaps = { loadMaps: !isProduction };
const errorMsg = '[Error] ';

const path = {
  src: {
    js: 'src/js/index.js',
    html: 'src/*.html',
    templates: 'src/templates',
    styles: 'src/styles/index.scss',
    fonts: 'src/fonts/**/*.*',
    images: 'src/images/**/*.*',
    vendor: 'src/vendor/**/*.*',
  },
  watch: {
    js: 'src/js/**/*.js',
    html: 'src/**/*.html',
    styles: 'src/styles/**/*.scss',
    fonts: 'src/fonts/**/*.*',
    images: 'src/images/**/*.*',
    vendor: 'src/vendor/**/*.*',
  },
  dest: {
    base: `${destDir}/`,
    assets: `${destDir}/assets/`,
    fonts: `${destDir}/assets/fonts/`,
    images: `${destDir}/assets/images/`,
    vendor: `${destDir}/assets/vendor/`,
  },
};

function webserver() {
  browserSync({
    server: {
      baseDir: destDir
    },
    host: 'localhost',
    port: 3000,
  });
}

/* Helper */
const ifProduction = (cb) => {
  return gulpif(
    isProduction,
    cb
  )
};

/* HTML */
function html() {
  return src(path.src.html)
    .pipe(nunjucks({ path: path.src.templates }))
    .pipe(dest(path.dest.base))
    .pipe(reload({ stream: true }))
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
    .pipe(ifProduction(postcss(plugins)))
    .pipe(ifProduction(rename({ extname: '.min.css' })))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.dest.assets))
    .pipe(reload({ stream: true }))
}

/* JS */
function javascript() {
  const options = {
    plugins: [babel(), resolve(), commonjs()]
  };
  return src(path.src.js)
    .pipe(sourcemaps.init(initSrcMaps))
    .pipe(rollup(options, 'umd'))
    .pipe(ifProduction(uglify()))
    .pipe(ifProduction(rename({ extname: '.min.js' })))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.dest.assets))
    .pipe(reload({ stream: true }))
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
  watch(path.watch.html, { ignoreInitial: false }, html);
  watch(path.watch.styles, { ignoreInitial: false }, styles);
  watch(path.watch.js, { ignoreInitial: false }, javascript);
}

const build = parallel(html, styles, vendor, javascript);
const serve = series(build, parallel(watching, webserver));

exports.buildDev = series(clean, serve);
exports.default = series(clean, build);
