const router = require('express').Router()
const authUtil = require('../utils/util-auth')

router.use('/auth', require('./route-auth'))
router.use('/lunchbox', authUtil, require('./route-lunchbox'))

module.exports = router
