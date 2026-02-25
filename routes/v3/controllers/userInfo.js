import express from 'express';
var router = express.Router();

router.get('/', async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "username required" });
  }

  const user = await req.models.UserInfo.findOne({ username });

  res.json(user || {});
})

router.post('/', async (req, res) => {
  const {
    username,
    bio,
    favoriteWebsite
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username required" });
  }

  const updatedUser = await req.models.UserInfo.findOneAndUpdate(
    { username },
        {
            bio,
            favoriteWebsite
        },
        {
            upsert: true,
            new: true
        }
  )

  res.json(updatedUser);

})


export default router;