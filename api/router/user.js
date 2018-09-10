
const query = require('../common/index')
const svgCaptcha = require('svg-captcha')
const {waterfall, auto} = require('async')
const md5 = require('md5')
const mysql = require('mysql')

const md5String = 'sgdzxt'

module.exports = router => {
  router.get('/user/captcha', (req, res) => { //验证码接口
    let captcha = svgCaptcha.createMathExpr();
    req.session.captcha = captcha.text;
    res.send({
      code: true,
      captcha: captcha.data,
      text: captcha.text
    })
  })

  router.post('/user/login', (req, res) => { //登录接口
    const {account, password, captcha} = req.body
    waterfall([
      cb => {
        if (!account || !password || !captcha) {
          res.send({
            code: false,
            msg: '登录信息填写不完整'
          })
        } else {
          cb(null)
        }
      },
      cb => {
        if (captcha !==  req.session.captcha) {
          res.send({
            code: false,
            msg: '验证码错误'
          })
        } else {
          cb(null)
        }
      },
      cb => {
        let sql = `SELECT count(1) as total FROM sg_user WHERE account = '${account}' and password = '${md5(md5String + password)}'`
        query(sql).then(data => {
          if (data.data[0].total > 0) {
            let token = md5(account + Math.round(new Date() / 1000))
            waterfall([
              cb => {
                let sqlToken = `UPDATE sg_user SET token = '${token}', last_time = ${Math.round(new Date() / 1000)} WHERE account = '${account}'`
                query(sqlToken).then(data => {
                  if (data.code) {
                    cb(null)
                  } else {
                    res.send(data)
                  }
                })
              },
              cb => {
                let sqlState = `select state, name from sg_user WHERE account = '${account}'`
                query(sqlState).then(data => {
                  if (data.code) {
                    res.send({
                      code: true,
                      msg: '登陆成功',
                      name: data.data[0].name,
                      state: data.data[0].state,
                      token: token
                    })
                  } else {
                    res.send(data)
                  }
                })
              }
            ])
          } else {
            res.send({
              code: false,
              msg: '账号或密码错误'
            })
          }
        })
      }
    ])
  })

  router.post('/user/add', (req, res) => { //添加管理员接口
    const {account, password, name, state, wx_num, cid} = req.body
    waterfall([
      cb => {
        if (!account || !password || !name || !state) {
          res.send({
            code: false,
            msg: '参数不全'
          })
        } else {
          cb(null)
        }
      },
      cb => {
        let sql = `SELECT count(1) as total FROM sg_user WHERE account = '${account}'`
        query(sql).then(data => {
          if (data.data[0].total > 0) {
            res.send({
              code: false,
              msg: '账号已存在'
            })
          } else {
            cb(null)
          }
        })
      },
      cb => {
        let sql = `INSERT INTO sg_user (name, account, password, state, wx_num, class_id, create_time) VALUES ('${name}', '${account}', '${md5(md5String + password)}', ${state}, '${wx_num}',${cid}, ${Math.round(new Date() / 1000)})`
        query(sql).then(data => {
          if (data.code) {
            res.send({
              code: true,
              msg: '添加成功'
            })
          } else {
            res.send(data)
          }
        })
      }
    ])
  })

  router.get('/user/class', (req, res) => { //添加用户获取分组信息
    let sql = `select cid, name from sg_class`
    query(sql).then(data => {
      if (data.code) {
        res.send({
          code: true,
          data: data.data
        })
      } else {
        res.send(data)
      }
    })
  })

  router.get('/user/data', (req, res) => { //用户数据
    let {cid, name, page} = req.query
    auto({
      dataFun: cb => {
        let sql = `SELECT uid, name, wx_num, (case state when 1 then '超管' when 2 then '审核员' else '普通' end) as state, (SELECT name FROM sg_class c WHERE c.cid = u.class_id) class, class_id as cid, account, create_time, last_time  FROM sg_user u`
        if (cid && !name) {
          sql += ` where class_id = ${cid}`
        }
        if (!cid && name) {
          sql += ` where name like '%${name}%'`
        }
        if (cid && name) {
          sql += ` where class_id = ${cid} and name like '%${name}&'`
        }
        sql += ` ORDER BY create_time DESC LIMIT ${(page - 1) * 10}, 10`
        query(sql).then(data => {
          cb(null, {data: data.data})
        })
      },
      totalFun: cb => {
        let sql = `SELECT count(1) as total  FROM sg_user`
        if (cid && !name) {
          sql += ` where class_id = ${cid}`
        }
        if (!cid && name) {
          sql += ` where name like '%${name}%'`
        }
        if (cid && name) {
          sql += ` where class_id = ${cid} and name like '%${name}%'`
        }
        query(sql).then(data => {
          cb(null, {total: data.data[0].total})
        })
      }
    }, (err, results) => {
      if (err) return res.send({code: false, msg: '服务器异常'})
      res.send({
        code: true,
        data: results.dataFun.data,
        total: results.totalFun.total
      })
    })
  })

  router.post('/user/modify', (req, res) => { //用户修改
    const {uid, name, pwd, cid} = req.body
    let sql = `UPDATE sg_user SET name = '${name}', class_id = ${cid}`
    if (pwd) {
      sql += `  ,password = '${md5(md5String + pwd)}'`
    }
    sql += ` WHERE uid = ${uid}`
    query(sql).then(data => {
      if (data.code) {
        res.send({
          code: true,
          msg: '修改成功'
        })
      } else {
        res.send(data)
      }
    })
  })

  router.get('/user/delete', (req, res) => { //用户删除
    const {uid} = req.query
    waterfall([
      cb => {
        let sql = `select name, class_id, state from sg_user where uid = ${uid}`
        query(sql).then(data => {
          cb(null, {data: data.data[0]})
        })
      },
      (result, cb) => {
        let sql = `INSERT INTO sg_user_delete (uid, name, cid, state, delete_time) VALUES (${uid}, '${result.data.name}', ${result.data.class_id},  ${result.data.state}, ${Math.round(new Date() / 1000)})`
        query(sql).then(data => {
          cb(null)
        })
      },
      cb => {
        let sql = `DELETE FROM sg_user WHERE uid = ${uid}`
        query(sql).then(data => {
          if (data.code) {
            res.send({
              code: true,
              msg: '删除成功'
            })
          } else {
            res.send(data)
          }
        })
      }
    ])
  })

  router.post('/user/modifyPwd', (req, res) => { //用户修改密码
    const {oldPwd, newPwd} = req.body
    const token = req.headers.authorization
    waterfall([
      cb => {
        let sql = `select password FROM sg_user WHERE token = '${token}'`
        query(sql).then(data => {
          if (data.data[0].password !== md5(md5String + oldPwd)) {
            res.send({
              code: false,
              msg: '旧密码不正确'
            })
          } else {
            cb(null)
          }
        })
      },
      cb => {
        let sql = `UPDATE sg_user SET password = '${md5(md5String + newPwd)}' WHERE token = '${token}'`
        query(sql).then(data => {
          if (data.code) {
            res.send({
              code: true,
              msg: '修改成功'
            })
          } else {
            res.send(data)
          }
        })
      }
    ])
  })
}