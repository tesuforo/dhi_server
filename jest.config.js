

module.exports = {
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    coveragePathIgnorePatterns: ['src/utils', 'src/internal/decorators/rest', 'test']
};
