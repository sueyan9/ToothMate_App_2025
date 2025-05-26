const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'build/*'],
  },
  {
    files: [
      '**/*.test.js',
      '**/*.spec.js',
      '**/*.test.jsx',
      '**/*.spec.jsx',
      'test/**/*.js',
      'test/**/*.js',
      'tests/**/*.js'
    ],
    env: {
      jest: true,
    },
    rules:{

    }
  }
]);
