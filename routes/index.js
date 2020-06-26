const router = require('express').Router()
const authController = require('../controllers/authController')
const todosController = require('../controllers/todosController')
const userController = require('../controllers/userController')
const fs = require('fs')
const expressJWT = require('express-jwt')
const secret = fs.readFileSync('secret')

router.post('/register', authController.postRegister)
router.post('/login', authController.postLogin)

router.post('/addTodo', expressJWT({ secret }), todosController.postAddTodo)
router.post('/setDone', expressJWT({ secret }), todosController.postSetDone)
router.delete('/deleteTodo', expressJWT({ secret }), todosController.deleteTodo)
router.get('/todos', expressJWT({ secret }), todosController.getTodos)

router.post(
  '/setDarkMode',
  expressJWT({ secret }),
  userController.postSetDarkMode
)

router.post('/setBG', expressJWT({ secret }), userController.postSetBG)
router.get('/theme', expressJWT({ secret }), userController.getTheme)

module.exports = router
