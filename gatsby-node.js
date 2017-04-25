const rucksack = require('rucksack-css');
const lost = require('lost');
const cssnext = require('postcss-cssnext');
const fs = require("fs-extra");

exports.modifyWebpackConfig = function (config) {
  config.merge({
    postcss: [
      lost(),
      rucksack(),
      cssnext({
        browsers: ['>1%', 'last 2 versions'],
      }),
    ],
  });

  config.loader('svg', {
    test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader',
  });

  return config;
};

exports.postBuild = () => {
  let filename = 'google7e55f41597bad74b.html'
  fs.copySync(
    `./${filename}`,
    `./public/${filename}`
  )
  /* Alternative
  import Shell from 'child_process'
  Shell.execSync("cp -r assets/* public/")
  */
}
