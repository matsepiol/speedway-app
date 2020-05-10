module.exports = {
    preset: "jest-preset-angular",
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/src/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.html$',
            astTransformers: [
              'jest-preset-angular/build/InlineFilesTransformer',
              'jest-preset-angular/build/StripStylesTransformer'
            ],
        }
    },
    roots: ['src'],
    setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/app/$1',
        '@env/(.*)': '<rootDir>/src/environments/$1'
    }
}