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
    return res.status(400).json({
      ok: false,
      errors: { username: 'Enter username' },
    })
  }
  if (!password) {
    return res.status(400).json({
      ok: false,
      errors: { password: 'Enter password' },
    })
  }
  const found = await users.findOne({ username })
  if (found) {
    return res.status(401).json({
      ok: false,
      errors: { username: 'User exists' },
    })
  }
  bcrypt.hash(password, 12, (err, hash) => {
    addUser(
      users,
      { username, password: hash, darkMode: true, bg: '#FFCFD5' },
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
  const { users } = req
  const { username, password } = req.body
  if (!username) {
    return res.status(400).json({
      ok: false,
      errors: { username: 'Enter username' },
    })
  }
  if (!password) {
    return res.status(400).json({
      ok: false,
      errors: { password: 'Enter password' },
    })
  }
  const found = await users.findOne({ username })
  if (!found) {
    return res.status(401).json({
      ok: false,
      errors: { username: 'Incorrect username or password' },
    })
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
    return res.status(401).json({
      ok: false,
      errors: { username: 'Incorrect username or password' },
    })
  })
}
