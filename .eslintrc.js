module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["airbnb-base", "prettier"],
  plugins: ["@typescript-eslint", "jest", "prettier"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".js", ".ts", ".d.ts"],
    },
  },
  env: {
    "jest/globals": true,
  },
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "off",
  },
};
