const query = require('../common/index')
const {waterfall, auto} = require('async')

module.exports = router => {
  router.get('/customer/data', (req, res) => { //客户数据
    const {page, cid, name} = req.query
    const token = req.headers.authorization
    waterfall([
      cb => {
        let sql = `select uid, state FROM sg_user WHERE token = '${token}'`
        query(sql).then(data => {
          cb(null, {data: data.data[0]})
        })
      },
      (result, cb) => {
        auto({
          dataFun: cb => {
            let sql
            if (result.data.state === 3) {
              sql = `SELECT * from sg_customer WHERE uid = ${result.data.uid} ORDER BY create_time DESC LIMIT ${(page - 1) * 10},10`
            } else {
              if (cid && !name) {
                sql = `select cid, (SELECT name from sg_user u WHERE u.uid = c.uid) name, (SELECT name FROM sg_class a WHERE c.class_id = a.cid) class, num, create_time FROM sg_customer c WHERE class_id = ${cid}  ORDER BY create_time DESC LIMIT ${(page - 1) * 10},10`
              } else if (!cid && name) {
                sql = `select c.cid, u.name, (SELECT name FROM sg_class a WHERE c.class_id = a.cid) class, c.num, c.create_time FROM sg_customer c, sg_user u WHERE c.uid = u.uid AND u.name like '%${name}%' ORDER BY c.create_time DESC LIMIT ${(page - 1) * 10},10`
              } else if (cid && name) {
                sql = `select c.cid, u.name, (SELECT name FROM sg_class a WHERE c.class_id = a.cid) class, c.num, c.create_time FROM sg_customer c, sg_user u WHERE c.class_id = ${cid} and c.uid = u.uid AND u.name like '%${name}%' ORDER BY c.create_time DESC LIMIT ${(page - 1) * 10},10`
              } else {
                sql = `select cid, (SELECT name FROM sg_user u WHERE c.uid = u.uid) name, (SELECT name FROM sg_class a WHERE c.class_id = a.cid) class, num, create_time FROM sg_customer c ORDER BY create_time DESC LIMIT ${(page - 1) * 10},10`
              }
            }
            query(sql).then(data => {
              cb(null, {data: data.data})
            })
          },
          totalFun: cb => {
            let sql
            if (result.data.state === 3) {
              sql = `SELECT count(1) as total from sg_customer WHERE uid = ${result.data.uid}`
            } else {
              if (cid && !name) {
                sql = `select count(1) as total FROM sg_customer WHERE class_id = ${cid}`
              } else if (!cid && name) {
                sql = `select count(1) as total FROM sg_customer c, sg_user u WHERE c.uid = u.uid AND u.name like '%${name}%'`
              } else if (cid && name) {
                sql = `select count(1) as total FROM sg_customer c, sg_user u WHERE c.class_id = ${cid} and c.uid = u.uid AND u.name like '%${name}%'`
              } else {
                sql = `select count(1) as total FROM sg_customer`
              }
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
      }
    ])
  })

  router.post('/customer/add', (req, res) => { //添加客户
    const {wx_num} = req.body
    const token = req.headers.authorization
    waterfall([
      cb => {
        let sql = `select uid, class_id FROM sg_user WHERE token = '${token}'`
        query(sql).then(data => {
          cb(null, {data: data.data[0]})
        })
      },
      (result, cb) => {
        let sql = `INSERT INTO sg_customer (uid, class_id, num, create_time) VALUES (${result.data.uid}, ${result.data.class_id}, ${wx_num}, ${Math.round(new Date() / 1000)})`
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
}