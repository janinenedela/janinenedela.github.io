const {src, dest, series} = require('gulp');
const shell = require("shelljs");
const through2 = require('through2');

const AmpOptimizer = require('@ampproject/toolbox-optimizer');
const ampOptimizer = AmpOptimizer.create();

function build(done) {
  var shellCommand = 'bundle exec jekyll build -d src';
  shell.exec(shellCommand);
  done();
}

function cp() {
  return src('src/**')
    .pipe(dest('_docs/'));
}

function robots(cb) {
  return src('src/robots.txt')
    .pipe(
      through2.obj(async (file, _, cb) => {
        if (file.isBuffer()) {
          file.contents = Buffer.from('Sitemap: https://www.klinik-makler.com/sitemap.xml');
        }
        cb(null, file);
      })
    )
    .pipe(dest('_docs/'));
}

function ampOptimize(cb) {
  return src('src/*.html')
    .pipe(
      through2.obj(async (file, _, cb) => {
        if (file.isBuffer()) {
          const optimizedHtml = await ampOptimizer.transformHtml(
            file.contents.toString()
          );
          file.contents = Buffer.from(optimizedHtml);
        }
        cb(null, file);
      })
    )
    .pipe(dest('_docs/'));
}

exports.default = series(build, cp, robots, ampOptimize);
