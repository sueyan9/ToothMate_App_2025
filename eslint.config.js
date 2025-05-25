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
      'test/**/*.js',
      'tests/**/*.js'
    ],
    env: {
      jest: ture,
    },
    rules:{

    }
  }
]);
