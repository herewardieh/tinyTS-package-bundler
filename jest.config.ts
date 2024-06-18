import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  testRegex: ".*/(__tests__|tests)/.+\\.(generator|test|spec)\\.(ts|tsx)$",
  testPathIgnorePatterns: ["/node_modules/"],
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  moduleFileExtensions: ["ts", "js", "json"],
  extensionsToTreatAsEsm: [".ts"],
};

export default config;
