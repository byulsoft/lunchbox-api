const jwt = require('jsonwebtoken')

const INVALID_CODE = 'invalid'

const authMiddleware = (req, res, next) => {
  // read the token from header or url
  const token = req.headers['x-token'] || (req.cookies['Admin-Token'] ? req.cookies['Admin-Token'].split('|')[0] : undefined) || req.query.token

  // token does not exist
  if (!token) {
    return res.status(401).json({
      code: INVALID_CODE,
      message: 'not logged in'
    })
  }

  // create a promise that decodes the token
  const p = new Promise(
    (resolve, reject) => {
      jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
        if (err) reject(err)
        resolve(decoded)
      })
    }
  )

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    res.status(500).json({
      code: INVALID_CODE,
      message: error.message
    })
  }

  // process the promise
  p.then((decoded) => {
    req.decoded = decoded
    next()
  }).catch(onError)
}

module.exports = authMiddleware
