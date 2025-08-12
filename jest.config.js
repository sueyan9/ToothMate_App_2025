module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(expo-modules-core|@expo-google-fonts|@expo|expo|expo-font|expo-constants|expo-status-bar|expo-asset|expo-linear-gradient|react-native|@react-native|react-navigation)/)',
    ],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
    },
    testEnvironment: 'jsdom',
};