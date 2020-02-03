const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const moment = require('moment')

module.exports = function() {
  const app = express()

  // parse JSON and url-encoded query
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // logger
  morgan.token('realclfdate', () => {
    return moment().format('YYYY-MM-DD hh:mm:ss')
  })
  app.use(morgan('[:realclfdate] :method :url :status :res[content-length] - :response-time ms'))

  // set the secret key variable for jwt
  app.set('jwt-secret', 'SeCrEtKeYFoRlUnChBoX')

  // configure api router
  app.use('/api', require('./routes'))

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    console.error(err)
    res.status(err.status || 500)
    res.send('error')
  })

  console.log('\x1b[33m%s\x1b[0m', `

     ▄█   ▄█▄    ▄████████      ▄█    ▄████████ ███▄▄▄▄      ▄██████▄  
    ███ ▄███▀   ███    ███     ███   ███    ███ ███▀▀▀██▄   ███    ███ 
    ███▐██▀     ███    █▀      ███   ███    ███ ███   ███   ███    █▀  
   ▄█████▀      ███            ███   ███    ███ ███   ███  ▄███        
  ▀▀█████▄    ▀███████████     ███ ▀███████████ ███   ███ ▀▀███ ████▄  
    ███▐██▄            ███     ███   ███    ███ ███   ███   ███    ███ 
    ███ ▀███▄    ▄█    ███     ███   ███    ███ ███   ███   ███    ███ 
    ███   ▀█▀  ▄████████▀  █▄ ▄███   ███    █▀   ▀█   █▀    ████████▀  
    ▀                      ▀▀▀▀▀▀                                      
  `)
  console.log('\x1b[36m%s\x1b[0m', '===== ExpressJS API Server =================== Produced by K.S.JANG =====\n')
  console.log('\x1b[32m%s\x1b[0m', '[API Server] Lunchbox API Server (http://localhost:7070/api/*) 기동 완료.\n')

  return app
}
