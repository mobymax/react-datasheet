module.exports = {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    ['@babel/preset-env', { modules: false, loose: true }],
    '@babel/preset-react',
  ],
  plugins: [
    // NOTE: these are replacements for @babel/preset-stage-2 as of babel@7.2.2
    // only the installed plugins are uncommented
    // only plugins for syntax used in code are installed
    // if you require (including unlisted) plugins,
    // please DISCUSS WITH TECH LEAD first
    // More info: https://babeljs.io/blog/2018/07/27/removing-babels-stage-presets

    // Stage 2
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
    // '@babel/plugin-proposal-function-sent',
    // '@babel/plugin-proposal-export-namespace-from',
    // '@babel/plugin-proposal-numeric-separator',
    // '@babel/plugin-proposal-throw-expressions',

    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    // '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    // '@babel/plugin-proposal-json-strings'
  ],
};
