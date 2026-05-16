/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['./test/setupTests.ts'],
  snapshotSerializers: ['@emotion/jest/serializer'],
}
