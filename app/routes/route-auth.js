const router = require('express').Router()
const jwt = require('jsonwebtoken')

const defaultAdmin = {
  adminId: 'admin', // 관리자 아이디
  adminPw: '1234' // 관리자 비밀번호
}

/*
    로그인
    POST /api/auth/login
    {
        adminId,
        adminPw
    }
*/
router.post('/login', (req, res) => {
  const { adminId, adminPw } = req.body
  const secret = req.app.get('jwt-secret')

  // get Admin Info
  const get = (adminId) => {
    return new Promise((resolve, reject) => {
      resolve(defaultAdmin.adminId === adminId ? defaultAdmin : null)
    })
  }

  // check the user info & generate the jwt
  const check = (admin) => {
    if (!admin) {
      // admin does not exist
      throw new Error('login failed')
    } else {
      // admin exists, check the password
      if (admin.adminPw === adminPw) {
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: admin._id,
              adminId: admin.adminId,
              adminNm: admin.adminNm
            },
            secret,
            {
              expiresIn: '7d',
              issuer: 'lunchbox',
              subject: 'adminInfo'
            }, (err, token) => {
              if (err) reject(err)
              resolve({
                token,
                adminNm: admin.adminNm
              })
            })
        })
        return p
      } else {
        throw new Error('login failed')
      }
    }
  }

  // respond the token
  const respond = (obj) => {
    res.json({
      code: 'success',
      token: obj.token,
      adminNm: obj.adminNm
    })
  }

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    res.json({
      result: error.message
    })
  }

  // find the admin
  get(adminId)
    .then(check)
    .then(respond)
    .catch(onError)
})

module.exports = router
