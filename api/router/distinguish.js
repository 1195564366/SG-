const query = require('../common/index')
const {waterfall, auto} = require('async')
const AipOcrClient = require("baidu-aip-sdk").ocr //百度图片识别
const multiparty = require('multiparty') //文件上传
const fs = require('fs')
const moment = require('moment')
// 设置APPID/AK/SK
const APP_ID = "11728519"
const API_KEY = "Sc8Xizm1kDTkY00qsSbdraGM"
const SECRET_KEY = "SapiFHWFa80wyOOKEHAtKZkmITMZj6Zh"

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY)
const day = moment().format('YYYY-MM-DD')

const nowTamps = moment(moment().format('YYYY-MM-DD')).format('x') / 1000 - 3600 * 24

module.exports = router => {
  router.post('/wximage/num', (req, res) => { //上传图片+识别图片人数
    let form = new multiparty.Form();
    //上传完成后处理
    form.parse(req, (err, fields, files) => {
      const token = fields.token[0]
      let inputFile = files.file[0]
      let uploadedPath = inputFile.path;
      // let dstPath = inputFile.originalFilename.split('')
      waterfall([
        cb => {
          let sql = `SELECT uid, name, (select name from sg_class c WHERE c.cid = u.class_id) cname FROM sg_user u WHERE token = '${token}'`
          query(sql).then(data => {
            cb(null, {data: data.data[0]})
          })
        },
        (results, cb) => {
          let fixedUrl = `D:/项目/SG系统/api/wximage`
          let newPath = `${fixedUrl}/${results.data.cname}/${day}/${results.data.name}.png`
          let newUrl = `${fixedUrl}/${results.data.cname}/${day}`
          let new1Url = `${fixedUrl}/${results.data.cname}`
          console.log(newUrl)
          waterfall([
            cb => {
              fs.access(new1Url,function(err){
                //    文件和目录不存在的情况下；
                console.log(err)
                if(err){
                  console.log("文件和目录不存在")
                  fs.mkdir(new1Url,function(err){
                    if(err) return console.error(err);
                    console.log('创建目录成功');
                    cb(null)
                  });             
                } else {
                  cb(null)
                }
              })
            },
            cb => {
              fs.access(newUrl,function(err){
                //    文件和目录不存在的情况下；
                if(err){
                  console.log("文件和目录不存在")
                  fs.mkdir(newUrl,function(err){
                    if(err) return console.error(err);
                    console.log('创建目录成功');
                    cb(null)
                  });             
                } else {
                  cb(null)
                }
              })
            },
            cb => {
              fs.rename(uploadedPath, newPath, (err) => {
                if(err){
                  console.log('添加失败: ' + err);
                  res.send({
                    code: false,
                    msg: '图片上传失败'
                  })
                } else {
                  console.log('添加成功');
                  let image = fs.readFileSync(newPath).toString("base64")
                  // 调用通用文字识别, 图片参数为本地图片
                  client.generalBasic(image).then((result) => {
                    let Result = false
                    let i
                    result.words_result.forEach((item, index) => {
                      if (item.words.endsWith('位联系人')) {
                        i = index
                        Result = true
                      }
                    })
                    if (Result) {
                      waterfall([
                        cb => {
                          let sql = `select count(1) as num from sg_wx_img_log where uid = ${results.data.uid} and create_time = ${nowTamps}`
                          query(sql).then(data => {
                            if (data.data[0].num > 0) {
                              cb(null, {type: 1})
                            } else {
                              cb(null, {type: 2})
                            }
                          })
                        },
                        (reslu, cb) => {
                          const reg = new RegExp("位联系人","g");
                          let sql
                          if (reslu.type === 1) {
                            sql = `UPDATE sg_wx_img_log SET wx_img_url = '${newPath}', wx_num = ${Number(result.words_result[i].words.replace(reg,""))}, create_time = ${Math.round(new Date() / 1000)} WHERE uid = ${results.data.uid} and screenshot_time = ${nowTamps}`
                          } else {
                            sql = `INSERT INTO sg_wx_img_log (wx_img_url, uid, screenshot_time, create_time, wx_num) VALUES ('${newPath}', ${results.data.uid}, ${nowTamps}, ${Math.round(new Date() / 1000)}, ${Number(result.words_result[i].words.replace(reg,""))})`
                          }
                          query(sql).then(data => {
                            if (data.code) {
                              res.send({
                                code: true,
                                msg: `识别成功，联系人数${result.words_result[i].words.replace(reg,"")}`
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
                        msg: '识别失败'
                      })
                    }
                  }).catch(function(err) {
                      // 如果发生网络错误
                      console.log(err);
                  });
                }
              });
            }
          ])
        }
      ])
      // let newPath = `C:/Users/HP/Desktop/新版/api/wximage/${results.data.class_id}/${dstPath}`
      // fs.rename(uploadedPath, newPath, (err) => {
      //     if(err){
      //       console.log('添加失败: ' + err);
      //     } else {
      //       console.log('添加成功');
      //       let image = fs.readFileSync(newPath).toString("base64")
      //       // 调用通用文字识别, 图片参数为本地图片
      //       client.generalBasic(image).then((result) => {
      //         let Result = false
      //         let i
      //         result.words_result.forEach((item, index) => {
      //           if (item.words.endsWith('位联系人')) {
      //             i = index
      //             Result = true
      //           }
      //         })
      //         if (Result) {
      //           const reg = new RegExp("位联系人","g");
      //           res.send({
      //             code: true,
      //             msg: `识别成功，联系人数${result.words_result[i].words.replace(reg,"")}`
      //           })
      //         } else {
      //           res.send({
      //             code: false,
      //             msg: '识别失败'
      //           })
      //         }
      //       }).catch(function(err) {
      //           // 如果发生网络错误
      //           console.log(err);
      //       });
      //     }
      // });
    })
  })
}