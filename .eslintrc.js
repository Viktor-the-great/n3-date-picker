module.exports = {
  extends: ['@n3/eslint-config'],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
