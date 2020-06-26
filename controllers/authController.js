const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config.json')
const fs = require('fs')
const secretKey = fs.readFileSync('secret')
const { INTERNAL_SERVER_ERROR } = require('../errors')

const addUser = (users, data, callback) => {
  users.insertOne({ ...data, todos: [] }, null, (err) => {
    callback(err)
  })
}

exports.postRegister = async (req, res) => {
  const { users } = req
  const { username, password } = req.body
  if (!username) {
    return res.json({ ok: false, error: 'Enter username!' })
  }
  if (!password) {
    return res.json({ ok: false, error: 'Enter password!' })
  }
  const found = await users.findOne({ username })
  if (found) {
    return res.status(401).json({ ok: false, error: 'User exists!' })
  }
  bcrypt.hash(password, 12, (err, hash) => {
    addUser(
      users,
      { username, password: hash, darkMode: true, bg: '#9013FE' },
      (insertionError) => {
        if (insertionError) {
          return res.json({ ok: false, error: INTERNAL_SERVER_ERROR })
        }
        res.json({ ok: true })
      }
    )
  })
}

exports.postLogin = async (req, res) => {
  const INCORRECT_PASSWORD_ERROR = 'Incorrect username or password'
  const { users } = req
  const { username, password } = req.body
  if (!username) {
    return res.json({ ok: false, error: 'Enter username!' })
  }
  if (!password) {
    return res.json({ ok: false, error: 'Enter password!' })
  }
  const found = await users.findOne({ username })
  if (!found) {
    return res.status(401).json({ ok: false, error: INCORRECT_PASSWORD_ERROR })
  }
  bcrypt.compare(password, found.password, (err, authOk) => {
    if (err) {
      console.log(err)
    }
    if (authOk) {
      const data = {
        id: found._id,
      }
      const options = {
        expiresIn: config.TOKEN_LIFETIME,
      }
      const token = jwt.sign({ data }, secretKey, options)
      return res.json({ ok: true, token })
    }
    return res.status(401).json({ ok: false, error: INCORRECT_PASSWORD_ERROR })
  })
}
