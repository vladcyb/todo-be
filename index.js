const routes = require('./routes')
const express = require('express')
const config = require('./config')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
const app = express()

app.use(cors())

const client = new MongoClient(
    config.MONGO_URL,
    { useNewUrlParser: true,  useUnifiedTopology: true }
)

client.connect(err => {
  const db = client.db('todo')
  const users = db.collection('users')
  if (err) {
    console.log(err)
  }
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    req.users = users
    next()
  })
  app.use(routes)
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ ok: false, error: err.name })
    }
    console.log(err.name)
  })
  const { PORT = config.PORT } = process.env
  app.listen(PORT, () => { console.log(`listening on port ${PORT}`) })
})
