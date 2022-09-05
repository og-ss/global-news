const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://i.maoyan.com',
      changeOrigin: true,
    })
  );

//   app.use(
//     '/api2',
//     createProxyMiddleware({
//       target: 'https://i.maoyan2.com',
//       changeOrigin: true,
//     })
//   );
};