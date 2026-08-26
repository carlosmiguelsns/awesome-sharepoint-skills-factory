require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2018,
        sourceType: 'module'
      },
      rules: {
        '@rushstack/no-new-null': 1,
        '@rushstack/pair-react-dom-render-unmount': 1,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/no-explicit-any': 1,
        '@typescript-eslint/no-floating-promises': 2,
        '@typescript-eslint/no-unused-vars': [
          1,
          {
            vars: 'all',
            args: 'none'
          }
        ],
        '@typescript-eslint/no-use-before-define': [
          2,
          {
            functions: false,
            classes: true,
            variables: true,
            enums: true,
            typedefs: true
          }
        ],
        '@typescript-eslint/no-var-requires': 'error'
      }
    }
  ]
};
