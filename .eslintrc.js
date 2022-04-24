module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "project": "./tsconfig.json"
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "functional/no-method-signature": "off",
    "@typescript-eslint/prefer-readonly-parameter-types": "off"
  }
};
