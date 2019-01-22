module.exports = {
    preset: "jest-preset-angular",
    roots: ['src'],
    setupTestFrameworkScriptFile: "<rootDir>/src/setup-jest.ts",
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/app/$1',
        '@env/(.*)': '<rootDir>/src/environments/$1'
    }
}