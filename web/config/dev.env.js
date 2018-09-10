'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"', //开发环境
  BASE_API: '"http://192.168.0.101:8083"'
})
