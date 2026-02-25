import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';
// import mongoose from 'mongoose';

//TODO: Add handlers here

router.post('/', async (req, res) => {

  if (!req.session.isAuthenticated) {
      return res.status(401).json({
        status: 'error',
        error: 'not logged in'
      })
    }

  try {
    const newPost = new req.models.Post({
      url: req.body.url,
      description: req.body.description,
      username: req.session.account.username,
      created_date: new Date()
    })

    // save to database
    await newPost.save();

    // return success
    res.json({"status": "success"});

  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": "error",
      "error": err.message
    })
  }

});

router.get('/', async (req, res) => {
  try {
    // find all posts in mongodb
    let query = {};

    if (req.query.username) {
      query.username = req.query.username;
    }

    const posts = await req.models.Post.find(query);

    // generate previews for each posts
    let postData = await Promise.all(
      posts.map(async (post) => {
          try{
              // TODO some await call
              let htmlPreview = await getURLPreview(post.url);
              // TODO return info about post
              return {
                id: post._id,
                url: post.url,
                description: post.description,
                htmlPreview: htmlPreview,
                username: post.username,
                likes: post.likes,
                created_date: post.created_date,
              }
          }catch(error){
              // TODO: return error message
              return {
                description: post.description,
                htmlPreview: error.toString()
              }
          }
      })
    );

    // return all posts
    res.json(postData);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      error: err.toString()
    })

  }
})

router.post('/like', async (req, res) => {
  if (!req.session.account) {
    return res.status(401).json({
      status: 'error',
      error: 'not logged in'
    })
  }

  try {
    const username = req.session.account.username;
    const postId = req.body.postID;

    const post = await req.models.Post.findById(postId);

    if (!post.likes.includes(username)) {
      post.likes.push(username);
    }

    await post.save();

    res.json({ status: 'susccess' })

  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'error',
      error: error.toString()
    })
  }
})

router.post('/unlike', async (req, res) => {
  if (!req.session.account) {
    return res.status(401).json({
      status: 'error',
      error: 'not logged in'
    })
  }

  try {
    const username = req.session.account.username;
    const postId = req.body.postID;

    const post = await req.models.Post.findById(postId);

    if (post.likes.includes(username)) {
      post.likes = post.likes.filter(
        user => user !== username
      );
    }

    await post.save();

    res.json({ status: 'success'});
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'error',
      error: error.toString()
    })
  }
})

router.delete('/', async (req, res) => {
  if (!req.session.account) {
    return res.status(401).json({
      status: 'error',
      error: 'not logged in'
    })
  }

  try {

    const username = req.session.account.username;
    const postId = req.body.postID;

    const post = await req.models.Post.findById(postId);

    if (post.username !== username) {
      return res.status(401).json({
        status: 'error',
        error: 'you can only delete your own posts'
      })
    }

    await req.models.Comment.deleteMany({
      post: postId
    })

    await req.models.Post.deleteOne({
      post: postId
    })

    res.json({ "status": "success" })

  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      error: error.toString()
    })
  }
})

export default router;