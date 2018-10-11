module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/(src|tests)/.*(test|spec))\\.(jsx?|tsx?)$",
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.d.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/@migrations/**",
  ],
  coverageDirectory: "./coverage/",
  coverageReporters: ["json", "lcov", "text-summary"],
};
