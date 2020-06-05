const router = require('express').Router()

router.post('/register', (req, res) => {
  const { form } = req.body
  console.log(req.body)
  res.end()
})

router.post('/login', (req, res) => {
  res.send('login')
})

module.exports = router
