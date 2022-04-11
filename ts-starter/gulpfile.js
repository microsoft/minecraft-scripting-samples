// === CONFIGURABLE VARIABLES

const bpfoldername = "starterbp";
const useMinecraftPreview = false; // Whether to target the "Minecraft Preview" version of Minecraft vs. the main store version of Minecraft

// === END CONFIGURABLE VARIABLES

const gulp = require("gulp");
const ts = require("gulp-typescript");
const del = require("del");
const os = require("os");

const mcdir =
  os.homedir() +
    (useMinecraftPreview
      ? "/AppData/Local/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang/"
      : "/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/");

function clean_build(callbackFunction) { 
  del(["build/behavior_packs/", "build/resource_packs/"]).then(
    (value) => {
      callbackFunction(); // success
    },
    (reason) => {
      callbackFunction(); // error
    }
  );
}

function copy_behavior_packs() {
  return gulp.src(["behavior_packs/**/*"]).pipe(gulp.dest("build/behavior_packs"));
}

function copy_resource_packs() {
  return gulp.src(["resource_packs/**/*"]).pipe(gulp.dest("build/resource_packs"));
}

const copy_content = gulp.parallel(copy_behavior_packs, copy_resource_packs);

function compile_scripts() {
  return gulp
    .src("scripts/**/*.ts")
    .pipe(
      ts({
        module: "es2020",
        moduleResolution: "node",
        lib: ["es2020", "dom"],
        strict: true,
        target: "es2020",
        noImplicitAny: true,
      })
    )
    .pipe(gulp.dest("build/behavior_packs/" + bpfoldername + "/scripts"));
}

const build = gulp.series(clean_build, copy_content, compile_scripts);

function clean_localmc(callbackFunction) {
  if (!bpfoldername || !bpfoldername.length || bpfoldername.length < 2) {
    console.log("No bpfoldername specified.");
    callbackFunction();
    return;
  }

  del([mcdir + "development_behavior_packs/" + bpfoldername, mcdir + "development_resource_packs/" + bpfoldername], {
    force: true,
  }).then(
    (value) => {
      callbackFunction(); // Success
    },
    (reason) => {
      callbackFunction(); // Error
    }
  );
}

function deploy_localmc_behavior_packs() {
  return gulp
    .src(["build/behavior_packs/" + bpfoldername + "/**/*"])
    .pipe(gulp.dest(mcdir + "development_behavior_packs/" + bpfoldername));
}

function deploy_localmc_resource_packs() {
  return gulp
    .src(["build/resource_packs/" + bpfoldername + "/**/*"])
    .pipe(gulp.dest(mcdir + "development_resource_packs/" + bpfoldername));
}

const deploy_localmc = gulp.series(
  clean_localmc,
  function (callbackFunction) {
    console.log("\007"); // annunciate a beep!
    callbackFunction();
  },
  gulp.parallel(deploy_localmc_behavior_packs, deploy_localmc_resource_packs)
);

function watch() {
  return gulp.watch(
    ["scripts/**/*.ts", "behavior_packs/**/*", "resource_packs/**/*"],
    gulp.series(build, deploy_localmc)
  );
}

exports.clean_build = clean_build;
exports.copy_behavior_packs = copy_behavior_packs;
exports.copy_resource_packs = copy_resource_packs;
exports.compile_scripts = compile_scripts;
exports.copy_content = copy_content;
exports.build = build;
exports.clean_localmc = clean_localmc;
exports.deploy_localmc = deploy_localmc;
exports.default = gulp.series(build, deploy_localmc);
exports.clean = gulp.series(clean_build, clean_localmc);
exports.watch = gulp.series(build, deploy_localmc, watch);
