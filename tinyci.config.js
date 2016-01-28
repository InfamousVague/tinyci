module.exports = {
  'wski/dummy': {
    dir: '../dummy',
    watch: ['master', 'test'],
    tasks: [
      'git pull',
      'npm run test'
    ]
  }
};
