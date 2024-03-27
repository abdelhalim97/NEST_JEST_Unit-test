module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePaths: ['<rootDir>'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['globalConfig'],
};
