const query = require('../common/index')
const {waterfall, auto} = require('async')
const moment = require('moment')
var fs = require('fs')
const XLSX = require('xlsx')

module.exports = router => {
  // router.post('/export/log', (req, res) => {
    //   const {type, cid} = req.body //type 1: 今天 2: 昨天 3：本周
    //   if (Number(type) === 1) { //今天
    //     let className //组名
    //     let YMD = moment().format('YYYY-MM-DD HH')
    //     let _headers = ['名字', '微信号'] //制作表头
    //     for(let i = 11; i <= 18; i++) {
    //       _headers.push(`${i}:00`)
    //     }
    //     _headers.push(`10:00`)
    //     _headers.push(`合计`)
    //     let _data = [];
    //     waterfall([
    //       cb => {
    //         let sql = `SELECT name FROM sg_class WHERE cid = ${cid}`
    //         query(sql).then(data => {
    //           if (data.code) {
    //             className = data.data[0].name
    //             cb(null)
    //           } else {
    //             res.send(data)
    //           }
    //         })
    //       },
    //       cb => {
    //         let sql = `SELECT uid, name, wx_num FROM sg_user WHERE class_id = ${cid}` //查询出该组下的员工
    //         query(sql).then(data => {
    //           if (data.code) {
    //             data.data.forEach((item, index) => { //追加名字和微信号到数据
    //               let objP = {}
    //               objP[_headers[0]] = item.name
    //               objP[_headers[1]] = item.wx_num
    //               objP['uid'] = item.uid
    //               _data.push(objP)
    //             })
    //             let objB = {}
    //             objB[_headers[0]] = '合计'
    //             _data.push(objB)
    //             cb(null, {data: data.data})
    //           } else {
    //             res.send(data)
    //           }
    //         })
    //       },
    //       (results, cb) => { //取出今天所有的数据
    //         let timeStampTen = moment(moment().format('YYYY-MM-DD 10')).format('x') / 1000 //今天10点的时间戳
    //         let sql = `SELECT * FROM sg_customer WHERE create_time >= ${timeStampTen} and create_time <= ${timeStampTen + 3600 * 8} and class_id = ${cid}`
    //         query(sql).then(data => {
    //           if (data.code) {
    //             cb(null, {allData: data.data})
    //           } else {
    //             res.send(data)
    //           }
    //         })
    //       },
    //       (results, cb) => { //筛选归类
    //         let customerLog = results.allData //客户数据
    //         let hour = moment().format('HH')
    //         let hourSum = Number(moment().format('HH')) + 1
    //         let stampArr = []
    //         for(let i = 10; i <= 18; i++) {
    //           let timeStampTen = moment(moment().format(`YYYY-MM-DD ${i}`)).format('x') / 1000
    //           stampArr.push(timeStampTen)
    //           let n = `${i}:00`
    //           _data.forEach(item => {
    //             item[n] = 0
    //             delete item['10:00']
    //           })
    //         }
    //         stampArr.push(moment(moment().format(`YYYY-MM-DD ${hourSum}`)).format('x') / 1000)
    //         customerLog.forEach((c, ci) => { //遍历客户日志
    //           stampArr.forEach((s, si) => { //遍历时间戳
    //             if (c.create_time >= s && c.create_time < stampArr[si + 1]) { //判断是否在时间戳之内
    //               _data.forEach((d, di) => {
    //                 if (d.uid === c.uid) {
    //                   let t = `${moment(s * 1000).format('HH')}:00`
    //                   _data[di][t] ++
    //                 }
    //               })
    //             }
    //           })
    //         })
    //         cb(null)
    //       },
    //       cb => { //把竖行时间拼成数组
    //         let obj = {}
    //         _data.forEach((d, di) => {
    //           for(let i in d) {
    //             if (i.endsWith('00')) {
    //               if ( Array.isArray(obj[i]) ) {
    //                 obj[i].push(d[i])
    //               } else {
    //                 obj[i] =  new Array
    //                 obj[i].push(d[i])
    //               }
    //             }
    //           }
    //         })
    //         cb(null, {obj: obj})
    //       },
    //       (results, cb) => {
    //         let obj = results.obj
    //         for(let i in obj) {
    //           let sum = 0
    //           obj[i].forEach((o, oi) => {
    //             sum += o
    //           })
    //           _data[_data.length - 1][i] = sum
    //         }
    //         cb(null)
    //       },
    //       cb => { //横行求和
    //         _data.forEach((d, di) => {
    //           let sum = 0
    //           for (let i in d){
    //             if (i.endsWith('00')) {
    //               sum = sum + d[i]
    //             }
    //           }
    //           d['合计'] = sum
    //         })
    //         cb(null)
    //       },
    //       cb => {
            
    //         var headers = _headers
    //             // 为 _headers 添加对应的单元格位置
    //             .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
    //             .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
            
    //         var data = _data
    //             .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
    //             .reduce((prev, next) => prev.concat(next))
    //             .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
          
    //           // 合并 headers 和 data
    //           var output = Object.assign({}, headers, data);
    //           // 获取所有单元格的位置
    //           var outputPos = Object.keys(output);
    //           // 计算出范围
    //           var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
              
    //           // 构建 workbook 对象
    //           let Sheets = {}
    //           let key = className
    //           Sheets[key] = Object.assign({}, output, { '!ref': ref })
    //           var wb = {
    //           SheetNames: [className], //左下角名称
    //           Sheets
    //         };
            
    //         // 导出 Excel
    //         XLSX.writeFile(wb, `excel/${className}${YMD}点.xlsx`)
    //         res.send({
    //           code: true,
    //           downUrl: `excel/${className}${YMD}点.xlsx`,
    //           msg: '报表生成成功'
    //         })
    //       }
    //     ])
    //   } else if (Number(type) === 2) { //昨天
    //     let className //组名
    //     let YMD = `${moment().format('YYYY-MM')}-${moment().format('DD') - 1}`
    //     let _headers = ['名字', '微信号'] //制作表头
    //     for(let i = 11; i <= 18; i++) {
    //       _headers.push(`${i}:00`)
    //     }
    //     _headers.push(`10:00`)
    //     _headers.push(`合计`)
    //     let _data = [];
    //     waterfall([
    //       cb => {
    //         let sql = `SELECT name FROM sg_class WHERE cid = ${cid}`
    //         query(sql).then(data => {
    //           if (data.code) {
    //             className = data.data[0].name
    //             cb(null)
    //           } else {
    //             res.send(data)
    //           }
    //         })
    //       },
    //       cb => {
    //         let sql = `SELECT uid, name, wx_num FROM sg_user WHERE class_id = ${cid}` //查询出该组下的员工
    //         query(sql).then(data => {
    //           if (data.code) {
    //             data.data.forEach((item, index) => { //追加名字和微信号到数据
    //               let objP = {}
    //               objP[_headers[0]] = item.name
    //               objP[_headers[1]] = item.wx_num
    //               objP['uid'] = item.uid
    //               _data.push(objP)
    //             })
    //             let objB = {}
    //             objB[_headers[0]] = '合计'
    //             _data.push(objB)
    //             cb(null, {data: data.data})
    //           } else {
    //             res.send(data)
    //           }
    //         })
    //       },
    //       (results, cb) => { //取出今天所有的数据
    //         let timeStampTen = moment(moment().format(`${moment().format('YYYY-MM')}-${moment().format('DD') - 1} 10`)).format('x') / 1000 //昨天10点的时间戳
    //         let nowStampTen = moment(moment().format(`YYYY-MM-DD 10`)).format('x') / 1000
    //         let sql = `SELECT * FROM sg_customer WHERE create_time >= ${timeStampTen} and create_time < ${nowStampTen} and class_id = ${cid}`
    //         query(sql).then(data => {
    //           if (data.code) {
    //             cb(null, {allData: data.data})
    //           } else {
    //             res.send(data)
    //           }
    //         })
    //       },
    //       (results, cb) => { //筛选归类
    //         let customerLog = results.allData //客户数据
    //         let hour = moment().format('HH')
    //         let hourSum = Number(moment().format('HH')) + 1
    //         let stampArr = []
    //         for(let i = 10; i <= 18; i++) {
    //           let timeStampTen = moment(moment().format(`YYYY-MM-${moment().format('DD') - 1} ${i}`)).format('x') / 1000
    //           stampArr.push(timeStampTen)
    //           let n = `${i}:00`
    //           _data.forEach(item => {
    //             item[n] = 0
    //             // delete item['10:00']
    //           })
    //         }
    //         stampArr.push(moment(moment().format(`YYYY-MM-DD 10`)).format('x') / 1000)
    //         customerLog.forEach((c, ci) => { //遍历客户日志
    //           stampArr.forEach((s, si) => { //遍历时间戳
    //             if (si < stampArr.length - 2) {
    //               if (c.create_time >= s && c.create_time < stampArr[si + 1]) { //判断是否在时间戳之内
    //                 _data.forEach((d, di) => {
    //                   if (d.uid === c.uid) {
    //                     let t = `${moment(s * 1000 + 3600).format('HH')}:00`
    //                     _data[di][t] ++
    //                   }
    //                 })
    //               }
    //             } else {
    //               if (c.create_time >= s) { //判断是否在时间戳之内
    //                 _data.forEach((d, di) => {
    //                   if (d.uid === c.uid) {
    //                     // let t = `${moment(s * 1000 + 3600).format('HH')}:00`
    //                     _data[di]['10:00'] ++
    //                   }
    //                 })
    //               }
    //             }
    //           })
    //         })
    //         cb(null)
    //       },
    //       cb => { //把竖行时间拼成数组
    //         let obj = {}
    //         _data.forEach((d, di) => {
    //           for(let i in d) {
    //             if (i.endsWith('00')) {
    //               if ( Array.isArray(obj[i]) ) {
    //                 obj[i].push(d[i])
    //               } else {
    //                 obj[i] =  new Array
    //                 obj[i].push(d[i])
    //               }
    //             }
    //           }
    //         })
    //         cb(null, {obj: obj})
    //       },
    //       (results, cb) => {
    //         let obj = results.obj
    //         for(let i in obj) {
    //           let sum = 0
    //           obj[i].forEach((o, oi) => {
    //             sum += o
    //           })
    //           _data[_data.length - 1][i] = sum
    //         }
    //         cb(null)
    //       },
    //       cb => { //横行求和
    //         _data.forEach((d, di) => {
    //           let sum = 0
    //           for (let i in d){
    //             if (i.endsWith('00')) {
    //               sum = sum + d[i]
    //             }
    //           }
    //           d['合计'] = sum
    //         })
    //         cb(null)
    //       },
    //       cb => {
            
    //         var headers = _headers
    //             // 为 _headers 添加对应的单元格位置
    //             .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
    //             .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
            
    //         var data = _data
    //             .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
    //             .reduce((prev, next) => prev.concat(next))
    //             .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
          
    //           // 合并 headers 和 data
    //           var output = Object.assign({}, headers, data);
    //           // 获取所有单元格的位置
    //           var outputPos = Object.keys(output);
    //           // 计算出范围
    //           var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
              
    //           // 构建 workbook 对象
    //           let Sheets = {}
    //           let key = className
    //           Sheets[key] = Object.assign({}, output, { '!ref': ref })
    //           var wb = {
    //           SheetNames: [className], //左下角名称
    //           Sheets
    //         };
            
    //         // 导出 Excel
    //         XLSX.writeFile(wb, `C:/Users/HP/Desktop/新版/api/excel/${className}${YMD}.xlsx`)
    //         res.send({
    //           code: true,
    //           downUrl: `C:/Users/HP/Desktop/新版/api/excel/${className}${YMD}.xlsx`,
    //           msg: '报表生成成功'
    //         })
    //       }
    //     ])
    //   }
    // })
  router.post('/export/log', (req, res) => {
    const {time, cid} = req.body
    const NOWTIME = moment().format('YYYY-MM-DD')
    const CHANGE = Number(time) * 1000
    const PARAMSTIME = moment(CHANGE).format('YYYY-MM-DD')
    if (NOWTIME === PARAMSTIME) {
      let className //组名
      let YMD = moment().format('YYYY-MM-DD HH')
      let H = moment().format('HH')
      let _headers = ['名字', '微信号'] //制作表头
      for(let i = 0; i <= H; i++) {
        _headers.push(`${i}:00`)
      }
      _headers.push(`合计`)
      let _data = [];
      waterfall([
        cb => {
          let sql = `SELECT name FROM sg_class WHERE cid = ${cid}`
          query(sql).then(data => {
            if (data.code) {
              className = data.data[0].name
              cb(null)
            } else {
              res.send(data)
            }
          })
        },
        cb => {
          let sql = `SELECT uid, name, wx_num FROM sg_user WHERE class_id = ${cid}` //查询出该组下的员工
          query(sql).then(data => {
            if (data.code) {
              data.data.forEach((item, index) => { //追加名字和微信号到数据
                let objP = {}
                objP[_headers[0]] = item.name
                objP[_headers[1]] = item.wx_num
                objP['uid'] = item.uid
                _data.push(objP)
              })
              let objB = {}
              objB[_headers[0]] = '合计'
              _data.push(objB)
              cb(null, {data: data.data})
            } else {
              res.send(data)
            }
          })
        },
        (results, cb) => { //取出今天所有的数据
          let timeStampTen = moment(moment().format('YYYY-MM-DD 10')).format('x') / 1000 //今天0点的时间戳
          let sql = `SELECT * FROM sg_customer WHERE create_time >= ${timeStampTen} and class_id = ${cid}`
          query(sql).then(data => {
            if (data.code) {
              cb(null, {allData: data.data})
            } else {
              res.send(data)
            }
          })
        },
        (results, cb) => { //筛选归类
          let customerLog = results.allData //客户数据
          let hour = moment().format('HH')
          let hourSum = Number(moment().format('HH')) + 1
          let stampArr = []
          for(let i = 0; i <= H; i++) {
            let a = i.toString().length === 1 ? `0${i}` : `${i}`
            let timeStampTen = moment(moment().format(`YYYY-MM-DD ${a}`)).format('x') / 1000
            stampArr.push(timeStampTen)
            let n = `${i}:00`
            _data.forEach(item => {
              item[n] = 0
            })
          }
          customerLog.forEach((c, ci) => { //遍历客户日志
            stampArr.forEach((s, si) => { //遍历时间戳
              if (si === stampArr.length - 1) {
                if (c.create_time >= s) { //判断是否在时间戳之内
                  _data.forEach((d, di) => {
                    if (d.uid === c.uid) {
                      let t = `${moment(s * 1000).format('HH')}:00`
                      _data[di][t] =  _data[di][t] + c.num
                    }
                  })
                }
              } else {
                if (c.create_time >= s && c.create_time < stampArr[si + 1]) { //判断是否在时间戳之内
                  _data.forEach((d, di) => {
                    if (d.uid === c.uid) {
                      let aa = s * 1000
                      let t = `${Number(moment(aa).format('HH'))}:00`
                      _data[di][t] =  _data[di][t] + c.num
                    }
                  })
                }
              }
            })
          })
          cb(null)
        },
        cb => { //把竖行时间拼成数组
          let obj = {}
          _data.forEach((d, di) => {
            for(let i in d) {
              if (i.endsWith('00')) {
                if ( Array.isArray(obj[i]) ) {
                  obj[i].push(d[i])
                } else {
                  obj[i] =  new Array
                  obj[i].push(d[i])
                }
              }
            }
          })
          cb(null, {obj: obj})
        },
        (results, cb) => {
          let obj = results.obj
          for(let i in obj) {
            let sum = 0
            obj[i].forEach((o, oi) => {
              sum += o
            })
            _data[_data.length - 1][i] = sum
          }
          cb(null)
        },
        cb => { //横行求和
          _data.forEach((d, di) => {
            let sum = 0
            for (let i in d){
              if (i.endsWith('00')) {
                sum = sum + d[i]
              }
            }
            d['合计'] = sum
          })
          cb(null)
        },
        cb => {

          var headers = _headers
              // 为 _headers 添加对应的单元格位置
              .map((v, i) => Object.assign({}, {
                v: v, 
                position: i > 25 ? String.fromCharCode(65+ (i-26)) + String.fromCharCode(65+ (i-26)) + 1 : String.fromCharCode(65+i) + 1
              }))
              .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

          var data = _data
          .map((v, i) => _headers.map((k, j) => Object.assign({}, { 
            v: v[k], 
            position: j > 25 ? String.fromCharCode(65+ (j-26)) + String.fromCharCode(65+ (j-26)) + (i+2) : String.fromCharCode(65+j) + (i+2)
          })))
          .reduce((prev, next) => prev.concat(next))
          .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
        
            // 合并 headers 和 data
            var output = Object.assign({}, headers, data);
            // 获取所有单元格的位置
            var outputPos = Object.keys(output);
            // 计算出范围
            var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            
            // 构建 workbook 对象
            let Sheets = {}
            let key = className
            Sheets[key] = Object.assign({}, output, { '!ref': ref })
            var wb = {
            SheetNames: [className], //左下角名称
            Sheets
          };
          
          // 导出 Excel
          XLSX.writeFile(wb, `excel/${className}${YMD}点.xlsx`)
          res.send({
            code: true,
            downUrl: `excel/${className}${YMD}点.xlsx`,
            msg: '报表生成成功'
          })
        }
      ])
    } else if (NOWTIME > PARAMSTIME) {
      let className //组名
      let YMD = moment().format('YYYY-MM-DD HH')
      let _headers = ['名字', '微信号'] //制作表头
      for(let i = 0; i <= 23; i++) {
        _headers.push(`${i}:00`)
      }
      _headers.push(`合计`)
      let _data = [];
      waterfall([
        cb => {
          let sql = `SELECT name FROM sg_class WHERE cid = ${cid}`
          query(sql).then(data => {
            if (data.code) {
              className = data.data[0].name
              cb(null)
            } else {
              res.send(data)
            }
          })
        },
        cb => {
          let sql = `SELECT uid, name, wx_num FROM sg_user WHERE class_id = ${cid}` //查询出该组下的员工
          query(sql).then(data => {
            if (data.code) {
              data.data.forEach((item, index) => { //追加名字和微信号到数据
                let objP = {}
                objP[_headers[0]] = item.name
                objP[_headers[1]] = item.wx_num
                objP['uid'] = item.uid
                _data.push(objP)
              })
              let objB = {}
              objB[_headers[0]] = '合计'
              _data.push(objB)
              cb(null, {data: data.data})
            } else {
              res.send(data)
            }
          })
        },
        (results, cb) => { //取出这天所有数据所有的数据
          let timeStampTen = CHANGE / 1000 //今天0点的时间戳
          let sql = `SELECT * FROM sg_customer WHERE create_time >= ${timeStampTen} and create_time < ${timeStampTen + 3600 * 24} and class_id = ${cid}`
          query(sql).then(data => {
            if (data.code) {
              cb(null, {allData: data.data})
            } else {
              res.send(data)
            }
          })
        },
        (results, cb) => { //筛选归类
          let customerLog = results.allData //客户数据
          let hour = moment().format('HH')
          let hourSum = Number(moment().format('HH')) + 1
          let stampArr = []
          let Ymd =  moment(CHANGE).format('YYYY-MM-DD')
          for(let i = 0; i <= 23; i++) {
            let a = i.toString().length === 1 ? `0${i}` : `${i}`
            let timeStampTen = moment(moment().format(`${Ymd} ${a}`)).format('x') / 1000
            stampArr.push(timeStampTen)
            let n = `${i}:00`
            _data.forEach(item => {
              item[n] = 0
            })
          }
          customerLog.forEach((c, ci) => { //遍历客户日志
            stampArr.forEach((s, si) => { //遍历时间戳
              if (si === stampArr.length - 1) {
                if (c.create_time >= s) { //判断是否在时间戳之内
                  _data.forEach((d, di) => {
                    if (d.uid === c.uid) {
                      let t = `${moment(s * 1000).format('HH')}:00`
                      _data[di][t] ++
                    }
                  })
                }
              } else {
                if (c.create_time >= s && c.create_time < stampArr[si + 1]) { //判断是否在时间戳之内
                  _data.forEach((d, di) => {
                    if (d.uid === c.uid) {
                      let aa = s * 1000
                      let t = `${Number(moment(aa).format('HH'))}:00`
                      _data[di][t] ++
                    }
                  })
                }
              }
            })
          })
          cb(null)
        },
        cb => { //把竖行时间拼成数组
          let obj = {}
          _data.forEach((d, di) => {
            for(let i in d) {
              if (i.endsWith('00')) {
                if ( Array.isArray(obj[i]) ) {
                  obj[i].push(d[i])
                } else {
                  obj[i] =  new Array
                  obj[i].push(d[i])
                }
              }
            }
          })
          cb(null, {obj: obj})
        },
        (results, cb) => {
          let obj = results.obj
          for(let i in obj) {
            let sum = 0
            obj[i].forEach((o, oi) => {
              sum += o
            })
            _data[_data.length - 1][i] = sum
          }
          cb(null)
        },
        cb => { //横行求和
          _data.forEach((d, di) => {
            let sum = 0
            for (let i in d){
              if (i.endsWith('00')) {
                sum = sum + d[i]
              }
            }
            d['合计'] = sum
          })
          cb(null)
        },
        cb => {
          var headers = _headers
              // 为 _headers 添加对应的单元格位置
              .map((v, i) => Object.assign({}, {
                v: v, 
                position: i > 25 ? String.fromCharCode(65+ (i-26)) + String.fromCharCode(65+ (i-26)) + 1 : String.fromCharCode(65+i) + 1
              }))
              .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

          var data = _data
          .map((v, i) => _headers.map((k, j) => Object.assign({}, { 
            v: v[k], 
            position: j > 25 ? String.fromCharCode(65+ (j-26)) + String.fromCharCode(65+ (j-26)) + (i+2) : String.fromCharCode(65+j) + (i+2)
          })))
          .reduce((prev, next) => prev.concat(next))
          .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
            // 合并 headers 和 data

            var output = Object.assign({}, headers, data);
            // 获取所有单元格的位置
            var outputPos = Object.keys(output);
            // 计算出范围
            var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            
            // 构建 workbook 对象
            let Sheets = {}
            let key = className
            Sheets[key] = Object.assign({}, output, { '!ref': ref })
            var wb = {
            SheetNames: [className], //左下角名称
            Sheets
          };
          
          // 导出 Excel
          XLSX.writeFile(wb, `/excel/${className}.xlsx`)
          res.send({
            code: true,
            downUrl: `/excel/${className}.xlsx`,
            msg: '报表生成成功'
          })
        }
      ])
    } else {
      res.send({
        code: false,
        msg: '不要调皮，选择时间超过了今天'
      })
    }
  })
}
