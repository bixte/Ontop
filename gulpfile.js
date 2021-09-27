const { src, dest } = require("gulp");
const browsersync = require("browser-sync").create();
const gulp = require("gulp");
const fileinclude = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass')(require('sass'));
const groupmedia = require("gulp-group-css-media-queries");
const rename = require('gulp-rename');
const autoprefixer = require("gulp-autoprefixer");
const clean_css = require ("gulp-clean-css");
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const webpcss = require("gulp-webp-css");
const svgsprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');

let project_folder = "dist";
let source_folder = "app";



let path = {
  build: {
    html:project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
    svg: project_folder + "/svg/"
  },
   app: {
    html:source_folder + "/*index.html",
    scss: source_folder + "/scss/style.scss",
    js: source_folder + "/js/main.js",
    img: source_folder + "/img/**/*.{img,jpg,png,ico,gif,webp}",
    fonts: source_folder + "/fonts/*.ttf",
    svg: source_folder + "/svg/**/*.svg"
  },
  watch: {
    html: source_folder + "/**/*.html",
    scss: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{img,jpg,png,ico,gif,webp}",
  },
  clean: "./" + project_folder + "/"
}

function browserSync () { 
  browsersync.init ({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    notify: false
  })
}


function html() {
  return src(path.app.html)
  .pipe(fileinclude())
  // .pipe (webphtml())
  .pipe(dest(path.build.html))
  .pipe(browsersync.stream())
}

function watchfiles() {
  gulp.watch ([path.watch.html], html)
  gulp.watch ([path.watch.scss], css)
  gulp.watch ([path.watch.js], js)
  gulp.watch ([path.watch.img],images)
}


function clean() { 
  return del(["!/dist/svg"],["!/dist/img"],[path.clean])
}


function css() { 
  return src(path.app.scss)
  .pipe (scss({
    outputStyle: "expanded"
  }))
  .pipe(groupmedia())
  // .pipe (webpcss())
  .pipe(autoprefixer({
    overrideBrowserslist: ["last 5 version"]
  }))
  .pipe(dest(path.build.css))
  .pipe (clean_css())
  .pipe(rename({
    extname: ".min.css"
  }))
  .pipe(dest(path.build.css))
  .pipe(browsersync.stream())
}


function js() {
  return src(path.app.js)
  .pipe (fileinclude())
  .pipe (dest(path.build.js))
  .pipe (uglify())
  .pipe (rename({
    extname: ".min.js"
  }))
  .pipe(dest(path.build.js))
  .pipe(browsersync.stream())
}

function images() { 
  return src(path.app.img)
  .pipe(webp({
    quality: 75
  }))
  .pipe(dest(path.build.img))

  .pipe (src(path.app.img))
  .pipe (imagemin([
  imagemin.gifsicle({interlaced: true}),
	imagemin.mozjpeg({quality: 75, progressive: true}),
	imagemin.optipng({optimizationLevel: 5}),
  imagemin.svgo ({
    plugins: [
			{removeViewBox: true},
			{cleanupIDs: false}
		]
  })
]))
.pipe(dest(path.build.img))
.pipe(browsersync.stream())
}



function svgSprite() {
  return src (path.app.svg)
  .pipe(svgsprite({
    mode: {
      stack:{
        dest:"sprite",
        sprite: "sprite.svg"
      }
    },
    shape: {
      dimension:{
        maxWidth: 35,
        maxHeight: 35,
      },
      dest:"ico"
    }
  }))
  .pipe(dest(path.build.svg))
}


function fonts() {
  src (path.app.fonts)
  .pipe(ttf2woff())
  .pipe(dest(path.build.fonts))

  return src(path.app.fonts)
  .pipe(ttf2woff2())
  .pipe(dest(path.build.fonts))
}


function fontsStyle(params) {

  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
  if (file_content == '') {
  fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
  return fs.readdir(path.build.fonts, function (err, items) {
  if (items) {
  let c_fontname;
  for (var i = 0; i < items.length; i++) {
  let fontname = items[i].split('.');
  fontname = fontname[0];
  if (c_fontname != fontname) {
  fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
  }
  c_fontname = fontname;
  }
  }
  })
  }
  }
  
  function cb(){}



let build = gulp.series (clean,gulp.parallel(html,css,js),fontsStyle);
let watch = gulp.parallel(build,browserSync,watchfiles);


exports.fontsstyle = fontsStyle;
exports.fonts = fonts; /* шрифты  */
exports.svgmin = svgSprite; /* cжать svg + спрайт */
exports.imgmin = images;/* сжать картинки */
exports.build  = build;
exports.watch = watch;
exports.default = watch;






 

