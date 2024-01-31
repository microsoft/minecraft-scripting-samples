module.exports = {
  root: true,
  plugins: ["minecraft-linting"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "minecraft-linting/avoid-unnecessary-command": "error",
  },
};
