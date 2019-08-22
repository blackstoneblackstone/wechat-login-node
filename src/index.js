const express = require('express');
const wei = require('wei');
const proxy = require('http-proxy-middleware');

const app = express();
const appid = '';
const appsecret = '';

const proxyOption = {
  target: 'http://www.jarton.cn',
  pathRewrite: {
    '^/api': '/api', // 重写请求，api/解析为/
  },
  changeOrigoin: true,
};

/**
 * 微信认证需要的授权文件
 */
app.get('/MP_verify_Mti1B4FBENHQdphV.txt', async (req, res) => {
  res.send('Mti1B4FBENHQdphV');
});

/**
 * 这里是入口，直接返回html
 */
app.get('/', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.sendFile(`${__dirname}/index.html`);
    return;
  }
  const userInfo = await wei.authorize({
    appid,
    appsecret,
    code, // 此处code可在授权后重定向的url上拿到。
  }, {
    check(actoke) {
      // 这里可以写数据库逻辑
      // 在这里访问数据库获取，userInfo 就不会去微信拿了
    },
  });
  res.cookie('userId', userInfo.openid);
  res.cookie('userName', userInfo.nickname);
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(`${__dirname}/index.html`);
});

// 跨域配置
app.use('/api/*', proxy(proxyOption));

app.listen(80, () => {
  console.log('Example app listening on port 80!');
});
