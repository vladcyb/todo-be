const { v4: uuidv4 } = require('uuid')
const ObjectID = require('mongodb').ObjectID

exports.postAddTodo = async (req, res) => {
  const { users } = req
  const id = new ObjectID(req.user.data.id)
  const user = await users.findOne({ _id: id })
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
  const { title, description } = req.body
  if (!(title || description)) {
    return res.json({ ok: false, error: 'Enter todo title or description!' })
  }
  const todo = {
    id: uuidv4(),
    title,
    description,
    done: false,
  }
  const update = { $push: { todos: todo } }
  await users.updateOne({ _id: id }, update)
  res.json({ ok: true, todo: { ...todo } })
}

exports.getTodos = async (req, res) => {
  const { users } = req
  const { id } = req.user.data
  const user = await users.findOne({ _id: new ObjectID(id) })
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
  const { todos } = user
  return res.json({ ok: true, todos })
}

exports.postSetDone = async (req, res) => {
  const { users } = req
  const { id, done } = req.body
  const userID = new ObjectID(req.user.data.id)
  if (typeof id === 'undefined') {
    return res.json({ ok: false, error: 'Enter todo id!' })
  }
  if (typeof done === 'undefined') {
    return res.json({ ok: false, error: 'Enter is todo done!' })
  }
  const user = await users.findOne({ _id: userID })
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
  if (typeof done !== 'boolean') {
    return res.json({
      ok: false,
      error: '`done` parameter must be a boolean!',
    })
  }
  await users.updateOne(
    {
      _id: userID,
      'todos.id': id,
    },
    {
      $set: {
        'todos.$.done': done,
      },
    }
  )
  res.json({ ok: true })
}

exports.deleteTodo = async (req, res) => {
  const { users } = req
  const userID = new ObjectID(req.user.data.id)
  const { id } = req.body
  try {
    await users.updateOne(
      {
        _id: userID,
      },
      {
        $pull: {
          todos: {
            id,
          },
        },
      }
    )
    res.json({ ok: true })
  } catch (error) {
    console.log(error)
    res.json({ ok: false, error })
  }
}

exports.deleteAllDone = async (req, res) => {
  const { users } = req
  const userID = new ObjectID(req.user.data.id)
  try {
    await users.updateOne(
      {
        _id: userID,
      },
      {
        $pull: {
          todos: {
            done: true,
          },
        },
      }
    )
    const user = await users.findOne({ _id: userID })
    const { todos } = user
    res.json({ ok: true, res: todos })
  } catch (error) {
    console.log(error)
    res.json({ ok: false, error: '' })
  }
}
