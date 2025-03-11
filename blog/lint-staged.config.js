module.exports = {
  '*.js': ['eslint --fix', 'git add'],
  '*.jsx': ['eslint --fix', 'git add'],
  '*.css': ['stylelint --fix', 'git add'],
  '*.md': ['prettier --write', 'git add'],
};
