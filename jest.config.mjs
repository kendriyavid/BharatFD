export default {
  transformIgnorePatterns: ['/node_modules/(?!your-esm-package).+\\.mjs$'],
  transform: {
    '^.+\\.mjs$': 'babel-jest', 
    '^.+\\.[tj]sx?$': 'babel-jest', 
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.mjs'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'], 
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",  
  },
};
