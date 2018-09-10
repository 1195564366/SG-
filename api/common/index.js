
const mysql = require('mysql');

// const pool = mysql.createPool({
//   host: '182.61.44.197',
//   user:'root', 
//   password:'lupan', 
//   port:'3306', 
//   database:'sg'
// }); 
const pool = mysql.createPool({
  host: 'localhost',
  user:'root', 
  password:'root', 
  port:'3306', 
  database:'sg'
});

// 连接公用方法
function query (sql,options,callback) {
  return new Promise((resolve,reject) => {
    pool.getConnection((err,conn) => {
      if(err){
        console.log(err)
      }else{
          conn.query(sql,(err,results,fields)  => {
              //释放连接  
              if (err) {
                console.log(err)
                resolve({code: false, message: '服务器连接错误'})
              } else {
                resolve({code: true, data: results})
              }
              conn.release();
          });
      }
    });
  }).catch(err => {
    console.log(err)
  })
};

module.exports = query
