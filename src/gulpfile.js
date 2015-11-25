"use strict";

var gulp = require("gulp");
var cache = require("gulp-cached");
var plumber = require("gulp-plumber");
var coffee  = require("gulp-coffee");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task("default", function () {
    gulp.watch(["coffee/**/*.coffee"],["script"]);
});

gulp.task("script", function () {
    gulp.src("coffee/**/*.coffee")
        .pipe(plumber())
        .pipe(cache("script"))
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest("../build/"))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("../build/"))
        .on("error", console.error.bind(console))
});