module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-pattern": [2, "always", /^([A-Z]{2,}-\d+)\s-\s[A-Z].+/],
  },
};
