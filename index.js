const routes = require('./routes')
const express = require('express')
const config = require('./config')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', routes)

const PORT = config.PORT

MongoClient.connect(
    config.MONGO_URL,
    { useUnifiedTopology: true },
    async function(err, client) {
      if (err) {
        console.log(err)
      }
    }
)
