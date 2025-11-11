/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./test/setupTests.ts'],
  snapshotSerializers: ['@emotion/jest/serializer'],
  moduleNameMapper: {
    '^@jsonui/core$': '<rootDir>/../core/src/index.ts',
  },
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@jsonui/core)/)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.test.{ts,tsx}', '!src/**/*.stories.{ts,tsx}', '!src/**/types.ts'],
}
