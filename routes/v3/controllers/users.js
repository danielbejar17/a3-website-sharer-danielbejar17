import express from 'express';
var router = express.Router();

router.get('/myIdentity', (req, res) => {
  if (!req.session.account) {
    return res.json({
      status: 'loggedout'
    })
  }

  // logged in case
  res.json({
    status: "loggedin",
    userInfo: {
      name: req.session.account.name,
      username: req.session.account.username
      }
    })
})

export default router;