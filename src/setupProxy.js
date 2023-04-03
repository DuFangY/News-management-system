const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    //html代码运行在本地服务器的ip地址+指定端口号
    //在本地访问找不到位置时，发现访问的是本地地址：端口号+ /api的地址
  app.use(
    '/api',
    createProxyMiddleware({

        //使用target+/api及其以后的地址作为目标(服务器)访问地址
        //创建本地服务器 利用本地服务器与目标服务器进行交谈，因为服务器之间不存在跨域问题
      target: 'https://i.maoyan.com',
      changeOrigin: true,
      //这里创建的本地服务器需要访问的地址恰好是 https://i.maoyan.com/api/...  不需要将/api Rewrite
      // pathRewrite:{"^/api":''}
    })
  );
};