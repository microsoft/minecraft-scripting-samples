// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["header", "minecraft-linting", "@typescript-eslint"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "minecraft-linting/avoid-unnecessary-command": "error",
    "header/header": [2, "line", [" Copyright (c) Microsoft Corporation.", ` Licensed under the MIT License.`], 1],
  },
};
