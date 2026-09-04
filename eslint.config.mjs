import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['lib/**', 'coverage/**', 'playground/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      // The codebase deliberately does untyped DOM/ref manipulation ("not the
      // React way", by design) where a line isn't reliably always an error.
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  prettier,
);
