module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    'out/*',
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
  ],
};
