import { task, src, dest, watch, series, parallel } from "gulp";
import { reload, init } from "browser-sync";
var htmlImport = require("gulp-html-imports");
const changed = require("gulp-changed");
var del = require("del");
var glob = require("glob");

var source = "src";
var destination = "dist";

export function copy() {
	return src(`./${source}/**/*`)
		.pipe(changed(`./${destination}`))
		.pipe(dest(`./${destination}`));
}

task("html_imports", function () {
	return src(`./${source}/**/*.html`)
		.pipe(
			htmlImport({
				componentsPath: `./${source}/components/`,
			}),
		)

		.pipe(dest(`./${destination}`));
});

task("html_restore", function () {
	return src(`${destination}/**/*.html`, { allowEmpty: true })
		.pipe(
			htmlImport({
				componentsPath: `./${source}/components/`,
				restore: true,
			}),
		)
		.pipe(dest(`./${destination}`));
});

task("serve", () => {
	init({
		server: {
			baseDir: `./${destination}`,
			index: "index.html",
		},
		notify: false,
		injectChanges: true,
	});
	watch(
		`./${source}/**/*`,
		series(
			"copy",

			parallel("html_imports", readSrcFiles, readDistFiles),
			parseFiles,
		),
	);
	watch(`./${destination}/**/*`).on("change", series(reload));
});
var srcFileList;
var distFileList;
task(
	"default",
	series(
		copy,
		"html_imports",
		parallel(readSrcFiles, readDistFiles),
		parseFiles,
		"serve",
	),
);

task(
	"deploy",
	series(
		copy,
		"html_imports",
		parallel(readSrcFiles, readDistFiles),
		parseFiles,
	),
);

function readSrcFiles() {
	srcFileList = glob.sync("**/*", {
		cwd: `./${source}`,
	});
	return Promise.resolve("cleaned");
}

function readDistFiles() {
	distFileList = glob.sync("**/*", {
		cwd: `./${destination}/`,
	});
	return Promise.resolve("cleaned");
}
function parseFiles() {
	distFileList.forEach((el) => {
		if (!srcFileList.includes(el) || el == "components") {
			console.log(del.sync([`./${destination}/` + el]));
		}
	});
	return Promise.resolve("cleaned");
}
