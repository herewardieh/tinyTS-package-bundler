import { main as packBundler } from "../src/build";
import { dirname, join } from "path";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fileURLToPath } from "url";
import { rimrafSync } from "rimraf";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("tiny ts package bundler", () => {
  beforeEach(() => {
    rimrafSync(join(__dirname, "..", "/dist"));
  });

  it("bundle", async () => {
    await packBundler(join(__dirname, ".."));
  });
});
