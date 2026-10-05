import love from 'eslint-config-love';
import prettierConfig from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      'build',
      'cdk.out',
      'node_modules',
      // Route types written by `react-router typegen`; regenerated on every build.
      '.react-router',
      'public',
      'eslint.config.js',
    ],
  },
  { ...love, files: ['**/*.{ts,tsx}'] },
  { ...jsxA11y.flatConfigs.strict, files: ['app/**/*.tsx'] },
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { prettier, 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': 'error',

      complexity: 'off',
      'promise/avoid-new': 'off',

      // On a server the console is the log: Lambda ships it to CloudWatch.
      // Debug leftovers (`console.log`) are still errors.
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',

      // Guard clauses read best as `if (!ok) return`, which this rule cannot
      // tell apart from a genuinely inverted conditional.
      'no-negated-condition': 'off',

      // React event handlers are typed `() => void`, and an async handler is a
      // normal, safe pattern there.
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false, properties: false } },
      ],

      // Components and loaders have their return types inferred; spelling out
      // `JSX.Element` on every one of them adds noise and no safety.
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Props and options objects are read-only by convention here, not by
      // annotating every field of every interface.
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
  {
    // React Router requires default exports from route modules and from its
    // config files; everything else uses named exports.
    files: [
      'app/routes/**',
      'app/root.tsx',
      'app/entry.server.tsx',
      'app/routes.ts',
      '*.config.ts',
    ],
    rules: { 'import/no-default-export': 'off' },
  },
  {
    // Syntax-tree transforms edit nodes in place; that is the unified idiom.
    files: ['plugins/**/*.ts'],
    rules: { 'no-param-reassign': ['error', { props: false }] },
  },
  {
    // Constructs are created for their side effect on the stack.
    files: ['infra/**/*.ts'],
    rules: { 'no-new': 'off' },
  },
];
