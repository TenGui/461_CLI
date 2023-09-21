module.exports = {
  // testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  // testEnvironment: "node",
  // transform: {
  //   "^.+\\.js$": "babel-jest",
  // },
  // setupFiles: ["<rootDir>/setupTests.js"], // Run setupTests.js before tests.
  coveragePathIgnorePatterns:["src/url_list/evalUrls.js", "src/url_list/rampUpMetric/rampUpRunner.js", "src/url_list/respMaintMetric/respMaintRunner.js"],
  collectCoverageFrom: ["src/url_list/**/*.js"],
  coverageReporters: ["lcov", "text-summary", "json-summary"], // Specify coverage report formats.
  reporters: ["default"], // Use the default test reporter.
  // moduleNameMapper: {
  //   // Map module imports to mock files.
  //   "\\.(css|less|scss)$": "identity-obj-proxy",
  // },
  preset: "ts-jest",
  testEnvironment: "node",
};
