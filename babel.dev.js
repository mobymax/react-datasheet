module.exports = {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    ['@babel/preset-env', { modules: false, loose: true }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
