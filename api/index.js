const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const query = require('./common/index')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.setHeader("Access-Control-Allow-Methods","GET,POST");
  res.setHeader("Access-Control-Allow-Credentials","true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token,authorization");
  res.setHeader("Access-Control-Expose-Headers", "*");
  next();
});

app.use((req, res, next) => { // 验证token
  let pathnameJudeg = req._parsedUrl.pathname
  let token = req.headers.authorization
  if (token) {
    let sql = `select count(1) as number FROM sg_user WHERE token = '${token}'`
    query(sql).then(data => {
      if (data.data[0].number > 0) {
        let sqlToken = `UPDATE sg_user SET last_time = ${Math.round(new Date() / 1000)} WHERE token = '${token}'`
        query(sqlToken).then(data => {
          if (data.code) {
            next()
          } else {
            res.send(data)
          }
        })
      } else {
        res.send({
          code: false,
          msg: '账号在别处登录'
        })
      }
    })
  } else {
    next()
  }
})

app.use(session({
  secret: 'sessiontest',
  resave:true,
  saveUninitialized:true
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./router/index')) //路由

app.listen(8083, err => {
  if (err) return err
  console.log('站点开启')
})