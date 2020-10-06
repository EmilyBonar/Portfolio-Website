import { task, src, dest, watch, series, parallel } from "gulp";
import { reload, init } from "browser-sync";
var htmlImport = require("gulp-html-imports");
const changed = require("gulp-changed");
var del = require("del");
var glob = require("glob");

export function copy() {
	return src("./src/**/*")
		.pipe(changed("./EmilyBonar.github.io"))
		.pipe(dest("./EmilyBonar.github.io"));
}

task("html_imports", function () {
	return src("./src/**/*.html")
		.pipe(
			htmlImport({
				componentsPath: "./src/components/",
			}),
		)

		.pipe(dest("./EmilyBonar.github.io"));
});

task("html_restore", function () {
	return src("EmilyBonar.github.io/**/*.html", { allowEmpty: true })
		.pipe(
			htmlImport({
				componentsPath: "./src/components/",
				restore: true,
			}),
		)
		.pipe(dest("./EmilyBonar.github.io"));
});

task("serve", () => {
	init({
		server: {
			baseDir: "./EmilyBonar.github.io",
			index: "index.html",
		},
		notify: false,
		injectChanges: true,
	});
	watch(
		"./src/**/*",
		series(
			"copy",

			parallel("html_imports", readSrcFiles, readDistFiles),
			parseFiles,
		),
	);
	watch("./EmilyBonar.github.io/**/*").on("change", series(reload));
});
var srcFileList;
var distFileList;
task(
	"default",
	series(
		"html_imports",
		parallel(readSrcFiles, readDistFiles),
		parseFiles,
		"serve",
	),
);

let source = "./src";
let distrib = "./EmilyBonar.github.io/";
function readSrcFiles() {
	srcFileList = glob.sync("**/*", {
		cwd: source,
	});
	return Promise.resolve("cleaned");
}

function readDistFiles() {
	distFileList = glob.sync("**/*", {
		cwd: distrib,
	});
	return Promise.resolve("cleaned");
}
function parseFiles() {
	distFileList.forEach((el) => {
		if (!srcFileList.includes(el)) {
			console.log(del.sync([distrib + el]));
		}
	});
	return Promise.resolve("cleaned");
}
