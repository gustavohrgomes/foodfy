const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')

const server = express()

server.use(express.static('./public'))
server.use(routes)

server.set('view engine', 'njk')

nunjucks.configure('./views', {
  express: server,
  noCache: true
})

server.listen(3333, () => {
  console.log('Server is running')
})