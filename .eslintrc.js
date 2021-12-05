const path = require('path');

module.exports = {
  extends: ['airbnb', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: `module`,
    ecmaFeatures: {
      jsx: true,
    },
    // Currently when a babelrc is added to the project, it will override our babelOptions
    babelOptions: {
      presets: [require.resolve(`babel-preset-gatsby`)],
    },
    requireConfigFile: false,
  },
  rules: {
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': [0],
    'react/jsx-one-expression-per-line': [0],
    'react/jsx-props-no-spreading': [0],
    'react/destructuring-assignment': [0],
    'react/function-component-definition': [
      1,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'graphql/named-operations': [
      'error',
      {
        env: 'relay',
        schemaJsonFilepath: path.resolve(__dirname, './schema.json'),
        tagName: 'graphql',
      },
    ],
    'graphql/capitalized-type-name': [
      'error',
      {
        env: 'relay',
        schemaJsonFilepath: path.resolve(__dirname, './schema.json'),
        tagName: 'graphql',
      },
    ],
    'graphql/no-deprecated-fields': [
      'error',
      {
        env: 'relay',
        schemaJsonFilepath: path.resolve(__dirname, './schema.json'),
        tagName: 'graphql',
      },
    ],
    'graphql/template-strings': [
      'error',
      {
        env: 'relay',
        schemaJsonFilepath: path.resolve(__dirname, './schema.json'),
        tagName: 'graphql',
      },
    ],
  },
  plugins: ['prettier', 'graphql'],
  env: {
    browser: true,
    node: true,
  },
};
