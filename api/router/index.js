const router = require('express').Router()

require('./user')(router)
require('./class')(router)
require('./customer')(router)
require('./home')(router)
require('./distinguish')(router)
require('./wximg')(router)
require('./exportxls')(router)

module.exports = router