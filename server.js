const sqlite = require('sqlite')
const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const app = express()
const usersSeed = require('./public/pirates.json')
let db

app.use(express.static('public'))
app.use(bodyParser.json())

const insertUser = u => {
  const { firstName, lastName, bio, image, slug } = u
  return db.get('INSERT INTO users(slug, firstName, lastName, bio, image) VALUES(?, ?, ?, ?, ?)', slug, firstName, lastName, bio, image)
  .then(() => db.get('SELECT last_insert_rowid() as id'))
  .then(({ id }) => db.get('SELECT * from users WHERE id = ?', id))
}

const dbPromise = Promise.resolve()
.then(() => sqlite.open('./database.sqlite', { Promise }))
.then(_db => {
  db = _db
  return db.migrate({ force: 'last' })
})
.then(() => Promise.map(usersSeed, u => insertUser(u)))

const html = `
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <title>NodeJS server</title>
    <link rel="stylesheet" href="bootstrap.min.css" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="main">

    </div>
    <script src="page.js"></script>
    <script src="app.js"></script>
  </body>
</html>`

app.post('/pirates', (req, res) => {
  return insertUser(req.body)
  .then(record => res.json(record))
})

app.get('/pirates', (req, res) => {
  db.all('SELECT * from users')
  .then(records => res.json(records))
})

app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
