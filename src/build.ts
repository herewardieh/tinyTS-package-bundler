import { build as tsupBuild, Options } from "tsup";
import { readPackage } from "read-pkg";
import { keys, uniq, replace, trim, toString } from "lodash-es";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import hostedGitInfo from "hosted-git-info";
import { execSync } from "node:child_process";
import { rimrafSync } from "rimraf";

const output = {
  dir: ".",
  types: "./dist/type.d.ts",
  main: "./dist/index.cjs",
  module: "./dist/index.mjs",
};

export const main = async (curWorkDir = cwd()) => {
  const dist = join(curWorkDir, "dist");
  if (existsSync(dist)) rimrafSync(dist);
  // generate mjs and cjs file for project
  const pkg = await readPackage({ cwd: curWorkDir });
  const tinyTsPkgBundler = (pkg.tinyTsPkgBundler || {}) as Options & {
    dtsEntry: string[];
  };
  tsupBuild({
    clean: false,
    sourcemap: false,
    bundle: true,
    external: uniq([
      ...keys(pkg.dependencies as Record<string, string>),
      ...keys(pkg.devDependencies as Record<string, string>),
    ]),
    outExtension({ format }) {
      if (format === "cjs")
        return {
          js: `.cjs`,
        };
      return {
        js: `.mjs`,
      };
    },
    entryPoints: ["src/index.ts"],
    platform: tinyTsPkgBundler?.platform || "node",
    target: "es5",
    format: ["esm", "cjs"],
    ...tinyTsPkgBundler,
  });
  // generate typescript global declaration
  await tsupBuild({
    clean: false,
    entry: tinyTsPkgBundler.dtsEntry || [join(curWorkDir, "src", "index.ts")],
    dts: {
      resolve: true,
      only: true,
    },
    format: "esm",
  });
  const remoteUrl = trim(toString(execSync("git remote get-url origin")));
  //generate package.json for npm release
  const hosted = hostedGitInfo.fromUrl(remoteUrl);
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
      prepublishOnly: "tiny-ts-package-bundler",
      ...pkg.scripts,
    },
    readme: undefined,
    repository: `${replace(remoteUrl, `${hosted.auth}@`, "")}`,
  };
  writeFileSync(
    join(curWorkDir, "package.json"),
    `${JSON.stringify(template, null, 2)}`
  );
};
