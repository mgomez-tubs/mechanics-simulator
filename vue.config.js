const path = require('path');
const contentBase = path.resolve(__dirname);

module.exports = {
    configureWebpack: config => {
      config.devServer = {    // This will only work for 
        before(app) {
          // use proper mime-type for wasm files
          app.get('*.wasm', function (req, res, next) {
            var options = {
              root: contentBase,
              dotfiles: 'deny',
              headers: {
                'Content-Type': 'application/wasm'
              }
            };
            res.sendFile(req.url, options, function (err) {
              if (err) { next(err); }
            });
          });
        }
      }
    },
    devServer: {
      port: 80,
      host: '0.0.0.0'
    }
  }