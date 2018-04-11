const sqlite = require('sqlite')
const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')
// const fetch = require('node-fetch')
const request = require('request-promise')
const app = express()
const usersSeed = require('./public/pirates.json')
const { mapsKey } = require('./credentials.json')
let db

app.use(express.static('public'))
app.use(bodyParser.json())

const slugify = str => {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";

  for (var i=0, l=from.length ; i<l ; i++)
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));


  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

const insertStudio = s => {
  const { name, address, city, description } = s
  const slug = slugify(name)
  const geocoderQuery = `${address} ${city}`.replace(/ /g, '+')
  console.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${geocoderQuery}&key=${mapsKey}`)
  return request({
      uri: `https://maps.googleapis.com/maps/api/geocode/json`, 
      qs: {
        address: geocoderQuery, key: mapsKey
      },
    })
  .then(response => {
      console.log(typeof response, response)
      const parsed = JSON.parse(response)
      const { geometry: { location: { lat, lng } } } = parsed.results[0]
      console.log(lat, lng)

      return db.get(`INSERT INTO studios(slug, name, address, city, description, latitude, longitude)
        VALUES(?, ?, ?, ?, ?, ?, ?)`, slug, name, address, city, description, lat, lng)
      .then(() => db.get('SELECT last_insert_rowid() as id'))
      .then(({ id }) => db.get('SELECT * from studios WHERE id = ?', id))
     }
  )
  // .then(response => response.json())
  // .then(console.log)
  // .catch(console.error)


}

const dbPromise = Promise.resolve()
.then(() => sqlite.open('./database.sqlite', { Promise }))
.then(_db => {
  db = _db
  return db.migrate({ force: 'last' })
})
// .then(() => Promise.map(usersSeed, u => insertUser(u)))

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
    <script>
      window.mapsKey = '${mapsKey}'
    </script>
    <script src="zepto.min.js"></script>
    <script src="loadJS.js"></script>
    <script src="page.js"></script>
    <script src="app.js"></script>

  </body>
</html>`

app.post('/studios', (req, res) => {
  return insertStudio(req.body)
  .then(record => res.json(record))
})

app.get('/studios', (req, res) => {
  db.all('SELECT * from studios')
  .then(records => res.json(records))
})

app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
