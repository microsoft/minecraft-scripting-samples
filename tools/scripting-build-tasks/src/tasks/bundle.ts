// Copyright (c) Mojang AB.  All rights reserved.

import { parallel, resolve } from "just-scripts";

export type BundleTaskParams = {
  /** Initial script to be evaluated for the build. Documentation: https://esbuild.github.io/api/#entry-points */
  entryPoint: string;

  /** Packages to be considered as external. Documentation: https://esbuild.github.io/api/#external */
  external?: string[];

  /** When enabled, the generated code will be minified instead of pretty-printed. Documentation: https://esbuild.github.io/api/#minify */
  minifyWhitespace?: boolean;

  /** The output file for the bundle. Documentation: https://esbuild.github.io/api/#outfile */
  outfile: string;

  /** Flag to specify how to generate source map. Documentation: https://esbuild.github.io/api/#sourcemap */
  sourcemap?: boolean | "linked" | "inline" | "external" | "both";
};

export function bundleTask(
  options: BundleTaskParams
): ReturnType<typeof parallel> {
  // Resolve first from cwd, then through resolution paths
  const esbuildModuleResolution = resolve("esbuild");

  if (!esbuildModuleResolution) {
    throw new Error(
      "cannot find esbuild, please add it to your devDependencies"
    );
  }

  return async function esbuild() {
    const esbuildModule =
      require(esbuildModuleResolution) as typeof import("esbuild");
    return esbuildModule.build({
      entryPoints: [options.entryPoint],
      bundle: true,
      format: "esm",
      minifyWhitespace: options.minifyWhitespace,
      outfile: options.outfile,
      sourcemap: options.sourcemap,
      external: options.external,
    });
  };
}
