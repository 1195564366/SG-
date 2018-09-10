const query = require('../common/index')
const {waterfall, auto} = require('async')
const moment = require('moment')

const timestampNow = Math.round(new Date() / 1000) //现在时间戳 秒级
const NowTimeHour = moment().format('YYYY-MM-DD') //现在年月日
const NowHour = moment().format('HH') //现在时
module.exports = router => {
  router.get('/home/data', (req, res) => {
    const type = Number(req.query.type) //type 1: 今天 2: 本周 3: 本月
    let timeArr = []
    if (type === 1) { //今天
      for (let i = 1; i <= NowHour; i++) {
        let n = i.toString()
        n = n.length < 2 ? `0${n}`: n
        timeArr.push(moment(`${NowTimeHour} ${n}`, moment.ISO_8601).format('x') / 1000)
      }
    } else if (type === 2) { //本周
      let Weeks = moment().format('E') //获得今天周几
      for (let i = 1; i <= Weeks; i++ ) {
        let day = moment().format('DD') - (Weeks - i)
        timeArr.push(moment(`${moment().format(`YYYY-MM`)}-${day}`).format('x') / 1000 + (3600 * 10))
      }
    } else if (type === 3) { //本月
      let day = moment().format('DD') //获得今天是本月第几天
      let ym = moment().format('YYYY-MM')
      for(let i = 1; i <= day; i++) {
        let t = moment(`${ym}-${i}`, moment.ISO_8601).format('x') / 1000 + (3600 * 10)
        timeArr.push(t)
      }
    }
    waterfall([
      cb => { //查询出所有分组
        let sql = `SELECT cid, name from sg_class`
        query(sql).then(data => {
          cb(null, {data: data.data})
        })
      },
      (result, cb) => {

/**
 * 难受
 */
      
        let timeStamp
        let arr = []
        arr[0] = []
        arr[0][0] = 'product'
        result.data.forEach((item, index) => {
            arr[index + 1] = []
            arr[index + 1].push(item.name)
        })
        if (type === 1) { //生成今天凌晨时间戳
          timeStamp = moment(`${moment().format('YYYY-MM-DD')}`).format('x') / 1000
          let hour = moment().format('HH')
          for (let i = 1; i <= hour; i++) {
            arr[0].push(`${i}点`)
            for(let i = arr.length - 1; i > 0; i--) {
              arr[i].push(0)
            }
          }
        } else if (type === 2) { //生成本周第一天凌晨时间戳
          let weeks = moment().format(`E`)
          let day = moment().format(`DD`)
          let YTD = moment().format(`YYYY-MM`)
          for (let i = 1; i <= weeks; i++) {
            arr[0].push(`周${i}`)
            for(let i = arr.length - 1; i > 0; i--) {
              arr[i].push(0)
            }
          }
          timeStamp = moment(`${YTD}-${day - weeks + 1}`).format('x') / 1000
        } else if (type === 3) {  //生成本月第一天凌晨时间戳
          let YTD = moment().format(`YYYY-MM`)
          let day = moment().format(`DD`)
          for (let i = 1; i <= day; i++) {
            arr[0].push(`${i}日`)
            for(let i = arr.length - 1; i > 0; i--) {
              arr[i].push(0)
            }
          }
          timeStamp = moment(`${YTD}-01`).format('x') / 1000
        }
        let sql = `SELECT create_time, (SELECT name FROM sg_class a WHERE c.class_id = a.cid ) name, num from sg_customer c WHERE create_time >= ${timeStamp}`
        query(sql).then(data => {
          let dataArray = data.data
          dataArray.forEach((j, z) => { //查询出来数组
            timeArr.forEach((t, index) => { //时间戳数组
              if (index === timeArr.length - 1) {
                if (j.create_time >= t) {
                  for(let n = 1; n < arr.length; n++) {
                    if (arr[n][0] === j.name) {
                      arr[n][index + 1] = arr[n][index + 1] + j.num
                    }
                  }
                }
              } else {
                if (j.create_time >= t && j.create_time < timeArr[index + 1]) {
                  for(let n = 1; n < arr.length; n++) {
                    if (arr[n][0] === j.name) {
                      arr[n][index + 1] = arr[n][index + 1] + j.num
                    }
                  }
                }
              }
            })
          })

          res.send({
            code: true,
            data: arr
          })
        })
      }
    ])
  })
}