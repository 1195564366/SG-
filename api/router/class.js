const query = require('../common/index')
const {waterfall, auto} = require('async')

module.exports = router => {
  router.get('/class/data', (req, res) => { //分组数据
    const {name, page} = req.query
    auto({
      dataFun: cb => {
        let sql = `SELECT cid, name, (SELECT count(1) from sg_user u WHERE u.class_id = c.cid) as staffNum, (SELECT count(1) from sg_customer u WHERE u.class_id = c.cid) as customerNum, create_time from sg_class c`
        if (name) {
          sql += ` where name like '%${name}%'`
        }
        sql += ` ORDER BY create_time DESC LIMIT ${(page - 1) * 10}, 10`
        query(sql).then(data => {
          cb(null, {data: data.data})
        })
      },
      totalFun: cb => {
        let sql = `select count(1) as total from sg_class`
        if (name) {
          sql += ` where name like '%${name}%'`
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
        total: results.totalFun.total,
      })
    })
  })

  router.post('/class/add', (req, res) => { //添加分组
    const {name} = req.body
    waterfall([
      cb => {
        let sql = `select count(1) as num from sg_class where name = '${name}'`
        query(sql).then(data => {
          if (data.data[0].num > 0) {
            res.send({
              code: false,
              msg: '分组名已存在'
            })
          } else {
            cb(null)
          }
        })
      },
      cb => {
        let sql = `INSERT INTO sg_class (name, create_time)  VALUES ('${name}', ${Math.round(new Date() / 1000)})`
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

  router.get('/class/delete', (req, res) => { //删除分组
    const { cid } = req.query
    waterfall([
      cb => {
        let sql = `SELECT count(1) as num FROM sg_user WHERE class_id = ${cid}`
        query(sql).then(data => {
          if (data.data[0].num > 0) {
            res.send({
              code: false,
              msg: '该分组下还存在成员，请先清除该分组下的成员'
            })
          } else {
            cb(null)
          }
        })
      },
      cb => {
        let sql = `DELETE FROM sg_class where cid = ${cid}`
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

  router.post('/class/modify', (req, res) => { //修改分组
    const {cid, name} = req.body
    waterfall([
      cb => {
        let sql = `select count(1) as num from sg_class where name = '${name}'`
        query(sql).then(data => {
          if (data.data[0].num > 0) {
            res.send({
              code: false,
              msg: '分组名已存在'
            })
          } else {
            cb(null)
          }
        })
      },
      cb => {
        let sql = `UPDATE sg_class SET name = '${name}' WHERE cid = ${cid}`
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

  router.get('/class/details', (req, res) => { //分组详情员工/客户
    const { page, cid, type } = req.query
    auto({
      dataFun: cb => {
        let sql
        if (Number(type) === 1) {
          sql = `SELECT u.name, u.create_time FROM sg_user u, sg_class c WHERE u.class_id = c.cid and c.cid = ${cid} ORDER BY u.create_time DESC LIMIT ${(page - 1) * 10}, 10`
        } else if (Number(type) === 2) {
          sql = `SELECT u.num as name, u.create_time FROM sg_customer u, sg_class c WHERE u.class_id = c.cid and c.cid = ${cid} ORDER BY u.create_time DESC LIMIT ${(page - 1) * 10}, 10`
        } else if (Number(type) === 3) {
          sql = `SELECT c.num as num, c.create_time FROM sg_user u, sg_customer c WHERE u.uid = c.uid and u.uid = ${cid} ORDER BY u.create_time DESC LIMIT ${(page - 1) * 10}, 10`
        }
        query(sql).then(data => {
          cb(null, {data: data.data})
        })
      },
      totalFun: cb => {
        let sql
        if (Number(type) === 1) {
          sql = `select count(1) as total from sg_user u, sg_class c WHERE u.class_id = c.cid and c.cid = ${cid}`
        } else if (Number(type) === 2) {
          sql = `select count(1) as total from sg_customer u, sg_class c WHERE u.class_id = c.cid and c.cid = ${cid}`
        } else if (Number(type) === 3) {
          sql = `SELECT count(1) as total FROM sg_user u, sg_customer c WHERE u.uid = c.uid and u.uid = ${cid}`
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
}