const ObjectID = require('mongodb').ObjectID

exports.postSetDarkMode = async (req, res) => {
  const { users } = req
  const userID = new ObjectID(req.user.data.id)
  const { darkMode } = req.body
  if (typeof darkMode === 'undefined') {
    return res.json({ ok: false, error: 'Enter darkMode' })
  }
  try {
    await users.updateOne(
      {
        _id: userID,
      },
      {
        $set: {
          darkMode,
        },
      }
    )
    res.json({ ok: true })
  } catch (error) {
    console.log(error)
    res.json({ ok: false, error })
  }
}

exports.getDarkMode = async (req, res) => {
  const { users } = req
  const user = await users.findOne({ _id: new ObjectID(req.user.data.id) })
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
  res.json({ ok: true, res: user.darkMode })
}
