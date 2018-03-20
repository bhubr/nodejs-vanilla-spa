const express = require('express')
const app = express()

app.use(express.static('public'))

const html = `
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <title>NodeJS server</title>
  </head>
  <body>
    <script src="app.js"></script>
  </body>
</html>`

app.get('/', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
