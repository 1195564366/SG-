const query = require('../common/index')
const {waterfall, auto} = require('async')

module.exports = router => {
  router.get('/wximg/data', (req, res) => {
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
              sql = `SELECT * from sg_wx_img_log WHERE uid = ${result.data.uid} ORDER BY create_time DESC LIMIT ${(page - 1) * 10},10`
            } else {
              if (cid && !name) {
                sql = `select u.name, (SELECT a.name FROM sg_user u, sg_class a WHERE c.uid = u.uid AND u.class_id = a.cid) cname, c.wx_num, c.create_time, c.wx_img_url FROM sg_wx_img_log c, sg_user u, sg_class a WHERE u.uid = c.uid AND u.class_id = a.cid AND a.cid = ${cid} ORDER BY create_time DESC LIMIT ${(page - 1) * 10},10`
              } else if (!cid && name) {
                sql = `select u.name, (SELECT a.name FROM sg_user u, sg_class a WHERE c.uid = u.uid AND u.class_id = a.cid) cname, c.wx_num, c.create_time, c.wx_img_url FROM sg_wx_img_log c, sg_user u WHERE u.uid = c.uid AND u.name like '%${name}%' ORDER BY create_time DESC LIMIT ${(page - 1) * 10},10`
              } else if (cid && name) {
                sql = `select u.name, (SELECT a.name FROM sg_user u, sg_class a WHERE c.uid = u.uid AND u.class_id = a.cid) cname, c.wx_num, c.create_time, c.wx_img_url FROM sg_wx_img_log c, sg_user u, sg_class a WHERE u.uid = c.uid AND u.name like '%${name}%' AND u.class_id = a.cid AND a.cid = ${cid} ORDER BY create_time DESC LIMIT ${(page - 1) * 10},10`
              } else {
                sql = `select (SELECT name FROM sg_user u WHERE c.uid = u.uid) name, (SELECT a.name FROM sg_user u, sg_class a WHERE c.uid = u.uid AND u.class_id = a.cid) cname, wx_num, create_time, wx_img_url FROM sg_wx_img_log c ORDER BY create_time DESC LIMIT ${(page - 1) * 10},10`
              }
            }
            query(sql).then(data => {
              cb(null, {data: data.data})
            })
          },
          totalFun: cb => {
            let sql
            if (result.data.state === 3) {
              sql = `SELECT count(1) as total from sg_wx_img_log WHERE uid = ${result.data.uid}`
            } else {
              if (cid && !name) {
                sql = `select count(1) as total FROM sg_wx_img_log c, sg_user u, sg_class a WHERE u.uid = c.uid AND u.class_id = a.cid AND a.cid = ${cid}`
              } else if (!cid && name) {
                sql = `select count(1) as total FROM sg_wx_img_log c, sg_user u WHERE u.uid = c.uid AND u.name like '%${name}%'`
              } else if (cid && name) {
                sql = `select count(1) as total FROM sg_wx_img_log c, sg_user u, sg_class a WHERE u.uid = c.uid AND u.name like '%${name}%' AND u.class_id = a.cid AND a.cid = ${cid}`
              } else {
                sql = `select count(1) as total FROM sg_wx_img_log`
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
}