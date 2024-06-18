import { BuildOptions, build } from "esbuild";
import { build as tsupBuild } from "tsup";
import { readPackage } from "read-pkg";
import { keys, uniq } from "lodash-es";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

const output = {
  dir: ".",
  types: "./dist/type.d.ts",
  main: "./dist/index.cjs",
  module: "./dist/index.mjs",
};

const JS_OUTPUT_OPTIONS: BuildOptions[] = [
  {
    format: "esm",
    outfile: output.module,
  },
  {
    format: "cjs",
    outfile: output.main,
  },
];

export const main = async (curWorkDir = cwd()) => {
  // generate mjs and cjs file for project
  const pkg = await readPackage({ cwd: curWorkDir });
  const tinyTsPkgBundler = (pkg.tinyTsPkgBundler || {}) as {
    define: Record<string, string>;
  };
  const baseConfig: Partial<BuildOptions> = {
    define: tinyTsPkgBundler?.define,
    sourcemap: false,
    minify: true,
    logLevel: "warning",
    bundle: true,
    external: uniq([
      ...keys(pkg.dependencies as Record<string, string>),
      ...keys(pkg.devDependencies as Record<string, string>),
    ]),
    platform: "node",
    entryPoints: ["src/index.ts"],
  };
  for (const jsOutput of JS_OUTPUT_OPTIONS) {
    await build({ ...baseConfig, ...jsOutput });
  }
  // generate typescript global declaration
  await tsupBuild({
    entry: [join(curWorkDir, "src", "index.ts")],
    dts: {
      resolve: true,
      only: true,
    },
    format: "esm",
  });
  //generate package.json for npm release
  const template = {
    ...pkg,
    type: "module",
    main: output.main,
    module: output.module,
    exports: {
      [output.dir]: {
        require: output.main,
        import: output.module,
        types: output.types,
      },
      "./index.ts": "./index.ts",
    },
    files: uniq([
      ...(pkg.files || []),
      "dist/",
      join(output.dir, "./index.d.ts"),
    ]),
    scripts: {
      prepublishOnly: "../node_modules/.bin/tiny-ts-package-bundler",
      ...pkg.scripts,
    },
    readme: undefined,
  };
  writeFileSync(
    join(curWorkDir, "package.json"),
    `${JSON.stringify(template, null, 2)}`
  );
};
