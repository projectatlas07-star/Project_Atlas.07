module.exports = {
  extends: ["eslint:recommended"],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "off",
    "no-console": "off",
  },
};
