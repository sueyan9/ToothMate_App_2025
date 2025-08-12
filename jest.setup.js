import '@testing-library/jest-native/extend-expect';
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};
Object.defineProperty(global.navigator, 'userAgent', {
    value: 'node.js',
    configurable: true,
});
jest.mock('@expo-google-fonts/righteous', () => ({
    Righteous_400Regular: {},
    useFonts: () => [true],
}));

jest.mock('@expo-google-fonts/varela-round', () => ({
    VarelaRound_400Regular: {},
}));
jest.mock('@expo/vector-icons', () => {
    const { Text } = require('react-native');
    return {
        MaterialIcons: ({ name }) => <Text>{name}</Text>, // Mock icon
    };
});
process.env.EXPO_OS = 'ios'; // or 'android'

jest.spyOn(console, 'warn').mockImplementation((msg) => {
    if (msg.includes('process.env.EXPO_OS')) return;
    console.warn(msg);
});