var os = require('os');
var path = require('path');
var package = require('../package.json');

// browserify transforms
var requireGlobify = require('require-globify');

// postcss plugins
var autoprefixer = require('autoprefixer');
// var cssnano = require('cssnano');

var babelify = require('babelify');

// configuration for gulp tasks
module.exports = {
  browserSync: {
    opts: {
      server: 'dist',
      middleware: [ require( 'compression' )() ],
      watch: true
    }
  },
  browserify: {
    src: 'src/js/script.js',
    bundle: 'script.js',
    dist: 'dist/js',
    watch: 'src/js',
    resave: 'src/js/script.js',
    opts: {
      cache: {},
      packageCache: {},
      debug: true,
      transform: [requireGlobify, babelify]
    }
  },
  clean: {
    target: 'dist'
  },
  videos: {
    src: 'src/videos/**/*',
    dist: 'dist/videos'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dist: 'dist/fonts'
  },
  images: {
    src: 'src/img/**/*',
    dist: 'dist/img'
  },
  nunjucks: {
    src: 'src/html/**/[^_]*.html',
    dist: 'dist',
    watch: 'src/html/**/*.html',
    opts: {
      path: 'src/html'
    },
    htmlmin: {
      collapseWhitespace: false
    }
  },
  sass: {
    src: ['src/scss/**/*.scss', 'src/vendor/und/sass/**/*.scss'],
    dist: 'dist/css',
    postcss: [
      autoprefixer({
        browsers: [
          '> 1%',
          'safari >= 9',
          'iOS >= 9',
          'Edge >= 14',
          'Firefox >= 52'
        ]
      })
    ],
    cssnano: {
      safe: true,
      discardComments: {
        removeAll: true
      }
    }
  },
  svgstore: {
    src: 'src/svgstore/**/*.svg',
    dist: 'dist/img',
    template: 'src/svgstore/util/_template.mustache',
    sass: '_svgstore.scss',
    out: 'src/scss/utilities',
    opts: {
      inlineSvg: true
    },
    imagemin: {
      svgoPlugins: [{ removeTitle: true }]
    }
  }
};
