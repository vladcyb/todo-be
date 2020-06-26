const ObjectID = require('mongodb').ObjectID
const colorREG = /^#[0-9a-f]{3,6}$/i

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
    res.json({ ok: false, error })
  }
}

exports.getTheme = async (req, res) => {
  const { users } = req
  const user = await users.findOne({ _id: new ObjectID(req.user.data.id) })
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
  res.json({
    ok: true,
    darkMode: user.darkMode,
    bg: user.bg,
  })
}

exports.postSetBG = async (req, res) => {
  const { users } = req
  const userID = new ObjectID(req.user.data.id)
  const { bg } = req.body
  if (typeof bg === 'undefined') {
    return res.json({ ok: false, error: 'Enter `bg`!' })
  }
  if (!colorREG.test(bg)) {
    return res.json({ ok: false, error: 'Invalid color!' })
  }
  try {
    await users.updateOne(
      {
        _id: userID,
      },
      {
        $set: {
          bg,
        },
      }
    )
    res.json({ ok: true })
  } catch (error) {
    res.json({ ok: false, error })
  }
}
