module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["airbnb-base", "prettier"],
  plugins: ["@typescript-eslint", "jest", "prettier"],
  env: {
    "jest/globals": true,
  },
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "off",
  },
};
