// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/signup',
    createProxyMiddleware({
      target: 'http://ucanteen2.g3cwh8fvd9frdmeg.southeastasia.azurecontainer.io',
      changeOrigin: true,
    })
  );
};
