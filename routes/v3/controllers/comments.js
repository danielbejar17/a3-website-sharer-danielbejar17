import express from 'express';

var router = express.Router();

import mongoose from 'mongoose';

router.get('/', async (req, res) => {

  try {
    const postId = req.query.postID;

    const comments = await req.models.Comment.find({
      post: postId
    })

    res.json(comments);
  } catch (error) {
    console.log(error)

    res.status(500).json({
      status: 'error',
      error: error.toString()
    })
  }
})

router.post('/', async (req, res) => {

  if (!req.session.account) {
    return res.status(401).json({
      status: 'error',
      error: 'not logged in'
    })
  }

  try {

    const username = req.session.account.username;
    const newCommentText = req.body.newComment;
    const postId = req.body.postID;

    const newComment = new models.Comment({
      username: username,
      comment: newCommentText,
      post: postId,
      created_date: new Date()
    })

    await newComment.save();

    res.json({ status: 'success' })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'error',
      error: error.toString()
    })
  }

})

export default router;