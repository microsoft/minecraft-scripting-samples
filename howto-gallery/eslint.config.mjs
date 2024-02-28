import minecraftLinting from "eslint-plugin-minecraft-linting";
import header from "eslint-plugin-header";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["scripts/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
    },
    plugins: {
      ts,
      "minecraft-linting": minecraftLinting,
      header,
    },
    rules: {
      "minecraft-linting/avoid-unnecessary-command": "error",
    },
  },
];
