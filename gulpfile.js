const { series, parallel, src, dest, watch } = require('gulp');
const del = require('delete');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rollup = require('gulp-better-rollup');
const babel = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const nunjucks = require('gulp-nunjucks-render');
const { reload, stream } = browserSync;

const isProduction = process.env.NODE_ENV === 'production' || false; // is NODE_ENV === 'production'

console.debug(
  `🛠️ Build is for ${!isProduction ? 'development 👷' : 'production 🚀'}`
); // debug purpose only

const destDir = !isProduction ? 'dist' : 'build';
const initSrcMaps = { loadMaps: !isProduction };
const errorMsg = '🚨 ';

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
  tailwindConf: './src/tailwind.config.js',
};

function webserver() {
  browserSync({
    server: {
      baseDir: destDir,
    },
    host: 'localhost',
    port: !isProduction ? 3000 : 8888,
    open: false,
  });
}

/* HTML */
function html() {
  return src(path.src.html)
    .pipe(
      nunjucks({
        path: [path.src.templates],
        data: {
          GLOBAL_CSS_SUFIX: isProduction ? 'min.' : '',
          GLOBAL_JS_SUFIX: isProduction ? 'min.' : '',
        },
      })
    )
    .pipe(dest(path.dest.base))
    .pipe(stream({ match: '**/*.html' }));
}

/* STYLES */
function styles() {
  const tailwindcss = require('tailwindcss');
  const autoprefixer = require('autoprefixer');
  const cssnano = require('cssnano');
  const discardComments = require('postcss-discard-comments');

  let plugins = isProduction
    ? [
        tailwindcss(path.tailwindConf),
        discardComments({ removeAll: true }),
        autoprefixer('last 2 versions', '> 1%'),
        cssnano(),
      ]
    : [autoprefixer('last 2 versions', '> 1%'), tailwindcss(path.tailwindConf)];

  return src(path.src.styles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', function (err) {
      const message = `${errorMsg} ${err.message}|${err.fileName}|[${err.lineNumber}]`;
      console.error(message);
    })
    .pipe(postcss(plugins))
    .pipe(gulpif(isProduction, rename({ extname: '.min.css' })))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.dest.assets))
    .pipe(reload({ stream: true }));
}

/* JS */
function javascript() {
  const options = {
    plugins: [babel({ babelHelpers: 'bundled' }), resolve(), commonjs()],
  };
  return src(path.src.js)
    .pipe(sourcemaps.init(initSrcMaps))
    .pipe(rollup(options, 'umd'))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(isProduction, rename({ extname: '.min.js' })))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.dest.assets))
    .pipe(reload({ stream: true }));
}

/* VENDOR */
function vendor() {
  return src(path.src.vendor).pipe(dest(path.dest.vendor));
}

/* IMAGES */
function images() {
  return src(path.src.images).pipe(dest(path.dest.images));
}

/* FONTS */
function fonts() {
  return src(path.src.fonts).pipe(dest(path.dest.fonts));
}

function clean(cb) {
  del([path.dest + '*'], cb);
}

function watching() {
  watch(path.watch.html, { ignoreInitial: false }, html);
  watch(path.watch.styles, { ignoreInitial: false }, styles);
  watch(path.watch.images, { ignoreInitial: false }, images);
  watch(path.watch.fonts, { ignoreInitial: false }, fonts);
  watch(path.watch.js, { ignoreInitial: false }, javascript);
}

const build = parallel(html, styles, vendor, images, fonts, javascript);
const serve = series(build, parallel(watching, webserver));

exports.buildTask = series(clean, build);
exports.serveBuildTask = series(clean, build, webserver);
exports.default = series(clean, serve);
